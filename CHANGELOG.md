# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-07-23

### Added

- Installable Symfony bundle with PSR-4 autoloading and Symfony 6.4–8.x support.
- Symfony UX asset manifest for AssetMapper and Webpack Encore.
- Refactored Stimulus controller with values, targets, request cancellation,
  listener cleanup and generated-control cleanup.
- Native Symfony UX `next_page` pagination, grouped-result support and a
  backwards-compatible page-size fallback.
- JavaScript and PHP test suites.
- Symfony 6.4 AssetMapper demo installed through a Composer path repository.
- PHPStan, PHPUnit, PHP-CS-Fixer, ESLint, Prettier and EditorConfig tooling.
- Compatibility, JavaScript, CodeQL and release GitHub Actions workflows.
- Project documentation, contribution guide, security policy and community
  standards.

### Changed

- The controller now uses the Tom Select instance emitted by Symfony UX
  Autocomplete instead of creating a competing instance.
- The recommended markup places the select-all controller on a wrapper and uses
  a `field` target. Attaching it directly to the autocomplete field remains
  supported for migration.
- Legacy `data-label-select-all` and `data-label-deselect-all` attributes remain
  supported when the equivalent Stimulus values are not configured.
- Labels are inserted with `textContent`, preventing label values from being
  interpreted as HTML.

[1.0.0]: https://github.com/HugoSEIGLE/symfony-ux-autocomplete-select-all/releases/tag/v1.0.0
