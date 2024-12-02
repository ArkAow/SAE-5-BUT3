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
        // On récupère le JSON donner à partir du Frontend
        $data = json_decode($request->getContent(), true);

        // Si aucun nom  de groupe n'est donné alors on renvoi une erreur
        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom du groupe est obligatoire.'], 400);
        }

        $groupName = trim($data['name']); //Nom du groupe à ajouter
        $halfgroupsData = $data['halfgroups'] ?? []; // Tous les half_groups en lien avec le groupe ajouté
        $classID = $data['classID'] ?? null; //ID de la classe qui est en lien avec le groupe ajouté

        try {
            // Récupération du groupe existant par son nom ou création d'un nouveau groupe
            $groupRepository = $this->entityManager->getRepository(Groups::class);
            $group = $groupRepository->findOneBy(['name' => $groupName]);

            //Si le groupe n'existe pas alors on peut le créer
            if (!$group) { 
                $group = new Groups();
                $group->setName($groupName);

                $this->entityManager->persist($group);
            }

            // Si un ID de classe est fourni, on tente de l'associer au groupe
            if ($classID) {
                $classRepository = $this->entityManager->getRepository(ClassEntity::class);
                $class = $classRepository->find($classID);

                if ($class) { // Si la classe existe
                    $group->addClass($class); // Ajout de la classe au groupe
                } else {
                    // Retourne une erreur si la classe est introuvable
                    return new JsonResponse(['error' => 'Classe introuvable pour l\'ID fourni.'], 400);
                }
            }

            foreach ($halfgroupsData as $halfgroupData) {
                // Si halfGroup n'a pas de nom alors on renvoi une erreur ou si celuki-ci n'est pas bon
                if (!isset($halfgroupData['name']) || empty(trim($halfgroupData['name']))) {
                    return new JsonResponse(['error' => 'Chaque halfgroup doit avoir un nom valide.'], 400);
                }

                $halfgroupName = trim($halfgroupData['name']);
                $halfgroupRepository = $this->entityManager->getRepository(HalfGroup::class);
                $existingHalfgroup = $halfgroupRepository->findOneBy(['name' => $halfgroupName]);

                if (!$existingHalfgroup) { // Si le halfgroup n'existe pas alors on le crée
                    $halfgroup = new HalfGroup();
                    $halfgroup->setName($halfgroupName);
                    $this->entityManager->persist($halfgroup);
                } else {
                    $halfgroup = $existingHalfgroup; // Si le halfgroup existe déjà alors on l'utilise
                }

                // Si le halfgroup donné n'est pas déjà associé au groupe, alors on l'ajoute
                if (!$group->getHalfGroups()->contains($halfgroup)) {
                    $group->addHalfGroup($halfgroup);
                }
            }

            // "Push" le nouveau group dans la BDD
            $this->entityManager->flush();

            // On retourne un réponse JSON pour dire que l'ajout du groupe (halfgroups, class, ...) a fonctionné
            return new JsonResponse([
                'message' => 'Groupe ajouté avec succès.',
            ], 201);
        } catch (\Exception $e) {
            // Capture des erreurs et retour d'un message d'erreur avec le statut HTTP 500
            return new JsonResponse(['error' => 'Erreur lors de l`ajout : ' . $e->getMessage()], 500);
        }
    }
}