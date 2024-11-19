<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "subject")]
class Subject
{
    #[ORM\Id]
    #[ORM\Column(type: "integer")]
    #[ORM\GeneratedValue]
    private int $id;

    #[ORM\Column(type: "string", length: 50)]
    private string $name;

    #[ORM\Column(type: "string", length: 10)]
    private string $code;

    #[ORM\Column(type: "float")]
    private float $duration;

    #[ORM\OneToMany(mappedBy: "subject", targetEntity: ExpectedDuration::class, cascade: ["persist", "remove"])]
    #[ORM\JoinTable(name:"expected_duration_subject")]
    private Collection $expectedDurationSubject;

    public function __construct()
    {
        $this->expectedDurationSubject = new ArrayCollection();
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

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;
        return $this;
    }

    public function getDuration(): float
    {
        return $this->duration;
    }

    public function setDuration(float $duration): self
    {
        $this->duration = $duration;
        return $this;
    }

    public function getExpectedDurationsSubject(): Collection
    {
        return $this->expectedDurationSubject;
    }

    public function addExpectedDurationsSubject(ExpectedDuration $expectedDuration): self
    {
        if (!$this->expectedDurationSubject->contains($expectedDuration)) {
            $this->expectedDurationSubject->add($expectedDuration);
            $expectedDuration->setSubject($this);
        }

        return $this;
    }

    public function removeExpectedDurationsSubject(ExpectedDuration $expectedDuration): self
    {
        if ($this->expectedDurationSubject->removeElement($expectedDuration)) {
            if ($expectedDuration->getSubject() === $this) {
                $expectedDuration->setSubject(null);
            }
        }

        return $this;
    }
}