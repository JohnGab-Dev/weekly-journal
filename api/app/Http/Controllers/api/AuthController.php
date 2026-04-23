<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Helpers\LogRecorder;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class AuthController extends Controller
{
    
    public function register (Request $request){
        
        $password = $request->password;
        $name = $request->name;
        $role = $request->role;

        
       $request->validate([
            'email' => 'required|email|unique:users,email'
        ]);

        $email = $request->email;

        User::create(
            [
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => $role
            ]
        );

        return response()->json([
            'message' => 'Sign up successful'
        ]);

    }

   public function login(Request $request)
        {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // MANUAL AUTH
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Credentials'
                ], 401);
            }

            if($user->status === "disabled"){
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Credentials'
                ], 401);
            }

            // Revoke old tokens (optional - fresh login)
            $user->tokens()->delete();

            // Create new Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            $userData = [
                'userId' => $user->userId,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ];

            $redirectUrl = match($user->role) {
                'admin' => '/dashboard',
                'employee' => '/home',
                'student' => '/home'
            };

            LogRecorder::RecordLog("LOGIN", "User have logged in.", $user->userId);

            return response()->json([
                'success' => true,
                'message' => 'Login successful!',
                'data' => $userData,
                'token' => $token,
                'url' => $redirectUrl
            ]);
        }

    public function logout(Request $request) {
        $user = $request->user();
        LogRecorder::RecordLog("LOGOUT", "User have logged out.");

        $user->tokens()->delete();
        return response()->json([
            'message' => 'Log out successful!',
        ], 200);
    }

    public function verifyEmail(Request $request){
        $email = $request->email;

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $userId = $user->userId;
        $otp = rand(100000, 999999);
        User::where('userId', $userId)->update([
            'otp' => $otp,
        ]);

        $sendOtp = Mail::to($email)->send(new OtpMail($otp));

        if(!$sendOtp){
            return response()->json([
            'message' => 'Something went wrong'
            ], 404);
        }

        LogRecorder::RecordLog("FORGOT PASSWORD", "OTP sent.", $userId);

        return response()->json([
                'message' => 'OTP sent successfully',
                'data' => [
                    'email' => $email
                ]
            ], 200);
        
    } 
    public function verifyOtp(Request $request){
        $email = $request->email;
        $otp = $request->otp;

        $user = User::where('email', $email)->first();

        if(!$user){
            return response()->json([
                'message' => 'Invalid User'
            ], 404);
        }

        if($user->otp !== $otp){
            return response()->json([
                'message' => 'Invalid OTP'
            ], 404);
        }

        User::where('email', $email)->update([
            'otp'=> null
        ]);

        LogRecorder::RecordLog("FORGOT PASSWORD", "OTP verified.", $user->userId);

        return response()->json([
            'message' => 'OTP verified successfully',
            'userId' => $user->userId
        ], 200);
    } 
    

    
    public function changPass(Request $request){
        $password = $request->password;
        $userId = $request->id;

        User::where('userId', $userId)->update([
            'password' => Hash::make($password)
        ]);

        LogRecorder::RecordLog("FORGOT PASSWORD", "Password successfully changed.", $userId);

        return response()->json([
            'message' => 'Password saved, please re-login your account'
        ], 200);
    }
}
