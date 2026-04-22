<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Events;
use App\Models\ReportDate;
use App\Models\Preferences;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\TemplateProcessor;
use App\Helpers\LogRecorder;

class StudentController extends Controller
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
        $coordinator = $request->coordinator;
        $designation = $request->designation;
        $head_name = $request->head_name;
        $head_designation = $request->head_designation;
        $endDate = $request->endDate;
        $startDate = $request->startDate;
        $hours = $request->hours;

        $existingPref = Preferences::where('userId', $userId)->first();

        if($existingPref){
            $prefId = $existingPref->prefId;
            Preferences::where('prefId', $prefId)->update([
                'coordinator' => $coordinator,
                'owner_name' => $name,
                'department' => $department,
                'designation' => $designation,
                'head_name' => $head_name,
                'head_designation' => $head_designation,
                'hours' => $hours
            ]);
        }else{
            Preferences::create([
                'userId' => $userId,
                'coordinator' => $coordinator,
                'owner_name' => $name,
                'department' => $department,
                'designation' => $designation,
                'head_name' => $head_name,
                'head_designation' => $head_designation,
                'hours' => $hours
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

        $templatePath = storage_path('app/public/templates/template-for-ojt.docx');
        $templateProcessor = new TemplateProcessor($templatePath);

        $templateProcessor->setValue('owner', $name);
        $templateProcessor->setValue('coordinator', $coordinator);
        $templateProcessor->setValue('institution', $department);
        $templateProcessor->setValue('job_description', $designation);
        $date_range = "".date('M, d, Y', strtotime($startDate))." - ".date('M, d, Y', strtotime($endDate));
        $templateProcessor->setValue('date_range', $date_range);
        $templateProcessor->setValue('hours', $hours." hours");
        $templateProcessor->setValue('owner', $name);

        $objectives = [];
        foreach($reports as $report){
            if($report->type === 'reflection'){
                $templateProcessor->setValue('reflection', $report->desc);
            }
            if($report->type === 'objective'){
                $objectives[] = $report->desc;
            }
        }
        $templateProcessor->cloneBlock('obj_block', count($objectives), true, true);
        $objIndex = 1;
        foreach ($objectives as $objective) {
            $templateProcessor->setValue(
                'objective#' . ($objIndex),
                $objective
            );
            $objIndex++;
        }

        $reportDates = ReportDate::whereBetween('date', [$startDate, $endDate])->where('userId', $userId)->orderBy('date', 'ASC')->get();
        
        //rows
        $templateProcessor->cloneRow('date', count($reportDates));

        $index = 1;
        foreach ($reportDates as $reportDate) {
            //dates
            $templateProcessor->setValue(
                'date#' . $index,
                date('F d, Y', strtotime($reportDate->date))
            );

            $tasks = [];
            $knowledges = [];
            $skills = [];
            $values = [];

            //tasks blocks
            foreach($reports as $report){
                if (date('Y-m-d', strtotime($report->date)) === date('Y-m-d', strtotime($reportDate->date))) {
                    if ($report->type === 'task_accomplished') {
                        $tasks[] = $report->desc;
                    }

                    if ($report->type === 'knowledge') {
                        $knowledges[] = $report->desc;
                    }

                    if ($report->type === 'skills') {
                        $skills[] = $report->desc;
                    }

                    if ($report->type === 'values') {
                        $values[] = $report->desc;
                    }
                }
            }
            $templateProcessor->cloneBlock('task_block#'. ($index), count($tasks), true, true);
            $templateProcessor->cloneBlock('knowledge_block#'. ($index), count($knowledges), true, true);
            $templateProcessor->cloneBlock('skills_block#'. ($index), count($skills), true, true);
            $templateProcessor->cloneBlock('values_block#'. ($index), count($values), true, true);

            for ($taskIndex = 1; $taskIndex <= count($tasks); $taskIndex++) {
                $templateProcessor->setValue(
                    "task_accomplish#{$index}#{$taskIndex}",
                    $tasks[$taskIndex - 1]
                );
            }

            for ($knowledgeIndex = 1; $knowledgeIndex <= count($knowledges); $knowledgeIndex++) {
                $templateProcessor->setValue(
                    "knowledge#{$index}#{$knowledgeIndex}",
                    $knowledges[$knowledgeIndex - 1]
                );
            }
            
            for ($skillIndex = 1; $skillIndex <= count($skills); $skillIndex++) {
                $templateProcessor->setValue(
                    "skills#{$index}#{$skillIndex}",
                    $skills[$skillIndex - 1]
                );
            }

            for ($valuesIndex = 1; $valuesIndex <= count($values); $valuesIndex++) {
                $templateProcessor->setValue(
                    "values#{$index}#{$valuesIndex}",
                    $values[$valuesIndex - 1]
                );
            }
            
            $index++;
        }

        $templateProcessor->setValue('owner_designation', $designation);
        $templateProcessor->setValue('date_prepared', date('F d, Y', strtotime($endDate)));
        $templateProcessor->setValue('head', $head_name);
        $templateProcessor->setValue('head_designation', $head_designation);
        $templateProcessor->setValue('date_signed', date('F d, Y', strtotime($endDate)));

        $reportImages = ReportDate::whereBetween('date', [$startDate, $endDate])->where('documentation', '!=', '')->get();
        $templateProcessor->cloneBlock('docu_block', count($reportImages), true, true);
        $imgIndex = 1;
        foreach ($reportImages as $img) {
            $templateProcessor->setImageValue(
                'image#' . $imgIndex,
                [
                    'path' => storage_path('app/public/' . ltrim($img->documentation, '/')),
                    'width' => 600,
                    'height' => 300,
                    'ratio' => true,
                ]
            );

            // Description
            $templateProcessor->setValue(
                'image_description#' . $imgIndex,
                $img->description." ".date('F d, Y', strtotime($img->date))
            );
            $imgIndex++;
        }

    
        $fileName = preg_replace('/[^A-Za-z0-9]/', '_', trim($name)) . '_' . date('Ymd_His') . '.docx';
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
