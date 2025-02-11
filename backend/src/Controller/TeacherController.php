<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Teacher;
use App\Entity\Department;
use App\Repository\TeacherRepository;
use Symfony\Component\HttpFoundation\Request;

class TeacherController extends AbstractController
{
    #[Route('/teacher/department/{departmentId}', name: 'get_teachers_by_department', methods: ['GET'])]
    public function getTeachersByDepartment(int $departmentId, EntityManagerInterface $entityManager): JsonResponse
    {
        $departmentRepository = $entityManager->getRepository(Department::class);
        $department = $departmentRepository->find($departmentId);

        if (!$department) {
            return new JsonResponse(['message' => 'Département non trouvé'], 404);
        }

        $teachers = $department->getTeachers(); // Récupère les enseignants du département

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
        }, $teachers->toArray());

        return new JsonResponse($data, 200);
    }

    #[Route('/teacher/add/department/{departmentId}', name: 'add_teacher', methods: ['POST'])]
    public function addTeacher(int $departmentId, EntityManagerInterface $entityManager, Request $request): JsonResponse
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
        $teacher_timeConstraints = $data['constraint'] ?? 0;
        $teacher_is_partimetutor = $data['is_partimetutor'] ?? false;
    
        // Vérification si le département existe
        $departmentRepository = $entityManager->getRepository(Department::class);
        $department = $departmentRepository->find($departmentId);
    
        if (!$department) {
            return new JsonResponse(['error' => 'Département non trouvé.'], 404);
        }
    
        // Vérification si l'enseignant existe déjà (même nom, prénom et code)
        $teacherRepository = $entityManager->getRepository(Teacher::class);
        $existingTeacher = $teacherRepository->findOneBy([
            'firstName' => $teacherFirstname,
            'lastName' => $teacherLastname,
        ]);
    
        if ($existingTeacher !== null) {
            // Vérifier si le département est déjà assigné à cet enseignant
            if ($existingTeacher->getDepartments()->contains($department)) {
                return new JsonResponse(['message' => 'L\'enseignant est déjà associé à ce département.'], 200);
            }
    
            // Ajouter le département à l'enseignant existant
            $existingTeacher->addDepartment($department);
            $entityManager->persist($existingTeacher);
            $entityManager->flush();
    
            return new JsonResponse([
                'message' => 'Département ajouté à l\'enseignant existant.',
                'teacherId' => $existingTeacher->getId(),
                'code' => $existingTeacher->getCode(),
            ], 200);
        }
    
        // Génération d'un code unique pour le professeur
        $teacherCode = strtoupper($teacherFirstname[0] . $teacherLastname[0]);
        $existingCodeTeacher = $teacherRepository->findOneBy(['code' => $teacherCode]);
    
        $index = 1;
        while ($existingCodeTeacher !== null) {
            $teacherCode = strtoupper($teacherFirstname[0] . $teacherLastname[0] . substr($teacherLastname, $index, 1));
            $existingCodeTeacher = $teacherRepository->findOneBy(['code' => $teacherCode]);
            $index++;
    
            if ($index >= strlen($teacherLastname)) {
                $teacherCode = strtoupper($teacherFirstname[0] . $teacherLastname[0] . substr($teacherFirstname, 1, $index - strlen($teacherLastname)));
                $existingCodeTeacher = $teacherRepository->findOneBy(['code' => $teacherCode]);
            }
        }
    
        // Création d'un nouvel enseignant
        $teacher = new Teacher();
        $teacher->setCode($teacherCode);
        $teacher->setFirstname($teacherFirstname);
        $teacher->setLastname($teacherLastname);
        $teacher->setTimeConstraints($teacher_timeConstraints);
        $teacher->setIsPartimeTutor($teacher_is_partimetutor);
        $teacher->addDepartment($department);
    
        $entityManager->persist($teacher);
        $entityManager->flush();
    
        return new JsonResponse([
            'message' => 'Professeur ajouté avec succès et assigné au département.',
            'teacherId' => $teacher->getId(),
            'code' => $teacherCode,
        ], 201);
    }

    #[Route('/teacher/delete/{id}', name: 'delete_teacher', methods: ['DELETE'])]
    public function deleteTeacher(int $id, TeacherRepository $teacherRepository, EntityManagerInterface $entityManager, Request $request) : JsonResponse
    {
        $teacher = $teacherRepository->find($id);
    
        if ($teacher === null) {
            return new JsonResponse(['error' => 'Professeur non trouvé.'], 404);
        }
    
        $entityManager->remove($teacher);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Professeur supprimé avec succès.'], 200);
    }

    #[Route('/teacher/update', name: 'update_teachers', methods: ['PUT'])]
    public function updateTeacher(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $id = $data['id'] ?? null;
        $firstName = $data['firstName'] ?? null;
        $lastName = $data['lastName'] ?? null;
        $timeConstraints = $data['constraint'] ?? null;
        $isPartimeTutor = $data['isPartimeTutor'] ?? null;

        if (!$id || !$firstName || !$lastName) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $teacher = $entityManager->getRepository(Teacher::class)->find($id);

        if (!$teacher) {
            return new JsonResponse(['error' => 'Enseignant introuvable'], 404);
        }

        $teacher->setFirstName($firstName);
        $teacher->setLastName($lastName);
        $teacher->setTimeConstraints($timeConstraints);
        $teacher->setIsPartimeTutor($isPartimeTutor);

        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Enseignant mis à jour avec succès',
            'teacher' => [
                'id' => $teacher->getId(),
                'firstName' => $teacher->getFirstName(),
                'lastName' => $teacher->getLastName(),
                'code' => $teacher->getCode(),
                'subjects' => $teacher->getSubjects(),
                'courses' => $teacher->getCourses(),
                'timeConstraints' => $teacher->getTimeConstraints(),
                'isPartimeTutor' => $teacher->getIsPartimeTutor(),
            ]
        ], 200);
    }
}