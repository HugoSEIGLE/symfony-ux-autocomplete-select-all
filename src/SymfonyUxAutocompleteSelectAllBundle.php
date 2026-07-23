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

namespace HugoSeigle\SymfonyUx\AutocompleteSelectAll;

use Symfony\Component\HttpKernel\Bundle\Bundle;

final class SymfonyUxAutocompleteSelectAllBundle extends Bundle
{
    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
}
