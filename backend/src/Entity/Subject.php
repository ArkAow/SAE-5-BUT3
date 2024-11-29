<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: 'subject')]
class Subject
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: 'string', length: 100)]
    private string $name;

    #[ORM\Column(type: 'string', length: 10)]
    private string $code;

    #[ORM\Column(type: 'float')]
    private float $duration;

    #[ORM\ManyToMany(targetEntity: ExpectedDuration::class, mappedBy: "subjects")]
    private Collection $expectedDurations;

    #[ORM\ManyToMany(targetEntity: Semester::class, inversedBy: 'subjects')]
    #[ORM\JoinTable(name: 'subject_semester')]
    private Collection $semesters;

    public function __construct()
    {
        $this->expectedDurations = new ArrayCollection();
        $this->semesters = new ArrayCollection();
    }

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

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;
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

    public function getExpectedDurations(): Collection
    {
        return $this->expectedDurations;
    }

    public function addExpectedDuration(ExpectedDuration $expectedDuration): self
    {
        if (!$this->expectedDurations->contains($expectedDuration)) {
            $this->expectedDurations->add($expectedDuration);
            $expectedDuration->addSubject($this);
        }

        return $this;
    }

    public function removeExpectedDuration(ExpectedDuration $expectedDuration): self
    {
        if ($this->expectedDurations->removeElement($expectedDuration)) {
            $expectedDuration->removeSubject($this);
        }

        return $this;
    }

    public function getSemesters(): Collection
    {
        return $this->semesters;
    }

    public function addSemester(Semester $semester): self
    {
        if (!$this->semesters->contains($semester)) {
            $this->semesters->add($semester);
        }
        return $this;
    }

    public function removeSemester(Semester $semester): self
    {
        $this->semesters->removeElement($semester);
        return $this;
    }
}