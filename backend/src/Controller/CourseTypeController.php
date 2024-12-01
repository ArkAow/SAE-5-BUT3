<?php

namespace App\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\CourseType;

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
}
