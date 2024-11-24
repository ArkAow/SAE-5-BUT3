<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
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

    #[ORM\ManyToOne(targetEntity: Teacher::class, inversedBy: "courses")]
    #[ORM\JoinColumn(nullable: true, onDelete: "SET NULL")]
    private ?Teacher $teacher = null;

    #[ORM\ManyToOne(targetEntity: CourseType::class, inversedBy: "courses")]
    #[ORM\JoinColumn(nullable: true, onDelete: "SET NULL")]
    private ?CourseType $courseType = null;

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

    public function getTeacher(): ?Teacher
    {
        return $this->teacher;
    }

    public function setTeacher(?Teacher $teacher): self
    {
        $this->teacher = $teacher;
        return $this;
    }

    public function getCourseType(): ?CourseType
    {
        return $this->courseType;
    }

    public function setCourseType(?CourseType $courseType): self
    {
        $this->courseType = $courseType;
        return $this;
    }
}