<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
class Group
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\OneToMany(mappedBy: "group", targetEntity: HalfGroup::class, cascade: ["persist", "remove"], orphanRemoval: true)]
    private Collection $halfGroups;

    #[ORM\ManyToOne(targetEntity: Promo::class, inversedBy: "groups")]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?Promo $promo = null;

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
            $this->halfGroups[] = $halfGroup;
            $halfGroup->setGroup($this);
        }
        return $this;
    }

    public function removeHalfGroup(HalfGroup $halfGroup): self
    {
        if ($this->halfGroups->removeElement($halfGroup)) {
            if ($halfGroup->getGroup() === $this) {
                $halfGroup->setGroup(null);
            }
        }
        return $this;
    }

    public function getPromo(): ?Promo
    {
        return $this->promo;
    }

    public function setPromo(?Promo $promo): self
    {
        $this->promo = $promo;
        return $this;
    }
}
