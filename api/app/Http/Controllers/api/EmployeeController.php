<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ReportDate;
use App\Models\Preferences;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\TemplateProcessor;
use App\Helpers\LogRecorder;

class EmployeeController extends Controller
{
    public function getPreference(Request $request){
        $preference = Preferences::where('userId', $request->id)->first();
        if(!$preference){
            return response()->json([
                'data' => ''
            ]);
        }
        return response()->json([
            'data' => $preference
        ]);
    }

    public function exportReport(Request $request){
        $userId = Auth::id();
        $name = $request->name;
        $department = $request->department;
        $designation = $request->designation;
        $head_name = $request->head_name;
        $head_designation = $request->head_designation;
        $endDate = $request->endDate;
        $startDate = $request->startDate;

        $existingPref = Preferences::where('userId', $userId)->first();

        if($existingPref){
            $prefId = $existingPref->prefId;
            Preferences::where('prefId', $prefId)->update([
                'owner_name' => $name,
                'department' => $department,
                'designation' => $designation,
                'head_name' => $head_name,
                'head_designation' => $head_designation,
            ]);
        }else{
            Preferences::create([
                'userId' => $userId,
                'owner_name' => $name,
                'department' => $department,
                'designation' => $designation,
                'head_name' => $head_name,
                'head_designation' => $head_designation,
            ]);
        }

       $reports = ReportDate::select(
            'report_date.date',
            'report_date.documentation',
            'report_date.description as doc_desc',
            'reports.reportDateId as dateId',
            'reports.type',
            'reports.description as desc'
        )
        ->join('reports', 'report_date.reportDateId', '=', 'reports.reportDateId')
        ->where('report_date.userId', $userId)
        ->whereBetween('report_date.date', [$startDate, $endDate])
        ->get();

        if(!$reports){
            return response()->json([
                'message' => "Please add reports first"
            ]);
        }

        $templatePath = public_path('storage/templates/monthly_report_template.docx');
        $templateProcessor = new TemplateProcessor($templatePath);

        $templateProcessor->setValue('doc_owner_name', $name);
        $templateProcessor->setValue('department', $department);
        $templateProcessor->setValue('owner_desig', $designation);
        $templateProcessor->setValue('report_month', date('F', strtotime($startDate)));

        $reportDates = ReportDate::whereBetween('date', [$startDate, $endDate])->where('userId', $userId)->orderBy('date', 'ASC')->get();
        
        //rows
        $templateProcessor->cloneRow('t_date', count($reportDates));

        $index = 1;
        foreach ($reportDates as $reportDate) {
            //dates
            $templateProcessor->setValue(
                't_date#' . $index,
                date('d', strtotime($reportDate->date))
            );

            $tasks = [];
            foreach($reports as $report){
                if (date('Y-m-d', strtotime($report->date)) === date('Y-m-d', strtotime($reportDate->date))) {
                    if ($report->type === 'task_accomplished') {
                        $tasks[] = $report->desc;
                    }
                }
            }
            $templateProcessor->cloneBlock('block#'. ($index), count($tasks), true, true);

            for ($taskIndex = 1; $taskIndex <= count($tasks); $taskIndex++) {
                $templateProcessor->setValue(
                    "t_desc#{$index}#{$taskIndex}",
                    $tasks[$taskIndex - 1]
                );
            }
            $index++;
        }

        $templateProcessor->setValue('dep_head', $head_name);
        $templateProcessor->setValue('designation', $head_designation);


        $fileName = preg_replace('/[^A-Za-z0-9]/', '_', trim($name)) . '_Month_of_' . date('F', strtotime($startDate)) . '.docx';
        $tempFile = tempnam(sys_get_temp_dir(), 'docx');

        $templateProcessor->saveAs($tempFile);

        LogRecorder::RecordLog("EXPORT", "Exported a report.");

        return response()->download(
            $tempFile,
            $fileName,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ]
        )->deleteFileAfterSend(true);
        
    }
}
