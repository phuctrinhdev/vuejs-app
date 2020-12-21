<template>
  <div class="common-style">
    <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
    <ul class="card-btn btn-group clearfix">
      <li><goods-btn :data="{ label: 'general.add' }" @click-action="onActionDiscountCategory(options.form_actions.add)"/></li>
    </ul>
    <goods-table :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">
      <template slot="discount_value" slot-scope="{ row }">
        {{ formatMoney(row.discount_value, 0) }}<span v-if="row.discount_type == options.sales_enum.discount_type.percent">(%)</span>
      </template>
      <template slot="edit" slot-scope="{ row }">
        <goods-btn :data="{ label: 'general.edit' }"
                   @click-action="onActionDiscountCategory(options.form_actions.edit, row)"/>
      </template>
    </goods-table>
    
    <discount-category-action @action-success="onActionSuccess"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }                from '../../../../helpers/options'
import SalesCache                 from '../../../../helpers/cache/sales-cache'
import DiscountCategoryApi        from '../../../../api/sales/discount-category-api'
import DiscountCategoryViewModel  from '../../../../view-model/sales/discount-category-view-model'

import misc_code_mixin            from '../../../../helpers/mixins/misc-codes-mixin'
import show_inactives             from '../../../common/show-inactives/show-inactives.vue'
import goods_table                from '../../../goods/goods-table/goods-table.vue'
import goods_btn                  from '../../../goods/goods-btn/goods-btn.vue'
import component_base             from '../../../common/component-base/component-base.vue'
import discount_category_action   from './discount-category-action'

import { formatMoney }            from '../../../../helpers/common'

export default {
  components: { 
    'discount-category-action': discount_category_action,
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
          { field: 'name',            label: 'misc-codes.discount-category',  width: '60%', sortable: false, thClass:'col-misc-code' },
          { field: 'discount_value',  label: 'misc-codes.discount%',          width: '20%', sortable: false, thClass:'col-misc-code', expand: true },
          { field: 'edit',            label: 'misc-codes.edit',               width: '20%', sortable: false, thClass:'col-misc-code', expand: true }
        ],
        rows:[],
        groups: [
          { name: 'discount-categorys', rows: [] }
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

      discount_category_action: {}
    }
  },
  computed: {
    ...mapGetters('discount_category', {
      x_discount_categorys: 'getDiscountCategorys'
    }),
  },
  methods: {
    ...mapActions('discount_category', [
      'setDiscountCategorysData',
      'setDiscountCategoryActionData',
      'updateDiscountCategoryData'
    ]),
    formatMoney,

    // table
    async loadDataTable() {
      this.setFilterWithShopData()
      
      this.preLoader()
      let discount_category_api = new DiscountCategoryApi()
      let result = await discount_category_api.getDiscountCategorysAsync(this.table_filter)
      this.preLoader(false)
      
      if(result.is_ok){
        this.setDiscountCategorysData(result.data)
        this.table_data.rows = this.x_discount_categorys.items
        this.table_data.pagination = this.x_discount_categorys.pagination
      }
      else this.showAlertDialog(result.error_messages)

      // group data for drag-table
      this.table_data.groups[0].rows = this.table_data.rows
    },

    // modal action
    onActionDiscountCategory(action, discount_category = new DiscountCategoryViewModel().fields){
      this.discount_category_action = {
        action: action,
        data: discount_category,
      }
      this.setDiscountCategoryActionData(this.discount_category_action)
      this.showDialogById('discount-category-action-modal')
    },
    onActionSuccess(discount_category){
      if(this.discount_category_action.action == options.form_actions.add 
      || this.discount_category_action.data.status != discount_category.status) {
        this.loadDataTable()
      }
      else this.updateDiscountCategoryData(discount_category)

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
      let discount_category_api = new DiscountCategoryApi()
      let result = await discount_category_api.updateDiscountCategoryOrderNoAsync(drag_change)
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