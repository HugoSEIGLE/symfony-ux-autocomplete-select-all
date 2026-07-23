# Examples

## Plain Twig and AssetMapper

```twig
{% set select_all =
    'hugoseigle/symfony-ux-autocomplete-select-all/select-all' %}

<div {{ stimulus_controller(select_all) }}>
    <label for="people">People</label>
    <select
        id="people"
        name="people[]"
        multiple
        {{ stimulus_target(select_all, 'field') }}
        {{ stimulus_controller('symfony/ux-autocomplete/autocomplete', {
            url: path('app_people_autocomplete')
        }) }}
    ></select>
</div>
```

The same template works with Encore because the Stimulus logical identifiers do
not depend on the asset system.

## Symfony Form

Given an autocomplete-enabled, multiple field named `people`:

```twig
{% set select_all =
    'hugoseigle/symfony-ux-autocomplete-select-all/select-all' %}

{{ form_start(form) }}
    <div {{ stimulus_controller(select_all, {
        selectAllLabel: 'Add the whole team',
        deselectAllLabel: 'Start over'
    }) }}>
        {{ form_row(form.people, {
            attr: stimulus_target(select_all, 'field')
        }) }}
    </div>
    <button type="submit">Save</button>
{{ form_end(form) }}
```

The Symfony UX Autocomplete form type continues to own Tom Select. This bundle
only listens for its public connection event.

## A separate Select all endpoint

The optional `url` value is useful when interactive search and bulk selection
have different endpoints:

```twig
<div {{ stimulus_controller(select_all, {
    url: path('app_people_selectable_options')
}) }}>
    {# field #}
</div>
```

The response must use the same `results` and `next_page` format. Apply the same
authorization and filtering rules to both endpoints.

## Legacy same-element markup

The pre-bundle controller was commonly attached directly to the select. This
remains supported:

```html
<select
    multiple
    data-controller="
        hugoseigle--symfony-ux-autocomplete-select-all--select-all
        symfony--ux-autocomplete--autocomplete
    "
    data-symfony--ux-autocomplete--autocomplete-url-value="/autocomplete"
></select>
```

The wrapper-and-target form is preferred because it permits fully custom
controls and clearer ownership of generated markup.

## Listening for errors

Network and endpoint errors dispatch a Stimulus event before being logged:

```html
<div
    data-controller="hugoseigle--symfony-ux-autocomplete-select-all--select-all"
    data-action="
        hugoseigle--symfony-ux-autocomplete-select-all--select-all:error->errors#show
    "
>
    <!-- field -->
</div>
```

The original `Error` is available as `event.detail.error`.
