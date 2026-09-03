<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LeadController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['ok' => true, 'leads' => CrmLead::query()->latest()->limit(200)->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'lead_type' => ['required', Rule::in(['inquiry','partner','investor','supplier','career'])],
            'name' => ['required','string','max:160'],
            'email' => ['required','email','max:255'],
            'phone' => ['nullable','string','max:80'],
            'company' => ['nullable','string','max:180'],
            'country' => ['nullable','string','max:120'],
            'interest' => ['nullable','string','max:255'],
            'message' => ['nullable','string','max:5000'],
            'metadata' => ['nullable','array'],
        ]);

        $lead = CrmLead::create($data + ['source' => 'website', 'status' => 'new', 'metadata' => $data['metadata'] ?? []]);

        return response()->json(['ok' => true, 'lead' => $lead], 201);
    }

    public function updateStatus(Request $request, CrmLead $lead): JsonResponse
    {
        $data = $request->validate(['status' => ['required', Rule::in(['new','contacted','qualified','closed','rejected'])]]);
        $lead->update($data);
        return response()->json(['ok' => true, 'lead' => $lead->fresh()]);
    }
}
