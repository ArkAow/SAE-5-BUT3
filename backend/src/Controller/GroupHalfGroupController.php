<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Groups;

class GroupHalfGroupController extends AbstractController
{
    // Route pour obtenir tous les groupes avec leurs demi-groupes
    #[Route('groups', name:"get_all_groups", methods:['GET'])]
    public function getAllgroups(EntityManagerInterface $entityManager): JsonResponse
    {
        // GroupRepository permet la recherche de tous les groupes disponibles dans la BDD  
        $groupsRepository = $entityManager->getRepository(Groups::class);
        $groups = $groupsRepository->findAll();

        // Si aucun groupe n'existe ou n'est trouvé alors on retourne une erreur HTTP 404
        if (!$groups) {
            return new JsonResponse(['error' => 'Aucun groupe trouvé.'], 404);
        }

        // On construit les données avec les demi-groupes
        $data = array_map(function ($group) use ($entityManager) {
            return [
                'id' => $group->getId(),
                'name' => $group->getName(),
                //Tous les demi-groupes associés à chaque groupe dans la réponse
                'subGroups' => $this->getHalfGroups_of_a_Groups($group),
            ];
        }, $groups);

        // On retourne le tableau avec les groupes et leurs demi-groupes en format JSON
        return new JsonResponse($data, 200);
    }

    // Méthode pour obtenir les demi-groupes d'un groupe spécifique
    private function getHalfGroups_of_a_Groups(Groups $group): array
    {
        // On récupère les demi-groupes associés au groupe (Fonction définie dans l'entité Groups)
        $halfGroups = $group->getHalfGroups();

        // On retourne les demi-groupes sous forme de tableau
        return array_map(function ($halfGroup) {
            return [
                'id' => $halfGroup->getId(),
                'name' => $halfGroup->getName(),
            ];
        }, $halfGroups->toArray());
    }

    //Route pour obtenir un demi-groupe d'un groupe spécifique
    #[Route('groups/{id}/half_group', name:"get_halfgroup_of_a_group", methods:['GET'])]
    public function getHalfGroup(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        //GroupRepository permet la recherche d'un groupe spécifique dans la BDD
        $groupRepository = $entityManager->getRepository(Groups::class);
        $group = $groupRepository->find($id);

        //Si le groupe n'existe pas, on retourne une erreur 404
        if (!$group) {
            return new JsonResponse(['error' => 'Groupe introuvable ou inexistant.'], 404);
        }

        //On récupère les demi-groupes du groupe spécifique
        $halfGroups = $group->getHalfGroups();

        //On retourne les demi-groupes sous forme de tableau
        $data = array_map(function ($halfGroup){
            return [
                'id' => $halfGroup->getId(),
                'name' => $halfGroup->getName(),
            ];
        }, $halfGroups->toArray());

        //On retourne le tableau avec les demi-groupes en format JSON
        return new JsonResponse($data, 200);
    }
}