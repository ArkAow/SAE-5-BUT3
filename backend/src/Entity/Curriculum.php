<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: 'curriculum')]
class Curriculum
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 100)]
    private string $name;

    #[ORM\ManyToMany(targetEntity: ClassEntity::class, mappedBy: "curriculums")]
    private Collection $classes;

    #[ORM\ManyToMany(targetEntity: Semester::class, inversedBy: 'curriculums')]
    #[ORM\JoinTable(name: 'curriculum_semester')]
    private Collection $semesters;

    public function __construct()
    {
        $this->classes = new ArrayCollection();
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

    public function getClasses(): Collection
    {
        return $this->classes;
    }

    public function addClass(ClassEntity $class): self
    {
        if (!$this->classes->contains($class)) {
            $this->classes->add($class);
        }
        return $this;
    }

    public function removeClass(ClassEntity $class): self
    {
        $this->classes->removeElement($class);
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