# Select / Unselect All Autocomplete with Symfony & Stimulus

This repository contains a Stimulus controller for Symfony Autocomplete that adds "Select All" and "Unselect All" functionality to your autocomplete fields. This allows users to quickly select or deselect all available options in an autocomplete input.

## Features ✨

 - Select All: Automatically select all options in the autocomplete field.
 - Unselect All: Clear all selected options.
 - Responsive to changes: Buttons toggle based on the current selection.
 - Customizable labels: Easily change button labels for select/deselect actions.

## Requirements 🛠️

Before using this Stimulus controller, make sure you have the following packages installed in your Symfony project:

1. Symfony (v5.2+)
2. Symfony UX Autocomplete (Symfony UX)
3. Stimulus (included with Symfony UX)
4. TomSelect (for enhanced autocomplete functionality)

## Installation Steps 🚀

### 1. Add the Stimulus Controller to Your JavaScript

Copy the JavaScript code into your assets/controllers/form--custom-autocomplete_controller.js file or wherever you manage your Stimulus controllers. [autocomplete-select-all_controller.js](./autocomplete-select-all_controller.js)

### 2. Add the Necessary HTML Attributes to Your Form or HTML

In your Symfony form type or HTML, add the following attributes to your autocomplete field:

```php
'attr' => [
    'data-controller' => 'form--autocomplete',
    'data-label-select-all' => '<your label>',  // Example: 'Select All'
    'data-label-deselect-all' => '<your label>',  // Example: 'Deselect All'
],
```

This will ensure that the controller attaches the select/unselect buttons to the autocomplete input.

## 3. Customization: Non-Bootstrap Projects

If you're not using Bootstrap, you'll need to modify the button classes in the controller for custom styling.


Line 27 :

```js
loadAllButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'float-end', 'd-none', 'select-all-button')
```

Line 38 :

```js
unselectAllButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'float-end', 'd-none', 'unselect-all-button')
```

Modify this lines to fit your project's button styling classes.

## Usage Example 🎯

Once integrated, users will be able to:

1. Click "Select All": Automatically fetch and select all options from the server.
2. Click "Deselect All": Clear all selected options.
3. Buttons will toggle based on the current selection state, making it intuitive for users to manage large sets of options.

## Conclusion

By following these steps, you can easily implement a select/unselect all feature in your Symfony project using Stimulus and Symfony UX Autocomplete. If you run into any issues or have suggestions for improvements, feel free to open an issue or submit a PR!

Enjoy coding! 😎
