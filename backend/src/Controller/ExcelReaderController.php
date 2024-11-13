<?php

namespace App\Controller;

use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ExcelReaderController extends AbstractController
{
    #[Route('/read-excel/{id}', name: 'read_excel', methods: ['GET'])]
    public function readExcel(string $id): JsonResponse
    {
        $filePath = $this->getParameter('kernel.project_dir') . "/public/uploads/M3C_{$id}.xlsx";

        if (!file_exists($filePath)) {
            return new JsonResponse(['error' => "Le fichier M3C_{$id}.xlsx n'existe pas."], Response::HTTP_NOT_FOUND);
        }

        $spreadsheet = IOFactory::load($filePath);
        $worksheet = $spreadsheet->getActiveSheet();                    

        $data = [];
        foreach ($worksheet->getRowIterator(10, 26) as $row) {
            $rowData = [
                'intitule' => $worksheet->getCell('B' . $row->getRowIndex())->getValue(),
                'code_apogee' => $worksheet->getCell('C' . $row->getRowIndex())->getValue(),
                'CM' => $worksheet->getCell('E' . $row->getRowIndex())->getValue(),
                'TD' => $worksheet->getCell('F' . $row->getRowIndex())->getValue(),
                'TP' => $worksheet->getCell('G' . $row->getRowIndex())->getValue(),
                'heures_projet' => $worksheet->getCell('H' . $row->getRowIndex())->getValue(),
                'total' => $worksheet->getCell('I' . $row->getRowIndex())->getCalculatedValue(),
            ];
            $data[] = $rowData;
        }

        $data2 = [];
        foreach ($worksheet->getRowIterator(62, 76) as $row) {
            $rowData = [
                'intitule' => $worksheet->getCell('B' . $row->getRowIndex())->getValue(),
                'code_apogee' => $worksheet->getCell('C' . $row->getRowIndex())->getValue(),
                'CM' => $worksheet->getCell('E' . $row->getRowIndex())->getValue(),
                'TD' => $worksheet->getCell('F' . $row->getRowIndex())->getValue(),
                'TP' => $worksheet->getCell('G' . $row->getRowIndex())->getValue(),
                'heures_projet' => $worksheet->getCell('H' . $row->getRowIndex())->getValue(),
                'total' => $worksheet->getCell('I' . $row->getRowIndex())->getCalculatedValue(),
            ];
            $data2[] = $rowData;
        }

        return new JsonResponse(['data' => $data, 'data2' => $data2]);
    }
}
