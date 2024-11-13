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
        $sections = $this->extractSections($worksheet);

        return new JsonResponse(['sections' => $sections]);
    }

    private function extractSections($worksheet)
    {
        $sections = [];
        $currentSection = [];
        $isSectionActive = false;

        foreach ($worksheet->getRowIterator() as $row) {
            $rowIndex = $row->getRowIndex();
            $intitule = $worksheet->getCell('B' . $rowIndex)->getValue();

            if ($this->isStartOfSection($intitule)) {
                if ($isSectionActive && !empty($currentSection)) {
                    $sections[] = $currentSection;
                }
                $currentSection = [];
                $isSectionActive = true;
            }

            if ($isSectionActive && $this->isEndOfSection($intitule)) {
                $currentSection[] = $this->getRowData($worksheet, $rowIndex);
                $sections[] = $currentSection;
                $isSectionActive = false;
                continue;
            }

            if ($isSectionActive && $this->isRowUseful($intitule)) {
                $currentSection[] = $this->getRowData($worksheet, $rowIndex);
            }
        }

        if ($isSectionActive && !empty($currentSection)) {
            $sections[] = $currentSection;
        }

        return $sections;
    }

    private function getRowData($worksheet, $rowIndex)
    {
        return [
            'intitule' => $worksheet->getCell('B' . $rowIndex)->getValue(),
            'code_apogee' => $worksheet->getCell('C' . $rowIndex)->getValue(),
            'CM' => $worksheet->getCell('E' . $rowIndex)->getValue(),
            'TD' => $worksheet->getCell('F' . $rowIndex)->getValue(),
            'TP' => $worksheet->getCell('G' . $rowIndex)->getValue(),
            'heures_projet' => $worksheet->getCell('H' . $rowIndex)->getValue(),
            'total' => $worksheet->getCell('I' . $rowIndex)->getCalculatedValue(),
        ];
    }

    private function isStartOfSection($intitule)
    {
        return strpos($intitule, 'SAE') === 0;
    }

    private function isEndOfSection($intitule)
    {
        return preg_match('/^R\d+\.\d+$/', $intitule);
    }

    private function isRowUseful($intitule)
    {
        $projectKeyword = "SAE";
        return preg_match("/^($projectKeyword.[1-6]|R[1-6])/", $intitule) || in_array($intitule, ['Stage', 'Portfolio']);        
    }
}
