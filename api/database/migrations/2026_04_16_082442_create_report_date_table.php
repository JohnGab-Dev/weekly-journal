<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('report_date', function (Blueprint $table) {
            $table->id('reportDateId');
            $table->unsignedBigInteger('userId');
            $table->date('date');
            $table->string('documentation')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_date');
    }
};
