<template>
  <div class="clients-table-wrapper">
    <div class="clients-table-content">
      <vue-client-table-custom :rows="table_data.rows" :columns="table_data.fields" 
                               :row-style-class="rowStyleClassFn" :select-options="table_data.options.select_options"
                               style-class="normal"
                               @on-selected-rows-change="onSelectRows"
                               @on-row-click="onClickRows">
        <!-- action at top table -->
        <template slot="table-actions">
          <slot name="table-actions"/>
        </template>
        <!-- columns -->
        <template slot="table-column" slot-scope="props">
          <span v-if="props.column.field == 'calendar'" class="calendar-img-gray" />
          <span v-else-if="props.column.label != 'checkbox'">
            {{ $t(props.column.label) }}
          </span>
          <span v-else>
            <b-form-checkbox v-model="check_flag" @change="onCheckAll"/>
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
          <span v-if="props.column.label == 'checkbox'">
            <b-form-checkbox v-model="checked" :value="props.row.id"/>
          </span>
        </template>
        <!-- action at bottom table -->
        <div slot="table-actions-bottom">
          <slot name="table-actions-bottom"/>
        </div>
        <!-- show in no rows -->
        <div slot="emptystate">{{ $t('general.table-empty') }}</div>
      </vue-client-table-custom>
    </div>
    <div>
      <pagination v-if="table_data.options.pagination" :pagination.sync="table_data.pagination" @change-page="onChangePage"/>
    </div>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'
import pagination from '../../../components/common/pagination/pagination.vue'
import vue_client_table_custom from '../../../components/common/vue-good-table-custom/components/Table.vue'
import clients_btn from '../../../components/common/button/common-btn/common-btn.vue'

export default {
  components: {
    pagination,
    'vue-client-table-custom': vue_client_table_custom,
    'clients-btn': clients_btn
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
      check_flag: false,
      checkbox:'checkbox'
    }
  },
  computed: {
    table_data(){
      return this.data
    },
  },
  watch: {
    'data.status_action'(){
      this.$emit('change-status', this.checked)
    },
    'data.delete_action'(){
      this.$emit('deleted-action', this.checked)
    }
  },
  updated(){
    this.checked = []
    this.check_flag = false
  },
  methods: {
    // table UI
    onChangePage(page_num){
      this.$emit('change-page', page_num)
    },
    // modal action
    onActionModal(action, model = {}){
      this.$emit('action-modal', action, model)
    },
    rowStyleClassFn(row){
      let row_classes = ''
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
    onCheckAll(){
      this.check_flag = !this.check_flag

      if(this.check_flag){
        for(let i in this.table_data.rows){
          if(this.checked.indexOf(this.table_data.rows[i].id) == -1){
            this.checked.push(this.table_data.rows[i].id)
          }
        }
      }else{
        this.checked = []
      }
    },
  }
}
</script>

<style lang="scss">
@import './clients-table.scss';
</style>