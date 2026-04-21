<?php
    namespace App\Helpers;
    use App\Models\Log;
    use Illuminate\Support\Facades\Auth;

    class LogRecorder {
        public static function RecordLog( $title, $log, $id = null ){

            if(!$id){
                $id = Auth::id();
            }
            Log::create([
                "userId" => $id, 
                "title" => $title,
                "log" => $log
            ]);
        }
    }

    

?>