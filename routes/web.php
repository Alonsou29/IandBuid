<?php

use App\Http\Controllers\ProfileController;
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
});

Route::get('/prueba', function (){
    $employee = Employee::create([
        'name'=>'Alonso',
        'lastname'=>'Urdaneta',
        'email' => 'soyunxd@hotmail.com',
        'age'=> 20,
        'status'=>true
    ]);
    $occupation = Occupation::create([
        'name' => 'Cemento',
        'type'=>'albanil'
    ]);

    $employee->occupations()->attach([1,1]);


});

require __DIR__.'/auth.php';
