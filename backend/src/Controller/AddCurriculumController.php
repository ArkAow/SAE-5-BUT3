<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ClassEntity;
use App\Entity\Curriculum;

class AddCurriculumController extends AbstractController
{
    #[Route('/add/curriculum', name: 'add_curriculum', methods: ['POST'])]
    public function addCurriculum(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom du cursus est obligatoire.'], 400);
        }

        $curriculumName = trim($data['name']);

        try {
            $curriculumRepository = $entityManager->getRepository(ClassEntity::class);
            $existingCurriculum = $curriculumRepository->findOneBy(['name' => $curriculumName]);

            if ($existingCurriculum) {
                return new JsonResponse(['error' => 'Ce cursus existe déjà.'], 400);
            }

            $curriculum = new ClassEntity();
            $curriculum->setName($curriculumName);

            $entityManager->persist($curriculum);
            $entityManager->flush();

            return new JsonResponse([
                'id' => $curriculum->getId(),
                'name' => $curriculum->getName(),
            ], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la création : ' . $e->getMessage()], 500);
        }
    }

    #[Route('/api/curriculum/{id}', name: 'get_curriculum', methods: ['GET'])]
    public function getCurriculum(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $curriculum = $entityManager->getRepository(Curriculum::class)->find($id);

        if (!$curriculum) {
            return new JsonResponse(['error' => 'Curriculum introuvable'], 404);
        }

        $data = [
            'id' => $curriculum->getId(),
            'name' => $curriculum->getName(),
            'semesters' => $curriculum->getSemesters()->map(function ($semester) {
                return [
                    'id' => $semester->getId(),
                    'name' => $semester->getName(),
                    'subjects' => $semester->getSubjects()->map(function ($subject) {
                        return [
                            'id' => $subject->getId(),
                            'name' => $subject->getName(),
                            'code' => $subject->getCode(),
                            'duration' => $subject->getDuration(),
                            'courses' => [],
                        ];
                    })->toArray(),
                ];
            })->toArray(),
        ];

        return new JsonResponse($data, 200);
    }
}
