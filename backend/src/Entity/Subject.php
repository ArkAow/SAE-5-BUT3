<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\SubjectRepository;

#[ORM\Entity(repositoryClass: SubjectRepository::class)]
#[ORM\Table(name: 'Subject')]
class Subject
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 50)]
    private string $name;

    #[ORM\Column(type: 'string', length: 10, unique: true)]
    private string $code;

    #[ORM\Column(type: 'integer')]
    private int $expectedDuration;

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

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;
        return $this;
    }

    public function getExpectedDuration(): int
    {
        return $this->expectedDuration;
    }

    public function setExpectedDuration(int $expectedDuration): self
    {
        $this->expectedDuration = $expectedDuration;
        return $this;
    }
}
