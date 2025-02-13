<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Department;
use App\Entity\FormationLevel;
use App\Entity\Groups;
use App\Entity\HalfGroup;
use App\Entity\Curriculum;
use PHPUnit\TextUI\XmlConfiguration\Group;

class GroupController extends AbstractController
{
    #[Route('/groups/add/{formationLevelID}', name: 'add_group_to_formationlevel', methods: ['POST'])]
    public function addGroupToFormationLevel(
        int $formationLevelID, 
        Request $request, 
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $formationLevel = $entityManager->getRepository(FormationLevel::class)->find($formationLevelID);

        if (!$formationLevel) {
            return new JsonResponse(['error' => 'FormationLevel introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom du groupe est requis'], 400);
        }

        // Création du groupe
        $group = new Groups();
        $group->setName($data['name']);

        // Association avec le FormationLevel
        $formationLevel->addGroup($group);

        // Sauvegarde en base de données
        $entityManager->persist($group);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Groupe ajouté avec succès',
            'group' => ['id' => $group->getId(), 'name' => $group->getName()]
        ], 201);
    }

    #[Route('/formation-levels/add/{departmentID}', name: 'add_formation_level_to_department', methods: ['POST'])]
    public function addFormationLevelToDepartment(
        int $departmentID, 
        Request $request, 
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $department = $entityManager->getRepository(Department::class)->find($departmentID);

        if (!$department) {
            return new JsonResponse(['error' => 'Department introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom de la formation est requis'], 400);
        }
        if (!isset($data['curriculumId'])) {
            return new JsonResponse(['error' => 'Le choix d’un curriculum est requis'], 400);
        }

        $curriculum = $entityManager->getRepository(Curriculum::class)->find($data['curriculumId']);
        if (!$curriculum) {
            return new JsonResponse(['error' => 'Curriculum introuvable'], 404);
        }

        $formationLevel = new FormationLevel();
        $formationLevel->setName($data['name']);
        $formationLevel->addDepartment($department);
        $formationLevel->addCurriculum($curriculum);

        $entityManager->persist($formationLevel);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'FormationLevel ajouté avec succès',
            'formationLevel' => [
                'id' => $formationLevel->getId(), 
                'name' => $formationLevel->getName(),
                'curriculum' => $curriculum->getName(),
            ]
        ], 201);
    }
    
    #[Route('/formation-levels/delete/{id}', name: 'delete_formation_level', methods: ['DELETE'])]
    public function deleteFormationLevel(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $formationLevel = $entityManager->getRepository(FormationLevel::class)->find($id);

        if (!$formationLevel) {
            return new JsonResponse(['error' => 'FormationLevel introuvable'], 404);
        }

        foreach ($formationLevel->getGroups() as $group) {
            $formationLevel->removeGroup($group);
        }
        foreach ($formationLevel->getCurriculums() as $curriculum) {
            $formationLevel->removeCurriculum($curriculum);
        }
        foreach ($formationLevel->getCourses() as $course) {
            $formationLevel->removeCourse($course);
        }

        $entityManager->remove($formationLevel);
        $entityManager->flush();

        return new JsonResponse(['message' => 'FormationLevel supprimé avec succès'], 200);
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

    #[Route('/groups/add/halfgroup', name: 'add_halfgroup', methods: ['POST'])]
    public function addHalfGroup(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom du halfgroup est obligatoire.'], 400);
        }
        if (!isset($data['group_id']) || empty($data['group_id'])) {
            return new JsonResponse(['error' => 'L\'ID du groupe est obligatoire.'], 400);
        }

        $halfgroupName = trim($data['name']);
        $groupId = $data['group_id'];

        $halfgroupRepository = $entityManager->getRepository(HalfGroup::class);
        $groupRepository = $entityManager->getRepository(Groups::class);

        // Récupération du Group correspondant à l'ID fourni
        $group = $groupRepository->find($groupId);
        if (!$group) {
            return new JsonResponse(['error' => 'Groupe introuvable.'], 404);
        }

        // Récupération du Group correspondant à l'ID fourni
        $group = $groupRepository->find($groupId);
        if (!$group) {
            return new JsonResponse(['error' => 'Groupe introuvable.'], 404);
        }

        // Vérification si le nom du HalfGroup existe déjà parmi les sous-groupes du même groupe
        foreach ($group->getHalfGroups() as $existingSubGroup) {
            if ($existingSubGroup->getName() === $halfgroupName) {
                return new JsonResponse(['error' => 'Un sous-groupe avec ce nom existe déjà dans ce groupe.'], 409);
            }
        }

        // Création du HalfGroup
        $halfgroup = new HalfGroup();
        $halfgroup->setName($halfgroupName);
        $halfgroup->addGroup($group); // Association au groupe

        // Persistance du HalfGroup
        $entityManager->persist($halfgroup);
        $entityManager->flush();

        // Réponse JSON en cas de succès
        return new JsonResponse(['message' => 'HalfGroup ajouté avec succès.'], 201);
    }
}
