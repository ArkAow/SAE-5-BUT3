<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_expected_duration_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a table for the duration of the course';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Expected_Duration');
        $table->addColumn('id', 'integer', ['autoincrement' => true]);
        $table->addColumn('subject_id', 'integer');
        $table->addColumn('course_type_id', 'integer');
        $table->addForeignKeyConstraint('Subject', ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);
        $table->addForeignKeyConstraint('CourseType', ['course_type_id'], ['id'], ['onDelete' => 'CASCADE']);
        $table->addColumn('expected_duration','float');
        $table->setPrimaryKey(['id']);
    }

    //Suppression de la table si down des migrations
    public function down(Schema $schema): void
    {
        $schema->dropTable('Expected_Duration');
    }
}
