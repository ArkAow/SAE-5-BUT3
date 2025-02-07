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
    #[Route("/users", name:"get_users", methods:["GET"])]
    public function getUsers(EntityManagerInterface $entityManager): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $users = $userRepository->findAll();

        $data = array_map(function($user)
        {
            return [
                'id' => $user->getID(),
                'fullname' => $user->getFullname(),
                'email' => $user->getEmail(),
                'role' => $user->getRole(),
                'departments' => $user->getDepartments()
            ];
        }, $users);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/users/add', name: 'add_users', methods: ['POST'])]
    public function addUser(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['fullname'], $data['email'], $data['role'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }
        $user = new User();
        $user->setFullname($data['fullname']);
        $user->setEmail($data['email']);
        $user->setRole($data['role']);
        if (isset($data['departments']) && is_array($data['departments'])) {
            $departmentRepository = $entityManager->getRepository(Department::class);
            foreach ($data['departments'] as $deptId) {
                $department = $departmentRepository->find($deptId);
                if ($department) {
                    $user->addDepartment($department);
                }
            }
        }
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur ajouté avec succès', 'id' => $user->getId()], 201);
    }

    #[Route('/users/update', name: 'update_users', methods: ['PUT'])]
    public function updateUser(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) {
            return new JsonResponse(['error' => 'ID utilisateur manquant'], 400);
        }
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }
        if (isset($data['fullname'])) {
            $user->setFullname($data['fullname']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['role'])) {
            try {
                $user->setRole($data['role']);
            } catch (\InvalidArgumentException $e) {
                return new JsonResponse(['error' => $e->getMessage()], 400);
            }
        }

        if (isset($data['departments']) && is_array($data['departments'])) {
            $departmentRepository = $entityManager->getRepository(Department::class);
            $user->getDepartments()->clear(); // Supprime tous les départements existants

            foreach ($data['departments'] as $deptId) {
                $department = $departmentRepository->find($deptId);
                if ($department) {
                    $user->addDepartment($department);
                }
            }
        }
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès']);
    }

    #[Route('/users/delete/{id}', name: 'delete_users', methods: ['DELETE'])]
    public function deleteUser(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }
        $entityManager->remove($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur supprimé avec succès']);
    }

}