<?php

namespace App\Controller;

use App\Entity\Subject;
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
    }

    #[Route('/insert-data/{id}', name: 'insert_data', methods: ['POST'])]
    public function insertData(string $id): JsonResponse
    {
        // Fetch data from ExcelReaderController
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
                        $this->addSubject($subjectData, $semester);
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
        }

        return $curriculum;
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

    private function addSubject(array $subjectData, Semester $semester): void
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
            $subject->setDuration($subjectData['total'] ?? 0);
            $this->entityManager->persist($subject);
        } else {
            $subject->setDuration($subjectData['total'] ?? 0);
        }

        if (!$semester->getSubjects()->contains($subject)) {
            $semester->addSubject($subject);
        }
    }
}