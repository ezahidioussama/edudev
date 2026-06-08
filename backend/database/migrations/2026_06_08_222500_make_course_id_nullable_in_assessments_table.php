<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            Schema::table('assessments', function (Blueprint $table) {
                $table->dropForeign(['course_id']);
            });
        }

        Schema::table('assessments', function (Blueprint $table) {
            $table->foreignId('course_id')->nullable()->change();
        });

        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            Schema::table('assessments', function (Blueprint $table) {
                $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            Schema::table('assessments', function (Blueprint $table) {
                $table->dropForeign(['course_id']);
            });
        }

        Schema::table('assessments', function (Blueprint $table) {
            $table->foreignId('course_id')->nullable(false)->change();
        });

        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            Schema::table('assessments', function (Blueprint $table) {
                $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            });
        }
    }
};
