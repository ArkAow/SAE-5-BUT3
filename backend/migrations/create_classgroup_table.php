<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_classgroup_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a class for connect the group with the group';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('ClassGroup');
        $table->addColumn('group_id', 'integer');
        $table->addColumn('class_id', 'integer');
        $table->addForeignKeyConstraint('Group', ['group_id'], ['id'], ['onDelete' => 'CASCADE']);
        $table->addForeignKeyConstraint('Class', ['class_id'], ['id'], ['onDelete' => 'CASCADE']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('ClassGroup');
    }
}
