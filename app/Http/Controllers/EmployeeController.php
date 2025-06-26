<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Address;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use ZipArchive;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;


class EmployeeController extends Controller
{

    private $disk = 'public';

    public function listaEmployees(){
        try{
            $Employee = Employee::join('addresses', 'employees.social_id', "=", "addresses.employee_id")
            ->select('name', 'social_id', 'avaible_travel as available_for_travel', 'state')
            ->get();

            foreach($Employee as $item){
                $emplo = Employee::find($item['social_id']);
                $item['jobs_applied'] = $emplo->occupations()->count();
            }

            return Inertia::render("Employees", ["employees"=>$Employee]);
        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }

    public function employeeBySocialId(Request $request,$socialId){
        try{
            $Employee = Employee::find($socialId);

            if($Employee){
                $address = $Employee->addresses()->get();
                $reference = $Employee->references()->get();
                $workHistory = $Employee->workHistorys()->get();
                return response()->json(['employee'=>$Employee,'address'=>$address,'reference'=>$reference,'workHistory'=>$workHistory ],202);
            }else{
                return response()->json(['employee'=>'no exist employee'],200);
            }
        }catch(ValidationException $e){
            return response()->json(['msg'=>$e]);
        }
    }

    public function createEmployee(Request $request){
        try{
            $validateData = $request->validate([
                'social_id'=>['required','unique:'.Employee::class],
                'firstName'=>['required','string','max:255'],
                'lastName'=>['required','string', 'max:255'],
                'dob'=>['required'],
                'email'=>['required','unique:'.Employee::class]
            ]);

            $fechaActual = now();
            $fechaNacimiento =Carbon::parse($request->dob);
            $age = (int) $fechaNacimiento->diffInYears($fechaActual);

            $employee = Employee::create([
                'social_id'=>$request->social_id,
                'name'=>$request->firstName,
                'lastname'=>$request->lastName,
                'phone_number'=>$request->phone,
                'email' => $request->email,
                'age'=> $age,
                'birthday'=>$request->dob,
                'apply_occupations'=>false,
                'avaible_travel'=>$request->willingToTravel,
                'airport'=>$request->dfac ? $request->airport : "N/A" ,
                'military_services'=>$request->dfac,
                'start_services'=>$request->startDate,
                'end_services'=>$request->endDate,
                'isRefered'=>$request->referred,
                'military_desc'=>$request->dfac ? $request->branch : "N/A",
                'isContract'=>false,
                'status'=>$request->immigrationStatus == 'Other' ? $request->otherImmigrationStatus : $request->immigrationStatus,
            ]);
            $address = $employee->addresses()->create([
                'state'=>$request->state,
                'city'=>$request->city,
                'street'=>$request->street,
                'zip'=>$request->zip
            ]);

                // Decodificar referencias JSON
            $ref = json_decode($request->references, true);
            if (is_array($ref)) {
                foreach ($ref as $person) {
                    if (!empty($person['name'])) {
                        $employee->references()->create([
                            'fullname' => $person['name'],
                            'phone_number' => $person['phone'],
                            'email' => $person['email'],
                        ]);
                    }
                }
            }

            // Decodificar historial laboral JSON
            $works = json_decode($request->workHistory, true);
            if (is_array($works)) {
                foreach ($works as $work) {
                    if (!empty($work['employer'])) {
                        $employee->workHistorys()->create([
                            'emplo_name' => $work['employer'],
                            'phone_number' => $work['phone'],
                            'start_work' => $work['start'],
                            'end_work' => $work['end'],
                            'title' => $work['title'],
                            'duties' => $work['duties'],
                            'reason_leaving' => $work['reason'],
                        ]);
                    }
                }
            }

            if(!empty($request->occupation_id)){
                $employee->occupations()->attach($request->occupation_id);
            }

            if($request->hasFile('resume')){
                $file = $request->file('resume');
                $storageLink = $file->storeAs('resumes', $request->social_id.'_cv'.'.'.$file->extension(),$this->disk);
                $employee->documents()->create([
                    'type'=>"resume",
                    'url'=>$storageLink,
                ]);
            }

                        // Guardar certificaciones si vienen archivos
            if ($request->hasFile('certifications')) {
                foreach ($request->file('certifications') as $certFile) {
                    $numberCtf = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
                    $path = $certFile->storeAs('certifications',$request->social_id."_ctf_".$numberCtf.".".$certFile->extension(),$this->disk);

                    $employee->documents()->create([
                        'type' => 'certification',
                        'url' => $path,
                    ]);
                }
            }

            if($request->hasFile('contractFile')){
                $contract = $request->file('contractFile');
                $contract_path = $contract->storeAs('contracts',$request->social_id."_".time().".".$contract->extension(), $this->disk);

                $employee->documents()->create([
                    'type' => 'contract',
                    'url' => $contract_path
                ]);
            }


            return response()->json(['msg'=>$employee, 'certifications'=>$request->certifications], 201);
        }catch(ValidationException $e){
            return response()->json([$e],400);
        }

    }

    public function updateEmployee(Request $request, $socialId){
        try{
            $employee = Employee::find($socialId);
            return response()->json(["msg"=>$employee],201);
        }catch(ValidationException $e){
            return response()->json(["msg"=>$e]);
        }
    }

    public function downloadFile(Resquest $request,$folder, $name){
        if(Storage::disk($this->disk)->exists($folder."/".$name)){
            dd(Storage::disk($this->disk)->download($folder."/".$name));
        }
        return 'file_no_exist';
    }

    public function filesBySocialId(Request $request, $socialId, $type){
        try{
            $employee = Employee::find($socialId);

            $doc = $employee->documents()->where('type',$type)->get();

            if($type == 'contract' || $type == 'resume'){
                foreach($doc as $document){
                    if(Storage::disk($this->disk)->exists($document->url)){
                        if (ob_get_level()){
                            ob_end_clean();
                        }

                        $headers = [
                            'Content-Type'=>'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        ];
                        // return response()->donwload("app/public/",basename($document->url),$headers);
                        return Storage::disk($this->disk)->download($document->url);
                    }
                }
            }else{
                $filesCompress = [];
                $filesCompressName = 'certification_'.$employee->name.".zip";
                $tempPath = storage_path("app/public/" . $filesCompressName );
                $zip = new ZipArchive();

                foreach($doc as $document){
                    if(Storage::disk($this->disk)->exists($document->url)){
                        array_push($filesCompress, $document->url);
                    }
                }

                if($zip->open($tempPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true){
                    foreach($filesCompress as $filePath){
                        if(Storage::disk($this->disk)->exists($filePath)){
                            $fileBody = Storage::disk($this->disk)->get($filePath);
                            $zip->addFromString(basename($filePath), $fileBody);
                        }else{
                            $path= "";
                        }

                    }
                }
                $zip->close();
                return response()->download($tempPath, $filesCompressName)->deleteFileAfterSend(true);
            }


            return response()->json([$doc, 'msg'=>$type]);
        }catch(ValidationException $e){
            return response()->json(['msg'=> $e]);
        }
    }

    public function deleteEmployee(Request $request, $socialId){
        try{
            $Employee = Employee::find($socialId);
            $Employee->isDelete = true;
            $Employee->save();
            return response()->json(['msg'=>'Delete Success!!', 'payload'=>$Employee],200);
        }catch(ValidationException $e){
            return response()->json(['msg'=>$e]);
        }
    }
}
