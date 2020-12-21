<template>
  <div class="common-style">
    <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
    <ul class="card-btn btn-group clearfix">
      <li><goods-btn :data="{ label: 'general.add' }" @click-action="onActionPaymentMethod(options.form_actions.add)"/></li>
    </ul>
    <goods-table :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">
      <template slot="edit" slot-scope="{ row }">
        <goods-btn :data="{ label: 'general.edit' }"
                   @click-action="onActionPaymentMethod(options.form_actions.edit, row)"/>
      </template>
    </goods-table>
    
    <payment-method-action @action-success="onActionSuccess"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }          from '../../../../helpers/options'
import SalesCache from '../../../../helpers/cache/sales-cache'
import PaymentMethodApi from '../../../../api/sales/payment-method-api'
import PaymentMethodViewModel from '../../../../view-model/sales/payment-method-view-model'

import misc_code_mixin        from '../../../../helpers/mixins/misc-codes-mixin'
import show_inactives         from '../../../common/show-inactives/show-inactives.vue'
import goods_table            from '../../../goods/goods-table/goods-table.vue'
import goods_btn              from '../../../goods/goods-btn/goods-btn.vue'
import component_base         from '../../../common/component-base/component-base.vue'
import payment_method_action  from './payment-method-action'

export default {
  components: { 
    'payment-method-action': payment_method_action,
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
          { field: 'name', label: 'misc-codes.payment-name',   width: '80%', sortable: false, thClass:'col-misc-code' },
          { field: 'edit', label: 'misc-codes.edit',           width: '20%', sortable: false, thClass:'col-misc-code', expand: true }
        ],
        rows:[],
        groups: [
          { name: 'payment-methods', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true,
          page_size: options.pagination.max,
          page_number: 1,
          drag: options.good_table_drag.off,
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
    ...mapGetters('payment_method', {
      x_payment_methods: 'getPaymentMethods'
    }),
  },
  methods: {
    ...mapActions('payment_method', [
      'setPaymentMethodsData',
      'setPaymentMethodActionData',
      'updatePaymentMethodData'
    ]),

    // table
    async loadDataTable() {
      this.setFilterWithShopData()
      
      this.preLoader()
      let payment_method_api = new PaymentMethodApi()
      let result = await payment_method_api.getPaymentMethodsAsync(this.table_filter)
      this.preLoader(false)
      
      if(result.is_ok){
        this.setPaymentMethodsData(result.data)
        this.table_data.rows = this.x_payment_methods.items
        this.table_data.pagination = this.x_payment_methods.pagination
      }
      else this.showAlertDialog(result.error_messages) 

      // group data for drag-table
      this.table_data.groups[0].rows = this.table_data.rows
    },

    // modal action
    onActionPaymentMethod(action, payment_method = new PaymentMethodViewModel().getFields()){
      this.payment_method_action = {
        action: action,
        data: payment_method,
      }
      this.setPaymentMethodActionData(this.payment_method_action)
      this.showDialogById('payment-method-action-modal')
    },
    async onActionSuccess(payment_method){
      if(this.payment_method_action.action == options.form_actions.add 
      || this.payment_method_action.data.status != payment_method.status) {
        this.loadDataTable()
      }
      else this.updatePaymentMethodData(payment_method)

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
      let payment_method_api = new PaymentMethodApi()
      let result = await payment_method_api.updatePaymentMethodOrderNoAsync(drag_change)
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