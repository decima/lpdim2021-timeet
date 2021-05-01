<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(): Response
    {
        if($this->getUser()){
           if( count($this->getUser()->getLikes())==0 && count($this->getUser()->getDislikes())==0){
               return $this->redirectToRoute("hobbies");
           }
        }
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }


    public function userProfile(): Response
    {
        return $this->render('home/userProfile.html.twig', ["user" => $this->getUser()]);
    }
}
