<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Teacher;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Professor;

class TeacherController extends AbstractController
{
    #[Route('/professor/add', name: 'add_teacher', methods: ['POST'])]
    public function addTeacher(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['firstName']) || empty(trim($data['firstName']))) {
            return new JsonResponse(['error' => 'Le prénom du professeur est obligatoire.'], 400);
        }
        if (!isset($data['lastName']) || empty(trim($data['lastName']))) {
            return new JsonResponse(['error' => 'Le nom du professeur est obligatoire.'], 400);
        }
    
        $teacherFirstname = trim($data['firstName']);
        $teacherLastname = trim($data['lastName']);
    
        // Vérification si un professeur existe déjà par le nom ET le prénom
        $teacherRepository = $entityManager->getRepository(Professor::class);
        $existingTeacher = $teacherRepository->findOneBy([
            'firstName' => $teacherFirstname,
            'lastName' => $teacherLastname,
        ]);
    
        if ($existingTeacher !== null) {
            return new JsonResponse(['error' => 'Professeur déjà existant (même nom, prénom et code).'], 409);
        }
    
        // Création d'un nouveau professeur
        $professor = new Professor();
    
        //Génération d'un code unique pour le professeur
        $teacherCode = strtoupper($teacherFirstname[0] . $teacherLastname[0]);
        $existingCodeTeacher = $teacherRepository->findOneBy(['code' => $teacherCode]);
    
        $index = 1; // Compteur pour différencier les codes
        while ($existingCodeTeacher !== null) {
            // Si le code existe, on ajoute des lettres supplémentaires pour rendre le code unique el CO et COD
            $teacherCode = strtoupper($teacherFirstname[0] . $teacherLastname[0] . substr($teacherLastname, $index, 1));
            $existingCodeTeacher = $teacherRepository->findOneBy(['code' => $teacherCode]);
            $index++;
            
            // Si on dépasse la longueur du nom, on passe aux lettres du prénom pour différencier les codes mais arrive très peu de fois
            $teacherCode = strtoupper($teacherFirstname[0] . substr($teacherFirstname, 1, $index - strlen($teacherLastname)) . $teacherLastname[0]);
            $existingCodeTeacher = $teacherRepository->findOneBy(['code' => $teacherCode]);
        }
    
        $professor->setCode($teacherCode);
        $professor->setFirstname($teacherFirstname);
        $professor->setLastname($teacherLastname);
        $professor->setSubjectsTaught($data['subjectsTaught'] ?? '');
    
        $entityManager->persist($professor);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Professeur ajouté avec succès.', 'code' => $teacherCode], 201);
    }

    #[Route('/professors', name: 'get_teachers', methods: ['GET'])]
    public function getTeachers(EntityManagerInterface $entityManager): JsonResponse
    {
        $teacherRepository = $entityManager->getRepository(Professor::class);
        $teachers = $teacherRepository->findAll();
    
        $data = array_map(function($teacher){
            return [
                'id' => $teacher->getId(),
                'firstName' => $teacher->getFirstName(),
                'lastName' => $teacher->getLastName(),
                'code' => $teacher->getCode(),
                'subjectsTaught' => $teacher->getSubjectsTaught(),
            ];
        }, $teachers);
    
        return new JsonResponse($data, 200);
    }

    #[Route('/professor/delete', name: 'delete_teacher', methods: ['DELETE'])]
    public function deleteTeacher(EntityManagerInterface $entityManager, Request $request) : JsonResponse
    {
        $teacherId = json_decode($request->getContent(), true)['id'];
    
        $teacherRepository = $entityManager->getRepository(Professor::class);
        $teacher = $teacherRepository->findOneBy(['id' => $teacherId]);
    
        if ($teacher === null) {
            return new JsonResponse(['error' => 'Professeur non trouvé.'], 404);
        }
    
        $entityManager->remove($teacher);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Professeur supprimé avec succès.'], 200);
    }
}