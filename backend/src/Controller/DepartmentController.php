<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Department;
use App\Entity\Curriculum;
use App\Repository\DepartmentRepository;
use App\Repository\CurriculumRepository;

class DepartmentController extends AbstractController
{
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
                ], $department->getCurriculums()->toArray()),
                'users' => array_map(fn($u) => [
                    'id' => $u->getId()
                ], $department->getUsers()->toArray())
            ];
        }, $departments);

        return new JsonResponse($data, Response::HTTP_OK);
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

    #[Route('/department/update', name: 'app_department_update', methods: ['PUT'])]
    public function updateDepartment(
        EntityManagerInterface $entityManager, 
        Request $request, 
        DepartmentRepository $departmentRepository, 
        CurriculumRepository $curriculumRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        // Vérifier si l'ID est présent
        if (!isset($data['id'])) {
            return new JsonResponse(['error' => 'ID du département manquant'], 400);
        }
    
        $department = $departmentRepository->find($data['id']);
        if (!$department) {
            return new JsonResponse(['error' => 'Département non trouvé'], 404);
        }
    
        // Mettre à jour le nom si présent
        if (isset($data['name']) && !empty($data['name'])) {
            $department->setName($data['name']);
        }
    
        // Mise à jour des cursus associés
        if (isset($data['curriculums']) && is_array($data['curriculums'])) {
            $newCurriculums = $curriculumRepository->findBy(['id' => $data['curriculums']]);
    
            // Supprimer les cursus qui ne sont plus associés
            foreach ($department->getCurriculums() as $existingCurriculum) {
                if (!in_array($existingCurriculum, $newCurriculums)) {
                    $department->removeCurriculum($existingCurriculum);
                }
            }
            // Ajouter les nouveaux cursus
            foreach ($newCurriculums as $newCurriculum) {
                $department->addCurriculum($newCurriculum);
            }
        }
    
        $entityManager->flush();
    
        return new JsonResponse([
            'message' => 'Département mis à jour avec succès',
            'department' => [
                'id' => $department->getId(),
                'name' => $department->getName(),
                'curriculums' => array_map(fn($c) => ['id' => $c->getId(), 'name' => $c->getName()], $department->getCurriculums()->toArray())
            ]
        ], 200);
    }

    #[Route('/department/delete/{id}', name: 'app_department_delete', methods: ['DELETE'])]
    public function deleteDepartment(int $id, EntityManagerInterface $entityManager, DepartmentRepository $departmentRepository): JsonResponse
    {
        $department = $departmentRepository->find($id);

        if (!$department) {
            return new JsonResponse(['error' => 'Département non trouvé'], 404);
        }

        $entityManager->remove($department);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Département supprimé avec succès'], 200);
    }

    #[Route('/department/{departmentId}/subjects', name: 'get_department_subjects', methods: ['GET'])]
    public function getDepartmentSubjects(
        int $departmentId,
        DepartmentRepository $departmentRepository
    ): JsonResponse {
        $department = $departmentRepository->find($departmentId);

        if (!$department) {
            return new JsonResponse(['error' => 'Département non trouvé.'], 404);
        }

        $data = [];

        foreach ($department->getCurriculums() as $curriculum) {
            $curriculumData = [
                'id' => $curriculum->getId(),
                'name' => $curriculum->getName(),
                'semesters' => []
            ];

            foreach ($curriculum->getSemesters() as $semester) {
                $semesterData = [
                    'id' => $semester->getId(),
                    'name' => $semester->getName(),
                    'subjects' => []
                ];

                foreach ($semester->getSubjects() as $subject) {
                    $semesterData['subjects'][] = [
                        'id' => $subject->getId(),
                        'name' => $subject->getName(),
                        'code' => $subject->getCode(),
                    ];
                }

                $curriculumData['semesters'][] = $semesterData;
            }

            $data[] = $curriculumData;
        }

        return new JsonResponse($data, 200);
    }

    #[Route('/departments/{id}/formation-levels', name: 'get_department_formation_levels', methods: ['GET'])]
    public function getFormationLevels(DepartmentRepository $departmentRepository, int $id): JsonResponse
    {
        $department = $departmentRepository->find($id);

        if (!$department) {
            return $this->json(['error' => 'Département non trouvé'], 404);
        }

        $formationLevels = $department->getFormationLevels();

        $data = [];
        foreach ($formationLevels as $formationLevel) {
            $data[] = [
                'id' => $formationLevel->getId(),
                'name' => $formationLevel->getName(),
                'curriculums' => array_map(function ($c) {
                    return [
                        'id' => $c->getId(),
                        'name' => $c->getName(),
                    ];
                }, $formationLevel->getCurriculums()->toArray()), // Obtenir les sous-groupes
            ];
        }

        return $this->json($data);
    }
}
