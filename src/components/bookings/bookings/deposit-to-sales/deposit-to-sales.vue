<template>
  <b-modal id="deposit-to-sales-modal" 
           :title="form_title"
           :no-enforce-focus="true"
           :no-close-on-backdrop="true"
           hide-footer
           class="deposit-to-sales-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="form-wrapper">
      <div class="row deposit-info">
        <div class="col-6">
          <div>Deposit</div>
          <div>20,000</div>
        </div>
        <div class="col-6">
          <div>Date</div>
          <div>
            <v-date-picker v-model="booking_deposit_sales.fields.invoice_date" :popover="{ placement: 'bottom' }"
                           :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"/>
          </div>
        </div>
      </div>

      <!-- <div class="row sales-info">
        <div class="col-6">
          <div>
            <b-form-checkbox v-model="booking.fields.is_deposit_required" :value="true" :unchecked-value="false"
                             :disabled="booking_deposit_disabled">
              <span>{{ $t('bookings.booking-deposit-is-required') }}</span>
            </b-form-checkbox>
          </div>
          <div>20,000</div>
        </div>
        <div class="col-6">
          <div>Date</div>
          <div>
            ,
          </div>
        </div>
      </div> -->

      <error-box :errors="errors"/>
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>
    </div>
  </b-modal>
</template>

<script>
// import _ from 'lodash'
// import moment from 'moment'
import { options } from '../../../../helpers/options'
import { DatePicker } from 'v-calendar'
import { mapGetters, mapActions } from 'vuex'
// import BookingDepositViewModel from '../../../../view-model/bookings/booking-deposit-view-model'
import BookingDepositSalesViewModel from '../../../../view-model/sales/booking-deposit-sales-view-model'

import radio_group      from '../../../common/form/radio/radio-group/radio-group'
import input_money      from '../../../common/form/input/input-money/input-money.vue' 
import error_box        from '../../../common/form/error-box/error-box' 
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base   from '../../../common/component-base/component-base'
import select_hour      from '../../../common/form/select/select-hour/select-hour'
// import { formatMoney,
//   convertMinutesToHours,
//   convertDateToTimezone,
//   cache_session
// } from '../../../../helpers/common'

export default {
  components: {
    'radio-group': radio_group,
    'v-date-picker': DatePicker,
    'input-money': input_money,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'select-hour': select_hour,
  },
  extends: component_base,
  data(){
    return {
      options,

      form_options: {
        delete: false
      },

      booking_deposit_sales: new BookingDepositSalesViewModel(),

      errors: [],
    }
  },
  computed:{
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    form_title(){return this.$i18n.t('booking-list.add-deposit-to-sales')}
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    hideModal(){
      this.hideDialogById('deposit-to-sales-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      
      
      this.errors = []
    },
    async onConfirm(){
      //
    }
  }
}
</script>

<style lang="scss">
@import './deposit-to-sales.scss';
</style>