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
        if (!isset($data['sheets'])) {
            return new JsonResponse(['error' => "Le fichier avec l'ID {$id} n'existe pas ou est vide."], Response::HTTP_NOT_FOUND);
        }

        $sheets = $data['sheets'];

        foreach ($sheets as $sheetName => $rows) {
            foreach ($rows as $rowData) {
                $this->addData($rowData);
            }
        }

        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Les données ont été insérées avec succès']);
    }

    private function addData(array $rowData): void
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

        if (!empty($rowData['curriculum']) && !empty($rowData['semester'])) {
            $this->processCurriculumAndSemester($rowData);
        }

        $this->processCourseTypes($rowData, $subject);
    }

    private function processCurriculumAndSemester(array $rowData): void
    {
        $curriculum = $this->entityManager->getRepository(Curriculum::class)
            ->findOneBy(['name' => $rowData['curriculum']]);

        if (!$curriculum) {
            $curriculum = new Curriculum();
            $curriculum->setName($rowData['curriculum']);
            $this->entityManager->persist($curriculum);
        }

        $semester = $this->entityManager->getRepository(Semester::class)
            ->findOneBy(['name' => $rowData['semester']]);

        if (!$semester) {
            $semester = new Semester();
            $semester->setName($rowData['semester']);
            $this->entityManager->persist($semester);
        }

        $this->entityManager->getConnection()->executeStatement(
            'INSERT IGNORE INTO curriculum_semester (curriculum_id, semester_id) VALUES (:curriculum, :semester)',
            [
                'curriculum' => $curriculum->getId(),
                'semester' => $semester->getId(),
            ]
        );
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
                    $expectedDuration = new ExpectedDuration();
                    $expectedDuration->setCourseType($courseType);
                    $expectedDuration->setSubject($subject);
                    $expectedDuration->setExpectedDuration($duration);

                    $this->entityManager->persist($expectedDuration);
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
