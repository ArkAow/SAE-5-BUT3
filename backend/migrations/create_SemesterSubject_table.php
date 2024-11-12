<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241108104153 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('semester_subjects');
        $table->addColumn('semester_id', 'integer');
        $table->addColumn('subject_id', 'integer');
        $table->setPrimaryKey(['semester_id', 'subject_id']);

        $table->addForeignKeyConstraint('Semester', ['semester_id'], ['id'], ['onDelete' => 'CASCADE']);
        $table->addForeignKeyConstraint('Subject', ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('semester_subjects');
    }
}
