<?php

namespace App\Controller;

use App\Entity\Course;
use App\Repository\CourseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CoursesController extends AbstractController
{
    #[Route('/courses', name: 'get_courses', methods: ['GET'])]
    public function getCourses(CourseRepository $courseRepository): JsonResponse
    {
        $courses = $courseRepository->findAll();
        
        $response = [];
        foreach ($courses as $course) {
            $response[] = [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'positionX' => $course->getPositionX(),
                'positionY' => $course->getPositionY(),
                'courseTypes' => array_map(fn($type) => $type->getId(), $course->getCourseTypes()->toArray()),
                'teachers' => array_map(fn($teacher) => $teacher->getId(), $course->getTeachers()->toArray()),
            ];
        }

        return $this->json($response);
    }

    #[Route('/courses', name: 'create_course', methods: ['POST'])]
    public function createCourse(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['duration'])) {
            return new JsonResponse(['error' => 'La durée est obligatoire.'], 400);
        }
        if (empty($data['positionX']) || empty($data['positionY'])) {
            return new JsonResponse(['error' => 'La position est obligatoire.'], 400);
        }

        $course = new Course();
        $course->setDuration((float) $data['duration']);
        $course->setPositionX($data['positionX']);
        $course->setPositionY($data['positionY']);

        $entityManager->persist($course);
        $entityManager->flush();

        return $this->json([
            'message' => 'Cours créé avec succès.',
            'course' => [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'positionX' => $course->getPositionX(),
                'positionY' => $course->getPositionY(),
            ],
        ], 201);
    }

    #[Route('/courses/{id}', name: 'update_course', methods: ['PUT'])]
    public function updateCourse(
        int $id,
        Request $request,
        CourseRepository $courseRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $course = $courseRepository->find($id);

        if (!$course) {
            return new JsonResponse(['error' => 'Cours non trouvé.'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!empty($data['duration'])) {
            $course->setDuration((float) $data['duration']);
        }
        if (array_key_exists('positionX', $data)) {
            $course->setPositionX($data['positionX']);
        }
        if (array_key_exists('positionY', $data)) {
            $course->setPositionY($data['positionY']);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Cours mis à jour avec succès.',
            'course' => [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'positionX' => $course->getPositionX(),
                'positionY' => $course->getPositionY(),
            ],
        ]);
    }

    #[Route('/courses/{id}', name: 'delete_course', methods: ['DELETE'])]
    public function deleteCourse(int $id, CourseRepository $courseRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $course = $courseRepository->find($id);

        if (!$course) {
            return new JsonResponse(['error' => 'Cours non trouvé.'], 404);
        }

        $entityManager->remove($course);
        $entityManager->flush();

        return $this->json(['message' => 'Cours supprimé avec succès.'], 200);
    }
}
