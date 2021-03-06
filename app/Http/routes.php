<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'WelcomeController@index');
Route::get('/timepunch', 'TimepunchController@index');

Route::group(['prefix' => 'api/v1'], function ()
{
    Route::resource('/punch', 'PunchesController', ['except' => ['edit', 'create']]);
    Route::resource('/punchtags', 'PunchTagsController', ['except' => ['edit', 'create']]);

});

Route::get('home', 'HomeController@index');

Route::controllers([
    'auth'     => 'Auth\AuthController',
    'password' => 'Auth\PasswordController',
]);
