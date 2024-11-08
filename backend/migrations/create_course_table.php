<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use App\Entity\Teacher;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_course_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a table for the courses';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Course');
        $table->addColumn('course_id','integer',['autoincrement' => true]);
        $table->addColumn('teacher_id','integer');
        $table->addColumn('course_type_id','integer');
        $table->addColumn('subject_id','integer');
        $table->addColumn('duration','integer');
        $table->setPrimaryKey(['course_id']);

        $table->addForeignKeyConstraint(
            'CourseType',            
            ['course_type_id'],       
            ['id'],               
            ['onDelete' => 'CASCADE']
        );

        $table->addForeignKeyConstraint(
            'Subject',            
            ['subject_id'],       
            ['id'],               
            ['onDelete' => 'CASCADE']
        );

        $table->addForeignKeyConstraint(
            'Teacher',            
            ['teacher_id'],       
            ['id'],               
            ['onDelete' => 'CASCADE']
        );
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('Course');
    }
}
