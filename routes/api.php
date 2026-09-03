<?php

use App\Http\Controllers\Api\LeadController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'ok' => true,
    'service' => 'noon-investment-company',
    'runtime' => 'laravel',
]));

Route::post('/leads', [LeadController::class, 'store']);
Route::middleware('admin.key')->group(function () {
    Route::get('/leads', [LeadController::class, 'index']);
    Route::patch('/leads/{lead}/status', [LeadController::class, 'updateStatus']);
});
