<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_subjects_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a Table for the Subjects for the Courses';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Subject');
        $table->addColumn('idCode','integer',['autoincrement' => true]);
        $table->addColumn('code', 'string', ['length' => 5]);
        $table->addColumn('name','string',['length' => 50]);
        $table->addColumn('duration','integer',['length' => 3]);
        $table->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('Subject');
    }
}