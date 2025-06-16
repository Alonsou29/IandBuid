<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Occupation;

class OccupationController extends Controller
{
    public function listarOccupations(){

        $Occupation=Occupation::all();


        return reponse()->json($Occupation);


    }
}
