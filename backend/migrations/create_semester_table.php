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
    $table = $schema->createTable('Semester');
    $table->addColumn('id', 'integer', ['autoincrement' => true]);
    $table->addColumn('name', 'string', ['length' => 50]);
    $table->setPrimaryKey(['id']);

    $table->addColumn('curriculum_id', 'integer');
    $table->addForeignKeyConstraint('Curriculum', ['curriculum_id'], ['id'], ['onDelete' => 'CASCADE']);
}


    public function down(Schema $schema): void
    {
        $schema->dropTable('Semester');
    }
}
