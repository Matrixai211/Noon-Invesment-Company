<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('noon:status', function () {
    $this->info('Noon Investment Company Laravel backend is operational.');
})->purpose('Check Noon application status');
