<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
class Promo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\OneToMany(mappedBy: "promo", targetEntity: Group::class, cascade: ["persist", "remove"], orphanRemoval: true)]
    private Collection $groups;

    #[ORM\ManyToMany(targetEntity: Curriculum::class, mappedBy: "promos")]
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

    public function addGroup(Group $group): self
    {
        if (!$this->groups->contains($group)) {
            $this->groups[] = $group;
            $group->setPromo($this);
        }
        return $this;
    }

    public function removeGroup(Group $group): self
    {
        if ($this->groups->removeElement($group)) {
            if ($group->getPromo() === $this) {
                $group->setPromo(null);
            }
        }
        return $this;
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
