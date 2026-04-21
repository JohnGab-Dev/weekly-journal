<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Events;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Helpers\LogRecorder;

class AdminController extends Controller
{
    //users management
        public function getallUsers(Request $request){
            $query = User::query();

            // SEARCH (name or email)
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            // EXCLUDE CURRENT USER
            $query->where('userId', '!=', Auth::id())->where('status', 'active');

            // PAGINATION
            $users = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'data' => $users->items(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ]
            ]);
        } 
        public function addUser(Request $request){
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

            LogRecorder::RecordLog("INSERT", "Added New User.");

            return response()->json([
                'message' => 'User added successfully'
            ]);
        }

        public function editUser(Request $request){
            $name = $request->name;
            $id = $request->id;
            
            if(!$id){
                return response()->json([
                    "message" => "Internal Server Error"
                ], 500);
            }
            
            $request->validate([
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users')->ignore($id, 'userId'),
                ],
            ]);

            $email = $request->email;

            User::where('userId', $id)->update([
                'name' => $name,
                'email' => $email,
            ]);

            LogRecorder::RecordLog("UPDATE", "Update a User.");

            return response()->json([
                'message' => 'User updated successfully'
            ]);
        }

        public function changePass(Request $request){
            $password = $request->password;
            $id = $request->id;
            if(!$id){
                return response()->json([
                    "message" => "Internal Server Error"
                ], 500);
            }
            User::where('userId', $id)->update([
                'password' => Hash::make($password),
            ]);

            LogRecorder::RecordLog("UPDATE", "Update a User Password.");

            return response()->json([
                'message' => 'User password updated successfully'
            ], 200);
        }

        public function deleteUser(Request $request){
            $status = "disabled";
            $id = $request->id;
            if(!$id){
                return response()->json([
                    "message" => "Internal Server Error"
                ], 500);
            }
            User::where('userId', $id)->update([
                'status' => $status
            ]);

            LogRecorder::RecordLog("DELETE", "Deleted a User.");

            return response()->json([
                'message' => 'User deleted successfully'
            ], 200);
        }

        //events management

        public function getAllEvents(Request $request){
            $query = Events::query();

            // SEARCH (name or email)
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                    ->orwhere('date', 'like', '%'. $request->search . '%');
                });
            }

            // PAGINATION
            $events = $query->orderBy('date', 'asc')->paginate(10);

            return response()->json([
                'data' => $events->items(),
                'meta' => [
                    'current_page' => $events->currentPage(),
                    'last_page' => $events->lastPage(),
                    'per_page' => $events->perPage(),
                    'total' => $events->total(),
                ]
            ]);
        }

        public function addEvent(Request $request){
            $date = $request->date;
            $title = $request->title;
            $desc = $request->desc;

            Events::create(
                [   
                    'date' => $date,
                    'title' => $title,
                    'description'=>$desc
                ]
            );

            LogRecorder::RecordLog("INSERT", "Added a new event.");

            return response()->json([
                'message' => 'Event added successfully'
            ]);
        }

        public function editEvent(Request $request){
            $id = $request->id;
            $date = $request->date;
            $title = $request->title;
            $desc = $request->desc;

            if(!$id){
                return response()->json([
                    "message" => "Internal Server Error"
                ], 500);
            }

            Events::where('eventId', $id)->update(
                [   
                    'date' => $date,
                    'title' => $title,
                    'description'=>$desc
                ]
            );

            LogRecorder::RecordLog("UPDATE", "Updated an event.");

            return response()->json([
                'message' => 'Event updated successfully'
            ]);
        }

        public function deleteEvent(Request $request){
            $id = $request->id;

            if(!$id){
                return response()->json([
                    "message" => "Internal Server Error"
                ], 500);
            }

            Events::where('eventId', $id)->delete();

            LogRecorder::RecordLog("DELETE", "Deleted an event.");

            return response()->json([
                'message' => 'Event updated successfully'
            ]);
        }

        public function getAllLogs(Request $request){
            $query = Log::query()
                ->join('users', 'logs.userId', '=', 'users.userId')
                ->select(
                    'logs.*',
                    'logs.created_at as datetime',
                    'users.name as user_name',
                    'users.email as user_email'
                );

            // SEARCH 
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('logs.title', 'like', '%' . $request->search . '%')
                    ->orWhere('logs.created_at', 'like', '%' . $request->search . '%')
                    ->orWhere('users.email', 'like', '%' . $request->search . '%');
                });
            }

            // PAGINATION
            $logs = $query->orderBy('logs.created_at', 'desc')->paginate(10);

            return response()->json([
                'data' => $logs->items(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'last_page' => $logs->lastPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                ]
            ]);
        }

        //account

        public function ChangePassword(Request $request){
            $id = Auth::id();
            $user = User::where('userId', $id)->firstOrFail();

            if (!Hash::check($request->opass, $user->password)) {
                return response()->json([
                    'message' => 'Old password is incorrect'
                ], 400);
            }

            $user->update([
                'password' => Hash::make($request->password),
            ]);

            LogRecorder::RecordLog("UPDATE", "Updated own password.");

            return response()->json([
                'message' => 'User password updated successfully'
            ], 200);
        }

        public function editProfile(Request $request){
            $name = $request->name;
            $id = Auth::id();
            
            $request->validate([
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users')->ignore($id, 'userId'),
                ],
            ]);

            $email = $request->email;

            User::where('userId', $id)->update([
                'name' => $name,
                'email' => $email,
            ]);

            LogRecorder::RecordLog("UPDATE", "Update a Own Profile.");

            return response()->json([
                'message' => 'User updated successfully'
            ]);
        }


        //bin
        public function getallArchives(Request $request)
        {
            $query = User::query();

            // SEARCH (name or email)
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            // EXCLUDE CURRENT USER
            $query->where('userId', '!=', Auth::id())->where('status', 'disabled');

            // PAGINATION
            $users = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'data' => $users->items(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ]
            ]);
        }

        public function retriveAccount(Request $request){
            $status = "active";
            $id = $request->id;
            if(!$id){
                return response()->json([
                    "message" => "Internal Server Error"
                ], 500);
            }
            User::where('userId', $id)->update([
                'status' => $status
            ]);

            LogRecorder::RecordLog("RETRIEVE", "Retrieve a User.");

            return response()->json([
                'message' => 'User retrieve successfully'
            ], 200);
        }
}
