<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity
 */
#[ORM\Table(name: 'Group')]
class Group
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\Column(type="string", length=100)
     */
    private string $name;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Promo", inversedBy="groups")
     * @ORM\JoinColumn(nullable=false)
     */
    private ?Promo $promo = null;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\HalfGroup", mappedBy="group", cascade={"persist", "remove"})
     */
    private Collection $halfGroups;

    public function __construct()
    {
        $this->halfGroups = new ArrayCollection();
    }

    // Getters et Setters

    public function getId(): ?int
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

    public function getPromo(): ?Promo
    {
        return $this->promo;
    }

    public function setPromo(?Promo $promo): self
    {
        $this->promo = $promo;
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
}
