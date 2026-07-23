# Installation

## Requirements

- PHP 8.2 or later.
- Symfony 6.4, 7.x or 8.x.
- Symfony UX Autocomplete 2.17 or later.
- Stimulus 3.2 or later.
- AssetMapper or Webpack Encore.

## Composer

Install the bundle and its Symfony UX dependencies:

```bash
composer require hugoseigle/symfony-ux-autocomplete-select-all
```

When no Flex recipe is available, add the bundle explicitly:

```php
// config/bundles.php
use HugoSeigle\SymfonyUx\AutocompleteSelectAll\SymfonyUxAutocompleteSelectAllBundle;

return [
    // ...
    SymfonyUxAutocompleteSelectAllBundle::class => ['all' => true],
];
```

## AssetMapper

Symfony Flex normally updates `assets/controllers.json`. Verify that it contains
the following controller:

```json
{
    "controllers": {
        "@hugoseigle/symfony-ux-autocomplete-select-all": {
            "select-all": {
                "enabled": true,
                "fetch": "lazy"
            }
        }
    }
}
```

The package's `assets/package.json` declares its import map and controller.
There is no JavaScript build step in the consuming application.

Check the final map:

```bash
php bin/console debug:asset-map
php bin/console asset-map:compile
```

## Webpack Encore

Ensure the Stimulus bridge is enabled:

```js
// webpack.config.js
Encore.enableStimulusBridge('./assets/controllers.json');
```

The same entry must be enabled in `assets/controllers.json`. Then install and
build JavaScript dependencies:

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

Restart the Encore watcher after installing a new Symfony UX package.

## Verify the installation

```bash
php bin/console about
php bin/console debug:asset-map
```

The bundle contains no application service configuration, so the most useful
functional check is to render the example in [examples.md](examples.md) and
inspect the Stimulus debug log in development.

## Demo

The repository contains a complete baseline application:

```bash
cd demo
composer install
symfony serve
```

Its `composer.json` installs the parent bundle through a path repository,
exactly as a consuming Symfony application would.
