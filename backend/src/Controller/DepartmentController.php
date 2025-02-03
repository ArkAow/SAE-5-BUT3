<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Department;

class DepartmentController extends AbstractController
{
    #[Route('/department', name: 'app_department')]
    public function createDepartment(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $departmentRepository = $entityManager->getRepository(Department::class);
        $department = $departmentRepository->findOneBy(['name' => $data['name']]);

        if (!$department)
        {
            return new JsonResponse(['error' => 'Department not found'], Response::HTTP_NOT_FOUND);
        }

        $department->setName($data['name']);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Department updated successfully',
            'department' => [
                'id' => $department->getId(),
                'name' => $department->getName()
            ]
        ]);
    }
}
