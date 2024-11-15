<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241114084509 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Table Half_Group

        $half_group = $schema->createTable('half_group');
        $half_group->addColumn('id', 'integer', ['autoincrement' => true]);
        $half_group->addColumn('name', 'string', ['length' => 20]);
        $half_group->setPrimaryKey(['id']);
          
        // Table Group

        $group = $schema->createTable('group');
        $group->addColumn('id', 'integer', ['autoincrement' => true]);
        $group->addColumn('name', 'string', ['length' => 30]);
        $group->setPrimaryKey(['id']);
     
        // Table Group - Half_Group

        $group_half_group = $schema->createTable('group_half_group');
        $group_half_group->addColumn('group_id', 'integer');
        $group_half_group->addColumn('half_group_id', 'integer');
        $group_half_group->addForeignKeyConstraint($group, ['group_id'], ['id'], ['onDelete' => 'CASCADE']);
        $group_half_group->addForeignKeyConstraint($half_group, ['half_group_id'], ['id'], ['onDelete' => 'CASCADE']);
        
        // Table Class

        $class = $schema->createTable('class');
        $class->addColumn('id', 'integer', ['autoincrement' => true]);
        $class->addColumn('name', 'string', ['length' => 20]);
        $class->setPrimaryKey(['id']);
        
        // Table Class - Group

        $class_group = $schema->createTable('class_group');
        $class_group->addColumn('class_id', 'integer');
        $class_group->addColumn('group_id', 'integer');
        $class_group->addForeignKeyConstraint($class, ['class_id'], ['id'], ['onDelete' => 'CASCADE']);
        $class_group->addForeignKeyConstraint($group, ['group_id'], ['id'], ['onDelete' => 'CASCADE']);
        
        // Table Curriculum

        $curriculum = $schema->createTable('curriculum');
        $curriculum->addColumn('id', 'integer', ['autoincrement' => true]);
        $curriculum->addColumn('name', 'string', ['length' => 50]);
        $curriculum->setPrimaryKey(['id']);

        // Table Curriculum - Class

        $curriculum_class = $schema->createTable('curriculum_class');
        $curriculum_class->addColumn('curriculum_id', 'integer');
        $curriculum_class->addColumn('class_id', 'integer');
        $curriculum_class->addForeignKeyConstraint($curriculum, ['curriculum_id'], ['id'], ['onDelete' => 'CASCADE']);
        $curriculum_class->addForeignKeyConstraint($class, ['class_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Semester

        $semester = $schema->createTable('semester');
        $semester->addColumn('id', 'integer', ['autoincrement' => true]);
        $semester->addColumn('name', 'string', ['length' => 50]);
        $semester->setPrimaryKey(['id']);
        
        // Table Semester - Curriculum
        
        $semester_curriculum = $schema->createTable('curriculum_semester');
        $semester_curriculum->addColumn('curriculum_id', 'integer');
        $semester_curriculum->addColumn('semester_id', 'integer');
        $semester_curriculum->addForeignKeyConstraint($curriculum, ['curriculum_id'], ['id'], ['onDelete' => 'CASCADE']);
        $semester_curriculum->addForeignKeyConstraint($semester, ['semester_id'], ['id'], ['onDelete' => 'CASCADE']);
               
        // Table Subject

        $subject = $schema->createTable('subject');
        $subject->addColumn('id', 'integer', ['autoincrement' => true]);
        $subject->addColumn('name', 'string', ['length' => 50]);
        $subject->addColumn('code', 'string', ['length' => 10]);
        $subject->addColumn('duration', 'float');
        $subject->setPrimaryKey(['id']);

        // Table Subject - Semester

        $subject_semester = $schema->createTable('subject_semester');
        $subject_semester->addColumn('subject_id', 'integer');
        $subject_semester->addColumn('semester_id', 'integer');
        $subject_semester->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);
        $subject_semester->addForeignKeyConstraint($semester, ['semester_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Course

        $course = $schema->createTable('course');
        $course->addColumn('id', 'integer');
        $course->addColumn('duration', 'float');
        $course->addColumn('position_x', 'integer');
        $course->addColumn('position_y', 'integer');
        $course->setPrimaryKey(['id']);

        // Table Course - Subject
        
        $course_subject = $schema->createTable('course_subject');
        $course_subject->addColumn('id_course', 'integer');
        $course_subject->addColumn('id_subject', 'integer');
        $course_subject->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_subject->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Course_Type

        $course_type = $schema->createTable('course_type');
        $course_type->addColumn('id', 'integer');
        $course_type->addColumn('name', 'string', ['length' => 50]);
        $course_type->addColumn('color', 'string', ['length' => 50]);
        $course_type->addColumn('scope', 'string', ['length' => 500]);
        $course_type->setPrimaryKey(['id']);
        // ADD scope VARCHAR(800)

        // Table Course_Type - Course

        $course_type_course = $schema->createTable('course_type_course');
        $course_type_course->addColumn('course_type_id', 'integer');
        $course_type_course->addColumn('course_id', 'integer');
        $course_type_course->addForeignKeyConstraint($course_type, ['course_type_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_type_course->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);


        // Table Expected_Duration : format : matiere | type | durée                         

        $expected_duration = $schema->createTable('expected_duration');
        $expected_duration->addColumn('id', 'integer');
        $expected_duration->addColumn('name', 'string', ['length' => 80]);                    // Matière
        $expected_duration->addColumn('type', 'string', ['length' => 80]);                    // Type
        $expected_duration->addColumn('expected_duration', 'float');                                    // Durée
        $expected_duration->addForeignKeyConstraint($subject, ['name'], ['name'], ['onDelete' => 'CASCADE']);
        $expected_duration->addForeignKeyConstraint($course_type, ['type'], ['name'], ['onDelete' => 'CASCADE']);
        $expected_duration->setPrimaryKey(['id']);

        // Table Expected_Duration - Subject

        $expected_duration_subject = $schema->createTable('expected_duration_subject');
        $expected_duration_subject->addColumn('expected_duration_id', 'integer');
        $expected_duration_subject->addColumn('subject_id', 'integer');
        $expected_duration_subject->addForeignKeyConstraint($expected_duration, ['expected_duration_id'], ['id'], ['onDelete' => 'CASCADE']);
        $expected_duration_subject->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Expected_Duration - Course_Type

        $expected_duration_course_type = $schema->createTable('expected_duration_course_type');
        $expected_duration_course_type->addColumn('expected_duration_id', 'integer');
        $expected_duration_course_type->addColumn('course_type_id', 'integer');
        $expected_duration_course_type->addForeignKeyConstraint($expected_duration, ['expected_duration_id'], ['id'], ['onDelete' => 'CASCADE']);
        $expected_duration_course_type->addForeignKeyConstraint($course_type, ['course_type_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Teacher

        $teacher = $schema->createTable('teacher');
        $teacher->addColumn('id', 'integer', ['autoincrement' => true]);
        $teacher->addColumn('first_name', 'string', ['length' => 100]);
        $teacher->addColumn('last_name', 'string', ['length' => 100]);
        $teacher->addColumn('code', 'string', ['length' => 30]);
        $teacher->addColumn('subjects_taught', 'string', ['length' => 1000]);
        $teacher->setPrimaryKey(['id']);

        // Table Course - Teacher

        $course_teacher = $schema->createTable('course_teacher');
        $course_teacher->addColumn('course_id', 'integer');
        $course_teacher->addColumn('teacher_id', 'integer');
        $course_teacher->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_teacher->addForeignKeyConstraint($teacher, ['teacher_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Professor

        $professor = $schema->createTable('professor');
        $professor->addColumn('id', 'integer');
        $professor->addForeignKeyConstraint($teacher, ['id'], ['id'], ['onDelete' => 'CASCADE']);
        $professor->setPrimaryKey(['id']);

        // Table PartTimeTutor

        $partTimeTutor = $schema->createTable('part_time_tutor');
        $partTimeTutor->addColumn('id', 'integer');
        $partTimeTutor->addColumn('hourly_constraint', 'string', ['length' => 500]);
        $partTimeTutor->addForeignKeyConstraint($teacher, ['id'], ['id'], ['onDelete' => 'CASCADE']);
        $partTimeTutor->setPrimaryKey(columnNames: ['id']);

        // Table User

        $user = $schema->createTable('user');
        $user->addColumn('id', 'integer', ['autoincrement' => true]);
        $user->addColumn('email', 'integer', ['length' => 150]);
        $user->addColumn('password', 'integer', ['length' => 150]);
        $partTimeTutor->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $schema->dropTable('half_group');
        $schema->dropTable('group');
        $schema->dropTable('group_half_group');
        $schema->dropTable('class');
        $schema->dropTable('class_group');
        $schema->dropTable('curriculum');
        $schema->dropTable('curriculum_class');
        $schema->dropTable('semester');
        $schema->dropTable('curriculum_semester');
        $schema->dropTable('subject');
        $schema->dropTable('subject_semester');
        $schema->dropTable('course');
        $schema->dropTable('course_subject');
        $schema->dropTable('course_type');
        $schema->dropTable('course_type_course');
        $schema->dropTable('expected_duration');
        $schema->dropTable('expected_duration_subject');
        $schema->dropTable('expected_duration_course_type');
        $schema->dropTable('teacher');
        $schema->dropTable('course_teacher');
        $schema->dropTable('professor');
        $schema->dropTable('part_time_tutor');
        $schema->dropTable('user');
    }
}
