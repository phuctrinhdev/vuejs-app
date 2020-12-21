<template>
  <b-modal id="sales-item-staff-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="sales-item-staff-action-modal"
           @show="onLoadForm"
           @hide="onCancel()">
    <b-form-checkbox v-model="multiple_staffs_mode" :value="true" 
                     class="multiple-staffs-mode" @change="onChangeMultipleStaffsMode">
      {{ $t('sales.multiple-staffs') }}
    </b-form-checkbox>

    <div class="select-staffs-wrapper">
      <div class="row">
        <div class="col-md-8">
          <div class="staffs-list">
            <ul class="row">
              <li :class="{ active: staffs_selected.length == 0 }" class="col-6">
                <a @click="onClickNotSelect">{{ $t('sales.not-select') }}</a>
              </li>
              <li v-for="(staff, index) in staffs" :key="index" 
                  :class="{ active: staff.selected }" class="col-6">
                <a @click="onClickStaff(staff)">{{ staff.staff_name }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-4">
          <div class="modal-footer view-pc">
            <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
          </div>
          <div v-if="multiple_staffs_mode && staffs_selected.length > 0" class="staffs-payment">
            <div class="sales-amount">{{ $t('sales.sales-amount') }} : {{ formatMoney(item_amount, 0) }}</div>
            <div class="split-sales-mode">
              <label class="title">{{ $t('sales.split-sales') }}</label>
              <radio-group v-model="split_sales_type" :options="split_sales_type_options" @input="onSplitSalesAmount"/>
            </div>
            <div class="split-staffs-amount">
              <ul>
                <li v-for="(staff, index) in staffs_selected" :key="index" class="row">
                  <div class="col-6 name">
                    <label>{{ staff.staff_name }}</label>
                  </div>
                  <div class="col-6 money">
                    <input-money v-model="staff.amount" :decimal="0" :zero="true"
                                 :disabled="split_sales_type == sales_options.split_sales_type.even"/>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer view-mobile">
            <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import _                         from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import { options }               from '../../../helpers/options'
import { sales_options }         from '../../../helpers/options/sales-options'
import SalesItemStaffViewModel   from '../../../view-model/sales/sales-item/sales-item-staff-view-model'
import SalesUtils                from '../../../helpers/utils/sales-utils'
import component_base            from '../../common/component-base/component-base'
import btn_action_group          from '../../common/button/btn-action-group/btn-action-group'
import radio_group               from '../../common/form/radio/radio-group/radio-group'
import input_money               from '../../common/form/input/input-money/input-money.vue'

import { formatMoney } from '../../../helpers/common'


export default {
  components: {
    'btn-action-group': btn_action_group,
    'radio-group': radio_group,
    'input-money': input_money,
  },
  extends: component_base,
  props: {
    staff_options: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'sales'
    }
  },
  data(){
    return {
      options,
      sales_options,

      form_options: {
        delete: false
      },

      multiple_staffs_mode: false,
      staffs: [],
      staffs_selected: [],
      item_amount: 0,

      split_sales_type: sales_options.split_sales_type.even,
      split_sales_type_options: [
        { value: sales_options.split_sales_type.even,       text: 'sales.even' },
        { value: sales_options.split_sales_type.user_input, text: 'sales.user-input' }
      ],

      errors: []
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_sales_item_action: 'getSalesItemAction'
    }),
    ...mapGetters('refund', {
      x_refund_item_action: 'getRefundItemAction'
    }),
    form_title(){return this.$i18n.t('sales.select-staff')},
    split_sales_exceed_sales_amount(){return this.$i18n.t('sales.split-sales-exceed-sales-amount')},
    split_sales_less_than_sales_amount(){return this.$i18n.t('sales.split-sales-less-than-sales-amount')},
    item_action(){
      let tmp_item_action = {}
      if(this.type == 'sales'){
        tmp_item_action = this.x_sales_item_action
      }
      if(this.type == 'refund'){
        tmp_item_action = this.x_refund_item_action
      }
      return tmp_item_action
    }
  },
  methods: {
    ...mapMutations('sales',[
      'updateSalesActionSalesItem',
    ]),
    formatMoney,

    hideModal(){
      this.hideDialogById('sales-item-staff-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.multiple_staffs_mode = false

      this.staffs = []
      for(let staff of this.staff_options){
        staff.selected = false
        this.staffs.push(staff)
      }

      this.staffs_selected = this.item_action.data.staffs
      for(let staff_selected of this.staffs_selected){
        for(let staff of this.staff_options){
          if(staff.staff_id == staff_selected.staff_id){
            staff.selected = true
          }
        }
      }
      let tmp_item_amount = this.item_action.data.amount
      if(this.type == 'sales' 
      && this.item_action.data.goods_type == sales_options.sales_goods_type.prepaid_service 
      && this.item_action.data.deduction_type == sales_options.deduction_type.prepaid_service){
        tmp_item_amount = this.item_action.data.quantity * this.item_action.data.unit_price
      }
      this.item_amount = tmp_item_amount
      this.split_sales_type = sales_options.split_sales_type.even
      if(this.item_action.data.staffs.length > 1){
        this.multiple_staffs_mode = true
        this.split_sales_type = SalesUtils.getSplitSalesTypeOfSalesItem(this.staffs_selected)
      }
      SalesUtils.updateStaffsAmountOfSalesItem(this.staffs_selected, this.item_amount)

      this.errors = []
    },
    onChangeMultipleStaffsMode(){
      if(this.multiple_staffs_mode && this.staffs_selected.length > 1)
        this.onClickNotSelect()
    },
    onClickNotSelect(){
      this.staffs.map(s => s.selected = false)
      this.setStaffsSelected()

      this.split_sales_type = sales_options.split_sales_type.even
    },
    onClickStaff(staff){
      // de-select
      let tmp_staffs_selected = this.staffs_selected.filter(s => s.staff_id == staff.staff_id)
      if(tmp_staffs_selected.length > 0){
        for(let tmp_staff of this.staffs){
          if(tmp_staff.staff_id == staff.staff_id){
            tmp_staff.selected = false
            this.setStaffsSelected()
            return
          }
        }
      }
      // select
      if(!this.multiple_staffs_mode) {
        this.staffs.map(s => s.selected = false)
      }
      for(let tmp_staff of this.staffs){
        if(tmp_staff.staff_id == staff.staff_id){
          tmp_staff.selected = true
          tmp_staff.amount = 0
          break
        }
      }
      this.setStaffsSelected()
      // confirm auto
      if(!this.multiple_staffs_mode) {
        this.onConfirm()
      }
    },
    setStaffsSelected(){
      this.staffs_selected = this.staffs.filter(s => s.selected)
      this.onSplitSalesAmount()
    },
    onSplitSalesAmount(){
      if(this.split_sales_type == sales_options.split_sales_type.even){
        let tmp_amount = Math.floor(this.item_amount / this.staffs_selected.length)
        let tmp_remain = this.item_amount % this.staffs_selected.length

        this.staffs_selected.map(s => s.amount = tmp_amount)
        if(tmp_remain > 0){
          _.last(this.staffs_selected).amount += tmp_remain
        }
      }
    },
    onConfirm(){
      // validate staff money
      for(let staff of this.staffs_selected){
        let tmp_staff = new SalesItemStaffViewModel()
        tmp_staff.setFields(staff)

        this.errors = tmp_staff.isValid()
        if(this.errors.length > 0){
          this.showAlert(this.errors)
          return
        }
      }

      // validate sales amount
      if(this.split_sales_type == sales_options.split_sales_type.user_input){
        let tmp_split_amounts = 0
        for(let staff of this.staffs_selected){
          tmp_split_amounts += Number(staff.amount)
        }
        
        let tmp_diff_amount = tmp_split_amounts - this.item_amount
        if(tmp_diff_amount != 0){
          let tmp_message = ''
          if(tmp_diff_amount > 0)
            tmp_message = this.split_sales_exceed_sales_amount.replace('#amount', formatMoney(tmp_diff_amount, 0))
          if(tmp_diff_amount < 0)
            tmp_message = this.split_sales_less_than_sales_amount.replace('#amount', formatMoney(tmp_diff_amount * -1, 0))
          
          tmp_message = tmp_message.replace('#sales-item', this.item_action.data.goods_name)
          this.showAlert([tmp_message])
          return
        }
      }

      this.$emit('apply-staffs', _.cloneDeep(this.staffs_selected))
      this.hideModal()
    },
  }
}
</script>

<style lang="scss">
@import './sales-item-staff-action.scss';
</style>