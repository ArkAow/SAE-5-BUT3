<?php

namespace Tests\Entity;

use App\Entity\Curriculum;
use App\Entity\FormationLevel;
use App\Entity\Teacher;
use App\Entity\Department;
use PHPUnit\Framework\TestCase;

class DepartmentTest extends TestCase
{
    public function testSetName(){
        $department = new Department();
        $department->setName('DepartmentTest');
        $this->assertEquals("DepartmentTest", $department->getName());
    }

    public function testaddFormationLevel(){
        $department = new Department();
        $formationLevel = new FormationLevel();
        $department->addFormationLevel($formationLevel);
        $this->assertEquals(1, $department->getFormationLevels()->count());
    }

    public function testremoveFormationLevel(){
        $department = new Department();
        $formationLevel = new FormationLevel();
        $department->addFormationLevel($formationLevel);
        $this->assertEquals(1, $department->getFormationLevels()->count());
        $department->removeFormationLevel($formationLevel);
        $this->assertEquals(0, $department->getFormationLevels()->count());
    }

    public function testaddTeacher(){
        $department = new Department();
        $teacher = new Teacher();
        $department->addTeacher($teacher);
        $this->assertEquals(1, $department->getTeachers()->count());
    }

    public function testremoveTeacher(){
        $department = new Department();
        $teacher = new Teacher();
        $department->addTeacher($teacher);
        $this->assertEquals(1, $department->getTeachers()->count());
        $department->removeTeacher($teacher);
        $this->assertEquals(0, $department->getTeachers()->count());
    }

    public function testaddCurriculum(){
        $department = new Department();
        $curriculum = new Curriculum();
        $department->addCurriculum($curriculum);
        $this->assertEquals(1, $department->getCurriculums()->count());
        $department->removeCurriculum($curriculum);
        $this->assertEquals(0, $department->getCurriculums()->count());
    }
}
