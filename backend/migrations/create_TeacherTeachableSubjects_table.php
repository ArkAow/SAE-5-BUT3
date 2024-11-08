<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241108095057 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('teacher_teachable_subjects');
        $table->addColumn('teacher_id', 'integer');
        $table->addColumn('subject_id', 'integer');
        $table->setPrimaryKey(['teacher_id', 'subject_id']);

        $table->addForeignKeyConstraint('Teacher', ['teacher_id'], ['id'], ['onDelete' => 'CASCADE']);
        $table->addForeignKeyConstraint('Subject', ['subject_id'], ['id'], ['onDelete' => 'CASCADE']);

    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('teacher_teachable_subjects');
    }
}
