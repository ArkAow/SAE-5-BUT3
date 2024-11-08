<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241107092349 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a Table for the Professors with an inheritance of Teacher';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Professor');
        $table->addColumn('id', 'integer');
        $table->setPrimaryKey(['id']);
        $table->addForeignKeyConstraint($table, ['id'], ['id'], ['onDelete' => 'CASCADE']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('Professor');
    }
}
