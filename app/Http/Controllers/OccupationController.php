<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Occupation;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;


class OccupationController extends Controller
{
    public function listarOccupations()
{
    $occupations = Occupation::where('isDelete', false)->get();

    // Mapear correctamente y retornar el resultado
    $mapped = $occupations->map(function ($item) {
        $item->status = $item->status == 1 ? 'Active' : 'Inactive';
        return $item;
    });

    return Inertia::render("Occupations", ["occupations" => $mapped]);
}


    public function vistaOccupations(){
        $Occupations = Occupation::where('isDelete',false)->get();

        $mapped = $Occupations->map(function ($item) {
            $item->status = $item->status == 1 ? 'Activo' : 'Inactivo';
            return $item;
        });

        return Inertia::render("Occupations_Vista", ["occupations" => $mapped]);
    }


    public function postulationByNames(Request $request, $name){
        try{
            $occupation = Occupation::where('name', $name)->get();
            return response()->json(['occupations'=>$occupation],200);
        }catch(ValidationException $e){
            return response()->json(['msg'=>$e]);
        }
    }

    public function postulation(Request $request, $id){
        try{
            $occupation = Occupation::find($id);
            $rq = $occupation->employees()->get();

            return response()->json(['Employees'=>$rq],200);
        }catch(ValidationException $e){
            return response()->json(['msg'=>$e],400);
        }
    }

    public function create(Request $request){
        try{
            $createOccupation = Occupation::create([
                'name'=>$request->name,
                'type'=>$request->type,
                'description'=>$request->description,
                'ubication'=>$request->ubication,
                // 'needCertification'
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

            $Occupation->save();

            return response()->json(['msg'=>'Update Success!','data'=>$Occupation],200);

        }catch(ValidationException $e){
            return response()->json([$e],400);
        }
    }

    public function occupationById(Request $request, $id){
        $occupation = Occupation::find($id);

        return response()->json(['data'=>$occupation],200);
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

    public function similarJobs(Request $request)
    {
    $types = $request->input('types'); // Array de strings

    if (empty($types) || !is_array($types)) {
        return response()->json(['error' => 'Invalid types format. Expecting an array.'], 400);
    }

    $jobs = Occupation::where('isDelete', false)
        ->where(function ($query) use ($types) {
            foreach ($types as $type) {
                $query->orWhereRaw("FIND_IN_SET(?, REPLACE(type, ' ', '')) > 0", [trim($type)]);
            }
        })
        ->get();

    return response()->json($jobs, 200);
}

}
