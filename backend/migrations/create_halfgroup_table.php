<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_halfgroup_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a Table for the Half Groups of the school';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('HalfGroup');
        $table->addColumn('id', 'integer', ['autoincrement' => true]);
        $table->addColumn('name', 'string', ['length' => 50]);
        $table->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('HalfGroup');
    }
}
