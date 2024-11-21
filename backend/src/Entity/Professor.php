<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Teacher;

#[ORM\Entity]
#[ORM\Table(name: "professor")]
class Professor
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\ManyToOne(targetEntity: Teacher::class)]
    #[ORM\JoinColumn(name: "id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private Teacher $teacher;

    public function getTeacher(): Teacher
    {
        return $this->teacher;
    }

    public function setTeacher(Teacher $teacher): self
    {
        $this->teacher = $teacher;
        return $this;
    }
}
