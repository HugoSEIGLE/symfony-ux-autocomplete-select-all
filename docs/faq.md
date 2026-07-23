# Frequently asked questions

## Does this replace Symfony UX Autocomplete?

No. Symfony UX Autocomplete creates and owns Tom Select. This controller adds
bulk-selection controls and communicates through the public
`autocomplete:connect` event.

## Does it work with AssetMapper?

Yes. The Composer package ships a Symfony UX asset manifest and a built
controller. A consuming application does not need Node.js when using
AssetMapper.

## Does it work with Webpack Encore?

Yes. Enable the package in `assets/controllers.json`, install JavaScript
dependencies and restart Encore. See [installation.md](installation.md).

## Is Bootstrap required?

No. The default class names use Bootstrap conventions for backwards
compatibility, but visibility relies on the native `hidden` attribute. Override
the class values for any design system.

## Why must the field be multiple?

Selecting every option has useful semantics only for a multi-value Tom Select
field. The bundle intentionally does not change the Autocomplete configuration.

## Why does clicking Select all make several requests?

Symfony UX Autocomplete paginates remote data. The controller follows
`next_page` until the endpoint returns `null`, then adds all unique results to
the existing Tom Select instance.

## Can it select only the current search results?

Not in 1.0. The controller requests the configured endpoint without a search
query, matching the behavior of the original controller.

## My custom endpoint never stops loading

Return an explicit `"next_page": null` on the last page. For legacy responses
without that field, set `pageSize` to the actual endpoint page size and use
`maxPages` as a safety limit.

## Will it submit options that were not initially in the select element?

Yes. Options are added through Tom Select before their values are selected,
using the same mechanism as remote Symfony UX Autocomplete results.

## Is direct attachment to the select still supported?

Yes, for migration from the original standalone controller. New code should use
a wrapper with a `field` target as shown in the README.
