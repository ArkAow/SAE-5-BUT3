<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Groups;
use App\Entity\HalfGroup;

class GroupHalfGroupController extends AbstractController
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

    #[Route('/delete/group/{id}', name: 'delete_group', methods: ['DELETE'])]
    public function deleteGroups(EntityManagerInterface $em, string $id) : JsonResponse
    {
        $groupRepository = $em->getRepository(Groups::class);
        $group = $groupRepository->findOneBy(['id' => $id]);

        if (!$group){
            return new JsonResponse(['error' => 'Groupe introuvable', 404]);
        }else {
            $em->remove($group);
            $em->flush();
        }

        return new JsonResponse(['status' => 'Groupe supprimé avec succès'], 200);
    }

    #[Route('/delete/halfgroup/{id}', name: 'delete_halfgroup', methods: ['DELETE'])]
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
