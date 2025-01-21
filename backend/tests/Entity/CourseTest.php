<?php

namespace Tests\Entity;

use App\Entity\Course;
use App\Entity\CourseType;
use App\Entity\Teacher;
use App\Entity\Subject;
use App\Entity\Groups;
use App\Entity\HalfGroup;
use App\Entity\FormationLevel;
use App\Entity\ExpectedDuration;
use App\Entity\Comment;
use PHPUnit\Framework\TestCase;

class CourseTest extends TestCase
{
    public function testSetAndGetDuration()
    {
        $course = new Course();
        $course->setDuration(3.5);

        $this->assertEquals(3.5, $course->getDuration());
    }

    public function testSetAndGetWeekPosition()
    {
        $course = new Course();
        $course->setWeekPosition(2);

        $this->assertEquals(2, $course->getWeekPosition());
    }

    public function testAddAndRemoveCourseType()
    {
        $course = new Course();
        $courseType = new CourseType(); // Instance réelle

        $course->addCourseType($courseType);
        $this->assertCount(1, $course->getCourseTypes());

        $course->removeCourseType($courseType);
        $this->assertCount(0, $course->getCourseTypes());
    }

    public function testAddAndRemoveTeacher()
    {
        $course = new Course();
        $teacher = new Teacher(); // Instance réelle

        $course->addTeacher($teacher);
        $this->assertCount(1, $course->getTeachers());

        $course->removeTeacher($teacher);
        $this->assertCount(0, $course->getTeachers());
    }

    public function testAddAndRemoveSubject()
    {
        $course = new Course();
        $subject = new Subject(); // Instance réelle

        $course->addSubject($subject);
        $this->assertCount(1, $course->getSubjects());

        $course->removeSubject($subject);
        $this->assertCount(0, $course->getSubjects());
    }

    public function testAddAndRemoveGroup()
    {
        $course = new Course();
        $group = new Groups(); // Instance réelle

        $course->addGroup($group);
        $this->assertCount(1, $course->getGroups());

        $course->removeGroup($group);
        $this->assertCount(0, $course->getGroups());
    }

    public function testAddAndRemoveHalfGroup()
    {
        $course = new Course();
        $halfGroup = new HalfGroup(); // Instance réelle

        $course->addHalfGroup($halfGroup);
        $this->assertCount(1, $course->getHalfGroups());

        $course->removeHalfGroup($halfGroup);
        $this->assertCount(0, $course->getHalfGroups());
    }

    public function testAddAndRemoveFormationLevel()
    {
        $course = new Course();
        $formationLevel = new FormationLevel(); // Instance réelle

        $course->addFormationLevel($formationLevel);
        $this->assertCount(1, $course->getFormationLevel());

        $course->removeFormationLevel($formationLevel);
        $this->assertCount(0, $course->getFormationLevel());
    }

    public function testAddAndRemoveExpectedDuration()
    {
        $course = new Course();
        $expectedDuration = new ExpectedDuration(); // Instance réelle

        $course->addExpectedDuration($expectedDuration);
        $this->assertCount(1, $course->getExpectedDuration());

        $course->removeExpectedDuration($expectedDuration);
        $this->assertCount(0, $course->getExpectedDuration());
    }

    public function testAddAndRemoveComment()
    {
        $course = new Course();
        $comment = new Comment(); // Instance réelle

        $course->addComment($comment);
        $this->assertCount(1, $course->getComments());

        $course->removeComment($comment);
        $this->assertCount(0, $course->getComments());
    }
}