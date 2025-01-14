<?php

namespace App\Controller;

use Symfony\Component\Ldap\Ldap;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LdapLoginController extends AbstractController
{
    #[Route('/ldap/login', name: 'ldap_login', methods: ['POST'])]
    public function login(Request $request)
    {
        // Récupérer les informations de connexion depuis la requête (si besoin)
        $username = $request->get('username', 'abdellougenes1'); // Exemple par défaut
        $password = $request->get('password', 'votre_mot_de_passe'); // Exemple par défaut

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
                    'sn' => $attributes['sn'][0] ?? null,                  // Extraction de sn
                    'mail' => $attributes['mail'][0] ?? null,              // Extraction de mail
                ];
            }

            // Retourne les données LDAP en JSON
            return $this->json([
                'success' => true,
                'message' => 'Authentication successful',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            // Gestion des erreurs (échec de l'authentification, etc.)
            return $this->json([
                'success' => false,
                'message' => 'Authentication failed',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
