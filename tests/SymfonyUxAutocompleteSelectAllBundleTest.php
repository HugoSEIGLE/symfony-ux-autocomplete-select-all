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

namespace HugoSeigle\SymfonyUx\AutocompleteSelectAll\Tests;

use HugoSeigle\SymfonyUx\AutocompleteSelectAll\DependencyInjection\SymfonyUxAutocompleteSelectAllExtension;
use HugoSeigle\SymfonyUx\AutocompleteSelectAll\SymfonyUxAutocompleteSelectAllBundle;
use PHPUnit\Framework\TestCase;

final class SymfonyUxAutocompleteSelectAllBundleTest extends TestCase
{
    public function testBundleExposesItsPackageRoot(): void
    {
        $bundle = new SymfonyUxAutocompleteSelectAllBundle();

        self::assertSame('SymfonyUxAutocompleteSelectAllBundle', $bundle->getName());
        self::assertSame(\dirname(__DIR__), $bundle->getPath());
        self::assertInstanceOf(
            SymfonyUxAutocompleteSelectAllExtension::class,
            $bundle->getContainerExtension(),
        );
    }
}
