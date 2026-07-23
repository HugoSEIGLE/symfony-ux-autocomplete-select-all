<?php

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__.'/src', __DIR__.'/tests'])
;

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'declare_strict_types' => true,
        'header_comment' => [
            'header' => "This file is part of the Symfony UX Autocomplete Select All package.\n\n(c) Hugo Seigle\n\nFor the full copyright and license information, please view the LICENSE\nfile that was distributed with this source code.",
            'location' => 'after_open',
        ],
    ])
    ->setFinder($finder)
;
