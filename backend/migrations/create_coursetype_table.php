<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241108095603 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creation of the table CourseType (TP/TD/CM)';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('CourseType');
        $table->addColumn('id','integer',['autoincrement' => true]);
        $table->addColumn('name','string',['length' => 10]);
        $table->addColumn('color','string',['length' => 7]);
        $table->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('CourseType');
    }
}
