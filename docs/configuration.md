# Configuration

The bundle has no PHP configuration. Its public API consists of Stimulus values
and targets.

Use the logical name
`hugoseigle/symfony-ux-autocomplete-select-all/select-all` with Twig's Stimulus
helpers. In rendered HTML, Stimulus normalizes it to
`hugoseigle--symfony-ux-autocomplete-select-all--select-all`.

## Values

| Name                 | Type   | Default                                             | Description                                                     |
| -------------------- | ------ | --------------------------------------------------- | --------------------------------------------------------------- |
| `url`                | string | Upstream URL                                        | Override the Symfony UX Autocomplete endpoint                   |
| `selectAllLabel`     | string | `Select All`                                        | Select button text                                              |
| `deselectAllLabel`   | string | `Deselect All`                                      | Clear button text                                               |
| `selectAllClasses`   | string | `btn btn-outline-primary btn-sm select-all-button`  | Space-separated select button classes                           |
| `deselectAllClasses` | string | `btn btn-outline-danger btn-sm unselect-all-button` | Space-separated clear button classes                            |
| `controlsClasses`    | string | `autocomplete-select-all-controls`                  | Space-separated generated wrapper classes                       |
| `pageSize`           | number | `10`                                                | Result count used only for legacy endpoints without `next_page` |
| `maxPages`           | number | `1000`                                              | Safety limit against broken pagination                          |

Example:

```twig
{% set controller =
    'hugoseigle/symfony-ux-autocomplete-select-all/select-all' %}

<div {{ stimulus_controller(controller, {
    selectAllLabel: 'Everything',
    deselectAllLabel: 'Nothing',
    selectAllClasses: 'button button-primary',
    deselectAllClasses: 'button button-muted',
    maxPages: 50
}) }}>
    {# autocomplete field #}
</div>
```

Labels are always treated as text, never HTML.

## Targets

| Target              | Required    | Description                                                        |
| ------------------- | ----------- | ------------------------------------------------------------------ |
| `field`             | Recommended | The input or multiple select controlled by Symfony UX Autocomplete |
| `controls`          | No          | Existing container for the two controls                            |
| `selectAllButton`   | No          | Existing select button                                             |
| `deselectAllButton` | No          | Existing clear button                                              |

Missing controls are generated automatically. Generated controls are removed
when Stimulus disconnects.

### Custom controls

```twig
{% set controller =
    'hugoseigle/symfony-ux-autocomplete-select-all/select-all' %}

<div {{ stimulus_controller(controller) }}>
    <div {{ stimulus_target(controller, 'controls') }}>
        <button
            type="button"
            {{ stimulus_target(controller, 'selectAllButton') }}
        >Add all</button>
        <button
            type="button"
            {{ stimulus_target(controller, 'deselectAllButton') }}
        >Remove all</button>
    </div>

    <select
        multiple
        {{ stimulus_target(controller, 'field') }}
        {{ stimulus_controller('symfony/ux-autocomplete/autocomplete', {
            url: path('app_autocomplete')
        }) }}
    ></select>
</div>
```

The controller owns click listeners on custom buttons while connected but does
not remove user-provided markup on disconnect.

## Endpoint contract

Symfony UX Autocomplete returns:

```json
{
    "results": [{ "value": "1", "text": "First choice" }],
    "next_page": "/autocomplete?page=2"
}
```

Grouped results are also supported:

```json
{
    "results": {
        "options": [
            { "value": "1", "text": "First choice", "group_by": ["group"] }
        ],
        "optgroups": [{ "value": "group", "label": "Group" }]
    },
    "next_page": null
}
```

For custom legacy endpoints that omit `next_page`, fetching continues while a
page contains `pageSize` results.

## Performance and safety

Selecting all necessarily downloads all matching records. Keep endpoint
responses compact and authorization checks identical to the normal autocomplete
request. Set a lower `maxPages` value when the available dataset has a known
upper bound.
