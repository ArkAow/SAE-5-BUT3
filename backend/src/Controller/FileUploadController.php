<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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
            return new JsonResponse(['success' => false, 'error' => 'Aucun fichier n\'a été envoyé.'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $allowedExtensions = ['xlsx', 'xls', 'csv'];
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, $allowedExtensions)) {
            return new JsonResponse(['success' => false, 'error' => 'Le fichier doit être au format .xlsx, .xls ou .csv.'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads';
        if (!is_dir($uploadsDirectory)) {
            mkdir($uploadsDirectory, 0777, true);
        }

        try {
            $fileId = uniqid();
            $fileName = $fileId . '.' . $extension;
            $filePath = $uploadsDirectory . '/' . $fileName;

            $file->move($uploadsDirectory, $fileName);

            return new JsonResponse([
                'success' => true,
                'message' => 'Fichier uploadé avec succès.',
                'fileId' => $fileId,
            ]);
        } catch (FileException $e) {
            return new JsonResponse(['success' => false, 'error' => 'Erreur lors du téléchargement du fichier.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return new JsonResponse(['success' => false, 'error' => 'Erreur interne.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}