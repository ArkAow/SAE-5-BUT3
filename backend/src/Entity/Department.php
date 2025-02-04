<?php

namespace App\Entity;

use App\Repository\DepartmentRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: DepartmentRepository::class)]
#[ORM\Table(name: 'department')]
class Department
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: "string", name: "name", nullable: true)]
    private string $name;
    
    #[ORM\ManyToMany(targetEntity: FormationLevel::class)]
    #[ORM\JoinTable(name: "department_formationLevel")]
    private Collection $formationLevels;

    #[ORM\ManyToMany(targetEntity: Teacher::class, inversedBy: 'departments')]
    #[ORM\JoinTable(name: 'department_teacher')]
    private Collection $teachers;

    #[ORM\ManyToMany(targetEntity: Curriculum::class)]
    #[ORM\JoinTable(name: "department_curriculum")]
    private Collection $curriculums;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: "user_department")]
    private Collection $users;

    public function __construct()
    {
        $this->formationLevels = new ArrayCollection();
        $this->teachers = new ArrayCollection();
        $this->curriculums = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

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

    public function getFormationLevels(): Collection
    {
        return $this->formationLevels;
    }


    public function addFormationLevel(FormationLevel $formationLevel): self
    {
        if (!$this->formationLevels->contains($formationLevel)) {
            $this->formationLevels[] = $formationLevel;
        }

        return $this;
    }

    public function removeFormationLevel(FormationLevel $formationLevel): self
    {
        $this->formationLevels->removeElement($formationLevel);

        return $this;
    }

    public function getTeachers(): Collection
    {
        return $this->teachers;
    }

    public function addTeacher(Teacher $teacher): self
    {
        if (!$this->teachers->contains($teacher)) {
            $this->teachers[] = $teacher;
        }

        return $this;
    }

    public function removeTeacher(Teacher $teacher): self
    {
        $this->teachers->removeElement($teacher);

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

    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user))
        {
            $this->users[] = $user;
        }
        return $this;
    }

    public function removeUser(User $user): self
    {
        $this->users->removeElement($user);
        return $this;
    }
}