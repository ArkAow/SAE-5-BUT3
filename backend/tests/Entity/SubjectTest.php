<?php

namespace Tests\Entity;

use App\Entity\Subject;
use App\Entity\ExpectedDuration;
use App\Entity\Semester;
use App\Entity\Teacher;
use App\Entity\Course;
use PHPUnit\Framework\TestCase;

class SubjectTest extends TestCase
{
    public function testSetName()
    {
        $subject = new Subject();
        $subject->setName('Mathematics');
        $this->assertEquals('Mathematics', $subject->getName());
    }

    public function testSetCode()
    {
        $subject = new Subject();
        $subject->setCode('MATH101');
        $this->assertEquals('MATH101', $subject->getCode());
    }

    public function testSetDuration()
    {
        $subject = new Subject();
        $subject->setDuration(45.5);
        $this->assertEquals(45.5, $subject->getDuration());
    }

    public function testAddAndRemoveExpectedDuration()
    {
        $subject = new Subject();
        $expectedDuration = new ExpectedDuration();

        $subject->addExpectedDuration($expectedDuration);
        $this->assertEquals(1, $subject->getExpectedDurations()->count());

        $subject->removeExpectedDuration($expectedDuration);
        $this->assertEquals(0, $subject->getExpectedDurations()->count());
    }

    public function testAddAndRemoveSemester()
    {
        $subject = new Subject();
        $semester = new Semester();

        $subject->addSemester($semester);
        $this->assertEquals(1, $subject->getSemesters()->count());

        $subject->removeSemester($semester);
        $this->assertEquals(0, $subject->getSemesters()->count());
    }

    public function testAddAndRemoveTeacher()
    {
        $subject = new Subject();
        $teacher = new Teacher();

        $subject->addTeacher($teacher);
        $this->assertEquals(1, $subject->getTeachers()->count());

        $subject->removeTeacher($teacher);
        $this->assertEquals(0, $subject->getTeachers()->count());
    }

    public function testAddAndRemoveCourse()
    {
        $subject = new Subject();
        $course = new Course();

        $subject->addCourse($course);
        $this->assertEquals(1, $subject->getCourses()->count());

        $subject->removeCourse($course);
        $this->assertEquals(0, $subject->getCourses()->count());
    }
}
