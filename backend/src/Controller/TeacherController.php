<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Teacher;
use Symfony\Component\HttpFoundation\Request;

class TeacherController extends AbstractController
{
    #[Route('/teacher/add', name: 'add_teacher', methods: ['POST'])]
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
        $teacher_timeConstraints = $data['constraints'] ?? 0;
        $teacher_is_partimetutor = $data['is_partimetutor'] ?? 0;
    
        // Vérification si un professeur existe déjà par le nom ET le prénom
        $teacherRepository = $entityManager->getRepository(Teacher::class);
        $existingTeacher = $teacherRepository->findOneBy([
            'firstName' => $teacherFirstname,
            'lastName' => $teacherLastname,
        ]);
    
        if ($existingTeacher !== null) {
            return new JsonResponse(['error' => 'Professeur déjà existant (même nom, prénom et code).'], 409);
        }
    
        // Création d'un nouveau professeur
        $teacher = new Teacher();
    
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
            $teacherCode = strtoupper($teacherFirstname[0] . $teacherLastname[0] . substr($teacherLastname, 1, $index - strlen($teacherLastname)));
            $existingCodeTeacher = $teacherRepository->findOneBy(['code' => $teacherCode]);
        }
    
        $teacher->setCode($teacherCode);
        $teacher->setFirstname($teacherFirstname);
        $teacher->setLastname($teacherLastname);
        $teacher->setTimeConstraints($teacher_timeConstraints ?? 0);
        $teacher->setIsPartimeTutor($teacher_is_partimetutor ?? false);
    
        $entityManager->persist($teacher);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Professeur ajouté avec succès.', 'code' => $teacherCode], 201);
    }

    #[Route('/teacher', name: 'get_teachers', methods: ['GET'])]
    public function getTeachers(EntityManagerInterface $entityManager): JsonResponse
    {
        $teacherRepository = $entityManager->getRepository(Teacher::class);
        $teachers = $teacherRepository->findAll();
        
        // Affichage de TOUS les professeurs en liste avec TOUTES leurs données

        $data = array_map(function($teacher){
            return [
                'id' => $teacher->getId(),
                'firstName' => $teacher->getFirstName(),
                'lastName' => $teacher->getLastName(),
                'code' => $teacher->getCode(),
                'subjects' => $teacher->getSubjects(),
                'courses' => $teacher->getCourses(),
                'timeConstraints' => $teacher->getTimeConstraints(),
                'isPartimeTutor' => $teacher->getIsPartimeTutor(),
            ];
        }, $teachers);
    
        return new JsonResponse($data, 200);
    }

    #[Route('/teacher/delete', name: 'delete_teacher', methods: ['DELETE'])]
    public function deleteTeacher(EntityManagerInterface $entityManager, Request $request) : JsonResponse
    {
        $teacherId = json_decode($request->getContent(), true)['id'];
    
        $teacherRepository = $entityManager->getRepository(Teacher::class);
        $teacher = $teacherRepository->findOneBy(['id' => $teacherId]);
    
        if ($teacher === null) {
            return new JsonResponse(['error' => 'Professeur non trouvé.'], 404);
        }
    
        $entityManager->remove($teacher);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Professeur supprimé avec succès.'], 200);
    }
}