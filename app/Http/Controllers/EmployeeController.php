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
use Carbon\Carbon;


class EmployeeController extends Controller
{

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
                'airport'=>$request->airport,
                'military_services'=>$request->dfac,
                'start_services'=>$request->startDate,
                'end_services'=>$request->endDate,
                'isRefered'=>$request->referred,
                'military_desc'=>'terrestre',
                'isContract'=>false,
                'status'=>'',
            ]);
            $address = $employee->addresses()->create([
                'state'=>$request->state,
                'city'=>$request->city,
                'street'=>$request->street,
                'zip'=>$request->zip
            ]);

            $ref = $request->references;
            $works = $request->workHistory;

            foreach($ref as $person){
                if(!empty($person['name'])){
                    $reference = $employee->references()->create([
                     'fullname'=>$person['name'],
                     'phone_number'=>$person['phone'],
                     'email'=>$person['email']
                     ]);
                }
            }

            foreach($works as $work){
                if(!empty($work['employer'])){
                    $work = $employee->workHistorys()->create([
                        'emplo_name'=>$work['employer'],
                        'phone_number'=>$work['phone'],
                        'start_work'=>$work['start'],
                        'end_work'=>$work['end'],
                        'title'=>$work['title'],
                        'duties'=>$work['duties'],
                        'reason_leaving'=>$work['reason'],
                    ]);
                }
            }

            if(!empty($request->occupation_id)){
                $employee->occupations()->attach($request->occupation_id);
            }

            if($request->hasFile('resume')){
                $storageLink = $request->file('resume')->store('resumes', 'public');

                $employee->documents()->create([
                    'type'=>"por definir",
                    'url'=>$storageLink,
                ]);
            }

            return response()->json(['msg'=>$employee], 201);
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
