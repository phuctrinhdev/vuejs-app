<template>
  <div class="footer__navigation__page-info">
    {{ pageText }} <input
      :value="currentPage"
      class="footer__navigation__page-info__current-entry"
      type="text"
      @keyup.enter.stop="changePage"> {{ pageInfo }}
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
export default {
  name: 'VgtPaginationPageInfo',
  components: {
  },
  props: {
    currentPage: {
      default: 1,
    },
    lastPage: {
      default: 1,
    },
    totalRecords: {
      default: 0,
    },
    ofText: {
      default: 'of',
      type: String,
    },
    pageText: {
      default: 'page',
      type: String,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    pageInfo() {
      return `${this.ofText} ${this.lastPage}`
    },
  },
  methods: {
    changePage(event) {
      const value = parseInt(event.target.value, 10)

      //! invalid number
      if (Number.isNaN(value)
        || value > this.lastPage
        || value < 1) {
        event.target.value = this.currentPage
        return false
      }

      //* valid number
      event.target.value = value
      this.$emit('page-changed', value)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
