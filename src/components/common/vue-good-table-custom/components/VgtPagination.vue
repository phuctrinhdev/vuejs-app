<template>
  <div class="vgt-wrap__footer vgt-clearfix">
    <div class="footer__row-count vgt-pull-left">
      <span class="footer__row-count__label">{{ rowsPerPageText }}</span>
      <select
        v-model="currentPerPage"
        autocomplete="off"
        name="perPageSelect"
        class="footer__row-count__select"
        @change="perPageChanged">
        <option
          v-for="(option, idx) in rowsPerPageOptions"
          :key="'rows-dropdown-option-' + idx"
          :value="option">
          {{ option }}
        </option>
        <option v-if="paginateDropdownAllowAll" :value="total">{{ allText }}</option>
      </select>
    </div>
    <div class="footer__navigation vgt-pull-right">
      <a
        :class="{ disabled: !prevIsPossible }"
        href="javascript:undefined"
        class="footer__navigation__page-btn"
        tabindex="0"
        @click.prevent.stop="previousPage">
        <span :class="{ 'left': !rtl, 'right': rtl }" class="chevron"/>
        <span>{{ prevText }}</span>
      </a>
      <pagination-page-info
        v-if="mode === 'pages'"
        :total-records="total"
        :last-page="pagesCount"
        :current-page="currentPage"
        :of-text="ofText"
        :page-text="pageText"
        @page-changed="changePage"/>
      <div v-else class="footer__navigation__info">{{ paginatedInfo }}</div>
      <a :class="{ disabled: !nextIsPossible }" href="javascript:undefined"
         class="footer__navigation__page-btn" tabindex="0" @click.prevent.stop="nextPage">
        <span>{{ nextText }}</span>
        <span :class="{ 'right': !rtl, 'left': rtl }" class="chevron"/>
      </a>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import _ from 'lodash'
import VgtPaginationPageInfo from './VgtPaginationPageInfo.vue'

const DEFAULT_ROWS_PER_PAGE_DROPDOWN = [10, 20, 30, 40, 50]

export default {
  name: 'VgtPagination',

  components: {
    'pagination-page-info': VgtPaginationPageInfo,
  },
  props: {
    styleClass: { default: 'table table-bordered' },
    total: { default: null },
    perPage: {},
    rtl: { default: false },
    customRowsPerPageDropdown: { default() { return [] } },
    paginateDropdownAllowAll: { default: true },
    mode: { default: 'records' },

    // text options
    nextText: { default: 'Next' },
    prevText: { default: 'Prev' },
    rowsPerPageText: { default: 'Rows per page:' },
    ofText: { default: 'of' },
    pageText: { default: 'page' },
    allText: { default: 'All' },
  },

  data: () => ({
    currentPage: 1,
    prevPage: 0,
    currentPerPage: 10,
    rowsPerPageOptions: [],
  }),

  computed: {
    // Number of pages
    pagesCount() {
      const quotient = Math.floor(this.total / this.currentPerPage)
      const remainder = this.total % this.currentPerPage

      return remainder === 0 ? quotient : quotient + 1
    },

    // Current displayed items
    paginatedInfo() {
      let first = ((this.currentPage - 1) * this.currentPerPage) + 1
      const last = Math.min(this.total, this.currentPage * this.currentPerPage)

      if (last === 0) {
        first = 0
      }

      return `${first} - ${last} ${this.ofText} ${this.total}`
    },

    // Can go to next page
    nextIsPossible() {
      return this.currentPage < this.pagesCount
    },

    // Can go to previous page
    prevIsPossible() {
      return this.currentPage > 1
    },
  },

  watch: {
    perPage: {
      // eslint-disable-next-line no-unused-vars
      handler(newValue, oldValue) {
        this.handlePerPage()
        this.perPageChanged()
      },
      immediate: true,
    },

    customRowsPerPageDropdown() {
      this.handlePerPage()
    },
  },

  methods: {
    // Change current page
    changePage(pageNumber, emit = true) {
      if (pageNumber > 0 && this.total > this.currentPerPage * (pageNumber - 1)) {
        this.prevPage = this.currentPage
        this.currentPage = pageNumber
        if (emit) this.pageChanged()
      }
    },

    // Go to next page
    nextPage() {
      if (this.nextIsPossible) {
        this.prevPage = this.currentPage
        ++this.currentPage
        this.pageChanged()
      }
    },

    // Go to previous page
    previousPage() {
      if (this.prevIsPossible) {
        this.prevPage = this.currentPage
        --this.currentPage
        this.pageChanged()
      }
    },

    // Indicate page changing
    pageChanged() {
      this.$emit('page-changed', {
        currentPage: this.currentPage,
        prevPage: this.prevPage,
      })
    },

    // Indicate per page changing
    perPageChanged() {
      // go back to first page
      this.$emit('per-page-changed', { currentPerPage: this.currentPerPage })
      this.changePage(1, false)
    },

    // Handle per page changing
    handlePerPage() {
      //* if there's a custom dropdown then we use that
      if (this.customRowsPerPageDropdown !== null
        && (Array.isArray(this.customRowsPerPageDropdown)
        && this.customRowsPerPageDropdown.length !== 0)) {
        this.rowsPerPageOptions = this.customRowsPerPageDropdown
      } else {
        //* otherwise we use the default rows per page dropdown
        this.rowsPerPageOptions = _.cloneDeep(DEFAULT_ROWS_PER_PAGE_DROPDOWN)
      }

      if (this.perPage) {
        this.currentPerPage = this.perPage
        // if perPage doesn't already exist, we add it
        let found = false
        for (let i = 0; i < this.rowsPerPageOptions.length; i++) {
          if (this.rowsPerPageOptions[i] === this.perPage) {
            found = true
          }
        }
        if (!found && this.perPage !== -1) {
          this.rowsPerPageOptions.unshift(this.perPage)
        }
      } else {
        // reset to default
        this.currentPerPage = 10
      }
    },
  },
}
</script>

<style lang="scss">

</style>
