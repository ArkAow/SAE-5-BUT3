<?php

namespace Tests\Entity;

use App\Entity\Course;
use App\Entity\CourseType;
use App\Entity\ExpectedDuration;
use PHPUnit\Framework\TestCase;

class CourseTypeTest extends TestCase
{
    public function testsetName(){
        $coursetype = new CourseType();
        $coursetype->setName("Comm interne");
        $this->assertEquals("Comm interne", $coursetype->getName());
    }

    public function testsetColor(){
        $coursetype = new CourseType();
        $coursetype->setColor("#FF0000");
        $this->assertEquals("#FF0000", $coursetype->getColor());
    }

    public function testaddCourse(){
        $coursetype = new CourseType();
        $course = new Course;
        $coursetype->addCourse($course);
        $this->assertCount(1, $coursetype->getCourses());
    }

    public function removeCourse(){
        $coursetype = new CourseType();
        $course = new Course;
        $coursetype->addCourse($course);
        $this->assertCount(1, $coursetype->getCourses());
        $coursetype->removeCourse($course);
        $this->assertCount(0, $coursetype->getCourses());
    }

    public function testsetScope(){
        $coursetype = new CourseType();
        $coursetype->setScope("public");
        $this->assertEquals("public", $coursetype->getScope());
    }

    public function testaddExpectedDuration(){
        $coursetype = new CourseType();
        $exepectedDuration = new ExpectedDuration();
        $coursetype->addExpectedDuration($exepectedDuration);
        $this->assertCount(1, $coursetype->getExpectedDurations());
    }

    public function testsremoveExpectedDuration(){
        $coursetype = new CourseType();
        $exepectedDuration = new ExpectedDuration();
        $coursetype->addExpectedDuration($exepectedDuration);
        $this->assertCount(1, $coursetype->getExpectedDurations());
        $coursetype->removeExpectedDuration($exepectedDuration);
        $this->assertCount(0, $coursetype->getExpectedDurations());
    }
}
