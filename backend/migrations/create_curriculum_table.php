<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_curriculum_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the Curriculum table to store the curriculum of the school';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Curriculum');
        $table->addColumn('id', 'integer', ['autoincrement' => true]);
        $table->addColumn('name', 'string', ['length' => 50]);
        $table->setPrimaryKey(['id']);
        $table->addColumn('class_id', 'integer', ['notnull' => true]);
        $table->addForeignKeyConstraint('Class', ['class_id'], ['id'], ['onDelete' => 'CASCADE']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('Curriculum');
    }
}
