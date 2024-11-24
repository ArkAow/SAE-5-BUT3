<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class ExpectedDuration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "float", nullable: false)]
    private float $duration;

    #[ORM\ManyToOne(targetEntity: CourseType::class, inversedBy: "expectedDurations")]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?CourseType $courseType = null;

    #[ORM\ManyToOne(targetEntity: Subject::class, inversedBy: "expectedDurations")]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?Subject $subject = null;

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

    public function getCourseType(): ?CourseType
    {
        return $this->courseType;
    }

    public function setCourseType(?CourseType $courseType): self
    {
        $this->courseType = $courseType;
        return $this;
    }

    public function getSubject(): ?Subject
    {
        return $this->subject;
    }

    public function setSubject(?Subject $subject): self
    {
        $this->subject = $subject;
        return $this;
    }
}