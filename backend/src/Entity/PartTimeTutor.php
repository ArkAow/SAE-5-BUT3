<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class PartTimeTutor extends Teacher
{
    #[ORM\Column(type: "string", length: 500)]
    private string $hourlyConstraint;

    public function getHourlyConstraint(): string
    {
        return $this->hourlyConstraint;
    }

    public function setHourlyConstraint(string $hourlyConstraint): self
    {
        $this->hourlyConstraint = $hourlyConstraint;
        return $this;
    }
}