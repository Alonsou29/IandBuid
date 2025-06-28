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
    Route::get('/downloadFile/{folder}/{name}', [EmployeeController::class, 'downloadFile']);
    Route::get('/download/{socialid}/{type}', [EmployeeController::class, 'filesBySocialId']);
    Route::put('/deleteEmployee/{id}',[EmployeeController::class,'deleteEmployee']);
    Route::get('/formularioOccupation', function () {return Inertia::render('OccuForm');});
    Route::put('/updateOccupation/{id}',[OccupationController::class, 'updateOccupation']);
    
});

Route::post('/occupations/similar', [OccupationController::class, 'similarJobs']);

Route::get('/postu/{id}',[OccupationController::class, 'postulation']);
Route::post('/createEmployee',[EmployeeController::class, 'createEmployee']);
Route::put('/modifyEmployee/{id}',[EmployeeController::class, 'updateEmployee']);
Route::get('/EmployeeWithSocialId/{id}',[EmployeeController::class, 'employeeBySocialId']);
Route::get('/listarEmployee',[EmployeeController::class, 'listaEmployees'])->name('workers.index');
//occupations
Route::get('/occupation', [OccupationController::class, 'vistaOccupations'])->name('occupations.vista');
Route::get('/udtOccupation/{id}',[OccupationController::class, 'occupationById']);


require __DIR__.'/auth.php';
