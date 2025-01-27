<?php

namespace Tests\Entity;

use App\Entity\User;
use App\Entity\Comment;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testsetEmail(){
        $user = new User();
        $user->setEmail('prout@gmail.com');
        $this->assertEquals('prout@gmail.com', $user->getEmail());
    }

    public function testsetPassword(){
        $user = new User();
        $user->setPassword('password');
        $this->assertEquals('password', $user->getPassword());
    }

    public function testaddComment(){
        $user = new User();
        $comment = new Comment();
        $user->addComment($comment);
        $this->assertEquals(1, $user->getComments()->count());
    }

    public function testremoveComment(){
        $user = new User();
        $comment = new Comment();
        $user->addComment($comment);
        $this->assertEquals(1, $user->getComments()->count());
        $user->removeComment($comment);
        $this->assertEquals(0, $user->getComments()->count());
    }
}
