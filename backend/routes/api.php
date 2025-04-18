<?php
use App\Http\Controllers\ListingController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('listings', [ListingController::class, 'store']);
    Route::put('/listings/{listing}', [ListingController::class, 'update']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);
});


Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);

// REGISTER USER
Route::post('/register', [AuthController::class,'register'] );

// LOGIN USER & GET TOKEN
Route::post('/login',[AuthController::class,'login']  );
