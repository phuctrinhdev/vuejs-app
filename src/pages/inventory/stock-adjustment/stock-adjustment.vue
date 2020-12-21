<template>
  <main class="app-content">
    <section class="content stock-adjustment-page">
      <div class="page-title">
        <h3>{{ $t('stock-adjustment.stock-adjustment') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link :to="{ name: 'stock-adjustment-history' }">{{ $t('stock-adjustment.stock-adjustment-history') }}</router-link></li>
        </ul>
      </div>
      
      <div id="table-stock-adjustment" :class="{ 'has-pagination': table_data.pagination.total_pages > 1 }" class="table table-stock-adjustment">
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="stock_before_col">
            <div class="th-double" v-html="$t('stock-adjustment.stock-on-hand-before')"/>
          </template>
          <template slot="stock_after_col">
            <div class="th-double" v-html="$t('stock-adjustment.stock-on-hand-after')"/>
          </template>

          <template slot="stock_before" slot-scope="{row}">
            {{ formatMoney(row.stock_before, 0) }}
          </template>
          <template slot="stock_after" slot-scope="{row}">
            <input-money v-if="row.stock_after == ''" 
                         v-model="row.stock_after" :zero="false" @input="onInputStockAfter(row)"/>
            <input-money v-else 
                         v-model="row.stock_after" :zero="true" @input="onInputStockAfter(row)"/>
          </template>
        </view-table>
        <div class="btn-wrapper">
          <div class="btn btn-save" @click="onConfirm">{{ $t('general.save') }}</div>
        </div>
      </div>

      <stock-adjustment-notes-action ref="stock_adjustment_notes_action" @edited-notes="onEditedNotes"/>
    </section>
  </main>
</template>

<script>
// import _ from 'lodash'
// import moment from 'moment'
import { mapMutations, mapGetters }   from 'vuex'
import { options }    from '../../../helpers/options'
import { inventory_options } from '../../../helpers/options/inventory-options.js'
import product_mixin from '../../../helpers/mixins/product-mixin'
import stock_adjustment_notes_action from '../../../components/inventory/stock-adjustment-notes-action/stock-adjustment-notes-action'
import component_base        from '../../../components/common/component-base/component-base.vue'
import view_table            from '../../../components/common/view-table/view-table.vue'
import StockAdjustmentApi from '../../../api/inventory/stock-adjustmnet-api'
import input_money from '../../../components/common/form/input/input-money/input-money-type'
import StockAdjustmentViewModel from '../../../view-model/inventory/stock-adjustment/stock-adjustment-view-model'
import { formatMoney } from '../../../helpers/common'

export default {
  components : {
    'input-money': input_money,
    'view-table' : view_table,
    'stock-adjustment-notes-action': stock_adjustment_notes_action
  },
  extends : component_base,
  mixins: [product_mixin],
  data(){
    return {
      options,
      inventory_options,

      stock_adjustment: new StockAdjustmentViewModel(),
      stock_adjustment_api: new StockAdjustmentApi(),

      table_data   : {
        fields : [
          {field: 'code',          label: 'products.product-code', width: '20%',   sortable: false },
          {field: 'name',          label: 'products.product-name', width: '40%',   sortable: false },
          {field: 'stock_before',  label: 'products.stock-on-hand',width: '20%',   sortable: false, expand: true, column_expand: true, thClass: 'stock-before' },
          {field: 'stock_after',   label: 'products.stock-on-hand',width: '20%',   sortable: false, expand: true, column_expand: true, thClass: 'stock-after' },
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: true }
      },
      table_filter: {
        product_category_id: 0,
        key_word: '',
        usage_status: options.usage_status.all,
        status: options.good_status.active,
        page_size: options.pagination.big,
        page_number: 1,
        shop_id: 0,
      },
    }
  },
  computed:{
    ...mapGetters('stock_internal_use',{
      x_products_with_stock : 'getProductsWithStock',
    }),
    product_placeholder(){ return this.$i18n.t('stock-internal-use.product-code-or-name') },
    text_all(){ return this.$i18n.t('general.all') },
    stock_adjustment_not_selected(){return this.$i18n.t('stock-adjustment.stock_adjustment_not_selected')},
    stock_adjustment_max_characters(){return this.$i18n.t('stock-adjustment.stock_adjustment_max_characters')}
  },
  async created(){
    // stock-internal-use
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.onLoadTableData()
  },

  methods:{
    ...mapMutations('stock_adjustment',[
      'setStockAdjustmentAction'
    ]),
    formatMoney,

    // table
    async onLoadTableData(){
      this.preLoader()
      let response = await this.getProductsWithStockAsyncMixin(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        let tmp_products = []
        for(let product of response.data.items){
          let tmp_product = product
          tmp_product.stock_before = product.stock_on_hand
          tmp_product.stock_after  = ''
          tmp_products.push(tmp_product)
        }
        this.table_data.rows       = tmp_products
        this.table_data.pagination = response.data.pagination
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onChangePage(page_number){
      this.table_filter.page_number = page_number
      this.onLoadTableData()
    },

    // action
    onInputStockAfter(row){
      let changed_rows = this.table_data.rows.filter(r => r.id == row.id)
      if(changed_rows.length > 0){
        changed_rows[0].stock_after = row.stock_after
      }
    },
    async onConfirm(){
      // stock_adjustment
      this.stock_adjustment.mapFieldsFromProducts(this.table_data.rows)
      this.stock_adjustment.fields.user_id  = this.x_user.user_id,
      this.stock_adjustment.fields.user_name= this.x_user.user_name
      this.stock_adjustment.fields.shop_id  = this.shop_data.shop_id

      // validate
      if(this.stock_adjustment.fields.items.length == 0){
        this.showAlert([this.stock_adjustment_not_selected])
        return
      }
      for(let item of this.stock_adjustment.fields.items){
        if(item.stock_after.length > 10){
          this.showAlert([this.stock_adjustment_max_characters])
          return
        }
      }

      // stock_adjustment_action
      let tmp_stock_adjustment_action = {
        action: 0,
        data  : this.stock_adjustment.getFields(),
        options: {
          cases: this.stock_adjustment.fields.items.length,
          cases_total: this.table_data.rows.length
        }
      }
      this.setStockAdjustmentAction(tmp_stock_adjustment_action)
      this.showDialogById('stock-adjustment-notes-action-modal')
    },
    async onEditedNotes(notes){
      this.stock_adjustment.fields.notes = notes
      await this.submitStockAdjustment()
    },
    async submitStockAdjustment(){
      let errors = this.stock_adjustment.isValid()
      if(errors.length == 0){
        this.preLoader()
        let response = await this.stock_adjustment_api.addStockAdjustmentAsync(this.stock_adjustment)
        this.preLoader(false)
        
        if(response.is_ok){
          this.$refs.stock_adjustment_notes_action.onCancel()
          this.onChangePage(1)
        }
        else {
          let tmp_error_messages = []
          for(let error_message of response.error_messages){
            let index = error_message.indexOf(inventory_options.error_codes.stock_adjustment.saj07c)
            if(index > -1){
              tmp_error_messages.push(error_message)
              break
            }
          }
          this.showAlert(tmp_error_messages)
        }
      }
      else {
        this.showAlert(errors)
      }
    }
  }
}
</script>

<style lang="scss">
@import './stock-adjustment.scss';
</style>