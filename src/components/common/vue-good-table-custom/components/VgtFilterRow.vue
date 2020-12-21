
<template>
  <tr v-if="hasFilterRow">
    <th v-if="lineNumbers"/>
    <th v-if="selectable"/>
    <th v-for="(column, index) in getShowColumns"
        :key="index"
        class="filter-th">
      <div
        v-if="isFilterable(column)">
        <input v-if="!isDropdown(column)"
               :placeholder="getPlaceholder(column)"
               :value="columnFilters[column.field]"
               type="text"
               class="vgt-input"
               @keyup.enter="updateFiltersOnEnter(column, $event.target.value)"
               @input="updateFiltersOnKeyup(column, $event.target.value)" >

        <!-- options are a list of primitives -->
        <select v-if="isDropdownArray(column)"
                :value="columnFilters[column.field]"
                class="vgt-select"
                @change="updateFilters(column, $event.target.value)">
          <option key="-1" value="">{{ getPlaceholder(column) }}</option>
          <option
            v-for="(option, i) in column.filterOptions.filterDropdownItems"
            :key="i"
            :value="option">
            {{ option }}
          </option>
        </select>

        <!-- options are a list of objects with text and value -->
        <select v-if="isDropdownObjects(column)"
                :value="columnFilters[column.field]"
                class="vgt-select"
                @input="updateFilters(column, $event.target.value, true)">
          <option key="-1" value="">{{ getPlaceholder(column) }}</option>
          <option
            v-for="(option, i) in column.filterOptions.filterDropdownItems"
            :key="i"
            :value="option.value">{{ option.text }}</option>
        </select>
      </div>
    </th>
  </tr>
</template>

<script>
/* eslint-disable vue/require-prop-types */
import {isEqual,filter} from 'lodash'

export default {
  name: 'VgtFilterRow',
  props: [
    'lineNumbers',
    'columns',
    'typedColumns',
    'globalSearchEnabled',
    'selectable',
    'mode',
  ],
  data() {
    return {
      columnFilters: {},
      timer: null,
    }
  },
  computed: {
    getShowColumns() {
      return filter(this.columns, function(col){
        return !(col.hide === true)
      })
    },
    // to create a filter row, we need to
    // make sure that there is atleast 1 column
    // that requires filtering
    hasFilterRow() {
      // if (this.mode === 'remote' || !this.globalSearchEnabled) {
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i]
        if (col.filterOptions && col.filterOptions.enabled) {
          return true
        }
      }
      // }
      return false
    },
  },
  watch: {
    columns: {
      handler(newValue, oldValue) {
        if (!isEqual(newValue, oldValue)) {
          this.populateInitialFilters()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    reset(emitEvent = false) {
      this.columnFilters = {}
      if (emitEvent) {
        this.$emit('filter-changed', this.columnFilters)
      }
    },

    isFilterable(column) {
      return column.filterOptions
        && column.filterOptions.enabled
    },

    isDropdown(column) {
      return this.isFilterable(column)
        && column.filterOptions.filterDropdownItems
        && column.filterOptions.filterDropdownItems.length
    },

    isDropdownObjects(column) {
      return this.isDropdown(column)
        && typeof column.filterOptions.filterDropdownItems[0] === 'object'
    },

    isDropdownArray(column) {
      return this.isDropdown(column)
        && typeof column.filterOptions.filterDropdownItems[0] !== 'object'
    },

    // get column's defined placeholder or default one
    getPlaceholder(column) {
      const placeholder = (this.isFilterable(column) && column.filterOptions.placeholder) || `Filter ${column.label}`
      return placeholder
    },

    updateFiltersOnEnter(column, value) {
      if (this.timer) clearTimeout(this.timer)
      this.updateFiltersImmediately(column, value)
    },

    updateFiltersOnKeyup(column, value) {
      // if the trigger is enter, we don't filter on keyup
      if (column.filterOptions.trigger === 'enter') return
      this.updateFilters(column, value)
    },

    // since vue doesn't detect property addition and deletion, we
    // need to create helper function to set property etc
    updateFilters(column, value) {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.updateFiltersImmediately(column, value)
      }, 400)
    },

    updateFiltersImmediately(column, value) {
      this.$set(this.columnFilters, column.field, value)
      this.$emit('filter-changed', this.columnFilters)
    },

    populateInitialFilters() {
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i]
        // lets see if there are initial
        // filters supplied by user
        if (this.isFilterable(col)
          && typeof col.filterOptions.filterValue !== 'undefined'
          && col.filterOptions.filterValue !== null) {
          this.$set(this.columnFilters, col.field, col.filterOptions.filterValue)
          // this.updateFilters(col, col.filterOptions.filterValue);
          this.$set(col.filterOptions, 'filterValue', undefined)
        }
      }
      //* lets emit event once all filters are set
      this.$emit('filter-changed', this.columnFilters)
    },
  },
}
</script>

<style scoped>

</style>
