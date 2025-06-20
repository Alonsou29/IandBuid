<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\OccupationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\Occupation;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/createOccupation',[OccupationController::class, 'create']);
    Route::delete('/deleteOccupation/{id}',[OccupationController::class, 'deleteOccupation']);
    Route::get('/listaOccupation',[OccupationController::class, 'listarOccupations'])->name('occupations.index');
});


Route::post('/createEmployee',[EmployeeController::class, 'createEmployee']);
Route::put('/modifyEmployee/{id}',[EmployeeController::class, 'updateEmployee']);
Route::get('/listarEmployeeSocialId/{id}',[EmployeeController::class, 'employeeBySocialId']);
Route::get('/listarEmployee',[EmployeeController::class, 'listaEmployees'])->name('workers.index');
Route::put('/deleteEmployee/{id}',[EmployeeController::class,'deleteEmployee']);
//occupations
Route::get('/formularioOccupation', function () {return Inertia::render('OccuForm');});
Route::get('/occupation', [OccupationController::class, 'vistaOccupations'])->name('occupations.vista');
Route::put('/updateOccupation/{id}',[OccupationController::class, 'updateOccupation']);
Route::get('/udtOccupation/{id}',[OccupationController::class, 'occupationById']);

Route::get('/prueba', function (){
    $employee = Employee::create([
        'social_id'=>'sdasdah-ew20',
        'name'=>'Alonso',
        'lastname'=>'Urdaneta',
        'phone_number'=>'04246228729',
        'email' => 'soyunxd@hotmail.com',
        'age'=> 20,
        'birthday'=>'2003-03-23',
        'apply_occupations'=>true,
        'avaible_travel'=>true,
        'military_services'=>true,
        'start_services'=>'10/03/2020',
        'end_services'=>'20/03/2023',
        'military_desc'=>'terrestre',
        'contract_url'=>'~/micontrato/contrattofulanito.pdf',
        'status'=>true,
    ]);
    $occupation = Occupation::create([
        'name' => 'Cemento',
        'type'=>'albanil'
    ]);

    $employee->occupations()->attach(1);


});

require __DIR__.'/auth.php';
