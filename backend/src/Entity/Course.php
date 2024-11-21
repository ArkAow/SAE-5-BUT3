<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\CourseType;
use App\Entity\Subject;

#[ORM\Entity]
#[ORM\Table(name: "course")]
class Course
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "float")]
    private float $duration;

    #[ORM\Column(type: "integer")]
    private int $positionX;

    #[ORM\Column(type: "integer")]
    private int $positionY;

    #[ORM\ManyToOne(targetEntity: CourseType::class)]
    #[ORM\JoinColumn(name: "course_type_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private CourseType $courseType;

    #[ORM\ManyToOne(targetEntity: Subject::class)]
    #[ORM\JoinColumn(name: "subject_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private Subject $subject;

    public function getId(): int
    {
        return $this->id;
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

    public function getPositionX(): int
    {
        return $this->positionX;
    }

    public function setPositionX(int $positionX): self
    {
        $this->positionX = $positionX;
        return $this;
    }

    public function getPositionY(): int
    {
        return $this->positionY;
    }

    public function setPositionY(int $positionY): self
    {
        $this->positionY = $positionY;
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

    public function getSubject(): Subject
    {
        return $this->subject;
    }

    public function setSubject(Subject $subject): self
    {
        $this->subject = $subject;
        return $this;
    }
}
