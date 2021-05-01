<?php

namespace App\Controller;

use App\Entity\Hobby;
use App\Entity\User;
use App\Repository\HobbyRepository;
use Doctrine\ORM\EntityManagerInterface;
use http\Exception\InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HobbiesController extends AbstractController
{
    #[Route('/hobbies', name: 'hobbies')]
    public function index(HobbyRepository $hobbyRepository, Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->getMethod() == Request::METHOD_POST) {
            $user = $this->getUser();
            $likes = json_decode($request->request->get("likes"));
            $dislikes = json_decode($request->request->get("dislikes"));
            if (!$user instanceof User) {
                throw new InvalidArgumentException("invalid Argument exception");
            }
            $user->clearPreferences();
            $entityManager->flush();
            foreach ($likes as $likeId => $name) {
                $user->addLike($entityManager->getReference(Hobby::class, $likeId));
            }
            foreach ($dislikes as $dislikeId => $name) {
                $user->addDislike($entityManager->getReference(Hobby::class, $dislikeId));
            }
            $entityManager->flush();
            $this->addFlash("success","settings saved");
            return $this->redirectToRoute("hobbies");
        }
        $likes = [];
        $dislikes = [];
        foreach ($this->getUser()->getLikes() as $like) {
            $likes[$like->getId()] = $like->getName();
        }
        foreach ($this->getUser()->getDislikes() as $dislike) {
            $dislikes[$dislike->getId()] = $dislike->getName();
        }
        return $this->render('hobbies/index.html.twig', [
            'topLevelHobbies' => $hobbyRepository->findBy(["parent" => null]),
            "likes" =>  $likes,
            "dislikes" => $dislikes,
        ]);
    }
}
