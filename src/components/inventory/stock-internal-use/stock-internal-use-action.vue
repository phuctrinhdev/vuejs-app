<template>
  <b-modal id="stock-internal-use-action-modal"
           :no-close-on-backdrop="true"
           :title="form_title"
           size="sm"
           hide-footer
           class="stock-internal-use-action-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="form-wrapper">
      <div class="row form-group product-name">
        <div class="col-12 col-sm-4">
          <label>{{ $t('products.product-name') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-input id="internal-product-name" v-model="stock_internal_use.fields.product_name" disabled/>
        </div>
      </div>

      <div class="row form-group qty">
        <div class="col-12 col-sm-4">
          <label class="require">{{ $t('general.qty') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input-money id="internal-product-qty" v-model="stock_internal_use.fields.qty" :decimal="0"
                       :zero="false"/>
        </div>
      </div>

      <div class="row form-group staff">
        <div class="col-12 col-sm-4">
          <label>{{ $t('general.staff') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-select id="internal-staff-id" v-model="stock_internal_use.fields.staff_id" 
                         :options="x_staff_options" value-field="id" text-field="aliasname">
            <template v-slot:first>
              <option :value="0">{{ $t('general.select') }}</option>
            </template>
          </b-form-select>
        </div>
      </div>
      
      <div class="row form-group notes">
        <div class="col-12 col-sm-4">
          <label>{{ $t('general.notes') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-input id="internal-notes" v-model="stock_internal_use.fields.notes"/>
        </div>
      </div>

      <div class="row form-group date">
        <div class="col-12 col-sm-4">
          <label>{{ $t('general.date') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <v-date-picker id="internal-using-date"
                         v-model="stock_internal_use.fields.using_date" 
                         :popover="{ placement: 'bottom' }"
                         :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                         @input="onInputUsingDate"/>
        </div>
      </div>

      <error-box :errors="errors"/>
    </div>

    <div class="modal-footer">
      <btn-action-group :data="form_options" 
                        @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
    </div>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { inventory_options }         from '../../../helpers/options/inventory-options.js'
import { DatePicker, setupCalendar } from 'v-calendar'
import input_money                   from '../../common/form/input/input-money/input-money'
import StockInternalUseViewModel     from '../../../view-model/inventory/stock-internal-use/stock-internal-use-view-model'
import StockInternalUseApi           from '../../../api/inventory/stock-internal-use-api'
import radio_group                   from '../../common/form/radio/radio-group/radio-group.vue'

import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'

import { convertDateToTimezone,
  convertDateToTimeStamp}     from '../../../helpers/common'

export default {
  components: {
    'error-box'       : error_box,
    'radio-group'     : radio_group,
    'input-money'     : input_money,
    'btn-action-group': btn_action_group,
    'v-date-picker'   : DatePicker
  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,
      inventory_options,

      form_options: {
        delete: false
      },

      stock_internal_use: new StockInternalUseViewModel(),
      stock_internal_use_api: new StockInternalUseApi(),
      errors: []
    }
  },
  computed:{
    ...mapGetters('stock_internal_use',{
      x_products_with_stock : 'getProductsWithStock',
      x_stock_internal_use_action : 'getStockInternalUseAction'
    }),
    ...mapGetters('staff',{
      x_staff_options : 'getStaffOptions'
    }),
    form_title(){
      if(this.is_form_add)
        return this.$i18n.t('stock-internal-use.add-internal-use')
      if(this.is_form_edit)
        return this.$i18n.t('stock-internal-use.edit-internal-use')
    },
    is_form_add(){
      return this.x_stock_internal_use_action.action == common_options.form_actions.add
    },
    is_form_edit(){
      return this.x_stock_internal_use_action.action == common_options.form_actions.edit
    },
  },
  created(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db',
    })
  },
  methods:{
    hideModal(){
      this.hideDialogById('stock-internal-use-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []
      this.stock_internal_use.setFields(this.x_stock_internal_use_action.data)

      if(this.is_form_add){
        this.stock_internal_use.fields.using_date = convertDateToTimezone(new Date())
      }
      if(this.is_form_edit){
        this.form_options.delete = true
      }
    },
    
    onInputUsingDate(date){
      if(date == null)
        this.stock_internal_use.fields.using_date = convertDateToTimezone(new Date())
    },

    // add & edit
    onConfirm(){
      if(this.is_form_add){
        this.submitActionAsync('addStockInternalUseAsync', 'added')
      }
      else if(this.is_form_edit){
        this.submitActionAsync('updateStockInternalUseAsync', 'edited')
      }
    },
    async submitActionAsync(api_action, success_action){
      let tmp_stock_internal_use = _.cloneDeep(this.stock_internal_use)

      // prepair data
      tmp_stock_internal_use.fields.staff_name     = this.getStaffNameByStaffId(tmp_stock_internal_use.fields.staff_id)
      tmp_stock_internal_use.fields.using_date_ts  = convertDateToTimeStamp(tmp_stock_internal_use.fields.using_date, false, true)
      tmp_stock_internal_use.fields.user_id        = this.x_user.user_id
      tmp_stock_internal_use.fields.user_name      = this.x_user.user_name,
      tmp_stock_internal_use.fields.shop_id        = this.shop_data.shop_id

      // validate
      this.errors = tmp_stock_internal_use.isValid()
      if(this.errors.length == 0) {
        this.preLoader()
        let result = await this.stock_internal_use_api[api_action](tmp_stock_internal_use)
        this.preLoader(false)
        
        if(result.is_ok) {
          this.actionSuccess(result.data, success_action)
        }
        else this.errors = result.error_messages
      }
    },
    getStaffNameByStaffId(staff_id){
      let tmp_staff_name = ''
      let tmp_staffs = this.x_staff_options.filter(o => o.id == staff_id)
      if(tmp_staffs.length > 0 && staff_id != 0){
        tmp_staff_name = tmp_staffs[0].aliasname
      }
      return tmp_staff_name
    },
    actionSuccess(result_data, event){
      this.$emit(event, result_data)
      this.hideModal()
    },

    // delete
    async onDelete(){
      let tmp_stock_internal_use = _.cloneDeep(this.stock_internal_use)

      // prepair data
      tmp_stock_internal_use.fields.user_id        = this.x_user.user_id
      tmp_stock_internal_use.fields.user_name      = this.x_user.user_name,
      tmp_stock_internal_use.fields.shop_id        = this.shop_data.shop_id

      this.preLoader()
      let result = await this.stock_internal_use_api.deleteStockInternalUseAsync(tmp_stock_internal_use)
      this.preLoader(false)
      
      if(result.is_ok) {
        this.actionSuccess(result.data, 'deleted')
      }
      else this.errors = result.error_messages
    },
  }
}
</script>

<style lang="scss">
@import './stock-internal-use-action.scss'
</style>
