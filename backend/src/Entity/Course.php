<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

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

    #[ORM\ManyToMany(targetEntity: CourseType::class, inversedBy: 'courses')]
    #[ORM\JoinTable(
        name: 'course_type_course',
        joinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'course_type_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $courseTypes;

    #[ORM\ManyToMany(targetEntity: Teacher::class, inversedBy: 'courses')]
    private Collection $teachers;
    
    #[ORM\ManyToMany(targetEntity: Subject::class, mappedBy: 'courses')]
    private Collection $subjects;

    public function __construct()
    {
        $this->teachers = new ArrayCollection();
        $this->subjects = new ArrayCollection();
        $this->courseTypes = new ArrayCollection();
    }

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

    public function getCourseTypes(): Collection
    {
        return $this->courseTypes;
    }

    public function addCourseType(CourseType $courseType): self
    {
        if (!$this->courseTypes->contains($courseType)) {
            $this->courseTypes->add($courseType);
            $courseType->addCourse($this);
        }

        return $this;
    }

    public function removeCourseType(CourseType $courseType): self
    {
        if ($this->courseTypes->removeElement($courseType)) {
            $courseType->removeCourse($this);
        }

        return $this;
    }

    public function getTeachers(): Collection
    {
        return $this->teachers;
    }

    public function addTeacher(Teacher $teacher): self
    {
        if (!$this->teachers->contains($teacher)) {
            $this->teachers->add($teacher);
        }
        return $this;
    }

    public function removeTeacher(Teacher $teacher): self
    {
        $this->teachers->removeElement($teacher);
        return $this;
    }

    public function getSubjects():Collection
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject): self
    {
        if (!$this->subjects->contains($subject)){
            $this->subjects->add($subject);
            $subject->addCourse($this);
        }
        return $this;
    }

    public function removeSubject(Subject $subject): self
    {
        if ($this->subjects->removeElement($subject)){
            $subject->removeCourse($this);
        }
        return $this;
    }
}