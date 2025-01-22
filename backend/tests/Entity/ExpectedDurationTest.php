<?php

namespace Tests\Entity;

use App\Entity\Course;
use App\Entity\CourseType;
use App\Entity\ExpectedDuration;
use App\Entity\Subject;
use PHPUnit\Framework\TestCase;

class ExpectedDurationTest extends TestCase
{
    public function testsetDuration(){
        $expectedDuration = new ExpectedDuration();
        $expectedDuration->setDuration(10.5);
        $this->assertEquals(10.5, $expectedDuration->getDuration());
    }

    public function testaddCourseType(){
        $expectedDuration = new ExpectedDuration();
        $courseType = new CourseType();
        $expectedDuration->addCourseType($courseType);
        $this->assertEquals(1, $expectedDuration->getCourseTypes()->count());
    }

    public function tesremoveCourseType(){
        $expectedDuration = new ExpectedDuration();
        $courseType = new CourseType();
        $expectedDuration->addCourseType($courseType);
        $this->assertEquals(1, $expectedDuration->getCourseTypes()->count());
        $expectedDuration->removeCourseType($courseType);
        $this->assertEquals(0, $expectedDuration->getCourseTypes()->count());
    }

    public function testaddSubject(){
        $expectedDuration = new ExpectedDuration();
        $subject = new Subject();
        $expectedDuration->addSubject($subject);
        $this->assertEquals(1, $expectedDuration->getSubjects()->count());
    }

    public function testremoveSubject(){
        $expectedDuration = new ExpectedDuration();
        $subject = new Subject();
        $expectedDuration->addSubject($subject);
        $this->assertEquals(1, $expectedDuration->getSubjects()->count());
        $expectedDuration->removeSubject($subject);
        $this->assertEquals(0, $expectedDuration->getSubjects()->count());
    }

    public function testaddCourse(){
        $expectedDuration = new ExpectedDuration();
        $course = new Course();
        $expectedDuration->addCourse($course);
        $this->assertEquals(1, $expectedDuration->getCourses()->count());
    }

    public function testremoveCourse(){
        $expectedDuration = new ExpectedDuration();
        $course = new Course();
        $expectedDuration->addCourse($course);
        $this->assertEquals(1, $expectedDuration->getCourses()->count());
        $expectedDuration->removeCourse($course);
        $this->assertEquals(0, $expectedDuration->getCourses()->count());
    }
}
