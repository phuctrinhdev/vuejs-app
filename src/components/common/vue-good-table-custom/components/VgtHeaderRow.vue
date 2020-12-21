
<template>
  <tr>
    <th
      v-if="headerRow.mode === 'span'"
      :colspan="fullColspan"
      class="vgt-left-align vgt-row-header">
      <slot
        :row="headerRow"
        name="table-header-row">
        <span v-if="headerRow.html" v-html="headerRow.label"/>
        <span v-else>
          {{ headerRow.label }}
        </span>
      </slot>
    </th>
    <!-- if the mode is not span, we display every column -->
    <th
      v-if="headerRow.mode !== 'span' && lineNumbers"
      class="vgt-row-header"/>
    <th
      v-if="headerRow.mode !== 'span' && selectable"
      class="vgt-row-header"/>
    <th
      v-for="(column, i) in getShowColumns"
      :key="i"
      :class="getClasses(i, 'td')"
      class="vgt-row-header">
      <slot v-if="headerRow.mode !== 'span'"
            :row="headerRow"
            :column="column"
            :formattedRow="formattedRow(headerRow, true)"
            name="table-header-row">
        <span v-if="!column.html">
          {{ collectFormatted(headerRow, column, true) }}
        </span>
        <span v-if="column.html" v-html="collectFormatted(headerRow, column, true)"/>
      </slot>
    </th>
  </tr>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import {filter} from 'lodash'
export default {
  name: 'VgtHeaderRow',
  components: {
  },
  props: {
    headerRow: {
      type: Object,
    },
    columns: {
      type: Array,
    },
    lineNumbers: {
      type: Boolean,
    },
    selectable: {
      type: Boolean,
    },
    collectFormatted: {
      type: Function,
    },
    formattedRow: {
      type: Function,
    },
    getClasses: {
      type: Function,
    },
    fullColspan: {
      type: Number,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    getShowColumns() {
      return filter(this.columns, function(col){
        return !(col.hide === true)
      })
    },
  },
  methods: {
  },
}
</script>

<style lang="scss">

</style>
