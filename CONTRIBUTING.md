# Contributing

Thank you for helping improve Symfony UX Autocomplete Select All.

## Before opening an issue

- Search existing issues and the [FAQ](docs/faq.md).
- Reduce bugs to the smallest reproducible application.
- Include PHP, Symfony, Symfony UX Autocomplete and asset-system versions.
- Never disclose a security vulnerability in a public issue; follow
  [SECURITY.md](SECURITY.md).

## Local setup

Requirements are PHP 8.2+, Composer 2, Node.js 20+ and npm.

```bash
composer install
npm install
composer check
npm run check
```

Run the integration demo separately:

```bash
cd demo
composer install
php bin/console lint:container
symfony serve
```

## Pull requests

1. Create a focused branch from `main`.
2. Add or update tests for behavior changes.
3. Update documentation and `CHANGELOG.md` when users are affected.
4. Run all PHP and JavaScript checks.
5. Explain the problem and the chosen solution in the pull request.

Keep public behavior backwards compatible within the 1.x series. A change that
requires application code or markup to be updated must be discussed before
implementation.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
