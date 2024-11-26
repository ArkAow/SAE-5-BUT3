<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'course_type')]
class CourseType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 100)]
    private string $name;

    #[ORM\Column(type: 'string', length: 50)]
    private string $color;

    #[ORM\Column(type: 'string', length: 500)]
    private string $scope;

    #[ORM\OneToMany(mappedBy: 'courseType', targetEntity: Course::class, cascade: ['persist', 'remove'])]
    private Collection $courses;

    #[ORM\ManyToMany(targetEntity: ExpectedDuration::class, mappedBy: "courseTypes")]
    private Collection $expectedDurations;

    public function __construct()
    {
        $this->courses = new ArrayCollection();
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

    public function getCourses(): Collection
    {
        return $this->courses;
    }

    public function addCourse(Course $course): self
    {
        if (!$this->courses->contains($course)) {
            $this->courses->add($course);
            $course->setCourseType($this);
        }
        return $this;
    }

    public function removeCourse(Course $course): self
    {
        if ($this->courses->removeElement($course)) {
            if ($course->getCourseType() === $this) {
                $course->setCourseType(null);
            }
        }
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
            $expectedDuration->addCourseType($this);
        }
        return $this;
    }

    public function removeExpectedDuration(ExpectedDuration $expectedDuration): self
    {
        if ($this->expectedDurations->removeElement($expectedDuration)) {
            $expectedDuration->removeCourseType($this);
        }
        return $this;
    }
}