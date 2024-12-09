<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ClassEntity;
use App\Entity\Groups;
use App\Entity\HalfGroup;
use PHPUnit\TextUI\XmlConfiguration\Group;

class GroupController extends AbstractController
{
    #[Route('groups/{promoID}', name: "get_all_groups_by_promo", methods: ['GET'])]
    public function getAllGroupsByPromo(int $promoID, EntityManagerInterface $entityManager): JsonResponse
    {
        // Recherche des groupes via la relation avec les classes liées à une promotion donnée
        $groupsRepository = $entityManager->getRepository(Groups::class);
        $groups = $groupsRepository->createQueryBuilder('g')
            ->join('g.classes', 'c')
            ->where('c.id = :promoID')
            ->setParameter('promoID', $promoID)
            ->getQuery()
            ->getResult();

        if (!$groups) {
            return new JsonResponse(['error' => 'Aucun groupe trouvé pour cette promotion.'], 404);
        }

        // Construire la réponse avec les sous-groupes
        $data = array_map(function ($group) {
            return [
                'id' => $group->getId(),
                'name' => $group->getName(),
                'subGroups' => array_map(function ($subGroup) {
                    return [
                        'id' => $subGroup->getId(),
                        'name' => $subGroup->getName(),
                    ];
                }, $group->getHalfGroups()->toArray()), // Obtenir les sous-groupes
            ];
        }, $groups);

        return new JsonResponse($data, 200);
    }

    #[Route('groups/{id}/half_group', name: "get_halfgroup_of_a_group", methods: ['GET'])]
    public function getHalfGroup(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $groupRepository = $entityManager->getRepository(Groups::class);
        $group = $groupRepository->find($id);

        if (!$group) {
            return new JsonResponse(['error' => 'Groupe introuvable ou inexistant.'], 404);
        }

        $halfGroups = $group->getHalfGroups();

        $data = array_map(function ($halfGroup) {
            return [
                'id' => $halfGroup->getId(),
                'name' => $halfGroup->getName(),
            ];
        }, $halfGroups->toArray());

        return new JsonResponse($data, 200);
    }

    #[Route('groups/add', name: 'add_group', methods: ['POST'])]
    public function addGroup(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // On récupère le JSON donné à partir du Frontend
        $data = json_decode($request->getContent(), true);
        $groupRepository = $entityManager->getRepository(Groups::class);

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

        $group = $groupRepository->findOneBy(['name' => $groupName]);
        if ($group){
            return new JsonResponse(['error' => 'Groupe déjà existant'], 404);
        }

        // On créé le nouveau groupe.  
        $group = new Groups();
        $group->setName($groupName);
        $entityManager->persist($group);
        // Récupération de l'id de la promotion
    
        $classRepository = $entityManager->getRepository(ClassEntity::class);
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
            $halfgroupRepository = $entityManager->getRepository(HalfGroup::class);
            $existingHalfgroup = $halfgroupRepository->findOneBy(['name' => $halfgroupName]);

            if (!$existingHalfgroup) { // Si le halfgroup n'existe pas alors on le créé
                $halfgroup = new HalfGroup();
                $halfgroup->setName($halfgroupName);
                $entityManager->persist($halfgroup);
            } else {
                $halfgroup = $existingHalfgroup; // Si le halfgroup existe déjà alors on l'utilise
            }
            // Si un halfgroup n'est pas associé au groupe, alors on l'ajoute
            if (!$group->getHalfGroups()->contains($halfgroup)) {
                $group->addHalfGroup($halfgroup);
            }
        }

        // Ajouter le nouveau groupe dans la BDD
        $entityManager->flush();

        //Réponse JSON pour dire que l'ajout du groupe (class) et de ses halfgroups a fonctionné
        return new JsonResponse([
            'message' => 'Groupe ajouté avec succès.',
        ], 201);
        // Capture des erreurs et retour d'un message d'erreur avec le statut HTTP 500
        //$return new JsonResponse(['error' => 'Erreur lors de l`ajout : ' . $e->getMessage()], 500);
    }

    #[Route('/groups/delete/{id}', name: 'delete_group', methods: ['DELETE'])]
    public function deleteGroups(EntityManagerInterface $em, string $id): JsonResponse
    {
        $groupRepository = $em->getRepository(Groups::class);
        $group = $groupRepository->findOneBy(['id' => $id]);

        if (!$group) {
            return new JsonResponse(['error' => 'Groupe introuvable'], 409);
        }

        $halfgroupRepository = $em->getRepository(HalfGroup::class);
        $halfGroups = $halfgroupRepository->createQueryBuilder('h')
            ->where(':group MEMBER OF h.groups')
            ->setParameter('group', $group)
            ->getQuery()
            ->getResult();

        foreach ($halfGroups as $halfGroup) {
            $em->remove($halfGroup);
        }

        $em->remove($group);
        $em->flush();

        return new JsonResponse(['status' => 'Groupe et ses HalfGroup supprimés avec succès'], 200);
    }

    #[Route('/groups/delete/halfgroup/{id}', name: 'delete_halfgroup', methods: ['DELETE'])]
    public function deletehalfGroup(EntityManagerInterface $entityManager, string $id) : JsonResponse
    {
        $halfgroupRepository = $entityManager->getRepository(HalfGroup::class);
        $halfgroup = $halfgroupRepository->findOneBy(['id' => $id]);

        if (!$halfgroup) {
            return new JsonResponse(['error' => 'Erreur HalfGroup introuvable'], 404);
        }else {
            $entityManager->remove($halfgroup);
            $entityManager->flush();
        }
        return new JsonResponse(['status' => 'HalfGroup supprimé avec succès'], 200);
    }
}
