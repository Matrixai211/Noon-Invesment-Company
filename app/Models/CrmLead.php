<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CrmLead extends Model
{
    use HasUuids;

    protected $table = 'crm_leads';

    protected $fillable = [
        'lead_type','name','email','phone','company','country','interest','message','status','source','metadata',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }
}
