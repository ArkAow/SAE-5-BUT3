<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'expected_duration_course_type')]
class ExpectedDurationCourseType
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: ExpectedDuration::class)]
    #[ORM\JoinColumn(name: 'expected_duration_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ExpectedDuration $expectedDuration;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: CourseType::class)]
    #[ORM\JoinColumn(name: 'course_type_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private CourseType $courseType;

    #[ORM\Column(type: 'float')]
    private float $duration;

    public function getExpectedDuration(): ExpectedDuration
    {
        return $this->expectedDuration;
    }

    public function setExpectedDuration(ExpectedDuration $expectedDuration): self
    {
        $this->expectedDuration = $expectedDuration;
        return $this;
    }

    public function getCourseType(): CourseType
    {
        return $this->courseType;
    }

    public function setCourseType(CourseType $courseType): self
    {
        $this->courseType = $courseType;
        return $this;
    }

    public function getDuration(): float
    {
        return $this->duration;
    }

    public function setDuration(float $duration): self
    {
        $this->duration = $duration;
        return $this;
    }
}