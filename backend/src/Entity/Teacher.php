<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "teacher")]
class Teacher
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $firstName;

    #[ORM\Column(type: "string", length: 100)]
    private string $lastName;

    #[ORM\Column(type: "string", length: 30)]
    private string $code;

    #[ORM\Column(type: "string", length: 1000)]
    private string $subjectsTaught;

    public function getId(): int
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

    public function getSubjectsTaught(): string
    {
        return $this->subjectsTaught;
    }

    public function setSubjectsTaught(string $subjectsTaught): self
    {
        $this->subjectsTaught = $subjectsTaught;
        return $this;
    }
}