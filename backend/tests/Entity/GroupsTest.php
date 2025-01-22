<?php

namespace Tests\Entity;

use App\Entity\Groups;
use App\Entity\FormationLevel;
use App\Entity\HalfGroup;
use App\Entity\Course;
use PHPUnit\Framework\TestCase;

class GroupsTest extends TestCase
{
    public function testSetName()
    {
        $group = new Groups();
        $group->setName('GroupTest');
        $this->assertEquals('GroupTest', $group->getName());
    }

    public function testAddFormationLevel()
    {
        $group = new Groups();
        $formationLevel = new FormationLevel();
        $group->addFormationLevel($formationLevel);
        $this->assertEquals(1, $group->getFormationLevel()->count());
    }

    public function testRemoveFormationLevel()
    {
        $group = new Groups();
        $formationLevel = new FormationLevel();
        $group->addFormationLevel($formationLevel);
        $this->assertEquals(1, $group->getFormationLevel()->count());
        $group->removeFormationLevel($formationLevel);
        $this->assertEquals(0, $group->getFormationLevel()->count());
    }

    public function testAddHalfGroup()
    {
        $group = new Groups();
        $halfGroup = new HalfGroup();
        $group->addHalfGroup($halfGroup);
        $this->assertEquals(1, $group->getHalfGroups()->count());
    }

    public function testRemoveHalfGroup()
    {
        $group = new Groups();
        $halfGroup = new HalfGroup();
        $group->addHalfGroup($halfGroup);
        $this->assertEquals(1, $group->getHalfGroups()->count());
        $group->removeHalfGroup($halfGroup);
        $this->assertEquals(0, $group->getHalfGroups()->count());
    }

    public function testAddCourse()
    {
        $group = new Groups();
        $course = new Course();
        $group->addCourse($course);
        $this->assertEquals(1, $group->getCourses()->count());
    }

    public function testRemoveCourse()
    {
        $group = new Groups();
        $course = new Course();
        $group->addCourse($course);
        $this->assertEquals(1, $group->getCourses()->count());
        $group->removeCourse($course);
        $this->assertEquals(0, $group->getCourses()->count());
    }
}
