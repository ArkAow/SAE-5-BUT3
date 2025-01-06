<?php
declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241120093708 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Table Half_Group

        $half_group = $schema->createTable('half_group');
        $half_group->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $half_group->addColumn('name', 'string', ['length' => 100]); 
        $half_group->setPrimaryKey(['id']);
        
        // Table Group

        $group = $schema->createTable('group');
        $group->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $group->addColumn('name', 'string', ['length' => 100]); 
        $group->setPrimaryKey(['id']);
     
        // Table Group - Half_Group

        $group_half_group = $schema->createTable('group_half_group');
        $group_half_group->addColumn('group_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $group_half_group->addColumn('half_group_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $group_half_group->setPrimaryKey(['group_id', 'half_group_id']);
        $group_half_group->addForeignKeyConstraint($group,['group_id'],['id'],['onDelete' => 'CASCADE']);
        $group_half_group->addForeignKeyConstraint($half_group,['half_group_id'],['id'],['onDelete' => 'CASCADE']);

        // Table FormationLevel

        $formationLevel = $schema->createTable('formation_Level');
        $formationLevel->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $formationLevel->addColumn('name', 'string', ['length' => 100]); 
        $formationLevel->setPrimaryKey(['id']);
        
        // Table FormationLevel - Group

        $formationLevel_group = $schema->createTable('formation_Level_group');
        $formationLevel_group->addColumn('formationLevel_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $formationLevel_group->addColumn('group_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $formationLevel_group->setPrimaryKey(['formationLevel_id', 'group_id']);
        $formationLevel_group->addForeignKeyConstraint($formationLevel, ['formationLevel_id'], ['id'], ['onDelete' => 'CASCADE']);
        $formationLevel_group->addForeignKeyConstraint($group,['group_id'],['id'],['onDelete' => 'CASCADE']);
        
        // Table Curriculum

        $curriculum = $schema->createTable('curriculum');
        $curriculum->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $curriculum->addColumn('name', 'string', ['length' => 100]);
        $curriculum->setPrimaryKey(['id']);

        // Table Curriculum - FormationLevel

        $curriculum_formationLevel = $schema->createTable('curriculum_formation_Level');
        $curriculum_formationLevel->addColumn('curriculum_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $curriculum_formationLevel->addColumn('formationLevel_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $curriculum_formationLevel->setPrimaryKey(['curriculum_id', 'formationLevel_id']);
        $curriculum_formationLevel->addForeignKeyConstraint($curriculum,['curriculum_id'],['id'], ['onDelete' => 'CASCADE']);
        $curriculum_formationLevel->addForeignKeyConstraint( $formationLevel,['formationLevel_id'],['id'],['onDelete' => 'CASCADE']);

        // Table Semester

        $semester = $schema->createTable('semester');
        $semester->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $semester->addColumn('name', 'string', ['length' => 100]);
        $semester->addColumn('week_start', 'integer');
        $semester->addColumn('week_duration', 'integer');
        $semester->setPrimaryKey(['id']);
        
        // Table Semester - Curriculum
        
        $curriculum_semester = $schema->createTable('curriculum_semester');
        $curriculum_semester->addColumn('curriculum_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $curriculum_semester->addColumn('semester_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $curriculum_semester->setPrimaryKey(['curriculum_id', 'semester_id']);
        $curriculum_semester->addForeignKeyConstraint($curriculum, ['curriculum_id'], ['id'], ['onDelete' => 'CASCADE']);
        $curriculum_semester->addForeignKeyConstraint($semester, ['semester_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Subject

        $subject = $schema->createTable('subject');
        $subject->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $subject->addColumn('name', 'string', ['length' => 100]);
        $subject->addColumn('code', 'string', ['length' => 10]);
        $subject->addColumn('duration', 'float');
        $subject->setPrimaryKey(['id']);

        // Table Subject - Semester

        $subject_semester = $schema->createTable('subject_semester');
        $subject_semester->addColumn('subject_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $subject_semester->addColumn('semester_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $subject_semester->setPrimaryKey(['subject_id', 'semester_id']);
        $subject_semester->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);
        $subject_semester->addForeignKeyConstraint($semester, ['semester_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Teacher

        $teacher = $schema->createTable('teacher');
        $teacher->addColumn('id', 'integer',['autoincrement' => true, 'unsigned' => true]);
        $teacher->addColumn('first_name', 'string', ['length' => 100]);
        $teacher->addColumn('last_name', 'string', ['length' => 100]);
        $teacher->addColumn('code', 'string', ['length' => 30]);
        $teacher->addColumn('time_constraints','integer', ['unsigned' => true, 'notnull' => true]);
        $teacher->addColumn('partTimeTutor', 'boolean', ['default' => false]);
        $teacher->setPrimaryKey(['id']);

        // Table Subject - Teacher
        
        $subject_teacher = $schema->createTable('subject_teacher');
        $subject_teacher->addColumn('subject_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $subject_teacher->addColumn('teacher_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $subject_teacher->setPrimaryKey(['subject_id', 'teacher_id']);
        $subject_teacher->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);
        $subject_teacher->addForeignKeyConstraint($teacher, ['teacher_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Course

        $course = $schema->createTable('course');
        $course->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $course->addColumn('duration', 'float');
        $course->addColumn('week_position', 'integer');
        $course->setPrimaryKey(['id']);

        // Table Course - Group

        $course_group = $schema->createTable('course_group');
        $course_group->addColumn('course_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_group->addColumn('group_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_group->setPrimaryKey(['course_id', 'group_id']);
        $course_group->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_group->addForeignKeyConstraint($group, ['group_id'], ['id'], ['onDelete' => 'CASCADE']);
        
        // Table Course - HalfGroup

        $course_half_group = $schema->createTable('course_half_group');
        $course_half_group->addColumn('course_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_half_group->addColumn('half_group_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_half_group->setPrimaryKey(['course_id', 'half_group_id']);
        $course_half_group->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_half_group->addForeignKeyConstraint($half_group, ['half_group_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Course - Teacher

        $course_teacher = $schema->createTable('course_teacher');
        $course_teacher->addColumn('course_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_teacher->addColumn('teacher_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_teacher->setPrimaryKey(['course_id', 'teacher_id']);
        $course_teacher->addForeignKeyConstraint($course,['course_id'],['id'],['onDelete' => 'CASCADE']);
        $course_teacher->addForeignKeyConstraint($teacher,['teacher_id'],['id'],['onDelete' => 'CASCADE']);

        // Table Course - Subject
        
        $course_subject = $schema->createTable('course_subject');
        $course_subject->addColumn('course_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_subject->addColumn('subject_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_subject->setPrimaryKey(['course_id', 'subject_id']);
        $course_subject->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_subject->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Course - FormationLevel
        
        $course_formationLevel = $schema->createTable('course_formation_level');
        $course_formationLevel->addColumn('course_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_formationLevel->addColumn('formationLevel_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_formationLevel->setPrimaryKey(['course_id', 'formationLevel_id']);
        $course_formationLevel->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_formationLevel->addForeignKeyConstraint($formationLevel, ['formationLevel_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Course_Type

        $course_type = $schema->createTable('course_type');
        $course_type->addColumn('id', 'integer',['autoincrement' => true, 'unsigned' => true]);
        $course_type->addColumn('name', 'string', ['length' => 100]);
        $course_type->addColumn('color', 'string', ['length' => 50]);
        $course_type->addColumn('scope', 'string', ['length' => 800, 'default' => 'class', 'notnull' => true]);
        $course_type->setPrimaryKey(['id']);

        // Table Course_Type - Course

        $course_type_course = $schema->createTable('course_type_course');
        $course_type_course->addColumn('course_type_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_type_course->addColumn('course_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_type_course->setPrimaryKey(['course_type_id', 'course_id']);
        $course_type_course->addForeignKeyConstraint($course_type, ['course_type_id'], ['id'], ['onDelete' => 'CASCADE']);
        $course_type_course->addForeignKeyConstraint($course, ['course_id'], ['id'], ['onDelete' => 'CASCADE']);    

        // Table Expected_Duration                          

        $expected_duration = $schema->createTable('expected_duration');
        $expected_duration->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $expected_duration->addColumn('expected_duration', 'float');
        $expected_duration->setPrimaryKey(['id']);

        // Table Expected_Duration - Subject

        $expected_duration_subject = $schema->createTable('expected_duration_subject');
        $expected_duration_subject->addColumn('expected_duration_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $expected_duration_subject->addColumn('subject_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $expected_duration_subject->setPrimaryKey(['expected_duration_id', 'subject_id']);
        $expected_duration_subject->addForeignKeyConstraint($subject, ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);
        $expected_duration_subject->addForeignKeyConstraint($expected_duration,['expected_duration_id'],['id'],['onDelete' => 'CASCADE']);

        // Table Expected_Duration - Course_Type

        $expected_duration_course_type = $schema->createTable('expected_duration_course_type');
        $expected_duration_course_type->addColumn('expected_duration_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $expected_duration_course_type->addColumn('course_type_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $expected_duration_course_type->setPrimaryKey(['expected_duration_id', 'course_type_id']);
        $expected_duration_course_type->addForeignKeyConstraint($expected_duration,['expected_duration_id'],['id'],['onDelete' => 'CASCADE']);
        $expected_duration_course_type->addForeignKeyConstraint($course_type,['course_type_id'],['id'],['onDelete' => 'CASCADE']);

        // Table Expected_Duration - Teacher

        $expected_duration_teacher = $schema->createTable('expected_duration_teacher');
        $expected_duration_teacher->addColumn('expected_duration_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $expected_duration_teacher->addColumn('teacher_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $expected_duration_teacher->setPrimaryKey(['expected_duration_id', 'teacher_id']);
        $expected_duration_teacher->addForeignKeyConstraint($expected_duration,['expected_duration_id'],['id'],['onDelete' => 'CASCADE']);
        $expected_duration_teacher->addForeignKeyConstraint($teacher,['teacher_id'],['id'],['onDelete' => 'CASCADE']);

        // Table Expected_Duration - Course

        $course_expected_duration = $schema->createTable('course_expected_duration');
        $course_expected_duration->addColumn('course_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_expected_duration->addColumn('expected_duration_id', 'integer', ['unsigned' => true, 'notnull' => true]);
        $course_expected_duration->setPrimaryKey(['course_id', 'expected_duration_id']);
        $course_expected_duration->addForeignKeyConstraint($expected_duration,['expected_duration_id'],['id'],['onDelete' => 'CASCADE']);
        $course_expected_duration->addForeignKeyConstraint($course,['course_id'],['id'],['onDelete' => 'CASCADE']);
        
        // Table User

        $user = $schema->createTable('user');
        $user->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $user->addColumn('email', 'string', ['length' => 150]);
        $user->addColumn('password', 'string', ['length' => 150]);
        $user->setPrimaryKey(['id']);

        // Table Department

        $department = $schema->createTable('department');
        $department->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $department->addColumn('name', 'string', ['length' => 100]);
        $department->setPrimaryKey(['id']);
        
        // Table Department - FormationLevel
        
        $department_formationLevel = $schema->createTable('department_formation_Level');
        $department_formationLevel->addColumn('department_id','integer', ['unsigned' => true, 'notnull' => true]);
        $department_formationLevel->addColumn('formationLevel_id','integer', ['unsigned' => true, 'notnull' => true]);
        $department_formationLevel->setPrimaryKey(['department_id', 'formationLevel_id']);
        $department_formationLevel->addForeignKeyConstraint($department, ['department_id'], ['id'], ['onDelete' => 'CASCADE']);
        $department_formationLevel->addForeignKeyConstraint($formationLevel, ['formationLevel_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Department - Teacher

        $department_teacher = $schema->createTable('department_teacher');
        $department_teacher->addColumn('department_id','integer', ['unsigned' => true, 'notnull' => true]);
        $department_teacher->addColumn('teacher_id','integer', ['unsigned' => true, 'notnull' => true]);
        $department_teacher->setPrimaryKey(['department_id', 'teacher_id']);
        $department_teacher->addForeignKeyConstraint($department, ['department_id'], ['id'], ['onDelete' => 'CASCADE']);
        $department_teacher->addForeignKeyConstraint($teacher, ['teacher_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Department - Curriculum

        $department_curriculum = $schema->createTable('department_curriculum');
        $department_curriculum->addColumn('department_id','integer', ['unsigned' => true, 'notnull' => true]);
        $department_curriculum->addColumn('curriculum_id','integer', ['unsigned' => true, 'notnull' => true]);
        $department_curriculum->setPrimaryKey(['department_id', 'curriculum_id']);
        $department_curriculum->addForeignKeyConstraint($department, ['department_id'], ['id'], ['onDelete' => 'CASCADE']);
        $department_curriculum->addForeignKeyConstraint($curriculum, ['curriculum_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Department - User
        $user_department = $schema->createTable('user_department');
        $user_department->addColumn('user_id','integer', ['unsigned' => true, 'notnull' => true]);
        $user_department->addColumn('department_id','integer', ['unsigned' => true, 'notnull' => true]);
        $user_department->setPrimaryKey(['user_id', 'department_id']);
        $user_department->addForeignKeyConstraint($user, ['user_id'], ['id'], ['onDelete' => 'CASCADE']);
        $user_department->addForeignKeyConstraint($department, ['department_id'], ['id'], ['onDelete' => 'CASCADE']);

        // Table Archive
        $archive = $schema->createTable('archive');
        $archive->addColumn('id', 'integer', ['autoincrement' => true, 'unsigned' => true]);
        $archive->setPrimaryKey(['id']);

        // Table Archive - Department
        $archive_department = $schema->createTable('archive_department');
        $archive_department->addColumn('archive_id','integer', ['unsigned' => true, 'notnull' => true]);
        $archive_department->addColumn('department_id','integer', ['unsigned' => true, 'notnull' => true]);
        $archive_department->setPrimaryKey(['archive_id', 'department_id']);
        $archive_department->addForeignKeyConstraint($archive, ['archive_id'], ['id'], ['onDelete' => 'CASCADE']);
        $archive_department->addForeignKeyConstraint($department, ['department_id'], ['id'], ['onDelete' => 'CASCADE']);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $schema->dropTable('course_group');
        $schema->dropTable('course_half_group');
        $schema->dropTable('course_expected_duration');
        $schema->dropTable('expected_duration_teacher');
        $schema->dropTable('half_group');
        $schema->dropTable('group');
        $schema->dropTable('group_half_group');
        $schema->dropTable('formation_Level');
        $schema->dropTable('formation_Level_group');
        $schema->dropTable('curriculum');
        $schema->dropTable('curriculum_formation_Level');
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
        $schema->dropTable('subject_teacher');
        $schema->dropTable('user');
        $schema->dropTable('department');
        $schema->dropTable('department_formation_Level');
        $schema->dropTable('department_teacher');
        $schema->dropTable('department_curriculum');
        $schema->dropTable('user_department');
        $schema->dropTable('archive');
        $schema->dropTable('archive_department');
        $schema->dropTable('course_formation_level'); 
    }
}