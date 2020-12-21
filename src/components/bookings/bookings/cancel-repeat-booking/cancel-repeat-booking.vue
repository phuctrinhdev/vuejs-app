<template>
  <b-modal id="cancel-repeat-booking-modal" 
           :title="$t('bookings.cancel-repeat-booking')"
           :no-enforce-focus="true"
           :no-close-on-backdrop="true"
           hide-footer
           class="cancel-repeat-booking-modal"
           @show="onLoadForm()">
    <div class="form-wrapper">
      <div class="cancel-repeat-brief">{{ $t('bookings.cancel-repeat-booking-intro') }}</div>
      <div class="repeat-info">({{ cancel_repeat_message }})</div>
      <div class="row form-group repeat-type">
        <div class="col-12">
          <b-form-radio-group v-model="cancel_booking_repeat_type" class="form-btn-group"> 
            <b-form-radio :value="options.booking_cancel_type.booking_only">
              {{ $t('bookings.cancel-booking-only') }}</b-form-radio>
            <b-form-radio :value="options.booking_cancel_type.all_upcomming_bookings" :disabled="repeat_dates_ts.length == 0">
              {{ $t('bookings.all-upcomming-bookings') }}</b-form-radio>
          </b-form-radio-group>
        </div>
      </div>

      <error-box :errors="errors"/>
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { options } from '../../../../helpers/options'
import { mapGetters, mapActions } from 'vuex'
import BookingApi       from '../../../../api/bookings/booking-api'

import radio_group      from '../../../common/form/radio/radio-group/radio-group' 
import error_box        from '../../../common/form/error-box/error-box' 
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base   from '../../../common/component-base/component-base'

import { 
// convertTimeStampToDate 
}                       from '../../../../helpers/common'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options,

      form_options: {
        delete: false
      },

      repeat_dates_ts: [],
      cancel_booking_repeat_type: 0
    }
  },
  computed:{
    ...mapGetters('booking_cancel', {
      x_booking_cancel_action: 'getBookingCancelAction',
    }),
    cancel_repeat_option_not_selected(){return this.$i18n.t('bookings.cancel-repeat-option-not-selected')},
    cancel_repeat_message(){
      return this.generateCancelRepeatMessage()
    }
  },
  methods: {
    ...mapActions('booking_cancel', [
      'setBookingCancelTypeData'
    ]),
    hideModal(){
      this.hideDialogById('cancel-repeat-booking-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      // reset form
      this.cancel_booking_repeat_type = 0
      this.errors = []

      let query = {
        booking_id          : this.x_booking_cancel_action.data.booking_id,
        booking_date_ts     : this.x_booking_cancel_action.data.booking_date_ts,
        original_booking_id : this.x_booking_cancel_action.data.original_booking_id,
        shop_id             : this.shop_data.shop_id
      }
      let booking_api = new BookingApi()
      let result = await booking_api.getUpcomingRepeatedBookings(query)

      if(result.is_ok) {
        this.repeat_dates_ts = result.data
        this.x_booking_cancel_action.data.updateCancelRepeatDatesTS(result.data)
      }
      else this.showAlert(result.error_messages)
    },
    async onConfirm(){
      if(this.cancel_booking_repeat_type == 0) this.errors = [this.cancel_repeat_option_not_selected]
      else {
        this.setBookingCancelTypeData(this.cancel_booking_repeat_type)
        this.hideModal()
        this.showDialogById('booking-cancel-action-modal')
      }
    },
    generateCancelRepeatMessage(){
      let message = ''
      let dates_length = this.repeat_dates_ts.length

      message = this.$i18n.t('general.total') + ' ' + this.repeat_dates_ts.length + ' '
      if(dates_length > 0){
        let last_date = moment(this.repeat_dates_ts[dates_length-1] * 1000).format(options.standard_date_format.ymd)
        message += this.$i18n.t('bookings.upcoming-bookings-are-left-until') + ' ' + last_date
      }
      else message += this.$i18n.t('bookings.upcoming-bookings-are-left')
      this.x_booking_cancel_action.data.updateCancelRepeatMessage(message)

      return message
    }
  }
}
</script>

<style lang="scss">
@import './cancel-repeat-booking.scss';
</style>