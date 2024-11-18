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

        $sections = json_decode($response->getContent(), true)['sections'];

        if ($sections === null) {
            return new JsonResponse(['error' => "Le fichier avec l'ID {$id} n'existe pas ou est vide."], Response::HTTP_NOT_FOUND);
        }

        foreach ($sections as $section) {
            foreach ($section as $rowData) {
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

            $subject->getSemesters()->add($semester);
            $semester->getCurriculums()->add($curriculum);
        }

        $courseTypes = [
            'CM' => $rowData['CM'],
            'TD' => $rowData['TD'],
            'TP' => $rowData['TP'],
            'SAE' => $rowData['heures_projet'] ?? 0,
        ];

        foreach ($courseTypes as $typeName => $duration) {
            if ($duration > 0) {
                $courseType = $this->entityManager->getRepository(CourseType::class)
                    ->findOneBy(['name' => $typeName]);

                if (!$courseType) {
                    continue;
                }

                $expectedDuration = new ExpectedDuration();
                $expectedDuration->setCourseType($courseType);
                $expectedDuration->setSubject($subject);
                $expectedDuration->setExpectedDuration($duration);

                $this->entityManager->persist($expectedDuration);
            }
        }
    }

    private function initializeCourseTypes(): void
    {
        $courseTypesToAdd = [
            'CM' => '#FFFF00',
            'TD' => '#FF0000',
            'TP' => '#0000FF',
            'CONF' => '#00FF00',
            'CONTROLE' => '#F495F4',
            'SAE' => '#00FF00',
        ];

        foreach ($courseTypesToAdd as $name => $color) {
            $existingCourseType = $this->entityManager->getRepository(CourseType::class)
                ->findOneBy(['name' => $name]);

            if (!$existingCourseType) {
                $courseType = new CourseType();
                $courseType->setName($name);
                $courseType->setColor($color);
                $this->entityManager->persist($courseType);
            }
        }

        $this->entityManager->flush();
    }
}
