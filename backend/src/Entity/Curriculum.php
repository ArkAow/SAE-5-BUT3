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

    #[ORM\ManyToMany(targetEntity: FormationLevel::class, inversedBy: "curriculums")]
    #[ORM\JoinTable(name: 'curriculum_formation_Level')]
    #[ORM\JoinColumn(name: 'curriculum_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'formationLevel_id', referencedColumnName: 'id')]
    private Collection $formationLevels;

    
    #[ORM\ManyToMany(targetEntity: Semester::class, inversedBy: 'curriculums')]
    #[ORM\JoinTable(name: 'curriculum_semester')]
    private Collection $semesters;

    public function __construct()
    {
        $this->formationLevels = new ArrayCollection();
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

    public function getFormationLevels(): Collection
    {
        return $this->formationLevels;
    }

    public function addFormationLevel(FormationLevel $formationLevel): self
    {
        if (!$this->formationLevels->contains($formationLevel)) {
            $this->formationLevels->add($formationLevel);
        }
        return $this;
    }

    public function removeFormationLevel(FormationLevel $formationLevel): self
    {
        $this->formationLevels->removeElement($formationLevel);
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