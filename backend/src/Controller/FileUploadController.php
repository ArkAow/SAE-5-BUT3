<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileUploadController extends AbstractController
{
    #[Route('/insertM3C', name: 'insert_m3c', methods: ['POST'])]
    public function uploadFile(Request $request, DatasInsertController $datasInsertController): JsonResponse
    {
        $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['success' => false, 'error' => 'Aucun fichier n\'a été envoyé.'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($file->getClientOriginalExtension(), ['xlsx', 'xls', 'csv'])) {
            return new JsonResponse(['success' => false, 'error' => 'Le fichier doit être au format .xlsx, .xls ou .csv'], Response::HTTP_BAD_REQUEST);
        }

        $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads';

        try {
            $id = uniqid();
            $fileName = 'M3C_' . $id . '.' . $file->guessExtension();
            $filePath = $uploadsDirectory . '/' . $fileName;
            $file->move($uploadsDirectory, $fileName);

            $response = $datasInsertController->insertData($id);
            if ($response->getStatusCode() === Response::HTTP_OK) {
                return new JsonResponse(['success' => true, 'message' => 'Fichier uploadé et données insérées avec succès.']);
            }

            return $response;
        } catch (FileException $e) {
            return new JsonResponse(['success' => false, 'error' => 'Erreur lors du téléchargement du fichier.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return new JsonResponse(['success' => false, 'error' => 'Erreur lors de l\'insertion : ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
