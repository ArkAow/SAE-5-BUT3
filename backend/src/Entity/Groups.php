<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "`group`")]
class Groups
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\ManyToMany(targetEntity: HalfGroup::class, inversedBy: "groups")]
    #[ORM\JoinTable(name: "group_half_group")]
    #[ORM\JoinColumn(name: "group_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\InverseJoinColumn(name: "half_group_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private Collection $halfGroups;

    #[ORM\ManyToMany(targetEntity: FormationLevel::class, mappedBy: "groups")]
    private Collection $formationLevels;

    public function __construct()
    {
        $this->formationLevels = new ArrayCollection();
        $this->halfGroups = new ArrayCollection();
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

    public function getFormationLevel(): Collection
    {
        return $this->formationLevels;
    }

    public function addFormationLevel(FormationLevel $formationLevel): self
    {
        if (!$this->formationLevels->contains($formationLevel)) {
            $this->formationLevels[] = $formationLevel;
        }
        return $this;
    }

    public function removeFormationLevel(FormationLevel $formationLevel): self
    {
        $this->formationLevels->removeElement($formationLevel);
        return $this;
    }

    public function getHalfGroups(): Collection
    {
        return $this->halfGroups;
    }

    public function addHalfGroup(HalfGroup $halfGroup): self
    {
        if (!$this->halfGroups->contains($halfGroup)) {
            $this->halfGroups[] = $halfGroup;
        }
        return $this;
    }

    public function removeHalfGroup(HalfGroup $halfGroup): self
    {
        $this->halfGroups->removeElement($halfGroup);
        return $this;
    }
}