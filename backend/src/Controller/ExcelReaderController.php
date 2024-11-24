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
                $structuredSections = $this->extractStructuredSections($worksheet);
                if (!empty($structuredSections)) {
                    $allSections[$sheetName] = $structuredSections;
                }
            }
        }

        return new JsonResponse(['sheets' => $allSections]);
    }

    private function extractStructuredSections($worksheet)
    {
        $structuredSections = [];
        $currentBut = null;
        $currentSemester = null;

        foreach ($worksheet->getRowIterator() as $row) {
            $rowIndex = $row->getRowIndex();
            $columnA = $this->getCellValue($worksheet, 'A', $rowIndex);

            // Détecter les lignes "BUT X - XXXXX"
            if ($this->isButLine($columnA)) {
                $currentBut = $columnA;
                if (!isset($structuredSections[$currentBut])) {
                    $structuredSections[$currentBut] = [];
                }
                $currentSemester = null; // Réinitialiser le semestre
            }
            // Détecter les lignes "SEMESTRE X"
            elseif ($this->isSemesterLine($columnA)) {
                $currentSemester = $columnA;
                if ($currentBut && !isset($structuredSections[$currentBut][$currentSemester])) {
                    $structuredSections[$currentBut][$currentSemester] = [];
                }
            }
            // Ajouter les données pour les lignes valides
            elseif ($this->isValidRow($worksheet, $rowIndex)) {
                $rowData = $this->getRowData($worksheet, $rowIndex);
                if ($currentBut && $currentSemester) {
                    $structuredSections[$currentBut][$currentSemester][] = $rowData;
                }
            }
        }

        return $structuredSections;
    }

    private function getRowData($worksheet, $rowIndex)
    {
        return [
            'intitule' => $this->getCellValue($worksheet, 'B', $rowIndex),
            'code_apogee' => $this->getCellValue($worksheet, 'C', $rowIndex),
            'CM' => $this->convertToInt($this->getCellValue($worksheet, 'E', $rowIndex)),
            'TD' => $this->convertToInt($this->getCellValue($worksheet, 'F', $rowIndex)),
            'TP' => $this->convertToInt($this->getCellValue($worksheet, 'G', $rowIndex)),
            'SAE' => $this->convertToInt($this->getCellValue($worksheet, 'H', $rowIndex)),
            'total' => $this->convertToInt($this->getCellCalculatedValue($worksheet, 'I', $rowIndex))
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

    private function isButLine($intitule)
    {
        return preg_match('/^BUT\s\d+\s-\s.+$/i', $intitule);
    }

    private function isSemesterLine($intitule)
    {
        return preg_match('/^SEMESTRE\s\d+$/i', $intitule);
    }

    private function isValidRow($worksheet, $rowIndex)
    {
        $intitule = $this->getCellValue($worksheet, 'B', $rowIndex);
        return !empty($intitule) && preg_match('/^(SAÉ\s\d+\.\d{2}\s.+|SAE\s\d+\.\d{2}\s.+|R\d+\.\d{2}\s.+|Portfolio)$/i', $intitule);
    }
}