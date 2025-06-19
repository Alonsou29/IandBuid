<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;


class EmployeeController extends Controller
{

    public function listarEmployees(){
        try{
            $Employee = Employee::all();
            return Inertia::render("Employees", ["employees"=>$Employee]);
        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }

    public function employeeBySocialId(Request $request,$socialId){
        $Employee = Employee::find($socialId);

        return response()->json(['employee'=>$Employee],200);
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

            $employee = Employee::create([
                'social_id'=>$request->social_id,
                'name'=>$request->firstName,
                'lastname'=>$request->lastName,
                'phone_number'=>$request->phone,
                'email' => $request->email,
                'age'=> 20,
                'birthday'=>$request->dob,
                'apply_occupations'=>true,
                'avaible_travel'=>true,
                'military_services'=>$request->dfac,
                'start_services'=>'10/03/2020',
                'end_services'=>'20/03/2023',
                'military_desc'=>'terrestre',
                'contract_url'=>'',
                'status'=>true,
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
               $reference = $employee->references()->create([
                'fullname'=>$person['name'],
                'phone_number'=>$person['phone'],
                'email'=>$person['email']
                ]);
            }

            foreach($works as $work){
                $work = $employee->workHistory()->create([
                    'emplo_name'=>$work['employer'],
                    'phone_number'=>$work['phone'],
                    'start_work'=>$work['start'],
                    'end_work'=>$work['end'],
                    'title'=>$work['title'],
                    'duties'=>$work['duties'],
                    'reason_leaving'=>$work['reason'],
                ]);
            }

            return response()->json(['msg'=>$ref], 201);
        }catch(ValidationException $e){
            return response()->json([$e],400);
        }

    }

    

    public function deleteEmployee(Request $request, $socialId){
        $Employee = Employee::find($socialId);
        $Employee->isDelete = true;
        $Employee->save();
        return response()->json(['msg'=>'Delete Success!!', 'payload'=>$Employee],200);
    }
}
