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

    #[ORM\ManyToMany(targetEntity: Promo::class, inversedBy: 'curriculums')]
    #[ORM\JoinTable(name: 'curriculum_promo')]
    private Collection $promos;

    #[ORM\ManyToMany(targetEntity: Semester::class, inversedBy: 'curriculums')]
    #[ORM\JoinTable(name: 'curriculum_semester')]
    private Collection $semesters;

    public function __construct()
    {
        $this->promos = new ArrayCollection();
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

    public function getPromos(): Collection
    {
        return $this->promos;
    }

    public function addPromo(Promo $promo): self
    {
        if (!$this->promos->contains($promo)) {
            $this->promos->add($promo);
        }
        return $this;
    }

    public function removePromo(Promo $promo): self
    {
        $this->promos->removeElement($promo);
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