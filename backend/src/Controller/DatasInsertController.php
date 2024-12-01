<?php

namespace App\Controller;

use App\Entity\Subject;
use App\Entity\Curriculum;
use App\Entity\Semester;
use App\Entity\CourseType;
use App\Entity\ExpectedDuration;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\ExcelReaderController;
use App\Entity\ClassEntity;

class DatasInsertController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ExcelReaderController $excelReaderController;

    public function __construct(EntityManagerInterface $entityManager, ExcelReaderController $excelReaderController)
    {
        $this->entityManager = $entityManager;
        $this->excelReaderController = $excelReaderController;
    }

    #[Route('/insert-data/{id}', name: 'insert_data', methods: ['POST'])]
    public function insertData(string $id): JsonResponse
    {
        $response = $this->excelReaderController->readExcel($id);

        if ($response->getStatusCode() !== Response::HTTP_OK) {
            return $response;
        }

        $jsonData = json_decode($response->getContent(), true);

        if (!$jsonData || !isset($jsonData['sheets'])) {
            return new JsonResponse(['error' => "Le fichier avec l'ID {$id} n'existe pas ou est invalide."], Response::HTTP_NOT_FOUND);
        }

        foreach ($jsonData['sheets'] as $sheetName => $curricula) {
            foreach ($curricula as $curriculumName => $semesters) {
                $curriculum = $this->getOrCreateCurriculum($curriculumName);

                foreach ($semesters as $semesterName => $subjects) {
                    $semester = $this->getOrCreateSemester($semesterName);
                    $curriculum->addSemester($semester);

                    foreach ($subjects as $subjectData) {
                        $this->addSubjectWithCourseTypes($subjectData, $semester);
                    }
                }
            }
        }

        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Les données ont été insérées avec succès']);
    }

    private function getOrCreateCurriculum(string $name): Curriculum
    {
        $curriculum = $this->entityManager->getRepository(Curriculum::class)->findOneBy(['name' => $name]);

        if (!$curriculum) {
            $curriculum = new Curriculum();
            $curriculum->setName($name);
            $this->entityManager->persist($curriculum);

            if (preg_match('/BUT\s+(\d+)/i', $name, $matches)) {
                $classNumber = $matches[1];
                $className = "A" . $classNumber;

                $classEntity = $this->getOrCreateClassEntity($className);

                $curriculum->addClass($classEntity);
                $classEntity->addCurriculum($curriculum);
            }
        }

        return $curriculum;
    }

    private function getOrCreateClassEntity(string $className): ClassEntity
    {
        $classEntity = $this->entityManager->getRepository(ClassEntity::class)->findOneBy(['name' => $className]);
    
        if (!$classEntity) {
            $classEntity = new ClassEntity();
            $classEntity->setName($className);
            $this->entityManager->persist($classEntity);
        }
    
        return $classEntity;
    }    

    private function getOrCreateSemester(string $name): Semester
    {
        $semester = $this->entityManager->getRepository(Semester::class)->findOneBy(['name' => $name]);

        if (!$semester) {
            $semester = new Semester();
            $semester->setName($name);
            $this->entityManager->persist($semester);
        }

        return $semester;
    }

    private function addSubjectWithCourseTypes(array $subjectData, Semester $semester): void
    {
        if (empty($subjectData['code_apogee']) || empty($subjectData['intitule'])) {
            return;
        }

        $subject = $this->entityManager->getRepository(Subject::class)
            ->findOneBy(['code' => $subjectData['code_apogee']]);

        if (!$subject) {
            $subject = new Subject();
            $subject->setName($subjectData['intitule']);
            $subject->setCode($subjectData['code_apogee']);
            $subject->setDuration($subjectData['total']);
            $this->entityManager->persist($subject);
        }

        if (!$semester->getSubjects()->contains($subject)) {
            $semester->addSubject($subject);
        }

        $this->addCourseTypesAndDurations($subject, $subjectData);
    }

    private function addCourseTypesAndDurations(Subject $subject, array $subjectData): void
    {
        $courseTypes = ['CM', 'TD', 'TP', 'SAE'];

        foreach ($courseTypes as $courseTypeName) {
            if (isset($subjectData[$courseTypeName])) {
                $duration = (int) $subjectData[$courseTypeName];

                if ($duration <= 0) {
                    continue;
                }

                $courseType = $this->entityManager->getRepository(CourseType::class)
                    ->findOneBy(['name' => $courseTypeName]);

                if (!$courseType) {
                    throw new \Exception("Le CourseType '{$courseTypeName}' est introuvable. Veuillez le précharger dans la base de données.");
                }

                $this->addOrUpdateExpectedDuration($subject, $courseType, $duration);
            }
        }
    }

    private function addOrUpdateExpectedDuration(Subject $subject, CourseType $courseType, int $duration): void
    {
        $existingExpectedDuration = $this->entityManager->getRepository(ExpectedDuration::class)
            ->findOneBy(['duration' => $duration]);

        if ($existingExpectedDuration) {
            if (!$existingExpectedDuration->getSubjects()->contains($subject)) {
                $existingExpectedDuration->addSubject($subject);
            }
            if (!$existingExpectedDuration->getCourseTypes()->contains($courseType)) {
                $existingExpectedDuration->addCourseType($courseType);
            }
        } else {
            $expectedDuration = new ExpectedDuration();
            $expectedDuration->setDuration($duration);
            $expectedDuration->addSubject($subject);
            $expectedDuration->addCourseType($courseType);
            $this->entityManager->persist($expectedDuration);
        }
    }
}