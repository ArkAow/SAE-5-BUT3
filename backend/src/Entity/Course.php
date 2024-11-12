<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class Course
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Teacher")
     * @ORM\JoinColumn(nullable=false)
     */
    private Teacher $teacher;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\CourseType")
     * @ORM\JoinColumn(nullable=false)
     */
    private CourseType $courseType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Subject")
     * @ORM\JoinColumn(nullable=false)
     */
    private Subject $subject;

    /**
     * @ORM\Column(type="integer")
     */
    private int $duration;

    // Getters and Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTeacher(): Teacher
    {
        return $this->teacher;
    }

    public function setTeacher(Teacher $teacher): self
    {
        $this->teacher = $teacher;
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

    public function getSubject(): Subject
    {
        return $this->subject;
    }

    public function setSubject(Subject $subject): self
    {
        $this->subject = $subject;
        return $this;
    }

    public function getDuration(): int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;
        return $this;
    }
}
