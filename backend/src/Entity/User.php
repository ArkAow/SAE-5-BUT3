<?php

namespace App\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Comment;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 150)]
    private string $email;

    #[ORM\Column(type: "string", length: 50)]
    private string $role;

    #[ORM\ManyToMany(targetEntity: Comment::class, mappedBy: "users")]
    private Collection $comments;

    #[ORM\Column(type: "boolean")]
    private bool $is_superadmin;

    #[ORM\Column(type: "boolean")]
    private bool $is_admin;

    #[ORM\Column(type: "boolean")]
    private bool $is_extendedviewer;
    
    #[ORM\Column(type: "boolean")]
    private bool $is_restrictedviewer;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = $role;
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

    public function getIsSuperadmin(): bool
    {
        return $this->is_superadmin;
    }

    public function setIsSuperadmin(bool $is_superadmin): self
    {
        $this->is_superadmin = $is_superadmin;
        return $this;
    }

    public function getIsAdmin(): bool
    {
        return $this->is_admin;
    }

    public function setIsAdmin(bool $is_admin): self
    {
        $this->is_admin = $is_admin;
        return $this;
    }

    public function getIsExtendedviewer(): bool
    {
        return $this->is_extendedviewer;
    }

    public function setIsExtendedviewer(bool $is_extendedviewer): self
    {
        $this->is_extendedviewer = $is_extendedviewer;
        return $this;
    }

    public function getIsRestrictedviewer(): bool
    {
        return $this->is_restrictedviewer;
    }

    public function setIsRestrictedviewer(bool $is_restrictedviewer): self
    {
        $this->is_restrictedviewer = $is_restrictedviewer;
        return $this;
    }
}