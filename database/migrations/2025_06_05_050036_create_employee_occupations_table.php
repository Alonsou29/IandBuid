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
        Schema::create('employee_occupation', function (Blueprint $table) {
            $table->uuid('employee_id');
            $table->foreign('employee_id')->references('social_id')->on('employees')->onDelete('cascade');
            $table->foreignId('occupation_id')->constrained()->onDelete('cascade');
            $table->boolean('isDelete')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_occupation', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropColumn('employee_id');
            $table->dropForeign(['occupation_id']);
            $table->dropColumn('occupation_id');
        });
        Schema::dropIfExists('employee_occupation');
    }
};
