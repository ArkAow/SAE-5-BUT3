<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;  
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;

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
}