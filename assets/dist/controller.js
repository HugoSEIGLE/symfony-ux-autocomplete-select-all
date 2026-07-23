import { Controller } from '@hotwired/stimulus';

const AUTOCOMPLETE_URL_ATTRIBUTE =
  'data-symfony--ux-autocomplete--autocomplete-url-value';
const LEGACY_SELECT_ALL_LABEL_ATTRIBUTE = 'data-label-select-all';
const LEGACY_DESELECT_ALL_LABEL_ATTRIBUTE = 'data-label-deselect-all';

class controller extends Controller {
  static targets = [
    'field',
    'controls',
    'selectAllButton',
    'deselectAllButton',
  ];

  static values = {
    url: String,
    selectAllLabel: { type: String, default: 'Select All' },
    deselectAllLabel: { type: String, default: 'Deselect All' },
    selectAllClasses: {
      type: String,
      default: 'btn btn-outline-primary btn-sm select-all-button',
    },
    deselectAllClasses: {
      type: String,
      default: 'btn btn-outline-danger btn-sm unselect-all-button',
    },
    controlsClasses: {
      type: String,
      default: 'autocomplete-select-all-controls',
    },
    pageSize: { type: Number, default: 10 },
    maxPages: { type: Number, default: 1000 },
  };

  initialize() {
    this.onAutocompleteConnect = this.onAutocompleteConnect.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  connect() {
    this.fieldElement = this.hasFieldTarget ? this.fieldTarget : this.element;
    this.tomSelect = null;
    this.allOptions = null;
    this.allOptionGroups = [];
    this.fetchPromise = null;
    this.abortController = null;
    this.createdControls = false;
    this.resolvedSelectAllLabel = this.resolveLabel(
      this.selectAllLabelValue,
      'select-all-label',
      LEGACY_SELECT_ALL_LABEL_ATTRIBUTE,
    );
    this.resolvedDeselectAllLabel = this.resolveLabel(
      this.deselectAllLabelValue,
      'deselect-all-label',
      LEGACY_DESELECT_ALL_LABEL_ATTRIBUTE,
    );

    this.element.addEventListener(
      'autocomplete:connect',
      this.onAutocompleteConnect,
    );
    this.fieldElement.addEventListener('change', this.onFieldChange);

    this.createControls();

    // This covers reconnections and the legacy setup where both controllers
    // live on the field and Autocomplete connected first.
    queueMicrotask(() => {
      if (!this.tomSelect && this.fieldElement.tomselect) {
        this.attachTomSelect(this.fieldElement.tomselect);
      }
    });
  }

  disconnect() {
    this.element.removeEventListener(
      'autocomplete:connect',
      this.onAutocompleteConnect,
    );
    this.fieldElement?.removeEventListener('change', this.onFieldChange);
    this.selectAllButtonElement?.removeEventListener('click', this.selectAll);
    this.deselectAllButtonElement?.removeEventListener(
      'click',
      this.deselectAll,
    );
    this.abortController?.abort();

    if (this.createdControls) {
      this.controlsElement.remove();
    }

    this.tomSelect = null;
    this.allOptions = null;
    this.allOptionGroups = [];
    this.fetchPromise = null;
  }

  onAutocompleteConnect(event) {
    if (event.target !== this.fieldElement || !event.detail?.tomSelect) {
      return;
    }

    this.attachTomSelect(event.detail.tomSelect);
  }

  attachTomSelect(tomSelect) {
    this.tomSelect = tomSelect;
    this.refreshSelectionState();
  }

  async selectAll() {
    if (!this.tomSelect) {
      this.reportError(
        new Error('Symfony UX Autocomplete has not connected to the field.'),
      );

      return;
    }

    this.setLoading(true);

    try {
      const options = await this.fetchAllOptions();

      for (const group of this.allOptionGroups) {
        this.tomSelect.addOptionGroup?.(group.value, group);
      }

      for (const option of options) {
        this.tomSelect.addOption(option);
      }

      this.tomSelect.addItems(options.map((option) => option.value));
      this.updateButtons(false);
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.reportError(error);
      }
    } finally {
      this.setLoading(false);
    }
  }

  deselectAll() {
    if (!this.tomSelect) {
      return;
    }

    this.tomSelect.clear();
    this.updateButtons(true);
  }

  onFieldChange() {
    this.refreshSelectionState();
  }

