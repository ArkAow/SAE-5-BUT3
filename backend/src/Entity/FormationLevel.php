<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "formationL_evel")]
class FormationLevel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\ManyToMany(targetEntity: Groups::class, mappedBy: "classes")]
    private Collection $groups;

    #[ORM\ManyToMany(targetEntity: Curriculum::class, inversedBy: "classes")]
    #[ORM\JoinTable(name: "curriculum_formation_Level")]
    #[ORM\JoinColumn(name: "class_id", referencedColumnName: "id")]
    #[ORM\InverseJoinColumn(name: "curriculum_id", referencedColumnName: "id")]
    private Collection $curriculums;

    public function __construct()
    {
        $this->groups = new ArrayCollection();
        $this->curriculums = new ArrayCollection();
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

    public function getGroups(): Collection
    {
        return $this->groups;
    }

    public function getCurriculums(): Collection
    {
        return $this->curriculums;
    }

    public function addCurriculum(Curriculum $curriculum): self
    {
        if (!$this->curriculums->contains($curriculum)) {
            $this->curriculums[] = $curriculum;
        }
        return $this;
    }

    public function removeCurriculum(Curriculum $curriculum): self
    {
        $this->curriculums->removeElement($curriculum);
        return $this;
    }
}