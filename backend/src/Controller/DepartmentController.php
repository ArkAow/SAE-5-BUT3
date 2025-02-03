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
    #[Route('/department/update', name: 'app_department')]
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

    #[Route('/department/add', name: 'add_department', methods: ['POST'])]
    public function addDepartment(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || !isset($data['curriculums'])) {
            return new JsonResponse(['error' => 'Nom et curriculums requis'], Response::HTTP_BAD_REQUEST);
        }

        $existingDepartment = $entityManager->getRepository(Department::class)->findOneBy(['name' => $data['name']]);

        if ($existingDepartment) {
            return new JsonResponse(['error' => 'Ce département existe déjà'], Response::HTTP_CONFLICT);
        }

        $department = new Department();
        $department->setName($data['name']);

        foreach ($data['curriculums'] as $curriculumId) {
            $curriculum = $entityManager->getRepository(Curriculum::class)->find($curriculumId);
            if ($curriculum) {
                $department->addCurriculum($curriculum);
            }
        }

        $entityManager->persist($department);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Département ajouté avec succès',
            'department' => [
                'id' => $department->getId(),
                'name' => $department->getName(),
                'curriculums' => array_map(fn($c) => ['id' => $c->getId(), 'name' => $c->getName()], $department->getCurriculums()->toArray())
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/department', name: 'get_departments', methods: ['GET'])]
    public function getDepartments(EntityManagerInterface $entityManager): JsonResponse
    {
        $departmentRepository = $entityManager->getRepository(Department::class);
        $departments = $departmentRepository->findAll();

        $data = array_map(function ($department) {
            return [
                'id' => $department->getId(),
                'name' => $department->getName(),
                'curriculums' => array_map(fn($c) => [
                    'id' => $c->getId(),
                    'name' => $c->getName()
                ], $department->getCurriculums()->toArray())
            ];
        }, $departments);

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