  async refreshSelectionState() {
    if (!this.tomSelect) {
      return;
    }

    try {
      const options = await this.fetchAllOptions();
      const selected = this.normalizeValues(this.tomSelect.getValue());
      const allSelected =
        options.length > 0 &&
        options.every((option) => selected.includes(String(option.value)));

      this.updateButtons(!allSelected);
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.reportError(error);
      }
    }
  }

  fetchAllOptions() {
    if (this.allOptions) {
      return Promise.resolve(this.allOptions);
    }

    if (!this.fetchPromise) {
      this.fetchPromise = this.loadAllPages()
        .then((options) => {
          this.allOptions = options;

          return options;
        })
        .catch((error) => {
          // A temporary network failure must not poison every later attempt.
          this.fetchPromise = null;

          throw error;
        });
    }

    return this.fetchPromise;
  }

  async loadAllPages() {
    const configuredUrl = this.getAutocompleteUrl();

    if (!configuredUrl) {
      throw new Error(
        'No autocomplete URL was found. Configure the url value on this controller or Symfony UX Autocomplete.',
      );
    }

    this.abortController?.abort();
    this.abortController = new AbortController();

    const options = [];
    const optionGroups = new Map();
    const visitedUrls = new Set();
    let page = 1;
    let nextUrl = this.withPage(configuredUrl, page);

    while (nextUrl) {
      if (visitedUrls.has(nextUrl)) {
        throw new Error(
          'The autocomplete endpoint returned a pagination loop.',
        );
      }

      if (page > this.maxPagesValue) {
        throw new Error(
          `The autocomplete endpoint exceeded the ${this.maxPagesValue} page safety limit.`,
        );
      }

      visitedUrls.add(nextUrl);

      const response = await fetch(nextUrl, {
        headers: { Accept: 'application/json' },
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load autocomplete options (HTTP ${response.status}).`,
        );
      }

      const payload = await response.json();
      const pageOptions = this.extractOptions(payload);
      const pageOptionGroups = payload?.results?.optgroups;

      options.push(...pageOptions);

      if (Array.isArray(pageOptionGroups)) {
        for (const group of pageOptionGroups) {
          if (group && Object.hasOwn(group, 'value')) {
            optionGroups.set(String(group.value), group);
          }
        }
      }

      page += 1;

      if (typeof payload.next_page === 'string' && payload.next_page !== '') {
        nextUrl = new URL(payload.next_page, nextUrl).toString();
      } else if (Object.hasOwn(payload, 'next_page')) {
        nextUrl = null;
      } else if (pageOptions.length < this.pageSizeValue) {
        nextUrl = null;
      } else {
        nextUrl = this.withPage(configuredUrl, page);
      }
    }

    this.allOptionGroups = [...optionGroups.values()];

    return this.uniqueOptions(options);
  }

  extractOptions(payload) {
    const results = payload?.results?.options ?? payload?.results;

    if (!Array.isArray(results)) {
      throw new TypeError(
        'The autocomplete endpoint must return a "results" array.',
      );
    }

    return results.filter(
      (option) =>
        option &&
        Object.hasOwn(option, 'value') &&
        Object.hasOwn(option, 'text'),
    );
  }

  uniqueOptions(options) {
    const unique = new Map();

    for (const option of options) {
      unique.set(String(option.value), option);
    }

    return [...unique.values()];
  }

  normalizeValues(values) {
    const list = Array.isArray(values) ? values : [values];

    return list.filter((value) => value !== '').map(String);
  }

  getAutocompleteUrl() {
    if (this.hasUrlValue) {
      return this.urlValue;
    }

    // Reading the upstream value once keeps the zero-configuration behavior
    // of the original controller without duplicating Autocomplete internals.
    return this.fieldElement.getAttribute(AUTOCOMPLETE_URL_ATTRIBUTE);
  }

  resolveLabel(defaultLabel, valueAttribute, legacyAttribute) {
    if (
      this.element.hasAttribute(
        `data-${this.identifier}-${valueAttribute}-value`,
      )
    ) {
      return defaultLabel;
    }

    return this.fieldElement.getAttribute(legacyAttribute) ?? defaultLabel;
  }

  withPage(url, page) {
    const paginatedUrl = new URL(url, document.baseURI);
    paginatedUrl.searchParams.set('page', String(page));

    return paginatedUrl.toString();
  }

  createControls() {
    if (this.hasControlsTarget) {
      this.controlsElement = this.controlsTarget;
    } else {
      this.controlsElement = document.createElement('div');
      this.controlsElement.classList.add(
        ...this.controlsClassesValue.split(/\s+/).filter(Boolean),
      );
      this.controlsElement.setAttribute(
        `data-${this.identifier}-target`,
        'controls',
      );
      this.fieldElement.insertAdjacentElement(
        'beforebegin',
        this.controlsElement,
      );
      this.createdControls = true;
    }

    this.selectAllButtonElement = this.hasSelectAllButtonTarget
      ? this.selectAllButtonTarget
      : this.createButton(
          'selectAllButton',
          this.resolvedSelectAllLabel,
          this.selectAllClassesValue,
        );
    this.deselectAllButtonElement = this.hasDeselectAllButtonTarget
      ? this.deselectAllButtonTarget
      : this.createButton(
          'deselectAllButton',
          this.resolvedDeselectAllLabel,
          this.deselectAllClassesValue,
        );

    this.selectAllButtonElement.addEventListener('click', this.selectAll);
    this.deselectAllButtonElement.addEventListener('click', this.deselectAll);
    this.updateButtons(true);
  }

  createButton(target, label, classes) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.classList.add(...classes.split(/\s+/).filter(Boolean));
    button.setAttribute(`data-${this.identifier}-target`, target);
    this.controlsElement.append(button);

    return button;
  }

  updateButtons(showSelectAll) {
    this.setButtonVisibility(this.selectAllButtonElement, showSelectAll);
    this.setButtonVisibility(this.deselectAllButtonElement, !showSelectAll);
  }

  setButtonVisibility(button, visible) {
    button.hidden = !visible;
    button.setAttribute('aria-hidden', String(!visible));
  }

  setLoading(loading) {
    this.selectAllButtonElement.disabled = loading;
    this.selectAllButtonElement.setAttribute('aria-busy', String(loading));
  }

  reportError(error) {
    this.dispatch('error', { detail: { error } });
    console.error('[Autocomplete Select All]', error);
  }
}

export { controller as default };
