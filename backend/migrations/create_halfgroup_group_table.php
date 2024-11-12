<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_halfgroup_group_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a Table for connect the Half Group of the school with the Group';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Group_Halfgroup');
        $table->addColumn('group_id', 'integer');
        $table->addColumn('halfgroup_id', 'integer');
        $table->addForeignKeyConstraint('Group', ['group_id'], ['id'], ['onDelete' => 'CASCADE']);
        $table->addForeignKeyConstraint('HalfGroup', ['halfgroup_id'], ['id'], ['onDelete' => 'CASCADE']);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs

    }
}
