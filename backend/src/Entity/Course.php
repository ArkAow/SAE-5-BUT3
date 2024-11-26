<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'course')]
class Course
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'float', nullable: false)]
    private float $duration;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $positionX = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $positionY = null;

    #[ORM\ManyToOne(targetEntity: CourseType::class, inversedBy: 'courses')]
    #[ORM\JoinColumn(nullable: true)]
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

    public function getPositionX(): ?int
    {
        return $this->positionX;
    }

    public function setPositionX(?int $positionX): self
    {
        $this->positionX = $positionX;
        return $this;
    }

    public function getPositionY(): ?int
    {
        return $this->positionY;
    }

    public function setPositionY(?int $positionY): self
    {
        $this->positionY = $positionY;
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