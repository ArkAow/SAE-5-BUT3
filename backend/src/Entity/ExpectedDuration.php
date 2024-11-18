<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "expected_duration")]
class ExpectedDuration
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "float")]
    private float $expectedDuration;

    #[ORM\ManyToOne(targetEntity: Subject::class, inversedBy: "expectedDurations")]
    #[ORM\JoinColumn(name: "subject_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private Subject $subject;

    #[ORM\ManyToOne(targetEntity: CourseType::class, inversedBy: "expectedDurations")]
    #[ORM\JoinColumn(name: "course_type_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private CourseType $courseType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getExpectedDuration(): float
    {
        return $this->expectedDuration;
    }

    public function setExpectedDuration(float $expectedDuration): self
    {
        $this->expectedDuration = $expectedDuration;
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

    public function getCourseType(): CourseType
    {
        return $this->courseType;
    }

    public function setCourseType(CourseType $courseType): self
    {
        $this->courseType = $courseType;
        return $this;
    }
}
