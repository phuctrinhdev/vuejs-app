<template>
  <div class="common-style">
    <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
    <ul class="card-btn btn-group clearfix">
      <li><goods-btn :data="{ label: 'general.add' }" @click-action="onActionSalesType(options.form_actions.add)"/></li>
    </ul>
    <goods-table :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">
      <template slot="edit" slot-scope="{ row }">
        <goods-btn :data="{ label: 'general.edit' }"
                   @click-action="onActionSalesType(options.form_actions.edit, row)"/>
      </template>
    </goods-table>
    
    <sales-type-action @action-success="onActionSuccess"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }            from '../../../../helpers/options'
import SalesCache             from '../../../../helpers/cache/sales-cache'
import SalesTypeViewModel     from '../../../../view-model/sales/sales-type-view-model'
import SalesTypeApi           from '../../../../api/sales/sales-type-api'

import misc_code_mixin        from '../../../../helpers/mixins/misc-codes-mixin'
import show_inactives         from '../../../common/show-inactives/show-inactives.vue'
import goods_table            from '../../../goods/goods-table/goods-table.vue'
import goods_btn              from '../../../goods/goods-btn/goods-btn.vue'
import component_base         from '../../../common/component-base/component-base.vue'
import sales_type_action      from './sales-type-action'

export default {
  components: { 
    'sales-type-action': sales_type_action,
    'show-inactives': show_inactives,
    'goods-table': goods_table,
    'goods-btn': goods_btn
  },
  extends: component_base,
  mixins: [misc_code_mixin],
  data() {
    return {
      options,
      
      // table
      table_data: {
        fields: [
          { field: 'name', label: 'misc-codes.sales-type',   width: '80%', sortable: false, thClass:'col-misc-code' },
          { field: 'edit', label: 'misc-codes.edit',         width: '20%', sortable: false, thClass:'col-misc-code', expand: true }
        ],
        rows:[],
        groups: [
          { name: 'sales-types', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: options.good_table_drag.off,
          pagination: true
        },
      },
      table_filter: {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },

      payment_method_action: {}
    }
  },
  computed: {
    ...mapGetters('sales_type', {
      x_sales_types: 'getSalesTypes'
    }),
  },
  methods: {
    ...mapActions('sales_type', [
      'setSalesTypesData',
      'setSalesTypeActionData',
      'updateSalesTypeData'
    ]),

    // table
    async loadDataTable() {
      this.setFilterWithShopData()
      
      this.preLoader()
      let sales_type_api = new SalesTypeApi()
      let result = await sales_type_api.getSalesTypesAsync(this.table_filter)
      this.preLoader(false)
      
      if(result.is_ok){
        this.setSalesTypesData(result.data)
        this.table_data.rows = this.x_sales_types.items
        this.table_data.pagination = this.x_sales_types.pagination
      }
      else this.showAlertDialog(result.error_messages)

      // group data for drag-table
      this.table_data.groups[0].rows = this.table_data.rows
    },

    // modal action
    onActionSalesType(action, sales_type = new SalesTypeViewModel().fields){
      this.sales_type_action = {
        action: action,
        data: sales_type,
      }
      this.setSalesTypeActionData(this.sales_type_action)
      this.showDialogById('sales-type-action-modal')
    },
    onActionSuccess(sales_type){
      if(this.sales_type_action.action == options.form_actions.add 
      || this.sales_type_action.data.status != sales_type.status) {
        this.loadDataTable()
      }
      else this.updateSalesTypeData(sales_type)

      SalesCache.clearAllSalesSetupCache()
    },

    // draggable
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }

      this.preLoader()
      let sales_type_api = new SalesTypeApi()
      let result = await sales_type_api.updateSalesTypeOrderNoAsync(drag_change)
      this.preLoader(false)
      
      if(result.is_ok) {
        this.loadDataTable()
        SalesCache.clearAllSalesSetupCache()
      }
      else this.showAlertDialog(result.error_messages)
    },
  }
}
</script>