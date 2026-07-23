import { Application } from '@hotwired/stimulus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SelectAllController from '../src/controller.js';

const identifier = 'hugoseigle--symfony-ux-autocomplete-select-all--select-all';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Autocomplete Select All controller', () => {
  let application;
  let tomSelect;

  beforeEach(async () => {
    document.body.innerHTML = `
      <div data-controller="${identifier}">
        <select
          multiple
          data-${identifier}-target="field"
          data-symfony--ux-autocomplete--autocomplete-url-value="/autocomplete?context=test"
        ></select>
      </div>
    `;

    tomSelect = {
      addOption: vi.fn(),
      addItems: vi.fn(),
      clear: vi.fn(),
      getValue: vi.fn(() => []),
    };

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: Array.from({ length: 10 }, (_, index) => ({
              value: String(index + 1),
              text: `Choice ${index + 1}`,
            })),
            next_page: '/autocomplete?context=test&page=2',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [{ value: '11', text: 'Choice 11' }],
            next_page: null,
          }),
        }),
    );

    application = Application.start();
    application.register(identifier, SelectAllController);
    await tick();

    document.querySelector('select').dispatchEvent(
      new CustomEvent('autocomplete:connect', {
        bubbles: true,
        detail: { tomSelect },
      }),
    );
    await tick();
  });

  afterEach(() => {
    application.stop();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('loads every page and selects every option', async () => {
    const selectAllButton = document.querySelector(
      `[data-${identifier}-target="selectAllButton"]`,
    );

    selectAllButton.click();
    await tick();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[0][0]).toContain(
      '/autocomplete?context=test&page=1',
    );
    expect(tomSelect.addOption).toHaveBeenCalledTimes(11);
    expect(tomSelect.addItems).toHaveBeenCalledWith([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
    ]);
    expect(selectAllButton.hidden).toBe(true);
  });

  it('clears the selection without another request', async () => {
    const deselectAllButton = document.querySelector(
      `[data-${identifier}-target="deselectAllButton"]`,
    );

    deselectAllButton.hidden = false;
    deselectAllButton.click();

    expect(tomSelect.clear).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('removes generated controls when disconnected', async () => {
    document.querySelector(`[data-controller="${identifier}"]`).remove();
    await tick();

    expect(
      document.querySelector(`[data-${identifier}-target="controls"]`),
    ).toBeNull();
  });
});

describe('legacy controller migration', () => {
  it('supports same-element markup and endpoints without next_page', async () => {
    document.body.innerHTML = `
      <select
        multiple
        data-controller="${identifier}"
        data-label-select-all="Choose everything"
        data-label-deselect-all="Choose nothing"
        data-symfony--ux-autocomplete--autocomplete-url-value="/legacy"
      ></select>
    `;

    const tomSelect = {
      addOption: vi.fn(),
      addItems: vi.fn(),
      clear: vi.fn(),
      getValue: vi.fn(() => []),
    };
    document.querySelector('select').tomselect = tomSelect;

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: Array.from({ length: 10 }, (_, index) => ({
              value: String(index + 1),
              text: `Legacy choice ${index + 1}`,
            })),
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [{ value: '11', text: 'Legacy choice 11' }],
          }),
        }),
    );

    const application = Application.start();
    application.register(identifier, SelectAllController);
    await tick();
    await tick();

    const selectAllButton = document.querySelector(
      `[data-${identifier}-target="selectAllButton"]`,
    );
    const deselectAllButton = document.querySelector(
      `[data-${identifier}-target="deselectAllButton"]`,
    );

    expect(selectAllButton.textContent).toBe('Choose everything');
    expect(deselectAllButton.textContent).toBe('Choose nothing');

    selectAllButton.click();
    await tick();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[0][0]).toContain('/legacy?page=1');
    expect(fetch.mock.calls[1][0]).toContain('/legacy?page=2');
    expect(tomSelect.addItems).toHaveBeenCalledWith([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
    ]);

    application.stop();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });
});
