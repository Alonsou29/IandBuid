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
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->uuid('employee_id');
            $table->string('emplo_name');
            $table->string('phone_number')->nulleable();
            $table->date('start_work');
            $table->date('end_work');
            $table->string('title');
            $table->string('duties');
            $table->text('reason_leaving');
            $table->foreign('employee_id')->references('social_id')->on('employees')->onDelete('cascade');
            $table->boolean('isDelete')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
