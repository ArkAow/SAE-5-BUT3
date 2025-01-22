<?php

namespace Tests\Entity;

use App\Entity\Teacher;
use App\Entity\Course;
use App\Entity\Subject;
use App\Entity\Department;
use App\Entity\ExpectedDuration;
use PHPUnit\Framework\TestCase;

class TeacherTest extends TestCase
{
    public function testSetFirstName()
    {
        $teacher = new Teacher();
        $teacher->setFirstName('John');
        $this->assertEquals('John', $teacher->getFirstName());
    }

    public function testSetLastName()
    {
        $teacher = new Teacher();
        $teacher->setLastName('Doe');
        $this->assertEquals('Doe', $teacher->getLastName());
    }

    public function testSetCode()
    {
        $teacher = new Teacher();
        $teacher->setCode('T123');
        $this->assertEquals('T123', $teacher->getCode());
    }

    public function testSetTimeConstraints()
    {
        $teacher = new Teacher();
        $teacher->setTimeConstraints(10);
        $this->assertEquals(10, $teacher->getTimeConstraints());
    }

    public function testSetIsPartimeTutor()
    {
        $teacher = new Teacher();
        $teacher->setIsPartimeTutor(true);
        $this->assertTrue($teacher->getIsPartimeTutor());
    }

    public function testAddAndRemoveCourse()
    {
        $teacher = new Teacher();
        $course = new Course();

        $teacher->addCourse($course);
        $this->assertEquals(1, $teacher->getCourses()->count());

        $teacher->removeCourse($course);
        $this->assertEquals(0, $teacher->getCourses()->count());
    }

    public function testAddAndRemoveSubject()
    {
        $teacher = new Teacher();
        $subject = new Subject();

        $teacher->addSubject($subject);
        $this->assertEquals(1, $teacher->getSubjects()->count());

        $teacher->removeSubject($subject);
        $this->assertEquals(0, $teacher->getSubjects()->count());
    }

    public function testAddAndRemoveDepartment()
    {
        $teacher = new Teacher();
        $department = new Department();

        $teacher->addDepartment($department);
        $this->assertEquals(1, $teacher->getDepartments()->count());

        $teacher->removeDepartment($department);
        $this->assertEquals(0, $teacher->getDepartments()->count());
    }

    public function testAddAndRemoveExpectedDuration()
    {
        $teacher = new Teacher();
        $expectedDuration = new ExpectedDuration();

        $teacher->addExpectedDuration($expectedDuration);
        $this->assertEquals(1, $teacher->getExpectedDuration()->count());

        $teacher->removeExpectedDuration($expectedDuration);
        $this->assertEquals(0, $teacher->getExpectedDuration()->count());
    }
}
