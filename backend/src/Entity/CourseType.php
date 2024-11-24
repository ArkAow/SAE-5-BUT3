<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
class CourseType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\Column(type: "string", length: 50)]
    private string $color;

    #[ORM\Column(type: "string", length: 500)]
    private string $scope;

    #[ORM\OneToMany(mappedBy: "courseType", targetEntity: ExpectedDuration::class, cascade: ["persist", "remove"])]
    private Collection $expectedDurations;

    public function __construct()
    {
        $this->expectedDurations = new ArrayCollection();
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

    public function getColor(): string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;
        return $this;
    }

    public function getScope(): string
    {
        return $this->scope;
    }

    public function setScope(string $scope): self
    {
        $this->scope = $scope;
        return $this;
    }

    public function getExpectedDurations(): Collection
    {
        return $this->expectedDurations;
    }

    public function addExpectedDuration(ExpectedDuration $expectedDuration): self
    {
        if (!$this->expectedDurations->contains($expectedDuration)) {
            $this->expectedDurations[] = $expectedDuration;
            $expectedDuration->setCourseType($this);
        }
        return $this;
    }

    public function removeExpectedDuration(ExpectedDuration $expectedDuration): self
    {
        if ($this->expectedDurations->removeElement($expectedDuration)) {
            if ($expectedDuration->getCourseType() === $this) {
                $expectedDuration->setCourseType(null);
            }
        }
        return $this;
    }
}