<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_user_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a table for the user of the app with an email, a password and a role';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('User');
        $table->addColumn('id', 'integer', ['autoincrement' => true]);
        $table->addColumn('email', 'string', ['length' => 255]);
        $table->addColumn('password', 'string', ['length' => 255]);
        $table->setPrimaryKey(['id']);
    }
    

    public function down(Schema $schema): void
    {
        $schema->dropTable('User');
    }
}
