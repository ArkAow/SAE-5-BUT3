<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;  
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Department;

class UserController extends AbstractController
{
    #[Route("/users", name:"get_user", methods:["GET"])]
    public function getUsers(EntityManagerInterface $entityManager): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $users = $userRepository->findAll();

        $data = array_map(function($user)
        {
            return [
                'id' => $user->getID(),
                'identifiant' => $user->getIdentifiant(),
                'role' => $user->getRole()
            ];
        }, $users);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route("users/{id}/role", name:"set_role", methods:["PUT"])]
    public function setRole(EntityManagerInterface $entityManager, int $id, Request $request): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($id);

        if (!$user)
        {
            return new JsonResponse(['error' => 'Ustilisateur n\'existe pas ou n\'est pas trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!in_array($data['role'], User::ROLES, true)) {
            return new JsonResponse(['error' => 'Rôle invalide. Rôles possibles : ' . implode(', ', User::ROLES)], Response::HTTP_BAD_REQUEST);
        }

        $user->setRole($data['role']);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Rôle mis à jour avec succès',
            'user' => [
                'id' => $user->getId(),
                'identifiant' => $user->getIdentifiant(),
                'role' => $user->getRole(),
            ]
        ], Response::HTTP_OK);
    }

    #[Route("/users/{id}/department", name:"get_department_for_a_user", methods:['GET'])]
    public function getDepartmentForAUser(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($id);

        if (!$user)
        {
            return new JsonResponse(['error' => "L\'utilisateur n\'existe pas ou n\' pas été trouvé"], Response::HTTP_NOT_FOUND);
        }

        $departments = $user->getDepartments();
        $data = [];

        foreach ($departments as $department)
        {
            $data[] = [
                'id' => $department->getId(),
                'name' => $department->getName()
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route("user/{id}/department/{departmentId}", name:"add_department_to_user", methods:['POST'])]
    public function addDepartmentForAUser(EntityManagerInterface $entityManager, int $id, int $departmentId): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($id);

        if (!$user)
        {
            return new JsonResponse(['error' => "L\'utilisateur n\'existe pas ou n\' pas été trouvé"], Response::HTTP_NOT_FOUND);
        }

        $departmentRepository = $entityManager->getRepository(Department::class);
        $department = $departmentRepository->find($departmentId);

        if (!$department)
        {
            return new JsonResponse(['error' => "Le département n\'existe pas ou n\' pas été trouvé"], Response::HTTP_NOT_FOUND);
        }

        if ($user->getDepartments()->contains($department))
        {
            return new JsonResponse(['error' => "Le département est déjà associé à l\'utilisateur"], Response::HTTP_BAD_REQUEST);
        }

        $user->addDepartment($department);
        $entityManager->flush();

        return new JsonResponse(['message' => "Département ajouté à l\'utilisateur avec succès"], Response::HTTP_OK);
    }

    #[Route("user/{id}/department/{departmentId}", name:"modify_department_from_user", methods:['PUT'])]
    public function modifyDepartmentForAUser(EntityManagerInterface $entityManager, int $id, int $departmentId): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($id);

        if (!$user)
        {
            return new JsonResponse(['error' => "L\'utilisateur n\'existe pas ou n\' pas été trouvé"], Response::HTTP_NOT_FOUND);
        }

        $departmentRepository = $entityManager->getRepository(Department::class);
        $department = $departmentRepository->find($departmentId);

        if (!$department)
        {
            return new JsonResponse(['error' => "Le département n\'existe pas ou n\' pas été trouvé"], Response::HTTP_NOT_FOUND);
        }

        if (!$user->getDepartments()->contains($department))
        {
            return new JsonResponse(['error' => "Le département n\'est pas associé à l\'utilisateur"], Response::HTTP_BAD_REQUEST);
        }

        $user->removeDepartment($department);
        $entityManager->flush();

        return new JsonResponse(['message' => "Département retiré de l\'utilisateur avec succès"], Response::HTTP_OK);
    }
}