<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\CourseType;
use Symfony\Component\HttpFoundation\Request;

class CourseTypeController extends AbstractController
{
    #[Route('/coursetypes', name: 'app_course_type')]
    public function getCourseType(EntityManagerInterface $entityManager): JsonResponse
    {
        //CourseTypeRepository nous permet de rechercher tous les types de course dispo dans la BDD
        $courseTypeRepository = $entityManager->getRepository(CourseType::class);
        $coursetype = $courseTypeRepository->findAll();

        //On retourne les coursetype sous forme de tableau
        $data = array_map(function($coursetype){
            return [
                'id' => $coursetype->getId(),
                'name' => $coursetype->getName(),
                'color' => $coursetype->getColor(),
                'scope' => $coursetype->getScope(),
            ];
        }, $coursetype);

        //On retourne le tableau avec toutes les données de CourseType en format JSON
        return new JsonResponse($data, 200);
    }

    #[Route('/coursetypes/add', name: 'add_a_course_type', methods: ['POST'])]
    public function addCourseType(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        // Récupérer/Décoder le contenu JSON de la requête HTTP qui nous est envoyé via le front
        $data = json_decode($request->getContent(), true);

        // Vérifier si le champ 'name' est présent et non vide
        if (!isset($data['name']) || empty(trim($data['name']))) {
            //Si name n'est pas présent et/ou vide alors on retourne une réponse JSON avec une erreur et un code HTTP 400
            return new JsonResponse(['error' => 'Le nom du type de cours est obligatoire.'], 400);
        }

        // Récupérer les données du type de cours
        $courseTypeName = trim($data['name']);  // Le nom du type de cours
        $courseTypeColor = $data['color'] ?? null;  // La couleur du type de cours
        $courseTypeScope = $data['scope'] ?? null;  // La portée du type de cours

        try {
            // Récupérer le Repository pour la classe CourseType (récupère toutes les données de la table CourseType)
            $courseTypeRepository = $entityManager->getRepository(CourseType::class);

            // On vérifie si un cours du même nom existe déjà
            $courseType = $courseTypeRepository->findOneBy(['name' => $courseTypeName]);

            // Si le nom n'est pas déjà pris alors on crée un nouveau CourseType
            if (!$courseType) {
                $courseType = new CourseType(); // Créer un nouvel objet CourseType pour définir les valeurs données par le Front
                $courseType->setName($courseTypeName);  // Définir le nom
                $courseType->setColor($courseTypeColor);  // Définir la couleur
                $courseType->setScope($courseTypeScope);  // Définir la portée

                // Insertion du nouveau CourseType dans la BDD
                $entityManager->persist($courseType);

                // Enfin sauvegarder les nouvelles données dans la BDD 
                $entityManager->flush();
            }

            // Retourner une réponse JSON pour signaler la création du CourseType
            return new JsonResponse(['success' => 'Nouveau CourseType a bel et bien été ajouté.'], 201);
        } catch (\Exception $e) {
            // Si le CourseType n'a pas pu être créé alors on retourne une erreur
            return new JsonResponse(['error' => 'Il y a eu un problème dans la création du nouveau CourseType (déjà existant, problème serveur, ...)'], 500);
        }
    }

    //Route permettant de supprimer un CourseType spéciffique par son ID
    #[Route('/coursetypes/delete/{id}', name: 'delete_course_type', methods: ['DELETE'])]
    public function deleteCourseType(EntityManagerInterface $entityManager, string $id): JsonResponse
    {
        // Recherche d'un CourseType par son id
        $courseTypeRepository = $entityManager->getRepository(CourseType::class);
        $courseType = $courseTypeRepository->findOneBy(['id' => $id]);
    
        // Si le type de cours n'existe pas, on retourne une erreur
        if (!$courseType) {
            return new JsonResponse(['error' => 'Type de cours introuvable ou inexistant.'], 404, [], true);
        }
        // Supprime toutes  les associations de notre CourseType avec ses items de la table ExpectedDuration
        foreach ($courseType->getExpectedDurations() as $duration) {
            $courseType->removeExpectedDuration($duration);
            $entityManager->remove($duration);
        }

        // Supprime toutes  les associations de notre CourseType avec ses items de la table Course
        foreach ($courseType->getCourses() as $course) {
            $courseType->removeCourse($course);
            $entityManager->remove($course);
        }
    
        // Suppression du CourseType
        $entityManager->remove($courseType);
        $entityManager->flush();
    
        // Retourne une réponse de succès
        return new JsonResponse(['success' => 'Type de cours supprimé avec succès.'], 200);
    }
}
