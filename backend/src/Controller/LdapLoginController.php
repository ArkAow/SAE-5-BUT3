<?php

namespace App\Controller;

use Symfony\Component\Ldap\Ldap;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
USE Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class LdapLoginController extends AbstractController
{
#[Route('/ldap/login', name: 'ldap_login', methods: ['POST', 'OPTIONS'])]
public function login(Request $request): JsonResponse
    {
    // Gérer les requêtes OPTIONS pour CORS
    if ($request->getMethod() === 'OPTIONS') {
        return new JsonResponse(null, 204, [
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
            'Access-Control-Allow-Methods' => 'POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
            'Access-Control-Max-Age' => '3600',
        ]);
    }

    // Récupérer les données JSON envoyées
    $data = json_decode($request->getContent(), true);

    // Vérifier si les données JSON sont valides
    if (json_last_error() !== JSON_ERROR_NONE) {
        return new JsonResponse([
            'success' => false,
            'message' => 'Invalid JSON data',
        ], 400, [
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
        ]);
    }

    // Vérifier si les champs username et password sont présents
    if (!isset($data['username']) || !isset($data['password'])) {
        return new JsonResponse([
            'success' => false,
            'message' => 'Invalid request, missing username or password',
        ], 400, [
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
        ]);
    }

    $username = $data['username'];
    $password = $data['password'];

    // Vérifier si l'utilisateur est le compte root
    if ($username === 'root' && $password === 'admin') {
        return new JsonResponse([
            'success' => true,
            'message' => 'Authentication successful (root account)',
            'data' => [
                [
                    'givenName' => 'admin', // Prénom
                    'sn' => 'root',         // Nom
                    'mail' => null,         // Adresse mail
                ],
            ],
        ], 200, [
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
        ]);
    }

    try {
        // Création de la connexion LDAP
        $ldap = Ldap::create('ext_ldap', [
            'host' => 'ldap.unilim.fr',
            'encryption' => 'none',
            'port' => 389,
            'options' => [
                'protocol_version' => 3,
                'referrals' => false,
            ],
        ]);

        // Bind (authentification avec les credentials de l'utilisateur)
        $bindDn = sprintf('uid=%s,ou=people,dc=unilim,dc=fr', $username); // DN formaté
        $ldap->bind($bindDn, $password);

        // Exécution de la requête LDAP
        $query = $ldap->query('dc=unilim,dc=fr', sprintf('(&(objectClass=person)(uid=%s))', $username));
        $result = $query->execute();

        // Extraction des données nécessaires
        $data = [];
        foreach ($result as $entry) {
            $attributes = $entry->getAttributes();
            $data[] = [
                'givenName' => $attributes['givenName'][0] ?? null, // Extraction de givenName
                'sn' => $attributes['sn'][0] ?? null,              // Extraction de sn
                'mail' => $attributes['mail'][0] ?? null,          // Extraction de mail
            ];
        }

        // Retourne les données LDAP en JSON
        return new JsonResponse([
            'success' => true,
            'message' => 'Authentication successful',
            'data' => $data,
        ], 200, [
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
        ]);
    } catch (\Exception $e) {
        // Gestion des erreurs (échec de l'authentification, etc.)
        return new JsonResponse([
            'success' => false,
            'message' => 'Authentication failed',
            'error' => $e->getMessage(),
        ], 401, [
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
        ]);
    }
}
}