<?php

namespace App\Controller;

use App\Entity\Course;
use App\Entity\FormationLevel;
use App\Repository\CourseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\CourseTypeRepository;
use App\Repository\SubjectRepository;
use App\Repository\TeacherRepository;
use App\Repository\FormationLevelRepository;
use App\Repository\GroupsRepository;
use App\Repository\HalfGroupRepository;

class CoursesController extends AbstractController
{
    /**
     * Formatte les données d'un cours pour la réponse JSON.
     */
    private function formatCourse(Course $course): array
    {
        return [
            'id' => $course->getId(),
            'duration' => $course->getDuration(),
            'weekPosition' => $course->getWeekPosition(),
            'formation_level' => $course->getFormationLevel(),
            'group' => $course->getGroups(),
            'half_group' => $course->getHalfGroups(),
            'courseTypes' => array_map(
                fn($type) => [
                    'id' => $type->getId(),
                    'name' => $type->getName(),
                    'color' => $type->getColor(),
                ],
                $course->getCourseTypes()->toArray()
            ),
            'teachers' => array_map(
                fn($teacher) => [
                    'id' => $teacher->getId(),
                    'firstName' => $teacher->getFirstName(),
                    'lastName' => $teacher->getLastName(),
                ],
                $course->getTeachers()->toArray()
            ),
            'subjects' => array_map(
                fn($subject) => [
                    'id' => $subject->getId(),
                    'name' => $subject->getName(),
                    'code' => $subject->getCode(),
                ],
                $course->getSubjects()->toArray()
            ),
        ];
    }

    #[Route('/courses', name: 'get_courses', methods: ['GET'])]
    public function getCourses(CourseRepository $courseRepository): JsonResponse
    {
        $courses = $courseRepository->findAll();
    
        $response = array_map([$this, 'formatCourse'], $courses);
    
        return $this->json($response);
    }

    #[Route('/subject/{id}/courses', name: 'get_course_by_the_subject', methods: ['GET'])]
    public function getCourseByTheSubject(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $queryBuilder = $entityManager->createQueryBuilder();
    
        $queryBuilder->select('course')
            ->from(Course::class, 'course')
            ->join('course.subjects', 'sub')
            ->where('sub.id = :subjectId')
            ->setParameter('subjectId', $id);
    
        $courses = $queryBuilder->getQuery()->getResult();
    
        $response = array_map([$this, 'formatCourse'], $courses);
    
        return $this->json($response);
    }

    #[Route('/teacher/{id}/courses', name: 'get_courses_by_the_teacher', methods: ['GET'])]
    public function getCourseByTheTeacher(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $queryBuilder = $entityManager->createQueryBuilder();
    
        $queryBuilder->select('course')
            ->from(Course::class, 'course')
            ->join('course.teachers', 't')
            ->where('t.id = :teacherId')
            ->setParameter('teacherId', $id);
    
        $courses = $queryBuilder->getQuery()->getResult();
    
        $response = array_map([$this, 'formatCourse'], $courses);
    
        return $this->json($response);
    }

