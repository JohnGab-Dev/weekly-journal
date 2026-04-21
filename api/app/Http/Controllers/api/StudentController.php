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

class StudentController extends Controller
{
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

        $reportDates = ReportDate::whereBetween('date', [$startDate, $endDate])->get();
        
        //rows
        $templateProcessor->cloneRow('date', count($reportDates));

        $tasks = [];
        $knowledges = [];
        $skills = [];
        $values = [];

        $index = 1;
        foreach ($reportDates as $reportDate) {
            //dates
            $templateProcessor->setValue(
                'date#' . $index,
                date('F d, Y', strtotime($reportDate->date))
            );

            //tasks blocks
            foreach($reports as $report){
                if($report->date === $reportDate && $report->type === 'task_accomplished'){
                    $tasks[] = $report->desc;
                }
                if($report->date === $reportDate && $report->type === 'knowledge'){
                    $knowledges[] = $report->desc;
                }
                if($report->date === $reportDate && $report->type === 'skills'){
                    $skills[] = $report->desc;
                }
                if($report->date === $reportDate && $report->type === 'values'){
                    $values[] = $report->desc;
                }
            }
            $templateProcessor->cloneBlock('task_block', count($tasks), true, true);
            $templateProcessor->cloneBlock('knowledge_block', count($knowledges), true, true);
            $templateProcessor->cloneBlock('skills_block', count($skills), true, true);
            $templateProcessor->cloneBlock('values_block', count($values), true, true);
            $taskIndex = 1;
            foreach ($tasks as $task) {
                $templateProcessor->setValue(
                    'task_accomplish#' . ($taskIndex),
                    $task
                );
                $taskIndex++;
            }
            
            $knowledgeIndex = 1;
            foreach ($knowledges as $knowledge) {
                $templateProcessor->setValue(
                    'knowledge#' . ($knowledgeIndex),
                    $knowledge
                );
                $knowledgeIndex++;
            }

            $skillIndex = 1;
            foreach ($skills as $skill) {
                $templateProcessor->setValue(
                    'skills#' . ($skillIndex),
                    $skill
                );
                $skillIndex++;
            }

            $valuesIndex = 1;
            foreach ($values as $value) {
                $templateProcessor->setValue(
                    'values#' . ($valuesIndex),
                    $value
                );
                $valuesIndex++;
            }
            
            $tasks = [];
            $knowledges = [];
            $skills = [];
            $values = [];
            $index++;
        }

        $templateProcessor->setValue('owner_designation', $designation);
        $templateProcessor->setValue('date_prepared', date('F d, Y', strtotime($endDate)));
        $templateProcessor->setValue('head', $head_name);
        $templateProcessor->setValue('head_designation', $head_designation);
        $templateProcessor->setValue('date_signed', $endDate);

        $reportImages = ReportDate::whereBetween('date', [$startDate, $endDate])->where('documentation', '!=', '')->get();
        $templateProcessor->cloneBlock('task_block', count($reportImages), true, true);

        foreach ($reportImages as $index => $img) {

            $templateProcessor->setImageValue(
                'image#' . ($index + 1),
                [
                    'path' => storage_path('app/public' . $img->path),
                    'width' => 300,
                    'height' => 200,
                    'ratio' => true,
                ]
            );

            // Description
            $templateProcessor->setValue(
                'image_description#' . ($index + 1),
                $img->description
            );
        }

        $fileName = 'report.docx';
        $savePath = storage_path("app/public/$fileName");

        $templateProcessor->saveAs($savePath);
        // $dl = download($savePath)->deleteFileAfterSend(true);

        // if(!$dl){
        //     return response()->json([
        //         'message' => 'Something went wrong'
        //     ]);
        // }
        return response()->json([
            'message' => 'Export Successfull'
        ]);
        
    }
}
