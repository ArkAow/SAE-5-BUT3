<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Veuillez remplir tous les champs.'], 400);
        }

        // Vérifiez si l'utilisateur existe
        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user || $user->getPassword() !== $password) {
            return new JsonResponse(['error' => 'Email ou mot de passe incorrect.'], 401);
        }

        return new JsonResponse(['message' => 'Connexion réussie !'], 200);
    }
}
