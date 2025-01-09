<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class SemesterController extends AbstractController
{   
    //Route afin de récupérer les matières d'un semestre donné
    #[Route('/semester/{id}/subjects', name: 'api_get_subjects', methods: ['GET'])]
    public function getSubjects(int $id, EntityManagerInterface $em): JsonResponse
    {
        //Connexion à la BDD afin de récupérer les données
        $connection = $em->getConnection();
        //Requete SQL nous permettant de récupérer les données
        $sql = '
            SELECT sub.id, sub.name, sub.code, subsem.semester_id
            FROM subject sub
            INNER JOIN subject_semester subsem ON subsem.subject_id = sub.id
            WHERE subsem.semester_id = :semesterId
        ';
        //Execution de la requete SQL avec nos parametres
        $stmt = $connection->prepare($sql);
        $result = $stmt->executeQuery(['semesterId' => $id])->fetchAllAssociative();

        //Si aucun résultat n'est trouvé, alors une erreur est renvoyée
        if (empty($result)) {
            return $this->json(['error' => 'Pas de matières pour le semestre choisi'], 404);
        }
        
        //On retourne les matières sous forme de tableau en JSON
        return $this->json($result, 200);
    }
}
