<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "curriculum")]
class Curriculum
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 50)]
    private string $name;

    #[ORM\OneToMany(mappedBy: "curriculum", targetEntity: Promo::class, cascade: ["persist", "remove"])]
    private Collection $classes;

    #[ORM\OneToMany(mappedBy: "curriculum", targetEntity: Semester::class, cascade: ["persist", "remove"])]
    private Collection $semesters;

    public function __construct()
    {
        $this->classes = new ArrayCollection();
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

    public function addClass(Promo $promo): self
    {
        if (!$this->classes->contains($promo)) {
            $this->classes->add($promo);
        }
        return $this;
    }

    public function removeClass(Promo $promo): self
    {
        $this->classes->removeElement($promo);
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

