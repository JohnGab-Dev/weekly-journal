<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Events;
use App\Models\ReportDate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
     public function TaskEvents(Request $request){
        $events = Events::all('date');
        $userId = Auth::id();
        $reportDates = ReportDate::select('date')->where('userId', $userId)->get();

        if($request->date){
            $filteredEvent = Events::where('date', $request->date)->get();
            $filteredReport = ReportDate::select('report_date.*', 'reports.*', 'report_date.description as doc_desc', 'reports.description as desc')->join('reports', 'report_date.reportDateId', '=', 'reports.reportDateId')
                ->where('report_date.date', $request->date)
                ->where('report_date.userId', $userId)
                ->get();
        }

        return response()->json([
            "events" => $events,
            "reportDates" => $reportDates,
            "filteredEvent" => $filteredEvent ?? "",
            "filteredReport" => $filteredReport ?? ""
        ]);
    }
    public function fetchReport(Request $request){
        $userId = Auth::id();
        $report = ReportDate::select('report_date.*', 'reports.*', 'report_date.description as doc_desc', 'reports.description as desc')->join('reports', 'report_date.reportDateId', '=', 'reports.reportDateId')
                ->where('report_date.date', $request->date)
                ->where('report_date.userId', $userId)
                ->get();
        return response()->json([
            'report' => $report
        ], 200);
    }

    public function addReport(Request $request){
        if($request->hasFile('image')){
            $request->validate([
                'image' => 'image|mimes:jpg,png,jpeg|max:2048'
            ]);
        }
        $date = $request->date;
        $doc_desc = $request->doc_desc;
        $items = $request->items;
        $reportDateId = 0;
        $userId = Auth::id();

        $existingDate = ReportDate::where('date', $date)->first();

        if($existingDate){
            $reportDateId = $existingDate->reportDateId;
        }else{
            if($request->hasFile('image')){
                $imgpath = $request->file('image')->store('uploads', 'public');
            }
            $newReportDate = ReportDate::create([
                'date' => $date,
                'userId' => $userId,
                'description' => $doc_desc,
                'documentation' => $imgpath ?? ""
            ]);
            $reportDateId = $newReportDate->reportDateId;
        }
        
        foreach($items as $item){
            Report::create([
                'reportDateId' => $reportDateId,
                'type' => $item['type'],
                'description' => $item['desc']
            ]);
        }

        return response()->json([
            'message' => "Report successfully recorded."
        ], 200);
    }

    public function editReport(Request $request){
        if($request->hasFile('image')){
            $request->validate([
                'image' => 'image|mimes:jpg,png,jpeg|max:2048'
            ]);
        }

        
        $reportDateId = $request->id;
        $date = $request->date;
        $doc_desc = $request->doc_desc;
        $items = $request->items;

        $oldReportDate = ReportDate::where('reportDateId', $reportDateId)->first();
        $oldImg = $oldReportDate->documentation ?? "";

        if($request->hasFile('image')){
            if($oldImg !== ""){
                Storage::disk('public')->delete($oldImg);
            }
            $imgpath = $request->file('image')->store('uploads', 'public');
            ReportDate::where('reportDateId', $reportDateId)->update([
                'date' => $date,
                'description' => $doc_desc,
                'documentation' => $imgpath
            ]);
        }else{
            ReportDate::where('reportDateId', $reportDateId)->update([
                'date' => $date,
                'description' => $doc_desc,
            ]);
        }
        
        foreach($items as $item){
            if (!empty($item['id'])) {
                Report::where('reportId', $item['id'])->update([
                    'type' => $item['type'],
                    'description' => $item['desc'],
                ]);
            } else {
                Report::create([
                    'reportDateId' => $reportDateId,
                    'type' => $item['type'],
                    'description' => $item['desc'],
                ]);
            }
        }

        return response()->json([
            'message' => "Report successfully updated."
        ], 200);
    }

    public function delReport(Request $request){
        $reportId = $request->id;
        Report::where('reportId', $reportId)->delete();

         return response()->json([
            'message' => "Report successfully deleted."
        ], 200);
    }

    public function delReportDate(Request $request)
    {
        $reportDateId = $request->id;

        $report = ReportDate::where('reportDateId', $reportDateId)->first();

        // delete image if exists
        if ($report->documentation && Storage::disk('public')->exists($report->documentation)) {
            Storage::disk('public')->delete($report->documentation);
        }

        $report->delete();

        return response()->json([
            'message' => "Report Date successfully deleted."
        ], 200);
    }
}
