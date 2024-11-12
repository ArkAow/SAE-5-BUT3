<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileUploadController extends AbstractController
{
    #[Route('/insertM3C', name: 'insert_m3c', methods: ['POST'])]
    public function uploadFile(Request $request): JsonResponse
    {
        $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier n\'a été envoyé.'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($file->getClientOriginalExtension(), ['xlsx', 'xls', 'csv'])) {
            return new JsonResponse(['error' => 'Le fichier doit être au format .xlsx, .xls ou .csv'], Response::HTTP_BAD_REQUEST);
        }

        $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads';

        try {
            $fileName = 'M3C_' . uniqid() . '.' . $file->guessExtension();
            $file->move($uploadsDirectory, $fileName);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Erreur lors du téléchargement du fichier.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['success' => 'Fichier téléchargé avec succès.', 'filePath' => '/uploads/' . $fileName]);
    }
}
