<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class PartTimeTutor extends Teacher
{
    // TO-DO : Ajouter les contraintes horaires par semaine pour PartTimeTutor
}
