<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ExpectedDurationRepository;

#[ORM\Entity(repositoryClass: ExpectedDurationRepository::class)]
#[ORM\Table(name: 'Expected_Duration')]
class ExpectedDuration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\ManyToOne(targetEntity: Subject::class)]
    #[ORM\JoinColumn(name: 'subject_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private Subject $subject;

    #[ORM\ManyToOne(targetEntity: CourseType::class)]
    #[ORM\JoinColumn(name: 'course_type_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private CourseType $courseType;

    #[ORM\Column(name: 'expected_duration', type: 'float')]
    private float $expectedDuration;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSubject(): ?Subject
    {
        return $this->subject;
    }

    public function setSubject(Subject $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function getCourseType(): ?CourseType
    {
        return $this->courseType;
    }

    public function setCourseType(CourseType $courseType): self
    {
        $this->courseType = $courseType;

        return $this;
    }

    public function getExpectedDuration(): ?float
    {
        return $this->expectedDuration;
    }

    public function setExpectedDuration(float $expectedDuration): self
    {
        $this->expectedDuration = $expectedDuration;

        return $this;
    }
}
 