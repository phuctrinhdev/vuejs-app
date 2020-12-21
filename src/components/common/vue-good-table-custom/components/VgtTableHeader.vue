<template>
  <thead>
    <tr>
      <th v-if="lineNumbers" class="line-numbers"/>
      <th v-if="selectable" class="vgt-checkbox-col">
        <input
          :checked="allSelected"
          :indeterminate.prop="allSelectedIndeterminate"
          type="checkbox"
          @change="toggleSelectAll" >
      </th>
      <th v-for="(column, index) in getShowColumns"
          :key="index"
          :class="getHeaderClasses(column, index)"
          :style="columnStyles[index]"
          @click="sort($event, column)">
        <slot :column="column" name="table-column">
          <span>{{ column.label }}</span>
        </slot>
      </th>
    </tr>
    <tr
      is="vgt-filter-row"
      ref="filter-row"
      :global-search-enabled="searchEnabled"
      :line-numbers="lineNumbers"
      :selectable="selectable"
      :columns="columns"
      :mode="mode"
      :typed-columns="typedColumns"
      @filter-changed="filterRows"/>
  </thead>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import {assign,filter} from 'lodash'
import VgtFilterRow from './VgtFilterRow.vue'
import * as SortUtils from './utils/sort.js'

export default {
  name: 'VgtTableHeader',
  components: {
    'vgt-filter-row': VgtFilterRow,
  },
  props: {
    lineNumbers: {
      default: false,
      type: Boolean,
    },
    selectable: {
      default: false,
      type: Boolean,
    },
    allSelected: {
      default: false,
      type: Boolean,
    },
    allSelectedIndeterminate: {
      default: false,
      type: Boolean,
    },
    columns: {
      type: Array,
    },
    mode: {
      type: String,
    },
    typedColumns: {},

    //* Sort related
    sortable: {
      type: Boolean,
    },
    // sortColumn: {
    //   type: Number,
    // },
    // sortType: {
    //   type: String,
    // },

    // utility functions
    // isSortableColumn: {
    //   type: Function,
    // },
    getClasses: {
      type: Function,
    },

    //* search related
    searchEnabled: {
      type: Boolean,
    },

    tableRef: {},

    paginated: {},
  },
  data() {
    return {
      timer: null,
      checkBoxThStyle: {},
      lineNumberThStyle: {},
      columnStyles: [],
      sorts: [],
    }
  },
  computed: {
    getShowColumns() {
      return filter(this.columns, function(col){
        return !(col.hide === true)
      })
    },
  },
  watch: {
    tableRef: {
      handler() {
        this.setColumnStyles()
      },
      immediate: true,
    },
    paginated: {
      handler() {
        if (this.tableRef) {
          this.setColumnStyles()
        }
      },
      deep: true,
    },
  },
  mounted() {
    window.addEventListener('resize', this.setColumnStyles)
  },
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer)
    window.removeEventListener('resize', this.setColumnStyles)
  },
  methods: {
    reset() {
      this.$refs['filter-row'].reset(true)
    },
    toggleSelectAll() {
      this.$emit('on-toggle-select-all')
    },
    isSortableColumn(column) {
      const { sortable } = column
      const isSortable = typeof sortable === 'boolean' ? sortable : this.sortable
      return isSortable
    },
    sort(e, column) {
      //* if column is not sortable, return right here
      if (!this.isSortableColumn(column)) return

      if (e.shiftKey) {
        this.sorts = SortUtils.secondarySort(this.sorts, column)
      } else {
        this.sorts = SortUtils.primarySort(this.sorts, column)
      }
      this.$emit('on-sort-change', this.sorts)
    },

    setInitialSort(sorts) {
      this.sorts = sorts
      this.$emit('on-sort-change', this.sorts)
    },

    getColumnSort(column) {
      for (let i = 0; i < this.sorts.length; i += 1) {
        if (this.sorts[i].field === column.field) {
          return this.sorts[i].type || 'asc'
        }
      }
      return null
    },

    getHeaderClasses(column, index) {
      const classes = assign({}, this.getClasses(index, 'th'), {
        'sorting sorting-desc': this.getColumnSort(column) === 'desc',
        'sorting sorting-asc': this.getColumnSort(column) === 'asc',
      })
      return classes
    },

    filterRows(columnFilters) {
      this.$emit('filter-changed', columnFilters)
    },

    getWidthStyle(dom) {
      if (window && window.getComputedStyle) {
        const cellStyle = window.getComputedStyle(dom, null)
        return {
          width: cellStyle.width,
        }
      }
      return {
        width: 'auto',
      }
    },

    setColumnStyles() {
      const colStyles = []
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        for (let i = 0; i < this.columns.length; i++) {
          if (this.tableRef) {
            let skip = 0
            if (this.selectable) skip++
            if (this.lineNumbers) skip++
            const cell = this.tableRef.rows[0].cells[i + skip]
            colStyles.push(this.getWidthStyle(cell))
          } else {
            colStyles.push({
              width: this.columns[i].width ? this.columns[i].width : 'auto',
            })
          }
        }
        this.columnStyles = colStyles
      }, 200)
    },

    getColumnStyle(column, index) {
      const styleObject = {
        width: column.width ? column.width : 'auto',
      }
      //* if fixed header we need to get width from original table
      if (this.tableRef) {
        if (this.selectable) index++
        if (this.lineNumbers) index++

        const cell = this.tableRef.rows[0].cells[index]
        const cellStyle = window.getComputedStyle(cell, null)
        styleObject.width = cellStyle.width
      }
      return styleObject
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
