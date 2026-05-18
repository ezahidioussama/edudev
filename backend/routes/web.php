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
