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

    #[Route('/add/group', name: 'add_group', methods: ['POST'])]
    public function addGroup(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom du groupe est obligatoire.'], 400);
        }

        $groupName = trim($data['name']);
        $halfgroupNames = $data['halfgroups'] ?? [];
        $cursusID = $data['cursusID'] ?? null;

        try {
            $groupRepository = $this->entityManager->getRepository(Groups::class);
            $group = $groupRepository->findOneBy(['name' => $groupName]);

            if (!$group) {
                $group = new Groups();
                $group->setName($groupName);

                $this->entityManager->persist($group);
            }

            if ($cursusID) {
                $classRepository = $this->entityManager->getRepository(ClassEntity::class);
                $class = $classRepository->find($cursusID);

                if ($class) {
                    $group->setClass($class);
                } else {
                    return new JsonResponse(['error' => 'Classe introuvable pour l\'ID fourni.'], 400);
                }
            }

            foreach ($halfgroupNames as $halfgroupName) {
                $halfgroupRepository = $this->entityManager->getRepository(HalfGroup::class);
                $existingHalfgroup = $halfgroupRepository->findOneBy(['name' => $halfgroupName]);

                if (!$existingHalfgroup) {
                    $halfgroup = new HalfGroup();
                    $halfgroup->setName($halfgroupName);
                    $this->entityManager->persist($halfgroup);
                } else {
                    $halfgroup = $existingHalfgroup;
                }

                if (!$group->getHalfGroups()->contains($halfgroup)) {
                    $group->addHalfGroup($halfgroup);
                }
            }

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Groupe ajouté avec succès.',
                'group' => [
                    'id' => $group->getId(),
                    'name' => $group->getName(),
                    'classes' => $group->getClasses()->map(fn($class) => ['id' => $class->getId(), 'name' => $class->getName()])->toArray(),
                    'halfGroups' => $group->getHalfGroups()->map(fn($halfgroup) => $halfgroup->getName())->toArray(),
                ],
            ]);            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de l’ajout : ' . $e->getMessage()], 500);
        }
    }

    #[Route('/groups', name: 'get_groups', methods: ['GET'])]
    public function getGroups(): JsonResponse
    {
        $groupRepository = $this->entityManager->getRepository(Groups::class);
        $groups = $groupRepository->findAll();

        return new JsonResponse([
            'groups' => array_map(fn($group) => [
                'id' => $group->getId(),
                'name' => $group->getName(),
                'classes' => $group->getClasses()->map(fn($class) => ['id' => $class->getId(), 'name' => $class->getName()])->toArray(),
                'halfGroups' => $group->getHalfGroups()->map(fn($halfgroup) => $halfgroup->getName())->toArray(),
            ], $groups),
        ]);
    }
}