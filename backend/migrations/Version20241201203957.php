<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241201203957 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute une class A1 comme base pour tous les curriculums et les groupes';
    }

    public function up(Schema $schema): void
    {
        // Insérer la classe A1 dans la table class
        $this->addSql("INSERT INTO class (id, name) VALUES (1, 'A1') ON DUPLICATE KEY UPDATE name = 'A1';");

        // A1 est connecté à tous les curriculums disponibles
        $this->addSql(" INSERT INTO curriculum_class (curriculum_id, class_id) SELECT id, 1 FROM curriculumON DUPLICATE KEY UPDATE curriculum_id = curriculum_id;");

        // A1 est connecté à tous les groupes disponibles
        $this->addSql(" INSERT INTO class_group (class_id, group_id) SELECT 1, id FROM `group` ON DUPLICATE KEY UPDATE group_id = group_id;");
    }

    public function down(Schema $schema): void
    {
        // Suppression de toutes les connexions entre A1 et les curriculums
        $this->addSql("DELETE FROM curriculum_class WHERE class_id = 1");

        // Suppression de toutes les connexions entre A1 et les groupes
        $this->addSql("DELETE FROM class_group WHERE class_id = 1");

        // Enfin suppression de A1 dans la table class
        $this->addSql("DELETE FROM class WHERE id = 1");
    }
}
