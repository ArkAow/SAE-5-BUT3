<?php

namespace App\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\CourseType;
use Symfony\Component\HttpFoundation\Request;

class CourseTypeController extends AbstractController
{
    #[Route('/coursetypes', name: 'app_course_type')]
    public function getCourseType(EntityManagerInterface $em): JsonResponse
    {
        //CourseTypeRepository nous permet de rechercher tous les types de course dispo dans la BDD
        $courseTypeRepository = $em->getRepository(CourseType::class);
        $coursetype = $courseTypeRepository->findAll();

        //On retourne les coursetype sous forme de tableau
        $data = array_map(function($coursetype){
            return [
                'id' => $coursetype->getId(),
                'name' => $coursetype->getName(),
                'color' => $coursetype->getColor(),
                'scope' => $coursetype->getScope(),
            ];
        }, $coursetype);

        //On retourne le tableau avec toutes les données de CourseType en format JSON
        return new JsonResponse($data, 200);
    }

    #[Route('/add/coursetype', name: 'add_a_course_type', methods: ['POST'])]
    public function addCourseType(EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le nom du type de cours est obligatoire.'], 400);
        }

        $courseTypeName = trim($data['name']);
        $courseTypeColor = $data['color'] ?? null;
        $courseTypeScope = $data['scope'] ?? null;

        try {
            $courseTypeRepository = $em->getRepository(CourseType::class);
            $courseType = $courseTypeRepository->findOneBy(['name' => $courseTypeName]);

            if (!$courseType) {
                $courseType = new CourseType();
                $courseType->setName($courseTypeName);
                $courseType->setColor($courseTypeColor);
                $courseType->setScope($courseTypeScope);

                $em->persist($courseType);
                $em->flush();
            }

            return new JsonResponse(['success' => 'Type de cours ajouté avec succès.'], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], 500);
        }
    }
}
