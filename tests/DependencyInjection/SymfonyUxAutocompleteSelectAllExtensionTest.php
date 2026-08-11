<?php

/*
 * This file is part of the Symfony UX Autocomplete Select All package.
 *
 * (c) Hugo Seigle
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace HugoSeigle\SymfonyUx\AutocompleteSelectAll\Tests\DependencyInjection;

use HugoSeigle\SymfonyUx\AutocompleteSelectAll\DependencyInjection\SymfonyUxAutocompleteSelectAllExtension;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;

final class SymfonyUxAutocompleteSelectAllExtensionTest extends TestCase
{
    public function testItDoesNotConfigureAssetMapperWithoutFrameworkBundle(): void
    {
        $container = new ContainerBuilder();
        $container->setParameter('kernel.bundles_metadata', []);

        (new SymfonyUxAutocompleteSelectAllExtension())->prepend($container);

        self::assertSame([], $container->getExtensionConfig('framework'));
    }

    public function testItDoesNotConfigureAssetMapperWhenFrameworkDoesNotSupportIt(): void
    {
        $container = new ContainerBuilder();
        $container->setParameter('kernel.bundles_metadata', [
            'FrameworkBundle' => ['path' => __DIR__],
        ]);

        (new SymfonyUxAutocompleteSelectAllExtension())->prepend($container);

        self::assertSame([], $container->getExtensionConfig('framework'));
    }

    public function testItRegistersTheControllerWithAssetMapper(): void
    {
        $container = new ContainerBuilder();
        $container->setParameter('kernel.bundles_metadata', [
            'FrameworkBundle' => [
                'path' => (new \ReflectionClass(FrameworkBundle::class))->getFileName()
                    ? \dirname((string) (new \ReflectionClass(FrameworkBundle::class))->getFileName())
                    : '',
            ],
        ]);

        (new SymfonyUxAutocompleteSelectAllExtension())->prepend($container);

        $configuration = $container->getExtensionConfig('framework');
        $frameworkConfiguration = $configuration[0] ?? null;
        self::assertIsArray($frameworkConfiguration);

        $assetMapperConfiguration = $frameworkConfiguration['asset_mapper'] ?? null;
        self::assertIsArray($assetMapperConfiguration);

        $paths = $assetMapperConfiguration['paths'] ?? null;
        self::assertIsArray($paths);

        self::assertContains(
            '@hugoseigle/symfony-ux-autocomplete-select-all',
            $paths,
        );
    }
}
