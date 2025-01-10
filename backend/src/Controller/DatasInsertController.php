<?php

namespace App\Controller;

use App\Entity\Subject;
use App\Entity\Curriculum;
use App\Entity\Semester;
use App\Entity\CourseType;
use App\Entity\ExpectedDuration;
use App\Entity\FormationLevel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\ExcelReaderController;

class DatasInsertController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ExcelReaderController $excelReaderController;

    public function __construct(EntityManagerInterface $entityManager, ExcelReaderController $excelReaderController)
    {
        $this->entityManager = $entityManager;
        $this->excelReaderController = $excelReaderController;
    }

    // Route pour insérer les données en base depuis un fichier Excel
    #[Route('/insert-data/{id}', name: 'insert_data', methods: ['POST'])]
    public function insertData(string $id): JsonResponse
    {
        // Lecture du fichier Excel à partir de l'ID fourni lorsque celui-ci eswt ajouté dans le frontend
        $response = $this->excelReaderController->readExcel($id);

        // Si la lecture n'a pas fonctionné alors on renvoi une erreur
        if ($response->getStatusCode() !== Response::HTTP_OK) {
            return $response;
        }

        // Décoder le contenu JSON du fichier Excel
        $jsonData = json_decode($response->getContent(), true);

        // Si le contenu JSON est vide ou que les données n'existent pas alors on renvoi une erreur
        if (!$jsonData || !isset($jsonData['sheets'])) {
            return new JsonResponse(['error' => "Le fichier avec l'ID {$id} n'existe pas ou est invalide."], Response::HTTP_NOT_FOUND);
        }

        // Lecture des données pour les insérer dans notre BDD
        foreach ($jsonData['sheets'] as $sheetName => $curricul) {
            foreach ($curricul as $curriculumName => $semesters) {
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

        // Enregistrement des données dans la BDD
        $this->entityManager->flush();

        // Réponse JSON pour confirmer l'insertion des données
        return new JsonResponse(['status' => 'Les données ont été insérées avec succès',
            'sheets' => $jsonData['sheets']], Response::HTTP_OK);
    }

    // Fonction pour récupérer ou créer un curriculum à partir du fichier excel et de ses données
    private function getOrCreateCurriculum(string $name): Curriculum
    {
        // Recherche si le curriculum voulant être ajouté existe déjà ou non
        $curriculum = $this->entityManager->getRepository(Curriculum::class)->findOneBy(['name' => $name]);

        // Si le curriculum n'existe pas alors on le crée
        if (!$curriculum) {
            // Création du curriculum et de ses datas puis ajout dans la BDD (persist)
            $curriculum = new Curriculum();
            $curriculum->setName($name);
            $this->entityManager->persist($curriculum);

            // Si le nom du curriculum contient le mot "BUT" alors on ajoute le niveau de formation correspondant
            if (preg_match('/BUT\s+(\d+)/i', $name, $matches)) {
                $classNumber = $matches[1];
                $formationLevelName = "A" . $classNumber;

                $formationLevel = $this->getOrCreateFormationLevel($formationLevelName);

                $curriculum->addFormationLevel($formationLevel);
                $formationLevel->addCurriculum($curriculum);
            }
        }

        return $curriculum;
    }

    // Fonction pour récupérer ou créer un FormationLevel (A1, A2, etc) à partir du fichier excel et de ses données
    private function getOrCreateFormationLevel(string $name): FormationLevel
    {
        // Recherche si le FormationLevel voulant être ajouté existe déjà ou non dans la BDD
        $formationLevel = $this->entityManager->getRepository(FormationLevel::class)->findOneBy(['name' => $name]);

        // Si le niveau de formation n'existe pas alors on le crée
        if (!$formationLevel) {
            // Création du FormationLevel et de ses datas et ajout dans la BDD (persist)
            $formationLevel = new FormationLevel();
            $formationLevel->setName($name);
            $this->entityManager->persist($formationLevel);
        }

        return $formationLevel;
    }

    // Fonction pour récupérer ou créer un Semester (S1, S2, etc) à partir du fichier excel et de ses données
    private function getOrCreateSemester(string $name): Semester
    {
        // Recherche si le Semester voulant être ajouté existe déjà ou non dans la BDD
        $semester = $this->entityManager->getRepository(Semester::class)->findOneBy(['name' => $name]);

        // Si le Semester n'existe pas alors on le crée
        if (!$semester) {
            // Création du Semester et de ses datas et ajout dans la BDD (persist)
            $semester = new Semester();
            $semester->setName($name);
            $this->entityManager->persist($semester);
        }

        return $semester;
    }

    // Fonction pour ajouter un sujet avec ses types de cours et leurs durées
    private function addSubjectWithCourseTypes(array $subjectData, Semester $semester): void
    {
        // Si le code ou l'intitulé du sujet est vide alors on ne fait rien
        if (empty($subjectData['code_apogee']) || empty($subjectData['intitule'])) {
            return;
        }

        // Recherche si le sujet voulant être ajouté existe déjà ou non dans la BDD
        $subject = $this->entityManager->getRepository(Subject::class)->findOneBy(['code' => $subjectData['code_apogee']]);

        // Si le sujet n'existe pas alors on le crée
        if (!$subject) {
            // Création du sujet et de ses datas et ajout dans la BDD (persist)
            $subject = new Subject();
            $subject->setName($subjectData['intitule']);
            $subject->setCode($subjectData['code_apogee']);
            $subject->setDuration($subjectData['total']);
            $this->entityManager->persist($subject);
        }

        // Ajout du sujet dans le Semester
        if (!$semester->getSubjects()->contains($subject)) {
            $semester->addSubject($subject);
        }

        // Ajout des types de cours et de leurs durées
        $this->addCourseTypesAndDurations($subject, $subjectData);
    }

    // Fonction pour ajouter les types de cours et leurs durées
    private function addCourseTypesAndDurations(Subject $subject, array $subjectData): void
    {
        $courseTypes = ['CM', 'TD', 'TP', 'SAE'];

        // Pour chaque type de cours on ajoute la durée correspondante
        foreach ($courseTypes as $courseTypeName) {
            if (isset($subjectData[$courseTypeName])) {
                $duration = (int) $subjectData[$courseTypeName];

                if ($duration <= 0) {
                    continue;
                }

                // Recherche si le type de cours voulant être ajouté existe déjà ou non dans la BDD
                $courseType = $this->entityManager->getRepository(CourseType::class)
                    ->findOneBy(['name' => $courseTypeName]);
                
                // Si le type de cours n'existe pas alors on le crée
                if (!$courseType) {
                    throw new \Exception("Le CourseType '{$courseTypeName}' est introuvable. Veuillez le précharger dans la base de données.");
                }
                
                // Ajout du type de cours dans le sujet
                $this->addOrUpdateExpectedDuration($subject, $courseType, $duration);
            }
        }
    }

    // Fonction pour ajouter ou mettre à jour la durée attendue
    private function addOrUpdateExpectedDuration(Subject $subject, CourseType $courseType, int $duration): void
    {
        // Recherche si la durée attendue voulant être ajoutée existe déjà ou non dans la BDD
        $existingExpectedDuration = $this->entityManager->getRepository(ExpectedDuration::class)
            ->findOneBy(['duration' => $duration]);

        // Si la durée attendue n'existe pas alors on la crée
        if ($existingExpectedDuration) {
            // Si la durée attendue n'a pas le sujet souhaité alors on lui ajoute'
            if (!$existingExpectedDuration->getSubjects()->contains($subject)) {
                $existingExpectedDuration->addSubject($subject);
            }
            // Si la durée attendue n'a pas le type de cours souhaité alors on lui ajoute
            if (!$existingExpectedDuration->getCourseTypes()->contains($courseType)) {
                $existingExpectedDuration->addCourseType($courseType);
            }
        } else {
            // Création de la durée attendue et de ses datas et ajout dans la BDD (persist)
            $expectedDuration = new ExpectedDuration();
            $expectedDuration->setDuration($duration);
            $expectedDuration->addSubject($subject);
            $expectedDuration->addCourseType($courseType);
            $this->entityManager->persist($expectedDuration);
        }
    }
}