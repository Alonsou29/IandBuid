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
            if($item['status']==1){
                $item['status'] = 'Activo';
            }else{
                $item['status'] = 'Inactivo';
            }
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

    public function update(Request $request, $id){

        try{
            $Occupation = Occupation::find($id);

            if($Occupation->name != $request->name){
                $Occupation->name = $request->name;
            }
            if($Occupation->status != $request->status){
                $Occupation->status = $request->status;
            }
            if($Occupation->type != $request->type){
                $Occupation->type = $request->type;
            }

            $Occupation->save();

            return response()->json(['msg'=>'Update Success!','data'=>$Occupation],200);

        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }

    public function destroy(Request $request, $id){
        try{
            $Occupation=Occupation::find($id);

            $Occupation->delete();

            return response()->json(['msg'=>'Occupation Delete Success!'],200);

        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }
}
