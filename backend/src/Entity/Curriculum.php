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

    #[ORM\ManyToMany(targetEntity: Clas::class)]
    #[ORM\JoinTable(name: "curriculum_class")]
    private Collection $classes;

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

    public function addClass(Clas $class): self
    {
        if (!$this->classes->contains($class)) {
            $this->classes->add($class);
        }
        return $this;
    }

    public function removeClass(Clas $class): self
    {
        $this->classes->removeElement($class);
        return $this;
    }
}