    #[Route('/courses/save', name: 'save_course', methods: ['POST'])]
    public function saveCourse(
        Request $request,
        EntityManagerInterface $entityManager,
        CourseRepository $courseRepository,
        GroupsRepository $groupsRepository,
        HalfGroupRepository $halfGroupRepository,
        FormationLevelRepository $formationLevelRepository,
        TeacherRepository $teacherRepository,
        CourseTypeRepository $courseTypeRepository,
        SubjectRepository $subjectRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérification des champs obligatoires
        if (!isset($data['duration']) || !isset($data['weekPosition']) || !isset($data['subjectId'])) {
            return new JsonResponse(['error' => 'Les champs duration, weekPosition et subjectId sont obligatoires.'], 400);
        }

        $course = null;

        // Si un ID de cours est fourni, on tente une mise à jour
        if (!empty($data['id'])) {
            $course = $courseRepository->find($data['id']);
            if (!$course) {
                return new JsonResponse(['error' => "Cours ID invalide."], 404);
            }
        } else {
            // Sinon, création d'un nouveau cours
            $course = new Course();
        }

        // Mise à jour des champs
        $course->setDuration((float) $data['duration']);
        $course->setWeekPosition((int) $data['weekPosition']);

        // Association des relations (Formation Level, Group, HalfGroup, Teacher, CourseType, Subject)
        if (!empty($data['formationLevelId'])) {
            $formationLevel = $formationLevelRepository->find($data['formationLevelId']);
            if ($formationLevel) {
                foreach ($course->getFormationLevel() as $existingFormationLevel) {
                    $course->removeFormationLevel($existingFormationLevel);
                }
                $course->addFormationLevel($formationLevel);
            }
        }

        if (!empty($data['groupId'])) {
            $group = $groupsRepository->find($data['groupId']);
            if ($group) {
                foreach ($course->getGroups() as $existingGroup) {
                    $course->removeGroup($existingGroup);
                }
                $course->addGroup($group);
            }
        }

        if (!empty($data['halfGroupId'])) {
            $halfGroup = $halfGroupRepository->find($data['halfGroupId']);
            if ($halfGroup) {
                foreach ($course->getHalfGroups() as $existingHalfGroup) {
                    $course->removeHalfGroup($existingHalfGroup);
                }
                $course->addHalfGroup($halfGroup);
            }
        }

        if (!empty($data['teacherId'])) {
            $teacher = $teacherRepository->find($data['teacherId']);
            if ($teacher) {
                $course->addTeacher($teacher);
            }
        }

        if (!empty($data['courseTypeName'])) {
            $courseType = $courseTypeRepository->findOneBy(['name' => $data['courseTypeName']]);
            if ($courseType) {
                foreach ($course->getCourseTypes() as $existingCourseType) {
                    $course->removeCourseType($existingCourseType);
                }
                $course->addCourseType($courseType);
            }
        }

        if (!empty($data['subjectId'])) {
            $subject = $subjectRepository->find($data['subjectId']);
            if ($subject) {
                $course->addSubject($subject);
            }
        }

        // Sauvegarde en base de données
        $entityManager->persist($course);
        $entityManager->flush();

        return $this->json([
            'message' => 'Cours sauvegardé avec succès.',
            'course' => [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'weekPosition' => $course->getWeekPosition(),
                'groupPosition' => array_map(fn($group) => $group->getId(), $course->getGroups()->toArray()),
                'halfGroupPosition' => array_map(fn($halfGroup) => $halfGroup->getId(), $course->getHalfGroups()->toArray()),
                'formationLevelPosition' => array_map(fn($level) => $level->getId(), $course->getFormationLevel()->toArray()),
                'courseType' => array_map(fn($type) => $type->getId(), $course->getCourseTypes()->toArray()),
                'teacher' => array_map(fn($teacher) => $teacher->getId(), $course->getTeachers()->toArray()),
                'subjects' => array_map(fn($subject) => $subject->getId(), $course->getSubjects()->toArray()),
            ],
        ]);
    }


    #[Route('/courses/delete/{id}', name: 'delete_course', methods: ['DELETE'])]
    public function deleteCourse(
        int $id,
        CourseRepository $courseRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $course = $courseRepository->find($id);
    
        if (!$course) {
            return $this->json(['error' => 'Cours non trouvé.'], 404);
        }
    
        foreach ($course->getGroups() as $group) {
            $course->removeGroup($group);
        }
    
        foreach ($course->getHalfGroups() as $halfGroup) {
            $course->removeHalfGroup($halfGroup);
        }
    
        foreach ($course->getFormationLevel() as $formationLevel) {
            $course->removeFormationLevel($formationLevel);
        }
    
        foreach ($course->getTeachers() as $teacher) {
            $course->removeTeacher($teacher);
        }
    
        foreach ($course->getSubjects() as $subject) {
            $course->removeSubject($subject);
        }
    
        foreach ($course->getCourseTypes() as $courseType) {
            $course->removeCourseType($courseType);
        }
    
        $entityManager->remove($course);
        $entityManager->flush();
    
        return $this->json(['message' => 'Cours supprimé avec succès.'], 200);
    }
}
