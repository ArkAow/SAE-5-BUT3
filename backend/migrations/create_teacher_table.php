<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_teacher_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Table for the teachers and the Part Time Tutors, with ';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Teacher');
        $table->addColumn('id','integer',['autoincrement' => true]);
        $table->addColumn('first_name', 'string', ['length' => 50]);
        $table->addColumn('last_name', 'string', ['length' => 50]);
        $table->addColumn('code', 'string', ['length' => 5]);
        $table->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('Teacher');
    }
}
