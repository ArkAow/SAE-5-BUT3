<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\MappedSuperclass
 */
#[ORM\Table(name: 'Teacher')]
abstract class Teacher
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private string $firstName;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private string $lastName;

    /**
     * @ORM\Column(type="string", unique=true)
     */
    private string $code;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Subject")
     * @ORM\JoinTable(name="teacher_subjects")
     */
    private Collection $teachableSubjects;

    public function __construct()
    {
        $this->teachableSubjects = new ArrayCollection();
    }

    // Getters and Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;
        return $this;
    }

    public function getTeachableSubjects(): Collection
    {
        return $this->teachableSubjects;
    }

    public function addTeachableSubject(Subject $subject): self
    {
        if (!$this->teachableSubjects->contains($subject)) {
            $this->teachableSubjects->add($subject);
        }
        return $this;
    }

    public function removeTeachableSubject(Subject $subject): self
    {
        $this->teachableSubjects->removeElement($subject);
        return $this;
    }
}
