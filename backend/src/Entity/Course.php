<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Teacher;

#[ORM\Entity]
#[ORM\Table(name: 'course')]
class Course
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'float', nullable: false)]
    private float $duration;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $weekPosition = null;

    #[ORM\ManyToMany(targetEntity: CourseType::class, inversedBy: 'courses')]
    #[ORM\JoinTable(
        name: 'course_type_course',
        joinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'course_type_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $courseTypes;

    #[ORM\ManyToMany(targetEntity: Groups::class, inversedBy: 'courses')]
    #[ORM\JoinTable(
        name: 'course_group',
        joinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'group_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $groups;

    #[ORM\ManyToMany(targetEntity: ExpectedDuration::class, inversedBy: 'courses')]
    #[ORM\JoinTable(
        name: 'course_expected_duration',
        joinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'expected_duration_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $expectedDurations;

    #[ORM\ManyToMany(targetEntity: HalfGroup::class, inversedBy: 'courses')]
    #[ORM\JoinTable(
        name: 'course_half_group',
        joinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'half_group_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $halfGroups;

    #[ORM\ManyToMany(targetEntity: FormationLevel::class, inversedBy: 'courses')]
    #[ORM\JoinTable(
        name: 'course_formation_level',
        joinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'formationLevel_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $formationLevels;

    #[ORM\ManyToMany(targetEntity: Teacher::class, inversedBy: 'courses')]
    #[ORM\JoinTable(name: 'course_teacher')]
    private Collection $teachers;
    
    #[ORM\ManyToMany(targetEntity: Subject::class, inversedBy: 'courses')]
    private Collection $subjects;

    #[ORM\ManyToMany(targetEntity: Comment::class, inversedBy: 'courses')]
    #[ORM\JoinTable(
        name: 'comment_course',
        joinColumns: [new ORM\JoinColumn(name: 'course_id', referencedColumnName: 'id', onDelete: 'CASCADE')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'comment_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    )]
    private Collection $comments;    

    public function __construct()
    {
        $this->teachers = new ArrayCollection();
        $this->subjects = new ArrayCollection();
        $this->expectedDurations = new ArrayCollection();
        $this->courseTypes = new ArrayCollection();
        $this->groups = new ArrayCollection();
        $this->halfGroups = new ArrayCollection();
        $this->formationLevels = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->expectedDurations = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
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

    public function getWeekPosition(): ?int
    {
        return $this->weekPosition;
    }

    public function setWeekPosition(?int $weekPosition): self
    {
        $this->weekPosition = $weekPosition;
        return $this;
    }

    public function getCourseTypes(): Collection
    {
        return $this->courseTypes;
    }

    public function addCourseType(CourseType $courseType): self
    {
        if (!$this->courseTypes->contains($courseType)) {
            $this->courseTypes->add($courseType);
            $courseType->addCourse($this);
        }

        return $this;
    }

    public function removeCourseType(CourseType $courseType): self
    {
        if ($this->courseTypes->removeElement($courseType)) {
            $courseType->removeCourse($this);
        }

        return $this;
    }

    public function getTeachers(): Collection
    {
        return $this->teachers;
    }

    public function addTeacher(Teacher $teacher): self
    {
        if (!$this->teachers->contains($teacher)) {
            $this->teachers->add($teacher);
            $teacher->addCourse($this);
        }
        return $this;
    }

    public function removeTeacher(Teacher $teacher): self
    {
        if ($this->teachers->removeElement($teacher)) {
            $teacher->removeCourse($this);
        }

        return $this;
    }

    public function getSubjects():Collection
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject): self
    {
        if (!$this->subjects->contains($subject)){
            $this->subjects->add($subject);
            $subject->addCourse($this);
        }
        return $this;
    }

    public function removeSubject(Subject $subject): self
    {
        if ($this->subjects->removeElement($subject)){
            $subject->removeCourse($this);
        }
        return $this;
    }

    public function getGroups():Collection
    {
        return $this->groups;
    }

    public function addGroup(Groups $group): self
    {
        if (!$this->groups->contains($group)){
            $this->groups->add($group);
            $group->addCourse($this);
        }
        return $this;
    }

    public function removeGroup(Groups $group): self
    {
        if ($this->groups->removeElement($group)){
            $group->removeCourse($this);
        }
        return $this;
    }

    public function getHalfGroups():Collection
    {
        return $this->halfGroups;
    }

    public function addHalfGroup(HalfGroup $halfGroup): self
    {
        if (!$this->halfGroups->contains($halfGroup)){
            $this->halfGroups->add($halfGroup);
            $halfGroup->addCourse($this);
        }
        return $this;
    }

    public function removeHalfGroup(HalfGroup $halfGroup): self
    {
        if ($this->halfGroups->removeElement($halfGroup)){
            $halfGroup->removeCourse($this);
        }
        return $this;
    }

    public function getFormationLevel():Collection
    {
        return $this->formationLevels;
    }

    public function addFormationLevel(FormationLevel $formationLevel): self
    {
        if (!$this->formationLevels->contains($formationLevel)){
            $this->formationLevels->add($formationLevel);
            $formationLevel->addCourse($this);
        }
        return $this;
    }

    public function removeFormationLevel(FormationLevel $formationLevel): self
    {
        if ($this->formationLevels->removeElement($formationLevel)){
            $formationLevel->removeCourse($this);
        }
        return $this;
    }

    public function getExpectedDuration():Collection
    {
        return $this->expectedDurations;
    }

    public function addExpectedDuration(ExpectedDuration $expectedDuration): self
    {
        if (!$this->expectedDurations->contains($expectedDuration)){
            $this->expectedDurations->add($expectedDuration);
            $expectedDuration->addCourse($this);
        }
        return $this;
    }

    public function removeExpectedDuration(expectedDuration $expectedDuration): self
    {
        if ($this->expectedDurations->removeElement($expectedDuration)){
            $expectedDuration->removeCourse($this);
        }
        return $this;
    }

    public function getComments():Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)){
            $this->comments->add($comment);
            $comment->addCourse($this);
        }
        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment)){
            $comment->removeCourse($this);
        }
        return $this;
    }
}