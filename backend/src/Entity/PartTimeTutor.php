<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "part_time_tutor")]
class PartTimeTutor
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: Teacher::class)]
    #[ORM\JoinColumn(name: "id", referencedColumnName: "id", onDelete: "CASCADE")]
    private Teacher $teacher;

    #[ORM\Column(type: "string", length: 500)]
    private string $hourlyConstraint;

    public function getTeacher(): Teacher
    {
        return $this->teacher;
    }

    public function setTeacher(Teacher $teacher): self
    {
        $this->teacher = $teacher;
        return $this;
    }

    public function getHourlyConstraint(): string
    {
        return $this->hourlyConstraint;
    }

    public function setHourlyConstraint(string $hourlyConstraint): self
    {
        $this->hourlyConstraint = $hourlyConstraint;
        return $this;
    }
}