<template>
  <b-modal :id="modal_id"
           :class="modal_id"
           :title="modal_title"
           :no-close-on-backdrop="true"
           hide-footer
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="form-wrapper">
      <view-table :data="table_data">
        <template slot="expenditure_date_ts" slot-scope="{row}">
          <v-date-picker v-model="row.date" :popover="{ placement: 'bottom' }"
                         :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }" 
                         @input="onInputRow(row)"/>
        </template>
        <template slot="item_id" slot-scope="{row}">
          <b-form-select v-model="row.item_id" 
                         :options="expenditure_item_options" value-field="id" text-field="item_name"
                         @input="onInputRow(row)"
                         @mouseleave.native="onMouseLeaveSelect"/>
        </template>
        <template slot="payment_method_id" slot-scope="{row}">
          <b-form-select v-model="row.payment_method_id" 
                         :options="payment_method_options" value-field="id" text-field="name"
                         @input="onInputRow(row)"
                         @mouseleave.native="onMouseLeaveSelect"/>
        </template>
        <template slot="amount" slot-scope="{row}">
          <input-money v-model="row.amount" :decimal="0" :zero="false" 
                       @input="onInputRow(row)"/>
        </template>
        <template slot="notes" slot-scope="{row}">
          <b-form-input v-model="row.notes" @input="onInputRow(row)"/>
        </template>
      </view-table>
    </div>
    
    <error-box :errors="errors"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import view_table                    from '../../common/view-table/view-table'
import input_money                   from '../../common/form/input/input-money/input-money'
import { DatePicker }             from 'v-calendar'

import ExpenditureHistoryApi         from '../../../api/expenditure/expenditure-history-api'
import ExpenditureHistoryViewModel   from '../../../view-model/expenditure/expenditure-history-view-model'
import { convertDateToTimezone,
  convertTimeStampPlusLocalzone,
  convertDateToTimeStamp
} from '../../../helpers/common'

export default {
  components: {
    'v-date-picker'   : DatePicker,
    'view-table'      : view_table,
    'input-money'     : input_money,
    'error-box'       : error_box,
    'btn-action-group': btn_action_group
  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,

      table_data   : {
        fields : [
          {field: 'expenditure_date_ts',  label: 'general.date',        width: '15%',   sortable: false, expand: true, tdClass: 'date' },
          {field: 'item_id',              label: 'expenditure.item',    width: '20%',   sortable: false, expand: true, tdClass: 'item' },
          {field: 'payment_method_id',    label: 'sales.payment-method',width: '20%',   sortable: false, expand: true, tdClass: 'payment' },
          {field: 'amount',               label: 'sales.amount',        width: '15%',   sortable: false, expand: true, tdClass: 'amount' },
          {field: 'notes',                label: 'general.notes',       width: '30%',   sortable: false, expand: true, tdClass: 'notes' },
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: true }
      },

      expenditure_history     : new ExpenditureHistoryViewModel(),
      expenditure_history_api : new ExpenditureHistoryApi(),

      modal_id     : 'expenditure-history-add-modal',
      form_options : {
        delete: false
      },
      errors       : []
    }
  },
  computed:{
    ...mapGetters('expenditure_item',{
      x_expenditure_items: 'getExpenditureItems',
    }),
    ...mapGetters('payment_method',{
      x_payment_methods: 'getPaymentMethods',
    }),
    expenditure_item_options(){
      return this.x_expenditure_items.filter(i => i.status == common_options.good_status.active)
    },
    payment_method_options(){
      return this.x_payment_methods.items.filter(p => p.status == common_options.good_status.active)
    },
    modal_title(){return this.$i18n.t('expenditure.add-expenditure')},
    warning_there_is_no_expenditure_to_added(){return this.$i18n.t('expenditure.there_is_no_expenditure_to_added')},
    warning_expenditure_amount_max(){return this.$i18n.t('expenditure.expenditure_amount_max')},
    warning_expenditure_notes_max(){return this.$i18n.t('expenditure.expenditure_notes_max')}
  },
  methods:{
    hideModal(){
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },

    onLoadForm(){
      this.errors = []
      this.generateForm()
    },
    generateForm(){
      let tmp_rows = []
      if(this.expenditure_item_options.length > 0){
        let tmp_expenditure_item_first = this.expenditure_item_options[0]
        let tmp_payment_method_first   = this.payment_method_options[0]
      
        for (let i = 0; i < 10; i++) {
          let tmp_row = new ExpenditureHistoryViewModel().fields
          tmp_row.id                = i
          tmp_row.item_id           = tmp_expenditure_item_first.id
          tmp_row.payment_method_id = tmp_payment_method_first.id
          tmp_row.shop_id           = this.shop_data.shop_id
        
          tmp_row.date              = convertDateToTimezone(new Date())
          tmp_rows.push(tmp_row)
        }
      }
      this.table_data.rows = tmp_rows
    },
    onInputRow(row){
      let tmp_rows = this.table_data.rows.filter(r => r.id == row.id)
      if(tmp_rows.length > 0){
        tmp_rows[0] = Object.assign(tmp_rows[0], row)
      }
    },

    async onConfirm() {
      this.errors = []

      // rows
      let tmp_rows = this.table_data.rows.filter(r => r.amount > 0)
      if(tmp_rows.length == 0){
        this.errors = [this.warning_there_is_no_expenditure_to_added]
      }
      else {
        // validate items
        for(let row of tmp_rows){
          if(row.amount.length > 10){
            this.errors.push(this.warning_expenditure_amount_max.replace('{max_value}', 10))
          }
          if(row.notes.length > 200){
            this.errors.push(this.warning_expenditure_notes_max.replace('{max_value}', 200))
          }
          if(this.errors.length > 0){
            return
          }

          // time
          row.expenditure_date_ts = convertTimeStampPlusLocalzone(convertDateToTimeStamp(row.date, false, true))
        }

        // send data
        this.preLoader()
        let response = await this.expenditure_history_api.addExpenditureHistoryAsync(tmp_rows)
        this.preLoader(false)

        if(response.is_ok){
          this.$emit('added',response.data)
          this.hideModal()
        }
        else{
          this.errors = response.error_messages
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import './expenditure-history-add.scss';
</style>