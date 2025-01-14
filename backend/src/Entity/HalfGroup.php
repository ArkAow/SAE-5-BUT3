<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "half_group")]
class HalfGroup
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\ManyToMany(targetEntity: Groups::class, mappedBy: "halfGroups")]
    private Collection $groups;

    #[ORM\ManyToMany(targetEntity: Course::class, mappedBy: "groups")]
    private Collection $courses;

    public function __construct()
    {
        $this->groups = new ArrayCollection();
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

    public function getGroups(): Collection
    {
        return $this->groups;
    }

    public function addGroup(Groups $group): self
    {
        if (!$this->groups->contains($group)) {
            $this->groups[] = $group;
            $group->addHalfGroup($this);
        }

        return $this;
    }

    public function removeGroup(Groups $group): self
    {
        if ($this->groups->removeElement($group)) {
            $group->removeHalfGroup($this);
        }

        return $this;
    }

    public function getCourses(): Collection
    {
        return $this->courses;
    }

    public function addCourse(Course $course): self
    {
        if (!$this->courses->contains($course)) {
            $this->courses[] = $course;
        }
        return $this;
    }

    public function removeCourse(Course $course): self
    {
        $this->courses->removeElement($course);
        return $this;
    }
}