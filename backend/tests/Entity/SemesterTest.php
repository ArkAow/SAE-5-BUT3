<?php

namespace Tests\Entity;

use App\Entity\Curriculum;
use App\Entity\Semester;
use App\Entity\Subject;
use PHPUnit\Framework\TestCase;

class SemesterTest extends TestCase
{
    public function testsetName(){
        $semester = new Semester();
        $semester->setName('Semestre A');
        $this->assertEquals('Semestre A', $semester->getName());
    }

    public function testweek_start(){
        $semester = new Semester();
        $semester->setWeekStart(1);
        $this->assertEquals(1, $semester->getWeekStart());
    }

    public function testweek_duration(){
        $semester = new Semester();
        $semester->setWeekDuration(10);
        $this->assertEquals(10, $semester->getWeekDuration());
    }

    public function testaddCurriculum(){
        $semester = new Semester();
        $curriculum = new Curriculum();
        $semester->addCurriculum($curriculum);
        $this->assertEquals(1, $semester->getCurriculums()->count());
    }

    public function testremoveCurriculum(){
        $semester = new Semester();
        $curriculum = new Curriculum();
        $semester->addCurriculum($curriculum);
        $this->assertEquals(1, $semester->getCurriculums()->count());
        $semester->removeCurriculum($curriculum);
        $this->assertEquals(0, $semester->getCurriculums()->count());
    }

    public function testaddSubject(){
        $semester = new Semester();
        $subject = new Subject();
        $semester->addSubject($subject);
        $this->assertEquals(1, $semester->getSubjects()->count());
    }

    public function testremoveSubject(){
        $semester = new Semester();
        $subject = new Subject();
        $semester->addSubject($subject);
        $this->assertEquals(1, $semester->getSubjects()->count());
        $semester->removeSubject($subject);
        $this->assertEquals(0, $semester->getSubjects()->count());
    }
}
