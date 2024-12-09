<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Teacher;
use App\Entity\Professor;
use App\Entity\PartTimeTutor;

class TeacherController extends AbstractController
{
    #[Route('/add/teacher', name: 'app_add_teacher')]
    public function addTeacher(EntityManagerInterface $entityManager): JsonResponse
    {
        
        return new JsonResponse(['status' => 'success']);
    }
}
