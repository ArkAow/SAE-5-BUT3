<?php

// src/Service/MailService.php
namespace App\Service;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailService
{
    private $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
    }

    public function sendWelcomeEmail($toEmail, $toName)
    {
        try {
            // Configurer le serveur SMTP
            $this->mailer->isSMTP();
            $this->mailer->SMTPAuth = true;
            $this->mailer->Host = 'smtp.gmail.com';
            $this->mailer->Username = 'previsionnelapplication@gmail.com'; 
            $this->mailer->Password = 'mdpsecur';  
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port = 587;

            $this->mailer->setFrom('previsionnelapplication@gmail.com', 'Application prévisionnel - IUT de Limoges');
            
            $this->mailer->addAddress($toEmail, $toName);

            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Bienvenue sur notre site';
            $this->mailer->Body    = 'Bonjour ' . $toName . ',<br>Bienvenue sur notre site ! Nous sommes heureux de vous compter parmi nous.';

            // Envoi de l'email
            $this->mailer->send();
            echo 'Message envoyé.';
        } catch (Exception $e) {
            echo "Le message n'a pas pu être envoyé. Error: {$this->mailer->ErrorInfo}";
        }
    }
}
