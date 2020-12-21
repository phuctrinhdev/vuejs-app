<template>
  <div class="clients-table-wrapper">
    <div class="clients-table-content">
      <vue-staff-table-custom :rows="table_data.rows" :columns="table_data.fields" 
                              :row-style-class="rowStyleClassFn" :select-options="table_data.options.select_options"
                              @on-selected-rows-change="onSelectRows"
                              @on-row-click="onClickRows">
        <!-- action at top table -->
        <template slot="table-actions">
          <slot name="table-actions"/>
        </template>
        <!-- columns -->
        <template slot="table-column" slot-scope="props">
          <span>
            {{ $t(props.column.label) }}
          </span>
        </template>
        <!-- rows -->
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.expand">
            <slot :name="props.column.field" :row="props.row" :props="props"/>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
        <!-- action at bottom table -->
        <div slot="table-actions-bottom">
          <slot name="table-actions-bottom"/>
        </div>
        <!-- show in no rows -->
        <div slot="emptystate">{{ $t('general.table-empty') }}</div>
      </vue-staff-table-custom>
    </div>
    <div>
      <pagination v-if="table_data.options.pagination" :pagination.sync="table_data.pagination" @change-page="onChangePage"/>
    </div>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'
import pagination from '../../../components/common/pagination/pagination.vue'
import vue_staff_table_custom from '../../../components/common/vue-good-table-custom/components/Table.vue'

export default {
  components: {
    pagination,
    'vue-staff-table-custom': vue_staff_table_custom
  },
  props: {
    data: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      // options
      options: options,
      checked: [],
      check_flag: false
    }
  },
  computed: {
    table_data(){
      return this.data
    },
  },
  methods: {
    // table UI
    onChangePage(page_num){
      this.$emit('change-page', page_num)
    },
    rowStyleClassFn(row){
      let row_classes = ''
      if(row.status == options.staffs_enums.status.inactive) row_classes += ' inactive'
      if(row.selected) row_classes += ' selected'
      return row_classes
    },
    // select rows
    onSelectRows(params) {
      this.$emit('select-rows', params.selectedRows)
    },
    onClickRows(data){
      if(data.row.id != this.table_data.user_id)
        this.$emit('click-rows', { client_id: data.row.id, client_name: data.row.client_name} )
    },
  }
}
</script>

<style lang="scss">

</style>