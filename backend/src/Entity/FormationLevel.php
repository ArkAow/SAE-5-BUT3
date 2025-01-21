<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "formation_Level")]
class FormationLevel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\ManyToMany(targetEntity: Groups::class, inversedBy: "formationLevels")]
    #[ORM\JoinTable(name: "formation_Level_group")]
    #[ORM\JoinColumn(name: "formationLevel_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\InverseJoinColumn(name: "group_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private Collection $groups;

    #[ORM\ManyToMany(targetEntity: Curriculum::class, mappedBy: "formationLevels")]
    private Collection $curriculums;

    #[ORM\ManyToMany(targetEntity: Course::class, mappedBy: "formationLevels")]
    private Collection $courses;

    public function __construct()
    {
        $this->groups = new ArrayCollection();
        $this->curriculums = new ArrayCollection();
        $this->courses = new ArrayCollection();
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
        }
        return $this;
    }

    public function removeGroup(Groups $group): self
    {
        $this->groups->removeElement($group);
        return $this;
    }

    public function getCurriculums(): Collection
    {
        return $this->curriculums;
    }

    public function addCurriculum(Curriculum $curriculum): self
    {
        if (!$this->curriculums->contains($curriculum)) {
            $this->curriculums[] = $curriculum;
        }
        return $this;
    }

    public function removeCurriculum(Curriculum $curriculum): self
    {
        $this->curriculums->removeElement($curriculum);
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