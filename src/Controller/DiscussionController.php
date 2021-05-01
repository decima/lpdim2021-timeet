<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\Message;
use App\Repository\DiscussionRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DiscussionController extends AbstractController
{
    #[Route('/discussion', name: 'discussions', methods: ["GET"])]
    public function index(DiscussionRepository $discussionRepository): Response
    {
        return $this->render('discussion/index.html.twig', [
            'discussions' => $discussionRepository->findNotExpiredDiscussions($this->getUser()),
        ]);
    }

    #[ROute("/discussion/new", name: "discussion_new")]
    public function newDiscussion(EntityManagerInterface $entityManager, UserRepository $userRepository)
    {
        $discussion = new Discussion();
        $this->getUser()->addDiscussion($discussion);
        do {
            $users = $userRepository->findAll();
            $user = $users[rand(0, count($users)-1)];
            $discussion->addParticipant($user);
        } while ($user->getId() != $this->getUser()->getId());

        $entityManager->persist($discussion);
        $entityManager->flush();
        return $this->redirectToRoute("discussions");

    }

    #[Route('/discussion/{discussion}', name: 'discussion', methods: ["GET"])]
    public function show(Discussion $discussion): Response
    {
        if ($discussion->getEndsAt()->getTimestamp() < time()) {
            return $this->redirectToRoute("discussions");
        }
        return $this->render('discussion/show.html.twig', [
            'discussion' => $discussion,
        ]);
    }

    #[Route('/discussion/{discussion}/pull', name: 'pull', methods: ["GET"])]
    public function pull(Discussion $discussion): Response
    {
        if ($discussion->getEndsAt()->getTimestamp() < time()) {
            return new Response("End of chat", 403);
        }
        return $this->json($discussion->getMessages());
    }

    #[Route('/discussion/{discussion}', name: 'push', methods: ["POST"])]
    public function push(Discussion $discussion, Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($discussion->getEndsAt()->getTimestamp() < time()) {
            return new Response("End of chat", 403);
        }
        $msg = new Message();
        $msg->setAuthor($this->getUser());
        $msg->setContent(json_decode($request->getContent()));
        $msg->setCreatedAt(new \DateTime());
        $msg->setDiscussion($discussion);
        $entityManager->persist($msg);
        $entityManager->flush();
        return new Response("ok", 200);
    }


}
