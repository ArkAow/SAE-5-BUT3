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
                'subjects' => array_map(fn($subject) => $subject->getId(), $course->getSubjects()->toArray()),
            ];
        }

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

        $response = [];
        foreach ($courses as $course) {
            $response[] = [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'positionX' => $course->getPositionX(),
                'positionY' => $course->getPositionY(),
                'courseTypes' => array_map(fn($type) => $type->getId(), $course->getCourseTypes()->toArray()),
                'teachers' => array_map(fn($teacher) => $teacher->getId(), $course->getTeachers()->toArray()),
                'subjects' => array_map(fn($subject) => $subject->getId(), $course->getSubjects()->toArray()),
            ];
        }

        return $this->json($response);
    }

    #[Route('/teacher/{id}/courses', name: 'get_courses_by_the_teacher', methods: ['GET'])]
    public function getCourseByTheTeacher(int $teacherID, EntityManagerInterface $entityManager)
    {
        
        $queryBuilder = $entityManager->createQueryBuilder();

        $queryBuilder->select('course')
            ->from(Course::class, 'course')
            ->join('course.teachers', 't')
            ->where('t.id = :teacherId')
            ->setParameter('teacherId', $teacherID);

        $courses = $queryBuilder->getQuery()->getResult();

        $response = [];
        foreach ($courses as $course) {
            $response[] = [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'positionX' => $course->getPositionX(),
                'positionY' => $course->getPositionY(),
                'courseTypes' => array_map(fn($type) => $type->getId(), $course->getCourseTypes()->toArray()),
                'teachers' => array_map(fn($teacher) => $teacher->getId(), $course->getTeachers()->toArray()),
                'subjects' => array_map(fn($subject) => $subject->getId(), $course->getSubjects()->toArray()),
            ];
        }

        return $this->json($response);
    }


    #[Route('/courses/add/half_group', name: 'create_course_by_halfgroup', methods: ['POST'])]
    public function createCourse(
        Request $request,
        EntityManagerInterface $entityManager, 
        TeacherRepository $teacherRepository, 
        CourseTypeRepository $courseTypeRepository,
        SubjectRepository $subjectRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (empty($data['duration'])) {
            return new JsonResponse(['error' => 'La durée est obligatoire.'], 400);
        }
        if (empty($data['groupPosition']) || empty($data['weekPosition'])) {
            return new JsonResponse(['error' => 'La position est obligatoire.'], 400);
        }

        $course = new Course();
        $course->addGroup($data['groupPosition']);
        $course->setWeekPosition($data['weekPosition']);

        if (!empty($data['teacherId'])) {
            $teacher = $teacherRepository->find($data['teacherId']);
            if ($teacher) {
                $course->addTeacher($teacher);
            } else {
                return new JsonResponse(['error' => "Professeur ID '{$data['teacherId']}' introuvable."], 404);
            }
        }

        if (!empty($data['subjectId'])) {
            $subject = $subjectRepository->find($data['subjectId']);
            if ($subject) {
                $course->addSubject($subject);
            } else {
                return new JsonResponse(['error' => "Sujet ID '{$data['subjectId']}' introuvable."], 404);
            }
        }

        if (!empty($data['courseTypeId'])) {
            $courseType = $courseTypeRepository->find($data['courseTypeId']);
            if ($courseType) {
                $course->addCourseType($courseType);
            } else {
                return new JsonResponse(['error' => "CourseType ID '{$data['courseTypeId']}' introuvable."], 404);
            }
        }

        $entityManager->persist($course);
        $entityManager->flush();

        return $this->json([
            'message' => 'Cours créé avec succès.',
            'course' => [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'weekPosition' => $course->getWeekPosition(),
                'group' => $course->getGroups(),
                'courseType' => $courseType ? $courseType->getId() : null,
                'teacher' => $teacher ? $teacher->getId() : null,
                'subject' => $subject ? $subject->getId() : null,
            ],
        ], 201);
    }

    #[Route('/courses/{id}', name: 'update_course', methods: ['PUT'])]
    public function updateCourse(
        int $id,
        Request $request,
        CourseRepository $courseRepository,
        EntityManagerInterface $entityManager,
        CourseTypeRepository $courseTypeRepository,
        SubjectRepository $subjectRepository,
        TeacherRepository $teacherRepository
    ): JsonResponse {
        $course = $courseRepository->find($id);

        if (!$course) {
            return new JsonResponse(['error' => 'Cours non trouvé.'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!empty($data['duration'])) {
            $course->setDuration((float) $data['duration']);
        }
        if (array_key_exists('weekPosition', $data)) {
            $course->setPositionX($data['weekPosition']);
        }
        if (array_key_exists('groupPosition', $data)) {
            $course->setPositionY($data['groupPosition']);
        }
        if (!empty($data['teacherId'])) {
            $teacher = $teacherRepository->find($data['teacherId']);
            if ($teacher) {
                $course->addCourseType($teacher);
            } else {
                return new JsonResponse(['error' => "Teacher '{$data['teacher']}' introuvable."], 404);
            }
        }
    
        if (!empty($data['courseTypeId'])) {
            $courseType = $courseTypeRepository->find($data['courseTypeId']);
            if ($courseType) {
                $course->addCourseType($courseType);
            } else {
                return new JsonResponse(['error' => "CourseType ID '{$data['courseTypeId']}' introuvable."], 404);
            }
        }

        if (!empty($data['subjectsId'])) {
            $subjects = $subjectRepository->find($data['subjectsId']);
            if ($subjects) {
                $course->addCourseType($subjects);
            } else {
                return new JsonResponse(['error' => "Sujet '{$data['subjectsId']}' introuvable."], 404);
            }
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Cours mis à jour avec succès.',
            'course' => [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'groupPosition' => $course->getHalfGroups(),
                'weekPosition' => $course->getWeekPosition(),
                'courseType' => array_map(fn($type) => $type->getId(), $course->getCourseTypes()->toArray()),
                'teacher' => array_map(fn($teacher) => $teacher->getId(), $course->getTeachers()->toArray()),
                'subjects' => array_map(fn($subject) => $subject->getId(), $course->getSubjects()->toArray()),
            ],
        ]);
    }

    #[Route('/courses/add/formationlevel', name: 'create_course_by_formationlevel', methods: ['POST'])]
    public function createCourse_by_FormationLevel(
        Request $request,
        EntityManagerInterface $entityManager, 
        TeacherRepository $teacherRepository, 
        CourseTypeRepository $courseTypeRepository,
        SubjectRepository $subjectRepository,
        FormationLevelRepository $formationLevelRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (empty($data['duration'])) {
            return new JsonResponse(['error' => 'La durée est obligatoire.'], 400);
        }
        if (empty($data['groupPosition']) || empty($data['weekPosition'])) {
            return new JsonResponse(['error' => 'La position est obligatoire.'], 400);
        }

        $group = $formationLevelRepository->find($data['groupPosition']);
        if (!$group) {
            return new JsonResponse(['error' => "Group ID '{$data['groupPosition']}' introuvable."], 404);
        }

        $course = new Course();
        $course->addFormationLevel($group);
        $course->setWeekPosition($data['weekPosition']);
        $course->setDuration($data['duration']);

        if (!empty($data['teacherId'])) {
            $teacher = $teacherRepository->find($data['teacherId']);
            if ($teacher) {
                $course->addTeacher($teacher);
            } else {
                return new JsonResponse(['error' => "Professeur ID '{$data['teacherId']}' introuvable."], 404);
            }
        }

        if (!empty($data['subjectId'])) {
            $subject = $subjectRepository->find($data['subjectId']);
            if ($subject) {
                $course->addSubject($subject);
            } else {
                return new JsonResponse(['error' => "Sujet ID '{$data['subjectId']}' introuvable."], 404);
            }
        }

        if (!empty($data['courseTypeId'])) {
            $courseType = $courseTypeRepository->find($data['courseTypeId']);
            if ($courseType) {
                $course->addCourseType($courseType);
            } else {
                return new JsonResponse(['error' => "CourseType ID '{$data['courseTypeId']}' introuvable."], 404);
            }
        }

        $entityManager->persist($course);
        $entityManager->flush();

        return $this->json([
            'message' => 'Cours créé avec succès.',
            'course' => [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'groupPosition' => $group->getId(),
                'weekPosition' => $course->getWeekPosition(),
                'courseType' => $courseType ? $courseType->getId() : null,
                'teacher' => $teacher ? $teacher->getId() : null,
                'subject' => $subject ? $subject->getId() : null,
            ],
        ], 201);
    }

    #[Route('/courses/add/group', name: 'create_course_by_group', methods: ['POST'])]
    public function createCourse_by_Group(
        Request $request,
        EntityManagerInterface $entityManager, 
        TeacherRepository $teacherRepository, 
        CourseTypeRepository $courseTypeRepository,
        SubjectRepository $subjectRepository,
        GroupsRepository $groupRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (empty($data['duration'])) {
            return new JsonResponse(['error' => 'La durée est obligatoire.'], 400);
        }
        if (empty($data['groupPosition']) || empty($data['weekPosition'])) {
            return new JsonResponse(['error' => 'La position est obligatoire.'], 400);
        }

        $group = $groupRepository->find($data['groupPosition']);
        if (!$group) {
            dump($data['groupPosition']); // Vérifie ce qui est passé en entrée
            die('Group not found');
        }

        $course = new Course();
        $course->addGroup($group);
        $course->setWeekPosition($data['weekPosition']);
        $course->setDuration($data['duration']);

        if (!empty($data['teacherId'])) {
            $teacher = $teacherRepository->find($data['teacherId']);
            if ($teacher) {
                $course->addTeacher($teacher);
            } else {
                return new JsonResponse(['error' => "Professeur ID '{$data['teacherId']}' introuvable."], 404);
            }
        }

        if (!empty($data['subjectId'])) {
            $subject = $subjectRepository->find($data['subjectId']);
            if ($subject) {
                $course->addSubject($subject);
            } else {
                return new JsonResponse(['error' => "Sujet ID '{$data['subjectId']}' introuvable."], 404);
            }
        }

        if (!empty($data['courseTypeId'])) {
            $courseType = $courseTypeRepository->find($data['courseTypeId']);
            if ($courseType) {
                $course->addCourseType($courseType);
            } else {
                return new JsonResponse(['error' => "CourseType ID '{$data['courseTypeId']}' introuvable."], 404);
            }
        }

        $entityManager->persist($course);
        $entityManager->flush();

        return $this->json([
            'message' => 'Cours créé avec succès.',
            'course' => [
                'id' => $course->getId(),
                'duration' => $course->getDuration(),
                'groupPosition' => $group->getId(),
                'weekPosition' => $course->getWeekPosition(),
                'courseType' => $courseType ? $courseType->getId() : null,
                'teacher' => $teacher ? $teacher->getId() : null,
                'subject' => $subject ? $subject->getId() : null,
            ],
        ], 201);
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
