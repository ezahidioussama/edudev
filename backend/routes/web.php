<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return file_exists(public_path('index.html'))
        ? file_get_contents(public_path('index.html'))
        : view('welcome');
});

Route::fallback(function () {
    return file_exists(public_path('index.html'))
        ? file_get_contents(public_path('index.html'))
        : view('welcome');
});

Route::get('/setup-database', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
        return 'Database migrated and seeded successfully! You can now login with stagiaire@edudev.ma and password.';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/debug-db', function () {
    try {
        $connection = \Illuminate\Support\Facades\DB::connection()->getName();
        $database = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
        $usersCount = \Illuminate\Support\Facades\DB::table('users')->count();
        $users = \Illuminate\Support\Facades\DB::table('users')->limit(3)->get(['id', 'name', 'email']);
        return response()->json([
            'connection' => $connection,
            'database' => $database,
            'total_users' => $usersCount,
            'sample_users' => $users
        ]);
    } catch (\Exception $e) {
        return 'DB Error: ' . $e->getMessage();
    }
});
