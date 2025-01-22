<?php

namespace Tests\Entity;

use App\Entity\HalfGroup;
use App\Entity\Groups;
use App\Entity\Course;
use PHPUnit\Framework\TestCase;

class HalfGroupTest extends TestCase
{
    public function testSetName()
    {
        $halfGroup = new HalfGroup();
        $halfGroup->setName('GroupTest');
        $this->assertEquals('GroupTest', $halfGroup->getName());
    }

    public function testAddGroups()
    {
        $halfGroup = new HalfGroup();
        $group = new Groups();
        $halfGroup->addGroup($group);
        $this->assertEquals(1, $halfGroup->getGroups()->count());
    }

    public function testRemoveGroups()
    {
        $halfGroup = new HalfGroup();
        $group = new Groups();
        $halfGroup->addGroup($group);
        $this->assertEquals(1, $halfGroup->getGroups()->count());
        $halfGroup->removeGroup($group);
        $this->assertEquals(0, $halfGroup->getGroups()->count());
    }


    public function testAddCourse()
    {
        $halfGroup = new HalfGroup();
        $course = new Course();
        $halfGroup->addCourse($course);
        $this->assertEquals(1, $halfGroup->getCourses()->count());
    }

    public function testRemoveCourse()
    {
        $halfGroup = new HalfGroup();
        $course = new Course();
        $halfGroup->addCourse($course);
        $this->assertEquals(1, $halfGroup->getCourses()->count());
        $halfGroup->removeCourse($course);
        $this->assertEquals(0, $halfGroup->getCourses()->count());
    }
}
