<?php

use App\Http\Controllers\api\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\HomeController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\EmployeeController;
use App\Http\Controllers\api\ReportController;
use App\Http\Controllers\api\StudentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//auth
Route::get('/home', [HomeController::class, 'index']);
Route::post('/signup', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/change-pass', [AuthController::class, 'changPass']);


Route::middleware('auth:sanctumn')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/edit-profile', [AdminController::class, 'editProfile']);
    Route::post('/change-password', [AdminController::class, 'ChangePassword']);
});

Route::middleware('auth:sanctumn', 'role:student')->group(function(){
    Route::post('/student-export', [StudentController::class, 'exportReport']);
    Route::get('/get-preference', [StudentController::class, 'getPreference']);
});

Route::middleware('auth:sanctumn', 'role:employee')->group(function(){
    Route::get('/get-employee-preference', [EmployeeController::class, 'getPreference']);
    Route::post('/employee-export', [EmployeeController::class, 'exportReport']);
});

Route::middleware('auth:sanctumn', 'role:student,employee')->group(function(){
    Route::post('/add-report', [ReportController::class, 'addReport']);
    Route::post('/edit-report', [ReportController::class, 'editReport']);
    Route::post('/del-report-date', [ReportController::class, 'delReportDate']);
    Route::post('/del-report', [ReportController::class, 'delReport']);
    Route::get('/fetch-report', [ReportController::class, 'fetchReport']); 
    Route::get('/get-events-and-tasks', [ReportController::class, 'TaskEvents']);
});

Route::middleware('auth:sanctum', 'role:admin')->group(function () {
    Route::get('/users', [AdminController::class, 'getallUsers']);
    Route::get('/bin', [AdminController::class, 'getallArchives']);
    Route::post('/users-add', [AdminController::class, 'addUser']);
    Route::post('/users-edit', [AdminController::class, 'editUser']);
    Route::post('/users-cpass', [AdminController::class, 'changePass']);
    Route::post('/users-delete', [AdminController::class, 'deleteUser']);
    Route::post('/users-retrieve', [AdminController::class, 'retriveAccount']);

    Route::get('/events', [AdminController::class, 'getAllEvents']);
    Route::post('/events-add', [AdminController::class, 'addEvent']);
    Route::post('/events-edit', [AdminController::class, 'editEvent']);
    Route::post('/events-delete', [AdminController::class, 'deleteEvent']);

    Route::get('/logs', [AdminController::class, 'getAllLogs']);
});
