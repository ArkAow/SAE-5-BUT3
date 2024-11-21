<?php

namespace App\Controller;

use App\Entity\Subject;
use App\Entity\CourseType;
use App\Entity\ExpectedDuration;
use App\Entity\Curriculum;
use App\Entity\Semester;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DatasInsertController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ExcelReaderController $excelReaderController;

    public function __construct(EntityManagerInterface $entityManager, ExcelReaderController $excelReaderController)
    {
        $this->entityManager = $entityManager;
        $this->excelReaderController = $excelReaderController;
        $this->initializeCourseTypes();
    }

    #[Route('/insert-data/{id}', name: 'insert_data', methods: ['POST'])]
    public function insertData(string $id): JsonResponse
    {
        $response = $this->excelReaderController->readExcel($id);

        if ($response->getStatusCode() !== Response::HTTP_OK) {
            return $response;
        }

        $data = json_decode($response->getContent(), true);

        if (!isset($data['sheets']) || !is_array($data['sheets'])) {
            return new JsonResponse(['error' => "Le fichier avec l'ID {$id} n'existe pas ou est vide."], Response::HTTP_NOT_FOUND);
        }

        foreach ($data['sheets'] as $sheetName => $rows) {
            foreach ($rows as $rowData) {
                $this->addData($rowData, $sheetName);
            }
        }

        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Les données ont été insérées avec succès']);
    }

    private function addData(array $rowData, string $sheetName): void
    {
        if (empty($rowData['code_apogee']) || empty($rowData['intitule'])) {
            return;
        }

        $subject = $this->entityManager->getRepository(Subject::class)
            ->findOneBy(['code' => $rowData['code_apogee']]);

        if (!$subject) {
            $subject = new Subject();
            $subject->setName($rowData['intitule']);
            $subject->setCode($rowData['code_apogee']);
            $subject->setDuration($rowData['total'] ?? 0);
            $this->entityManager->persist($subject);
        } else {
            $subject->setDuration($rowData['total'] ?? $subject->getDuration());
        }

        $this->processCurriculumAndSemester($rowData, $sheetName, $subject);
        $this->processCourseTypes($rowData, $subject);
    }

    private function processCurriculumAndSemester(array $rowData, string $sheetName, Subject $subject): void
    {
        $curriculumName = explode(' ', $sheetName)[0];
        $curriculum = $this->entityManager->getRepository(Curriculum::class)
            ->findOneBy(['name' => $curriculumName]);

        if (!$curriculum) {
            $curriculum = new Curriculum();
            $curriculum->setName($curriculumName);
            $this->entityManager->persist($curriculum);
        }

        $semesterName = $rowData['semester'] ?? $sheetName;
        $semester = $this->entityManager->getRepository(Semester::class)
            ->findOneBy(['name' => $semesterName]);

        if (!$semester) {
            $semester = new Semester();
            $semester->setName($semesterName);
            $this->entityManager->persist($semester);
        }

        if (!$curriculum->getSemesters()->contains($semester)) {
            $curriculum->addSemester($semester);
        }

        if (!$semester->getSubjects()->contains($subject)) {
            $semester->addSubject($subject);
        }
    }

    private function processCourseTypes(array $rowData, Subject $subject): void
    {
        $courseTypes = [
            'CM' => $rowData['CM'] ?? 0,
            'TD' => $rowData['TD'] ?? 0,
            'TP' => $rowData['TP'] ?? 0,
            'SAE' => $rowData['heures_projet'] ?? 0,
        ];

        foreach ($courseTypes as $typeName => $duration) {
            if ($duration > 0) {
                $courseType = $this->entityManager->getRepository(CourseType::class)
                    ->findOneBy(['name' => $typeName]);

                if ($courseType) {
                    $expectedDuration = $this->entityManager->getRepository(ExpectedDuration::class)
                        ->findOneBy(['subject' => $subject, 'courseType' => $courseType]);

                    if (!$expectedDuration) {
                        $expectedDuration = new ExpectedDuration();
                        $expectedDuration->setCourseType($courseType);
                        $expectedDuration->setSubject($subject);
                        $expectedDuration->setExpectedDuration($duration);
                        $this->entityManager->persist($expectedDuration);
                    } else {
                        $expectedDuration->setExpectedDuration($duration);
                    }
                }
            }
        }
    }

    private function initializeCourseTypes(): void
    {
        $courseTypesToAdd = [
            'CM' => ['color' => '#FFFF00', 'scope' => 'class'],
            'TD' => ['color' => '#FF0000', 'scope' => 'group'],
            'TP' => ['color' => '#0000FF', 'scope' => 'half_group'],
            'CONF' => ['color' => '#00FF00', 'scope' => 'class group half_group'],
            'CONTROLE' => ['color' => '#F495F4', 'scope' => 'class group half_group'],
            'SAE' => ['color' => '#00FF00', 'scope' => 'class group half_group'],
        ];

        foreach ($courseTypesToAdd as $name => $details) {
            $existingCourseType = $this->entityManager->getRepository(CourseType::class)
                ->findOneBy(['name' => $name]);

            if (!$existingCourseType) {
                $courseType = new CourseType();
                $courseType->setName($name);
                $courseType->setColor($details['color']);
                $courseType->setScope($details['scope']);
                $this->entityManager->persist($courseType);
            }
        }

        $this->entityManager->flush();
    }
}