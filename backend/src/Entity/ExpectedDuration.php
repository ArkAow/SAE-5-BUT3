<?php

namespace App\Entity;

use App\Entity\CourseType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "expected_duration")]
class ExpectedDuration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "float", name: "expected_duration", nullable: true)]
    private ?float $duration = null;

    #[ORM\ManyToMany(targetEntity: CourseType::class)]
    #[ORM\JoinTable(
        name: "expected_duration_course_type",
        joinColumns: [new ORM\JoinColumn(name: "expected_duration_id", referencedColumnName: "id", onDelete: "CASCADE")],
        inverseJoinColumns: [new ORM\JoinColumn(name: "course_type_id", referencedColumnName: "id", onDelete: "CASCADE")]
    )]
    private Collection $courseTypes;

    #[ORM\ManyToMany(targetEntity: Subject::class, inversedBy: "expectedDurations")]
    #[ORM\JoinTable(name: "expected_duration_subject",joinColumns: [new ORM\JoinColumn(name: "expected_duration_id", referencedColumnName: "id", onDelete: "CASCADE")],inverseJoinColumns: [new ORM\JoinColumn(name: "subject_id", referencedColumnName: "id", onDelete: "CASCADE")])]
    private Collection $subjects;

    #[ORM\ManyToMany(targetEntity: Course::class, mappedBy: "expectedDurations")]
    private Collection $courses;

    public function __construct()
    {
        $this->subjects = new ArrayCollection();
        $this->courseTypes = new ArrayCollection();
        $this->courses = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getDuration(): ?float
    {
        return $this->duration;
    }

    public function setDuration(?float $duration): self
    {
        $this->duration = $duration;
        return $this;
    }

    public function getCourseTypes(): Collection
    {
        return $this->courseTypes;
    }

    public function addCourseType(CourseType $courseType): self
    {
        if (!$this->courseTypes->contains($courseType)) {
            $this->courseTypes->add($courseType);
        }

        return $this;
    }

    public function removeCourseType(CourseType $courseType): self
    {
        if ($this->courseTypes->removeElement($courseType)) {
            $courseType->removeExpectedDuration($this);
        }

        return $this;
    }

    public function getSubjects(): Collection
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject): self
    {
        if (!$this->subjects->contains($subject)) {
            $this->subjects->add($subject);
            $subject->addExpectedDuration($this);
        }

        return $this;
    }

    public function removeSubject(Subject $subject): self
    {
        if ($this->subjects->removeElement($subject)) {
            $subject->removeExpectedDuration($this);
        }
        return $this;
    }

    public function getCourses(): Collection
    {
        return $this->courses;
    }

    public function addCourse(Course $course): self
    {
        if (!$this->courses->contains($course)) {
            $this->courses[] = $course;
        }
        return $this;
    }

    public function removeCourse(Course $course): self
    {
        $this->courses->removeElement($course);
        return $this;
    }
}