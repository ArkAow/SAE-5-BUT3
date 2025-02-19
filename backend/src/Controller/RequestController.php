<?php

namespace App\Controller;

use App\Entity\Teacher;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Course;
use App\Entity\Subject;
use App\Entity\Semester;

class RequestController extends AbstractController
{
    #[Route('/week_request/{id}', name: 'app_request')]
    public function getCourse_by_teacher(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $teacherRepository = $entityManager->getRepository(Teacher::class);
        $teacher = $teacherRepository->find($id);

        if (!$teacher) {
            return new JsonResponse(['error' => 'Teacher not found'], Response::HTTP_NOT_FOUND);
        }

        $courses = $teacher->getCourses();
        $weeklyCourses = [];

        foreach ($courses as $course) {
            $weekNumber = $course->getWeekPosition();
            $subjects = $course->getSubjects();
            $courseTypes = $course->getCourseTypes();

            foreach ($subjects as $subject) {
                $subjectName = $subject->getName();

                foreach ($courseTypes as $courseType) {
                    $courseTypeName = $courseType->getName();

                    if (!isset($weeklyCourses[$weekNumber])) {
                        $weeklyCourses[$weekNumber] = [];
                    }

                    if (!isset($weeklyCourses[$weekNumber][$subjectName])) {
                        $weeklyCourses[$weekNumber][$subjectName] = [];
                    }

                    if (!isset($weeklyCourses[$weekNumber][$subjectName][$courseTypeName])) {
                        $weeklyCourses[$weekNumber][$subjectName][$courseTypeName] = [
                            'total_duration' => 0,
                            'courses' => []
                        ];
                    }

                    $weeklyCourses[$weekNumber][$subjectName][$courseTypeName]['total_duration'] += $course->getDuration();
                    $weeklyCourses[$weekNumber][$subjectName][$courseTypeName]['courses'][] = [
                        'id' => $course->getId(),
                        'duration' => $course->getDuration(),
                    ];
                }
            }
        }

        return new JsonResponse($weeklyCourses);
    }

    #[Route('/weekly_hours/{id}/{weeks}', name: 'weekly_hours')]
    public function getWeeklyHours(int $id, int $weeks, EntityManagerInterface $entityManager): JsonResponse
    {
        $teacher = $entityManager->getRepository(Teacher::class)->find($id);
        if (!$teacher) {
            return new JsonResponse(['error' => 'Teacher not found'], Response::HTTP_NOT_FOUND);
        }

        $weeklyHours = array_fill(1, $weeks, 0);
    
        $weekZeroHours = 0;
    
        $courses = $teacher->getCourses();
    
        foreach ($courses as $course) {
            $weekNumber = $course->getWeekPosition();
            $duration = $course->getDuration();
    
            if ($weekNumber === 0) {
                $weekZeroHours += $duration;
            } elseif ($weekNumber > 0 && $weekNumber <= $weeks) {
                $weeklyHours[$weekNumber] += $duration;
            }
        }
    
        $weeklyHours['0'] = $weekZeroHours;
    
        return new JsonResponse($weeklyHours);
    }    

    #[Route('/courses_by_week/{week}', name: 'courses_by_week')]
    public function getCoursesByWeek(int $week, EntityManagerInterface $entityManager): JsonResponse
    {
        $courses = $entityManager->getRepository(Course::class)->findBy(['weekPosition' => $week]);
        $weekCourses = [];
    
        foreach ($courses as $course) {
            foreach ($course->getSubjects() as $subject) {
                $subjectName = $subject->getName();
    
                if (!isset($weekCourses[$subjectName])) {
                    $weekCourses[$subjectName] = 0;
                }
    
                $weekCourses[$subjectName] += $course->getDuration();
            }
        }
    
        return new JsonResponse($weekCourses);
    }   

    #[Route('/subject_weekly_distribution/{subjectId}/{weeks}', name: 'subject_weekly_distribution')]
    public function getSubjectWeeklyDistribution(int $subjectId, int $weeks, EntityManagerInterface $entityManager): JsonResponse
    {
        $subject = $entityManager->getRepository(Subject::class)->find($subjectId);
        if (!$subject) {
            return new JsonResponse(['error' => 'Subject not found'], Response::HTTP_NOT_FOUND);
        }

        $weeklyDistribution = array_fill(0, $weeks + 1, 0);
    
        $courses = $subject->getCourses();
    
        foreach ($courses as $course) {
            $weekNumber = $course->getWeekPosition();
            $duration = $course->getDuration();
    
            if ($weekNumber !== null && $weekNumber >= 0 && $weekNumber <= $weeks) {
                $weeklyDistribution[$weekNumber] += $duration;
            }
        }
    
        return new JsonResponse($weeklyDistribution);
    }


    #[Route('/courses_by_semester_subjects/{semesterId}', name: 'courses_by_semester_subjects')]
    public function getCoursesBySemesterSubjects(int $semesterId, EntityManagerInterface $entityManager): JsonResponse
    {
        $semester = $entityManager->getRepository(Semester::class)->find($semesterId);
    
        if (!$semester) {
            return new JsonResponse(['error' => 'Semester not found'], Response::HTTP_NOT_FOUND);
        }
    
        $semesterSubjects = [];
    
        foreach ($semester->getSubjects() as $subject) {
            $subjectName = $subject->getName();
    
            $totalDuration = 0;
            foreach ($subject->getCourses() as $course) {
                if ($subject->getSemesters()->contains($semester)) {
                    $totalDuration += $course->getDuration();
                }
            }
    
            if ($totalDuration > 0) {
                $semesterSubjects[$subjectName] = $totalDuration;
            }
        }
    
        return new JsonResponse($semesterSubjects);
    }    
}