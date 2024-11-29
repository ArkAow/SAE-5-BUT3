<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Teacher;
use App\Entity\Professor;
use App\Entity\PartTimeTutor;

class AddTeacherController extends AbstractController
{
    #[Route('/add/teacher', name: 'app_add_teacher')]
    public function addTeacher($rowData): JsonResponse
    {
        
        return new JsonResponse(['status' => 'success']);
    }
}
