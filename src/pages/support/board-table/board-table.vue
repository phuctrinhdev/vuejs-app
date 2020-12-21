<template>
  <div class="view-table-wrapper table-data form-wrapper">
    <vue-good-table-custom :columns="table_data.fields" :rows="table_data.rows" 
                           :select-options="table_data.options.select_options" 
                           :fixed-header="table_data.options.fixed_header" 
                           :row-style-class="rowStyleClassFn"
                           :style-class="table_data.style"
                           :class="{ empty: table_data.rows.length == 0 }"
                           max-height="550px" row-key="id"
                           @on-selected-rows-change="onSelectRows"
                           @on-row-click="onClickRows">
      <!-- action at top table -->
      <template slot="table-actions">
        <slot name="table-actions"/>
      </template>
      <!-- columns -->
      <template slot="table-column" slot-scope="props">
        <span v-if="props.column.column_expand">
          <slot :name="props.column.field + '_col'" :column="props.column" :props="props"/>
        </span>
        <span v-else>{{ $t(props.column.label) }}</span>
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
    </vue-good-table-custom>

    <!-- <pagination v-if="table_data.options.pagination" :pagination.sync="table_data.pagination" @change-page="onChangePage"/> -->
  </div>
</template>

<script>
import { options } from '../../../helpers/options'
import pagination from '../../../components/common/pagination/pagination.vue'
import vue_good_table_custom from '../../../components/common/vue-good-table-custom/components/Table.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    pagination,
    'vue-good-table-custom': vue_good_table_custom
  },
  props: {
    data: {
      type: Object,
      default: () => []
    },
  },
  data(){
    return {
      // options
      options: options
    }
  },
  computed: {
    ...mapGetters('user', {
      x_user   : 'getUser'
    }),
    table_data(){
      return this.data
    }
  },
  methods: {
    // table UI
    // onChangePage(page_num){
    //   this.$emit('change-page', page_num)
    // },

    // modal action
    rowStyleClassFn(row){
      let row_classes = ''
      if(row.status == options.good_status.inactive) row_classes += ' inactive'
      if(row.selected) row_classes += ' selected'
      if(row.post_on_top) row_classes += ' selected'
      if(this.table_data.options.clickable) row_classes += ' change-cursor'
      if(row.master_only_reading && this.x_user.user_role_code != options.user_roles.master) row_classes += ' disabled'
      return row_classes
    },

    // select rows
    onSelectRows(params) {
      this.$emit('select-rows', params.selectedRows)
    },

    // click rows
    onClickRows(row){
      if(this.x_user.user_role_code == options.user_roles.master || !row.row.master_only_reading)
        this.$emit('click-rows', row)
    }
  }
}
</script>
<style lang='scss'>
@import './board-table.scss';
</style>