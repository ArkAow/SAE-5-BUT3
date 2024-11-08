<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_class_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the Class table to store the classes of the school';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Class');
        $table->addColumn('id','integer',['autoincrement'=>true]);
        $table->addColumn('name','string',['length' => 25]);
        $table->addColumn('group_id','integer');
        $table->setPrimaryKey(['id']);
        $table ->addForeignKeyConstraint('Group', ['group_id'], ['id'], ['onDelete' => 'CASCADE']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('Class');
    }
}
