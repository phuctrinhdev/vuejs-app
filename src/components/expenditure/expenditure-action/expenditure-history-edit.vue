<template>
  <b-modal :id="modal_id"
           :class="modal_id"
           :title="modal_title"
           :no-close-on-backdrop="true"
           size="sm"
           hide-footer
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="form-wrapper">
      <div class="row form-group date">
        <div class="col-12 col-sm-4">
          <label>{{ $t('general.date') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <v-date-picker v-model="expenditure_history.fields.date" :popover="{ placement: 'bottom' }"
                         :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }" 
          />
        </div>
      </div>

      <div class="row form-group item">
        <div class="col-12 col-sm-4">
          <label>{{ $t('expenditure.item') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-select v-model="expenditure_history.fields.item_id" 
                         :options="expenditure_item_options" value-field="id" text-field="item_name"
                         @mouseleave.native="onMouseLeaveSelect"/>
        </div>
      </div>

      <div class="row form-group payment">
        <div class="col-12 col-sm-4">
          <label>{{ $t('sales.payment-method') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-select v-model="expenditure_history.fields.payment_method_id" 
                         :options="payment_method_options" value-field="id" text-field="name"
                         @mouseleave.native="onMouseLeaveSelect"/>
        </div>
      </div>
      
      <div class="row form-group amount">
        <div class="col-12 col-sm-4">
          <label>{{ $t('sales.amount') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input-money v-model="expenditure_history.fields.amount" :decimal="0" :zero="false"/>
        </div>
      </div>

      <div class="row form-group notes">
        <div class="col-12 col-sm-4">
          <label>{{ $t('general.notes') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-textarea v-model="expenditure_history.fields.notes" :rows="3" placeholder=""/>
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
import { DatePicker, setupCalendar } from 'v-calendar'

import ExpenditureHistoryApi         from '../../../api/expenditure/expenditure-history-api'
import ExpenditureHistoryViewModel   from '../../../view-model/expenditure/expenditure-history-view-model'

import input_money                   from '../../common/form/input/input-money/input-money'
import radio_group                   from '../../common/form/radio/radio-group/radio-group.vue'
import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'

import { 
  convertTimeStampPlusLocalzone,
  convertDateToTimeStamp,
  convertTimeStampToDate,
  convertTimeStampMinusLocalzone,
}     from '../../../helpers/common'

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

      expenditure_history     : new ExpenditureHistoryViewModel(),
      expenditure_history_api : new ExpenditureHistoryApi(),

      modal_id:'expenditure-history-edit-modal',
      form_options: {
        delete: true
      },
      errors: []
    }
  },
  computed:{
    ...mapGetters('expenditure_history',{
      x_expenditure_history_edit : 'getExpenditureHistoryEdit'
    }),
    ...mapGetters('expenditure_item',{
      x_expenditure_items: 'getExpenditureItems',
    }),
    ...mapGetters('payment_method',{
      x_payment_methods: 'getPaymentMethods',
    }),
    modal_title(){
      return this.$i18n.t('expenditure.edit-expenditure')
    },
    expenditure_item_options(){
      return this.x_expenditure_items.filter(i => i.status == common_options.good_status.active)
    },
    payment_method_options(){
      return this.x_payment_methods.items.filter(p => p.status == common_options.good_status.active)
    }
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
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []
      this.expenditure_history.setFields(this.x_expenditure_history_edit.data)
      this.expenditure_history.fields.date = convertTimeStampToDate(convertTimeStampMinusLocalzone(this.expenditure_history.fields.expenditure_date_ts))
    },

    async onConfirm(){
      let tmp_expenditure_history = _.cloneDeep(this.expenditure_history)
      tmp_expenditure_history.fields.expenditure_date_ts = convertTimeStampPlusLocalzone(convertDateToTimeStamp(tmp_expenditure_history.fields.date, false, true))

      this.errors = tmp_expenditure_history.isValid()
      if(this.errors.length == 0){
        this.preLoader()
        let response = await this.expenditure_history_api.updateExpenditureHistoryAsync(tmp_expenditure_history)
        this.preLoader(false)
        
        if(response.is_ok){
          this.$emit('edited', response.data)
          this.hideModal()
        }
        else {
          this.showAlert(response.error_messages)
        }
      }
    },

    // delete
    async onDelete(){
      let tmp_expenditure_history = _.cloneDeep(this.expenditure_history)

      this.preLoader()
      let response = await this.expenditure_history_api.deleteExpenditureHistoryAsync(tmp_expenditure_history)
      this.preLoader(false)
      
      if(response.is_ok){
        this.$emit('deleted', response.data)
        this.hideModal()
      }
      else {
        this.showAlert(response.error_messages)
      }
    }
  }
}
</script>

<style lang="scss">
@import './expenditure-history-edit.scss';
</style>
