<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Occupation;
use Inertia\Inertia;

class OccupationController extends Controller
{
    public function listarOccupations(){
        $Occupation=Occupation::all();

        $mapeo = $Occupation->map(function ($item) use ($Occupation){
            $item['status'] = $item['status'] == 1 ? 'Acitvo':'Inactivo'; 
        });

        return Inertia::render("Occupations", ["occupations"=>$Occupation]);
    }

    public function vistaOccupations(){
        $Occupations = Occupation::all();

        $mapped = $Occupations->map(function ($item) {
            $item->status = $item->status == 1 ? 'Activo' : 'Inactivo';
            return $item;
        });

        return Inertia::render("Occupations_Vista", ["occupations" => $mapped]);
    }


    public function create(Request $request){
        try{
            $createOccupation = Occupation::create([
                'name'=>$request->name,
                'type'=>$request->type,
                'description'=>$request->description,
                'ubication'=>$request->ubication,
                'status'=> (int) $request->status
            ]);

        return response()->json($createOccupation, 201);

        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }

    public function updateOccupation(Request $request, $id){

        try{
            $Occupation = Occupation::find($id);

            if(!$Occupation){
                return response()->json(["msg"=>"id not found"],421);
            }

            $Occupation->name = $request->name;
            $Occupation->type = $request->type;
            $Occupation->description = $request->description;
            $Occupation->ubication = $request->ubication;
            $Occupation->status = $request->status;
            // $Occupation->isDelete = $request->isDelete;
        
            $Occupation->save();

            return response()->json(['msg'=>'Update Success!','data'=>$Occupation],200);

        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }

    public function deleteOccupation(Request $request, $id){
        try{
            $Occupation=Occupation::find($id);
            $Occupation->isDelete = true;
            $Occupation->save();
            
            return response()->json(['msg'=>'Occupation Delete Success!'],200);

        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }
}
