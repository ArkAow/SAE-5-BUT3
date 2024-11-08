<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use App\Entity\Teacher;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class create_course_table extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create a table for the courses';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('Course');
        $table->addColumn('course_id','integer',['autoincrement' => true]);
        $table->addColumn('subject','Subject');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs

    }
}
