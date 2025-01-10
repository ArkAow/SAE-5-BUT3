<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Archive;
use Doctrine\ORM\EntityManagerInterface;

class ArchiveController extends AbstractController
{
    #[Route('archives', name: 'get_archives', methods: ['GET'])]
    public function getArchives(Request $request, EntityManagerInterface $entityManager) : JsonResponse
    {
        // On récupère le JSON encodé à partir du frontend
        $data = json_decode($request->getContent(), true);
        $archiveRepository = $entityManager->getRepository(Archive::class)->findAll();

        //Si le nom de l'archive est vide, on retourne une erreur
        if (!isset($data['name']) || empty(trim($data['name'])))
        {
            return new JsonResponse(['status' => 'Le nom de l\'archive est obligatoire'], Response::HTTP_BAD_REQUEST);
        }
        //Si l'année de l'archive est vide, on retourne une erreur
        if (!isset($data['year']) || empty(trim($data['year'])))
        {
            return new JsonResponse(['status' => 'L\'année de l\'archive est obligatoire'], Response::HTTP_BAD_REQUEST);
        }

        //Si les vérifications sont passées alors on crée l'archive
        $archive = new Archive();
        $archive->setName($data['name']);
        $archive->setData($data['data']);
        $archive->setYear($data['year']);
        

        return new JsonResponse(['status' => 'L\'archive a bien été ajoutée et est maintenant visible dans la liste']);
    }
}
