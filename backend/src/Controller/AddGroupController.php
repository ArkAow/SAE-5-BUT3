<?php

namespace App\Controller;

use App\Entity\Groups;
use App\Entity\HalfGroup;
use App\Entity\ClassEntity;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AddGroupController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    //Route afin d'ajouter un groupe avec ses half_groups et sa classe
    #[Route('/add/group', name: 'add_group', methods: ['POST'])]
    public function addGroup(Request $request): JsonResponse
    {
        // On récupère le JSON donné à partir du Frontend
        $data = json_decode($request->getContent(), true);

        // Si le nom du groupe est vide, on renvoie une erreur.
        // Si le groupe n'a pas de promotion, on renvoie une erreur.
        // Sinon on récupère les informations

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom du groupe est obligatoire.'], 400);
        } else if (!isset($data['classID']) || empty(trim($data['classID']))) {
            return new JsonResponse(['error' => 'Le groupe doit être lié à une promotion.'], 400);
        } else {
            $groupName = trim($data['name']);       //Nom du groupe à ajouter
            $halfgroupsData = $data['halfgroups'] ?? [];    // Tous les half_groups lié au groupe (id et name)
            $classID = $data['classID'] ?? null;            //ID de la classe parente du nouveau groupe. Null à enlever si l'ID ne peut pas être = à 0
        }
        

        // On créé le nouveau groupe.  

        $group = new Groups();
        $group->setName($groupName);
        $this->entityManager->persist($group);

        // Récupération de l'id de la promotion
        
        $classRepository = $this->entityManager->getRepository(ClassEntity::class);
        $class = $classRepository->find($classID);

        //  Associer le groupe à la promotion si elle existe
        //  Sinon on retourne une erreur

        
        if ($class) {                           
            $group->addClass($class);   
        } else {

            return new JsonResponse(['error' => 'Classe introuvable pour l\'ID fourni.'], 400);
        }
            
        // Gestion des halfgroups
        
        foreach ($halfgroupsData as $halfgroupData) {
            
            // Si un half_group n'a pas de nom, on renvoie une erreur.

            if (!isset($halfgroupData['name']) || empty(trim($halfgroupData['name']))) {
                return new JsonResponse(['error' => 'Chaque halfgroup doit avoir un nom valide.'], 400);
            }

            $halfgroupName = trim($halfgroupData['name']);
            $halfgroupRepository = $this->entityManager->getRepository(HalfGroup::class);
            $existingHalfgroup = $halfgroupRepository->findOneBy(['name' => $halfgroupName]);

            if (!$existingHalfgroup) { // Si le halfgroup n'existe pas alors on le créé
                $halfgroup = new HalfGroup();
                $halfgroup->setName($halfgroupName);
                $this->entityManager->persist($halfgroup);
            } else {
                $halfgroup = $existingHalfgroup; // Si le halfgroup existe déjà alors on l'utilise
            }

            // Si un halfgroup n'est pas associé au groupe, alors on l'ajoute
            
            if (!$group->getHalfGroups()->contains($halfgroup)) {
                $group->addHalfGroup($halfgroup);
            }
        }

        // Ajouter le nouveau groupe dans la BDD

        $this->entityManager->flush();

        //Réponse JSON pour dire que l'ajout du groupe (class) et de ses halfgroups a fonctionné
        return new JsonResponse([
            'message' => 'Groupe ajouté avec succès.',
        ], 201);
        
        // Capture des erreurs et retour d'un message d'erreur avec le statut HTTP 500
        //return new JsonResponse(['error' => 'Erreur lors de l`ajout : ' . $e->getMessage()], 500);
    }
}