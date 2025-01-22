<?php

namespace Tests\Entity;

use App\Entity\Curriculum;
use App\Entity\FormationLevel;
use App\Entity\Semester;
use PHPUnit\Framework\TestCase;

class CurriculumTest extends TestCase
{
    public function testsetName(){
        $curriculum = new Curriculum();
        $curriculum->setName('CurriculumTest');
        $this->assertEquals("CurriculumTest", $curriculum->getName());
    }

    public function testaddFormationLevel(){
        $curriculum = new Curriculum();
        $formationLevel = new FormationLevel();
        $curriculum->addFormationLevel($formationLevel);
        $this->assertEquals(1, $curriculum->getFormationLevels()->count());
    }

    public function testremoveFormationLevel(){
        $curriculum = new Curriculum();
        $formationLevel = new FormationLevel();
        $curriculum->addFormationLevel($formationLevel);
        $this->assertEquals(1, $curriculum->getFormationLevels()->count());
        $curriculum->removeFormationLevel($formationLevel);
        $this->assertEquals(0, $curriculum->getFormationLevels()->count());
    }

    public function testaddSemester(){
        $curriculum = new Curriculum();
        $semester = new Semester();
        $curriculum->addSemester($semester);
        $this->assertEquals(1, $curriculum->getSemesters()->count());
    }

    public function testremoveSemester(){
        $curriculum = new Curriculum();
        $semester = new Semester();
        $curriculum->addSemester($semester);
        $this->assertEquals(1, $curriculum->getSemesters()->count());
        $curriculum->removeSemester($semester);
        $this->assertEquals(0, $curriculum->getSemesters()->count());
    }
}
