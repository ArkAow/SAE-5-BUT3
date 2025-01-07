<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: 'teacher')]
class Teacher
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $firstName;

    #[ORM\Column(type: "string", length: 100)]
    private string $lastName;

    #[ORM\Column(type: "string", length: 30)]
    private string $code;
    
    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $time_constraints = 0;

    #[ORM\Column(name: "partTimeTutor", type: "boolean", nullable: true)]
    private ?bool $is_partimetutor = null;

    #[ORM\ManyToMany(targetEntity: Course::class, inversedBy: 'teachers')]
    #[ORM\JoinTable(
        name: 'course_teacher',
        joinColumns: [new ORM\JoinColumn(name: 'teacher_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $courses;

    #[ORM\ManyToMany(targetEntity:Subject::class, inversedBy: 'teachers')]
    private Collection $subjects;

    #[ORM\ManyToMany(targetEntity: Department::class, mappedBy: 'teachers')]
    private Collection $departments;

    #[ORM\ManyToMany(targetEntity: ExpectedDuration::class, mappedBy: "teachers")]
    private Collection $expected_duration;


    public function __construct()
    {
        $this->courses = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
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

    public function getCourses(): Collection
    {
        return $this->courses;
    }

    public function addCourse(Course $course): self
    {
        if (!$this->courses->contains($course)) {
            $this->courses[] = $course;
            $course->addTeacher($this);
        }
        return $this;
    }

    public function removeCourse(Course $course): self
    {
        if ($this->courses->removeElement($course)) {
            if ($course->getTeachers() === $this) {
                $course->removeTeacher($this);
            }
        }
        return $this;
    }

    public function getSubjects()
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject): self
    {
        if (!$this->subjects->contains($subject)) {
            $this->subjects[] = $subject;
            $subject->addTeacher($this);
        }
        return $this;
    }

    public function removeSubject(Subject $subject) : self
    {
        if ($this->subjects->removeElement($subject)) {
            $subject->removeTeacher($this);
        }
        return $this;
    }

    public function getDepartments(): Collection
    {
        return $this->departments;
    }

    public function addDepartment(Department $department): self
    {
        if (!$this->departments->contains($department)) {
            $this->departments[] = $department;
            $department->addTeacher($this);
        }
        return $this;
    }

    public function removeDepartment(Department $department): self
    {
        if ($this->departments->removeElement($department)) {
            $department->removeTeacher($this);
        }
        return $this;
    }
    
    public function getTimeConstraints(): ?int
    {
        return $this->time_constraints;
    }
    
    public function setTimeConstraints(?int $time_constraints): self
    {
        $this->time_constraints = $time_constraints;
        return $this;
    }
    
    public function getIsPartimeTutor(): ?bool
    {
        return $this->is_partimetutor;
    }
    
    public function setIsPartimeTutor(?bool $is_partimetutor): self
    {
        $this->is_partimetutor = $is_partimetutor;
        return $this;
    }

    public function getExpectedDuration() {
        return $this->expected_duration;
    }

    public function addExpectedDuration(ExpectedDuration $expectedDuration) {
        
    }

    public function removeExpectedDuration(ExpectedDuration $expectedDuration) {
        
    }
}