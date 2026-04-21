<?php


namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated',
                'error' => 'No user found'
            ], 401);
        }

        // Support multiple roles: role:admin,manager OR role:admin|manager
        $roles = is_array($roles) ? $roles : explode(',', $roles[0]);

        // Check if user has any of the required roles
        if (!in_array($user->role, $roles)) {
            Log::warning('Role access denied', [
                'user_id' => $user->id,
                'user_role' => $user->role,
                'required_roles' => $roles,
                'path' => $request->path()
            ]);

            return response()->json([
                'message' => 'Forbidden',
                'error' => "User role '{$user->role}' does not have access",
                'required_roles' => $roles
            ], 403);
        }

        return $next($request);
    }
}