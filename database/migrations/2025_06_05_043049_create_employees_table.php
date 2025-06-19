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
        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('social_id')->primary();
            $table->string('name');
            $table->string('lastname');
            $table->string('phone_number');
            $table->string('email');
            $table->integer('age');
            $table->date('birthday');
            $table->boolean('apply_occupations')->nullable();
            $table->boolean('avaible_travel');
            $table->boolean('military_services');
            $table->string('start_services')->nullable();
            $table->string('end_services')->nullable();
            $table->string('military_desc')->nullable();
            $table->string('contract_url');
            $table->boolean('status');
            $table->boolean('isDelete')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
