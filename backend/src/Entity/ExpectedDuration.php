<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "expected_duration")]
class ExpectedDuration
{
    #[ORM\Id]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 80)]
    private string $name;

    #[ORM\Column(type: "string", length: 80)]
    private string $type;

    #[ORM\Column(type: "float")]
    private float $expectedDuration;

    #[ORM\ManyToOne(targetEntity: Subject::class)]
    #[ORM\JoinColumn(name: "name", referencedColumnName: "name", onDelete: "CASCADE")]
    private Subject $subject;

    #[ORM\ManyToOne(targetEntity: CourseType::class)]
    #[ORM\JoinColumn(name: "type", referencedColumnName: "name", onDelete: "CASCADE")]
    private CourseType $courseType;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
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
