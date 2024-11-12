<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;


class FileUploadController extends AbstractController
{
    #[Route('/insertM3C', name: 'insert_m3c', methods: ['POST'])]
    public function uploadFile(Request $request): JsonResponse{
        $file = $request->files->get('file'); //Nous récupérons le fichier

        if (!$file){
            return new JsonResponse(['error' => 'Aucun fichier n\'a été déposé'], Response::HTTP_BAD_REQUEST);
        }
        
        if ($file->getClientOriginalExtension() !== 'xlsx' ||$file->getClientOriginalExtension() !== 'csv'){
            return new JsonResponse(['error' => 'Le fichier doit être au format .xlsx ou .csv'], Response::HTTP_BAD_REQUEST);
        }

        
    }
}