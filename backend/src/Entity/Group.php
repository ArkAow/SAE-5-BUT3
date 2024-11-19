<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "group")]
class Group
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 30)]
    private string $name;

    #[ORM\OneToMany(targetEntity: HalfGroup::class,mappedBy: "group")]
    #[ORM\JoinTable(name: "group_half_group")]
    private Collection $halfGroups;

    public function __construct()
    {
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

    public function getHalfGroups(): Collection
    {
        return $this->halfGroups;
    }

    public function addHalfGroup(HalfGroup $halfGroup): self
    {
        if (!$this->halfGroups->contains($halfGroup)) {
            $this->halfGroups->add($halfGroup);
        }
        return $this;
    }

    public function removeHalfGroup(HalfGroup $halfGroup): self
    {
        $this->halfGroups->removeElement($halfGroup);
        return $this;
    }
}