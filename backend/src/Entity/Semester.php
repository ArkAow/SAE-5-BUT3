<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: 'semester')]
class Semester
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 100)]
    private string $name;

    #[ORM\Column(type: 'integer')]
    private ?int $week_start = null;

    #[ORM\Column(type: 'integer')]
    private ?int $week_duration = null;

    #[ORM\ManyToMany(targetEntity: Curriculum::class, mappedBy: 'semesters')]
    private Collection $curriculums;

    #[ORM\ManyToMany(targetEntity: Subject::class, mappedBy: 'semesters')]
    private Collection $subjects;

    #[ORM\ManyToMany(targetEntity: Archive::class, mappedBy: 'semesters')]
    private Collection $archives;

    public function __construct()
    {
        $this->curriculums = new ArrayCollection();
        $this->subjects = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getWeekStart() : int
    {
        return $this->week_start;
    }

    public function getWeekDuration() : int
    {
        return $this->week_duration;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function setWeekStart(int $week_start): self
    {
        $this->week_start = $week_start;
        return $this;
    }

    public function setWeekDuration(int $week_duration): self
    {
        $this->week_duration = $week_duration;
        return $this;
    }

    public function getCurriculums(): Collection
    {
        return $this->curriculums;
    }

    public function addCurriculum(Curriculum $curriculum): self
    {
        if (!$this->curriculums->contains($curriculum)) {
            $this->curriculums->add($curriculum);
        }
        return $this;
    }

    public function removeCurriculum(Curriculum $curriculum): self
    {
        $this->curriculums->removeElement($curriculum);
        return $this;
    }

    public function getSubjects(): Collection
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject): self
    {
        if (!$this->subjects->contains($subject)) {
            $this->subjects->add($subject);
            $subject->addSemester($this);
        }
        return $this;
    }

    public function removeSubject(Subject $subject): self
    {
        if ($this->subjects->removeElement($subject)) {
            $subject->removeSemester($this);
        }
        return $this;
    }

    public function getArchives(): Collection
    {
        return $this->archives;
    }

    public function addArchive(Archive $archive): self
    {
        if (!$this->archives->contains($archive)) {
            $this->archives->add($archive);
        }
        return $this;
    }

    public function removeArchive(Archive $archive): self
    {
        $this->archives->removeElement($archive);
        return $this;
    }
}