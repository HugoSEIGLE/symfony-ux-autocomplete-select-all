<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DemoController extends AbstractController
{
    private const COUNTRIES = [
        'Austria',
        'Belgium',
        'Bulgaria',
        'Croatia',
        'Cyprus',
        'Czechia',
        'Denmark',
        'Estonia',
        'Finland',
        'France',
        'Germany',
        'Greece',
        'Hungary',
        'Ireland',
        'Italy',
        'Latvia',
        'Lithuania',
        'Luxembourg',
        'Malta',
        'Netherlands',
        'Poland',
        'Portugal',
        'Romania',
        'Slovakia',
        'Slovenia',
        'Spain',
        'Sweden',
    ];

    #[Route('/', name: 'app_demo', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('demo/index.html.twig');
    }

    #[Route('/api/countries', name: 'app_countries', methods: ['GET'])]
    public function countries(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $pageSize = 10;
        $offset = ($page - 1) * $pageSize;
        $countries = \array_slice(self::COUNTRIES, $offset, $pageSize, true);
        $results = [];

        foreach ($countries as $index => $country) {
            $results[] = [
                'value' => (string) ($index + 1),
                'text' => $country,
            ];
        }

        $nextPage = $offset + $pageSize < \count(self::COUNTRIES)
            ? $this->generateUrl('app_countries', ['page' => $page + 1])
            : null;

        return $this->json([
            'results' => $results,
            'next_page' => $nextPage,
        ]);
    }
}
