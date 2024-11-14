<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
#[ORM\Table(name: 'Curriculum')]
class Curriculum
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
     * @ORM\ManyToOne(targetEntity="App\Entity\Promo")
     * @ORM\JoinColumn(nullable=false)
     */
    private ?Promo $promo = null;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Semester")
     * @ORM\JoinColumn(nullable=false)
     */
    private ?Semester $semester1 = null;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Semester")
     * @ORM\JoinColumn(nullable=false)
     */
    private ?Semester $semester2 = null;

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

    public function getSemester1(): ?Semester
    {
        return $this->semester1;
    }

    public function setSemester1(Semester $semester): self
    {
        $this->semester1 = $semester;
        return $this;
    }

    public function getSemester2(): ?Semester
    {
        return $this->semester2;
    }

    public function setSemester2(Semester $semester): self
    {
        $this->semester2 = $semester;
        return $this;
    }
}
