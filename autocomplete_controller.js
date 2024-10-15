import { Controller } from '@hotwired/stimulus'
import TomSelect from 'tom-select'

export default class extends Controller {
  initialize () {
    this._onPreConnect = this._onPreConnect.bind(this)
    this._onConnect = this._onConnect.bind(this)
    this._loadAndSelectAll = this._loadAndSelectAll.bind(this)
    this._unselectAll = this._unselectAll.bind(this)
    this._checkSelectStatus = this._checkSelectStatus.bind(this)
  }

  connect () {
    this.element.addEventListener('autocomplete:pre-connect', this._onPreConnect)
    this.element.addEventListener('autocomplete:connect', this._onConnect)
    this._createLoadAllButton()
    this._createUnselectAllButton()
    this._checkSelectStatus()
  }

  _createLoadAllButton () {
    const loadAllButton = document.createElement('button')
    loadAllButton.innerHTML = this.element.getAttribute('data-label-select-all') || 'Select All'
    loadAllButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'float-end', 'd-none', 'select-all-button')
    loadAllButton.type = 'button'

    this.element.parentNode.insertBefore(loadAllButton, this.element)

    loadAllButton.addEventListener('click', this._loadAndSelectAll)
  }

  _createUnselectAllButton () {
    const unselectAllButton = document.createElement('button')
    unselectAllButton.innerHTML = this.element.getAttribute('data-label-deselect-all') || 'Deselect All'
    unselectAllButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'float-end', 'd-none', 'unselect-all-button')
    unselectAllButton.type = 'button'

    this.element.parentNode.insertBefore(unselectAllButton, this.element)

    unselectAllButton.addEventListener('click', this._unselectAll)
  }

  async _loadAndSelectAll (event) {
    const url = this.element.getAttribute('data-symfony--ux-autocomplete--autocomplete-url-value')

    if (!url) {
      console.error('The URL is not defined to load the options.')
      return
    }

    let allOptions = []
    let page = 1
    let hasMore = true

    try {
      while (hasMore) {
        const response = await fetch(`${url}?page=${page}`)
        if (!response.ok) throw new Error('Error while loading options')

        const data = await response.json()

        allOptions = [...allOptions, ...data.results]

        if (data.results.length < 10) {
          hasMore = false
        }

        page += 1
      }

      const tomSelectInstance = this._getOrCreateTomSelectInstance()

      allOptions.forEach((option) => {
        tomSelectInstance.addOption({ value: option.value, text: option.text })
      })

      const optionValues = allOptions.map((option) => option.value)
      tomSelectInstance.addItems(optionValues)

      this._toggleButtons()
    } catch (error) {
      console.error('Error : ', error)
    }
  }

  _unselectAll (event) {
    const tomSelectInstance = this._getOrCreateTomSelectInstance()
    tomSelectInstance.clear()

    this._toggleButtons(true)
  }

  async _checkSelectStatus () {
    const url = this.element.getAttribute('data-symfony--ux-autocomplete--autocomplete-url-value')

    if (!url) {
      console.error('URL not found to check the select status.')
      return
    }

    let allOptions = []
    let page = 1
    let hasMore = true

    try {
      while (hasMore) {
        const response = await fetch(`${url}?page=${page}`)
        if (!response.ok) throw new Error('Error while loading options')

        const data = await response.json()

        allOptions = [...allOptions, ...data.results]

        if (data.results.length < 10) {
          hasMore = false
        }

        page += 1
      }

      const tomSelectInstance = this._getOrCreateTomSelectInstance()
      const selectedValues = tomSelectInstance.getValue()

      const allOptionValues = allOptions.map((option) => option.value)

      const allSelected = allOptionValues.every((value) => selectedValues.includes(value))

      if (allOptionValues.length > 0) {
        if (allSelected) {
          this._toggleButtons(false)
        } else {
          this._toggleButtons(true)
        }
      }
    } catch (error) {
      console.error('Error : ', error)
    }
  }

  _getOrCreateTomSelectInstance () {
    if (!this.element.tomselect) {
      new TomSelect(this.element, {
        persist: true,
        create: false
      })
    }
    return this.element.tomselect
  }

  _toggleButtons (showSelectAll = false) {
    const selectAllButton = this.element.parentNode.querySelector('.select-all-button')
    const unselectAllButton = this.element.parentNode.querySelector('.unselect-all-button')

    if (showSelectAll) {
      selectAllButton.classList.remove('d-none')
      unselectAllButton.classList.add('d-none')
    } else {
      selectAllButton.classList.add('d-none')
      unselectAllButton.classList.remove('d-none')
    }
  }

  _onPreConnect (event) {
    event.detail.options.onInitialize = () => {
      this.element.addEventListener('change', this._checkSelectStatus)
    }
  }
}
