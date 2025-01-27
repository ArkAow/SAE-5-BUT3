<?php

namespace Tests\Entity;

use App\Entity\Curriculum;
use App\Entity\Groups;
use App\Entity\FormationLevel;
use App\Entity\Course;
use PHPUnit\Framework\TestCase;

class FormationLevelTest extends TestCase
{
    public function testsetName(){
        $formationLevel = new FormationLevel();
        $formationLevel->setName('FormationLevelTest');
        $this->assertEquals('FormationLevelTest', $formationLevel->getName());
    }

    public function testaddGroup(){
        $formationLevel = new FormationLevel();
        $group = new Groups();
        $formationLevel->addGroup($group);
        $this->assertEquals(1,$formationLevel->getGroups()->count());
    }

    public function testremoveGroups(){
        $formationLevel = new FormationLevel();
        $group = new Groups();
        $formationLevel->addGroup($group);
        $this->assertEquals(1,$formationLevel->getGroups()->count());
        $formationLevel->removeGroup($group);
        $this->assertEquals(0,$formationLevel->getGroups()->count());
    }

    public function testaddCurriculum(){
        $formationLevel = new FormationLevel();
        $curriculum = new Curriculum();
        $formationLevel->addCurriculum($curriculum);
        $this->assertEquals(1,$formationLevel->getCurriculums()->count());
    }

    public function testremoveCurriculum(){
        $formationLevel = new FormationLevel();
        $curriculum = new Curriculum();
        $formationLevel->addCurriculum($curriculum);
        $this->assertEquals(1,$formationLevel->getCurriculums()->count());
        $formationLevel->removeCurriculum($curriculum);
        $this->assertEquals(0,$formationLevel->getCurriculums()->count());
    }

    public function testaddCourse(){
        $formationLevel = new FormationLevel();
        $course = new Course();
        $formationLevel->addCourse($course);
        $this->assertEquals(1,$formationLevel->getCourses()->count());
    }

    public function testremoveCourse(){
        $formationLevel = new FormationLevel();
        $course = new Course();
        $formationLevel->addCourse($course);
        $this->assertEquals(1,$formationLevel->getCourses()->count());
        $formationLevel->removeCourse($course);
        $this->assertEquals(0,$formationLevel->getCourses()->count());
    }
}
