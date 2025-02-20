<?php

namespace App\Controller;

use App\Repository\CurriculumRepository;
use App\Repository\SemesterRepository;
use App\Repository\SubjectRepository;
use App\Entity\Curriculum;
use App\Entity\Course;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class CurriculumController extends AbstractController
{
    /**
     * Formatte les données d'un cours pour la réponse JSON.
     */
    private function formatCourse(Course $course): array
    {
        $group = null;
        if ($course->getFormationLevel()->count() > 0) {
            $formationLevel = $course->getFormationLevel()->first();
            $group = [
                'groupType' => 'formation_level',
                'groupID' => $formationLevel->getId(),
            ];
        } elseif ($course->getGroups()->count() > 0) {
            $groupEntity = $course->getGroups()->first();
            $group = [
                'groupType' => 'group',
                'groupID' => $groupEntity->getId(),
            ];
        } elseif ($course->getHalfGroups()->count() > 0) {
            $halfGroup = $course->getHalfGroups()->first();
            $group = [
                'groupType' => 'half_group',
                'groupID' => $halfGroup->getId(),
            ];
        }
    
        return [
            'id' => $course->getId(),
            'duration' => $course->getDuration(),
            'weekPosition' => $course->getWeekPosition(),
            'courseType' => $course->getCourseTypes()->first() ? [
                'id' => $course->getCourseTypes()->first()->getId(),
                'name' => $course->getCourseTypes()->first()->getName(),
                'color' => $course->getCourseTypes()->first()->getColor(),
            ] : null,
            'teacher' => $course->getTeachers()->first() ? [
                'id' => $course->getTeachers()->first()->getId(),
                'firstName' => $course->getTeachers()->first()->getFirstName(),
                'lastName' => $course->getTeachers()->first()->getLastName(),
                'code' => $course->getTeachers()->first()->getCode(),
            ] : null,
            'subject' => $course->getSubjects()->first() ? [
                'id' => $course->getSubjects()->first()->getId(),
                'name' => $course->getSubjects()->first()->getName(),
                'code' => $course->getSubjects()->first()->getCode(),
            ] : null,
            'group' => $group,
        ];
    }

    //Route et fonction permttant de récupérer les semestres d'un curriculum
    #[Route('/curriculum/{id}/semesters', name: 'api_get_semesters', methods: ['GET'])]
    public function getSemesters(int $id, CurriculumRepository $curriculumRepository, EntityManagerInterface $em): JsonResponse
    {
        $curriculum = $curriculumRepository->find($id);

        if (!$curriculum) {
            return $this->json(['error' => 'Cursus non trouvé'], 404);
        }

        $semesters = $curriculum->getSemesters();

        $data = [];
        foreach ($semesters as $semester) {
            $data[] = [
                'id' => $semester->getId(),
                'name' => $semester->getName(),
                'week_duration' => $semester->getWeekDuration(),
                'week_start' => $semester->getWeekStart(),
                'subjects' => array_map(function ($s) {
                    return [
                        'id' => $s->getId(),
                        'name' => $s->getName(),
                        'courses' => array_map(fn($c) => $this->formatCourse($c), $s->getCourses()->toArray())
                    ];
                }, $semester->getSubjects()->toArray())
            ];
        }

        return $this->json($data);
    }

    //Route et fonction afin de récupérer les curriculums disponibles
    #[Route('/curriculums', name: 'get_curriculums', methods: ['GET'])]
    public function getCurriculums(EntityManagerInterface $entityManager): JsonResponse
    {
        //CurriculumRepository permet la recherche de tous les curriculums disponibles dans la BDD
        $curriculumRepository = $entityManager->getRepository(Curriculum::class);
        $curriculums = $curriculumRepository->findAll();

        //On retourne les curriculums sous forme de tableau
        $data = array_map(function ($curriculum) {
            return [
                'id' => $curriculum->getId(),
                'name' => $curriculum->getName(),
                'formationLevels' => array_map(function ($formationLevel) {
                    return [
                        'id' => $formationLevel->getId(),
                        'name' => $formationLevel->getName(),
                    ];
                }, $curriculum->getFormationLevels()->toArray()),
            ];
        }, $curriculums);

        //On retourne le tableau en format JSON
        return new JsonResponse($data, 200);
    }
}