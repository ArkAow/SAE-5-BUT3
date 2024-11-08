<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_semester_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the Smester Table where it s connected to the Course Table';
    }

    public function up(Schema $schema): void
    {
        $semesterTable = $schema->createTable('Semester');
        $semesterTable->addColumn('id', 'integer', ['autoincrement' => true]);
        $semesterTable->addColumn('name', 'string', ['length' => 50]);
        $semesterTable->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('Semester');
    }
}
