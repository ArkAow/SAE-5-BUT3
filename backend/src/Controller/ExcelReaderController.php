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
        $sheetNames = $spreadsheet->getSheetNames();
        $allSections = [];

        foreach ($sheetNames as $sheetName) {
            $worksheet = $spreadsheet->getSheetByName($sheetName);
            if ($worksheet) {
                $sections = $this->extractSections($worksheet);
                if (!empty($sections)) {
                    $allSections[$sheetName] = $sections;
                }
            }
        }

        return new JsonResponse(['sheets' => $allSections]);
    }

    private function extractSections($worksheet)
    {
        $sections = [];
        foreach ($worksheet->getRowIterator() as $row) {
            $rowIndex = $row->getRowIndex();
            $intitule = $this->getCellValue($worksheet, 'B', $rowIndex);

            if (!$this->isValidIntitule($intitule)) {
                continue;
            }

            $sections[] = $this->getRowData($worksheet, $rowIndex);
        }
        return $sections;
    }

    private function getRowData($worksheet, $rowIndex)
    {
        return [
            'intitule' => $this->getCellValue($worksheet, 'B', $rowIndex),
            'code_apogee' => $this->getCellValue($worksheet, 'C', $rowIndex),
            'CM' => $this->convertToInt($this->getCellValue($worksheet, 'E', $rowIndex)),
            'TD' => $this->convertToInt($this->getCellValue($worksheet, 'F', $rowIndex)),
            'TP' => $this->convertToInt($this->getCellValue($worksheet, 'G', $rowIndex)),
            'heures_projet' => $this->convertToInt($this->getCellValue($worksheet, 'H', $rowIndex)),
            'total' => $this->convertToInt($this->getCellCalculatedValue($worksheet, 'I', $rowIndex)),
        ];
    }

    private function getCellValue($worksheet, $column, $rowIndex)
    {
        $cell = $worksheet->getCell("{$column}{$rowIndex}");
        return $cell ? trim((string) $cell->getValue()) : null;
    }

    private function getCellCalculatedValue($worksheet, $column, $rowIndex)
    {
        $cell = $worksheet->getCell("{$column}{$rowIndex}");
        return $cell ? $cell->getCalculatedValue() : null;
    }

    private function convertToInt($value)
    {
        return is_numeric($value) ? (int)$value : 0;
    }

    private function isValidIntitule($intitule)
    {
        if (empty($intitule)) {
            return false;
        }

        $intitule = trim($intitule);

        return preg_match('/^(SAÉ\s\d+\.\d{2}\s.+|SAE\s\d+\.\d{2}\s.+|R\d+\.\d{2}\s.+|Portfolio)$/i', $intitule);
    }
}
