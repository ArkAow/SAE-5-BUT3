<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241126183620 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute les types de cours avec leurs couleurs et scopes';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO course_type (name, color, scope) VALUES ('CM', '#FFFF00', 'class')");
        $this->addSql("INSERT INTO course_type (name, color, scope) VALUES ('TD', '#FF6961', 'group')");
        $this->addSql("INSERT INTO course_type (name, color, scope) VALUES ('TP', '#ADD8E6', 'half_group')");
        $this->addSql("INSERT INTO course_type (name, color, scope) VALUES ('SAE', '#008000', 'class group half_group')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM course_type WHERE name IN ('CM', 'TD', 'TP', 'SAE')");
    }
}