<?php

namespace App\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Comment;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity] 
class User
{
    public const ROLES = ['superadmin', 'admin', 'extendedviewer', 'restrictedviewer'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 255)]
    private string $identifiant;

    #[ORM\ManyToMany(targetEntity: Comment::class, mappedBy: "users")]
    private Collection $comments;

    #[ORM\Column(type: "string", length: 20)]
    private string $role;

    #[ORM\ManyToMany(targetEntity: Department::class, inversedBy: "users")]
    #[ORM\JoinTable(name: "user_department")]
    private Collection $departments;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->departments = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        if (!in_array($role, self::ROLES, true)) {
            throw new \InvalidArgumentException("Rôle invalide : " . $role);
        }
        $this->role = $role;
        return $this;
    }

    public function getIdentifiant(): string
    {
        return $this->identifiant;
    }

    public function setIdentifiant(string $identifiant): self
    {
        $this->identifiant = $identifiant;
        return $this;
    }

    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->addUser($this);
        }
        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        $this->comments->removeElement($comment);
        return $this;
    }

    public function getDepartments(): Collection
    {
        return $this->departments;
    }

    public function addDepartment(Department $department): self
    {
        if (!$this->departments->contains($department)) {
            $this->departments[] = $department;
            $department->addUser($this);
        }
        return $this;
    }

    public function removeDepartment(Department $department): self
    {
        $this->departments->removeElement($department);
        return $this;
    }
}