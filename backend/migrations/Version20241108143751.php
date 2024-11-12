<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241108143751 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Combined migration for all tables';
    }

    public function up(Schema $schema): void
    {
        // Table Curriculum
        $curriculum = $schema->createTable('Curriculum');
        $curriculum->addColumn('id', 'integer', ['autoincrement' => true]);
        $curriculum->addColumn('name', 'string', ['length' => 50]);
        $curriculum->setPrimaryKey(['id']);

        // Table Class
        $class = $schema->createTable('Class');
        $class->addColumn('id', 'integer', ['autoincrement' => true]);
        $class->addColumn('name', 'string', ['length' => 50]);
        $class->addColumn('curriculum_id', 'integer');
        $class->setPrimaryKey(['id']);
        $class->addForeignKeyConstraint($curriculum, ['curriculum_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Group
        $group = $schema->createTable('Group');
        $group->addColumn('id', 'integer', ['autoincrement' => true]);
        $group->addColumn('name', 'string', ['length' => 50]);
        $group->addColumn('class_id', 'integer');
        $group->setPrimaryKey(['id']);
        $group->addForeignKeyConstraint($class, ['class_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table HalfGroup
        $halfGroup = $schema->createTable('HalfGroup');
        $halfGroup->addColumn('id', 'integer', ['autoincrement' => true]);
        $halfGroup->addColumn('name', 'string', ['length' => 50]);
        $halfGroup->addColumn('group_id', 'integer');
        $halfGroup->setPrimaryKey(['id']);
        $halfGroup->addForeignKeyConstraint($group, ['group_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Semester
        $semester = $schema->createTable('Semester');
        $semester->addColumn('id', 'integer', ['autoincrement' => true]);
        $semester->addColumn('name', 'string', ['length' => 50]);
        $semester->addColumn('curriculum_id', 'integer');
        $semester->setPrimaryKey(['id']);
        $semester->addForeignKeyConstraint($curriculum, ['curriculum_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Subject
        $subject = $schema->createTable('Subject');
        $subject->addColumn('id', 'integer', ['autoincrement' => true]);
        $subject->addColumn('name', 'string', ['length' => 50]);
        $subject->addColumn('code', 'string', ['length' => 10]);
        $subject->addColumn('expected_duration', 'integer');
        $subject->setPrimaryKey(['id']);

        // Table Semester_Subjects (join table between Semester and Subject)
        $semesterSubjects = $schema->createTable('semester_subjects');
        $semesterSubjects->addColumn('semester_id', 'integer');
        $semesterSubjects->addColumn('subject_id', 'integer');
        $semesterSubjects->setPrimaryKey(['semester_id', 'subject_id']);
        $semesterSubjects->addForeignKeyConstraint($semester, ['semester_id'], ['id'], ['onDelete' => 'CASCADE']);
        $semesterSubjects->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table CourseType
        $courseType = $schema->createTable('CourseType');
        $courseType->addColumn('id', 'integer', ['autoincrement' => true]);
        $courseType->addColumn('name', 'string', ['length' => 50]);
        $courseType->addColumn('color', 'string', ['length' => 50]);
        $courseType->setPrimaryKey(['id']);

        // Table Teacher
        $teacher = $schema->createTable('Teacher');
        $teacher->addColumn('id', 'integer', ['autoincrement' => true]);
        $teacher->addColumn('first_name', 'string', ['length' => 50]);
        $teacher->addColumn('last_name', 'string', ['length' => 50]);
        $teacher->addColumn('code', 'string', ['length' => 50]);
        $teacher->addUniqueIndex(['code']);
        $teacher->setPrimaryKey(['id']);

        // Table teacher_teachable_subjects (join table between Teacher and Subject)
        $teacherSubjects = $schema->createTable('teacher_teachable_subjects');
        $teacherSubjects->addColumn('teacher_id', 'integer');
        $teacherSubjects->addColumn('subject_id', 'integer');
        $teacherSubjects->setPrimaryKey(['teacher_id', 'subject_id']);
        $teacherSubjects->addForeignKeyConstraint($teacher, ['teacher_id'], ['id'], ['onDelete' => 'CASCADE']);
        $teacherSubjects->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Course
        $course = $schema->createTable('Course');
        $course->addColumn('id', 'integer', ['autoincrement' => true]);
        $course->addColumn('type_id', 'integer');
        $course->addColumn('subject_id', 'integer');
        $course->addColumn('duration', 'integer');
        $course->addColumn('teacher_id', 'integer');
        $course->setPrimaryKey(['id']);
        $course->addForeignKeyConstraint($courseType, ['type_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course->addForeignKeyConstraint($teacher, ['teacher_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table User
        $user = $schema->createTable('User');
        $user->addColumn('id', 'integer', ['autoincrement' => true]);
        $user->addColumn('email', 'string', ['length' => 100]);
        $user->addColumn('password', 'string', ['length' => 60]);
        $user->addUniqueIndex(['email']);
        $user->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('semester_subjects');
        $schema->dropTable('teacher_teachable_subjects');
        $schema->dropTable('Course');
        $schema->dropTable('Teacher');
        $schema->dropTable('CourseType');
        $schema->dropTable('Subject');
        $schema->dropTable('Semester');
        $schema->dropTable('HalfGroup');
        $schema->dropTable('Group');
        $schema->dropTable('Class');
        $schema->dropTable('Curriculum');
        $schema->dropTable('User');
    }
}
