<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireAdminKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $configured = (string) config('services.noon.admin_api_key');
        $provided = (string) $request->bearerToken();

        if ($configured === '' || $provided === '' || ! hash_equals($configured, $provided)) {
            return response()->json(['ok' => false, 'error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
