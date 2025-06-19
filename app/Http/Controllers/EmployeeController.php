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

    public function store(){

    }


    public function createEmployee(Request $request){
        try{
            $validateData = $request->validate([
                'social_id'=>['required','unique:'.Employee::class],
                'firstName'=>['required','string','max:255'],
                'lastName'=>['required','string', 'max:255'],
                'dob'=>['required'],
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
                'military_services'=>true,
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

            return response()->json([$request->social_id], 201);
        }catch(ValidationException $e){
            return response()->json([$e],400);
        }

    }
}
