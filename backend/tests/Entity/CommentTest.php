<?php

namespace Tests\Entity;

use App\Entity\Comment;
use App\Entity\User;
use App\Entity\Course;
use PHPUnit\Framework\TestCase;

class CommentTest extends TestCase
{
    public function testSetAndGetText()
    {
        $comment = new Comment();
        $comment->setText("Baptiste est un bon professeur");

        $this->assertEquals("Baptiste est un bon professeur", $comment->getText());
    }

    public function testAddUser()
    {
        $comment = new Comment();
        $user = new User();

        $comment->addUser($user);
        $this->assertCount(1, $comment->getUsers());
        $this->assertTrue($comment->getUsers()->contains($user));
    }

    public function testRemoveUser()
    {
        $comment = new Comment();
        $user = new User();

        $comment->addUser($user);
        $this->assertCount(1, $comment->getUsers());
        $this->assertTrue($comment->getUsers()->contains($user));

        $comment->removeUser($user);
        $this->assertCount(0, $comment->getUsers());
        $this->assertFalse($comment->getUsers()->contains($user));
    }

    public function testAddCourse()
    {
        $comment = new Comment();
        $course = new Course();

        $comment->addCourse($course);
        $this->assertCount(1, $comment->getCourses());
        $this->assertTrue($comment->getCourses()->contains($course));
    }

    public function testRemoveCourse()
    {
        $comment = new Comment();
        $course = new Course();

        $comment->addCourse($course);
        $this->assertCount(1, $comment->getCourses());
        $this->assertTrue($comment->getCourses()->contains($course));

        $comment->removeCourse($course);
        $this->assertCount(0, $comment->getCourses());
        $this->assertFalse($comment->getCourses()->contains($course));
    }
}
