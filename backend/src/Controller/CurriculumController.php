<?php

namespace App\Controller;

use App\Repository\CurriculumRepository;
use App\Repository\SemesterRepository;
use App\Repository\SubjectRepository;
use App\Entity\Curriculum;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class CurriculumController extends AbstractController
{
    //Route et fonction permttant de récupérer les semestres d'un curriculum
    #[Route('/api/curriculum/{id}/semesters', name: 'api_get_semesters', methods: ['GET'])]
    public function getSemesters(int $id, EntityManagerInterface $em): JsonResponse
    {
        //Connexion à la BDD afin de récupérer les données
        $connection = $em->getConnection();
        //Requête SQL 
        $sql = '
            SELECT s.id, s.name 
            FROM semester s
            INNER JOIN curriculum_semester cursem ON cursem.semester_id = s.id
            WHERE cursem.curriculum_id = :curriculumId
        ';
        //Execution de la requete SQL avec nos parametres
        $stmt = $connection->prepare($sql);
        $result = $stmt->executeQuery(['curriculumId' => $id])->fetchAllAssociative();

        //Si aucun résultat n'est trouvé, alors une erreur est renvoyée
        if (empty($result)) {
            return $this->json(['error' => 'No semesters found for this curriculum'], 404);
        }

        //On retourne les semestres sous forme de tableau en JSON
        return $this->json($result, 200);
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
                // ajouter 'classes' qui est la liste de classes/promo du cursus
            ];
        }, $curriculums);

        //On retourne le tableau en format JSON
        return new JsonResponse($data, 200);
    }
}