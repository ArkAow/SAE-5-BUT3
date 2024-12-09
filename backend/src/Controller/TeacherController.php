<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Teacher;
use Symfony\Component\HttpFoundation\Request;

class TeacherController extends AbstractController
{
    #[Route('/teachers/add', name: 'add_teacher', methods: ['POST'])]
    public function addTeacher(EntityManagerInterface $entityManager, Request $request):JsonResponse
    {
        // On récupère le JSON donné à partir du Frontend
        $data = json_decode($request->getContent(), true);

        // On récupère le Repository pour la classe Teacher (récupère toutes les données de la table Teacher)
        $teacherRepository = $entityManager->getRepository(Teacher::class);
    
        // On vérifie si le prénom et le nom du professeur ne sont pas déja présent ou si ils sont vide
        if (!isset($data['firstname']) || empty(trim($data['firstname']))) {
            return new JsonResponse(['error' => 'Le prénom du professeur est obligatoire.'], 400);
        } else if (!isset($data['lastname']) || empty(trim($data['lastname']))) {
            return new JsonResponse(['error' => 'Le nom du professeur est obligatoire.'], 400);
        } else {
            $teacherFirstname = trim($data['firstname']);
            $teacherLastname = trim($data['lastname']);
        }

        //Création d'un nouveau Teacher
        $teacher = new Teacher();

        //Création du code Teacher à partir du prénom et du nom et vérification si le code existe déjà ou non
        $teacherCode = $teacherFirstname[0] . $teacherLastname[0];
        if ($teacherRepository->findOneBy(['code' => $teacherCode]) && $teacherRepository->findOneBy(['firstname' => $teacherFirstname]) && $teacherRepository->findOneBy(['lastname' => $teacherLastname])) {
            return new JsonResponse(['error' => 'Professeur déjà existant (nom,prénom et code déja existant)'], 409);
        } else if ($teacherRepository->findOneBy(['code' => $teacherCode]) && !$teacherRepository->findOneBy(['firstname' => $teacherFirstname]) && !$teacherRepository->findOneBy(['lastname' => $teacherLastname])) {
            return new JsonResponse(['error' => 'Code de Professeur déjà utlisée'], 409);
            $teacherCode = $teacherFirstname[0] . $teacherFirstName[1] . $teacherLastname[0];
        } else {
            $teacher->setCode($teacherCode);
        }

        //Définition du nom et du prénom du Teacher
        $teacher->setFirstname($teacherFirstname);
        $teacher->setLastname($teacherLastname);

        // Ajouter le nouveau Teacher dans la BDD
        $entityManager->flush();

        //Réponse JSON pour dire que l'ajout du Teacher s'est bien passé
        return new JsonResponse(['message' => 'Teacher ajouté avec succès.',], 201);
    }
}
