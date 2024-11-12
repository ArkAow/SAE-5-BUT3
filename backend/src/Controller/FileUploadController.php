<?php

namespace App\Controller;

use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileUploadController extends AbstractController
{
    #[Route('/insertM3C', name: 'insert_m3c', methods: ['POST'])]
    public function uploadFile(Request $request): JsonResponse
    {
        $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier n\'a été envoyé.']);
        }

        $allowedExtensions = ['xlsx', 'csv'];
        $fileExtension = $file->getClientOriginalExtension();

        if (!in_array($fileExtension, $allowedExtensions)) {
            return new JsonResponse(['error' => 'Le fichier doit être au format .xlsx ou .csv']);
        }

        $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads';

        try {
            $newFileName = 'fichier_' . uniqid() . '.' . $fileExtension;
            $file->move($uploadsDirectory, $newFileName);
            $filePath = $uploadsDirectory . '/' . $newFileName;

            $data = $this->readFileContent($filePath, $fileExtension);

            unlink($filePath);

            return new JsonResponse(['success' => true, 'data' => $data]);

        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Erreur lors du téléchargement du fichier.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function readFileContent(string $filePath, string $fileExtension): array
    {
        $data = [];

        if ($fileExtension === 'csv') {
            if (($handle = fopen($filePath, 'r')) !== false) {
                while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                    $data[] = $row;
                }
                fclose($handle);
            }
        } else {
            $spreadsheet = IOFactory::load($filePath);
            $worksheet = $spreadsheet->getActiveSheet();

            foreach ($worksheet->getRowIterator() as $row) {
                $rowData = [];
                foreach ($row->getCellIterator() as $cell) {
                    $rowData[] = $cell->getValue();
                }
                $data[] = $rowData;
            }
        }

        return $data;
    }
}
