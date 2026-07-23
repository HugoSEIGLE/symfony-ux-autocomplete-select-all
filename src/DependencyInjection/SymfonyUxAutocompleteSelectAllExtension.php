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

namespace HugoSeigle\SymfonyUx\AutocompleteSelectAll\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;

final class SymfonyUxAutocompleteSelectAllExtension extends Extension implements PrependExtensionInterface
{
    public function prepend(ContainerBuilder $container): void
    {
        if (!interface_exists('Symfony\Component\AssetMapper\AssetMapperInterface')) {
            return;
        }

        /** @var array<string, array{path: string}> $bundlesMetadata */
        $bundlesMetadata = $container->getParameter('kernel.bundles_metadata');

        if (!isset($bundlesMetadata['FrameworkBundle'])) {
            return;
        }

        if (!is_file($bundlesMetadata['FrameworkBundle']['path'].'/Resources/config/asset_mapper.php')) {
            return;
        }

        $container->prependExtensionConfig('framework', [
            'asset_mapper' => [
                'paths' => [
                    __DIR__.'/../../assets/dist' => '@hugoseigle/symfony-ux-autocomplete-select-all',
                ],
            ],
        ]);
    }

    /**
     * @param array<array-key, mixed> $configs
     */
    public function load(array $configs, ContainerBuilder $container): void
    {
    }
}
