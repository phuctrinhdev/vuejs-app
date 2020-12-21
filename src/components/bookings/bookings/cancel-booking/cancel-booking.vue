<template>
  <div>
    <b-modal id="booking-cancel-action-modal" 
             :title="$t('booking-list.cancel-booking')"
             :no-enforce-focus="true"
             :no-close-on-backdrop="true"
             hide-footer
             class="booking-cancel-action-modal"
             @show="onLoadForm()">
      <div class="form-wrapper">
        <div v-if="booking_cancel.fields.booked_items.length > 1" class="notification">
          <div class="noti-icon">※</div>
          <div class="noti-content">
            <h3>{{ $t('bookings.notification') }}</h3>
            <p>{{ $t('bookings.multi-resource-booking') }}</p>
          </div>
        </div>
        <div class="row form-group">
          <label>{{ $t('bookings.cancelation-reason') }}</label>
          <b-form-select v-model="booking_cancel.fields.reason" :placeholder="$t('bookings.select-reason')">
            <option v-for="(option, index) in reason_options" :key="index" :value="option.id">{{ $t(option.name) }}</option>
          </b-form-select>
        </div>
        <div class="row cancel-brief">
          <p>
            <b>{{ booking_cancel.fields.client_name }}</b>
            <span>{{ $t('bookings.booking-on') }}</span> {{ formatDateBySetting(booking_cancel.fields.booking_date) }}
            <span v-if="booking_cancel.fields.booked_items.length == 1">{{ $t('general.at') }} {{ booking_cancel.fields.start_time }}</span>
            {{ $t('bookings.will-be-cancel') }}
          </p>
          <p v-if="booking_cancel.fields.cancel_repeat_dates_ts != null && booking_cancel.fields.cancel_repeat_dates_ts.length > 0
             && booking_cancel.fields.option == options.booking_cancel_type.all_upcomming_bookings" 
             class="cancel-repeat-message">
            {{ booking_cancel.fields.cancel_repeat_message }} {{ $t('bookings.also-canceled') }}
          </p>
          <div v-if="booking_cancel.fields.booked_items.length > 1">
            <i v-for="booked_item in booking_cancel.fields.booked_items" :key="booked_item.id">
              - {{ formatHourShort(booked_item.start_time) }}, {{ booked_item.service_name }}
            </i>
          </div>
        </div>

        <error-box :errors="errors"/>
        <footer class="modal-footer">
          <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
        </footer>
      </div>
    </b-modal>

    <cancel-booking-alert :not_be_canceled_bookings="not_be_canceled_bookings"/>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { options } from '../../../../helpers/options'
import { mapGetters, mapActions } from 'vuex'
import error_box from         '../../../common/form/error-box/error-box' 
import component_base    from '../../../common/component-base/component-base'
import btn_action_group from  '../../../common/button/btn-action-group/btn-action-group'
import BookingCancelViewModel from  '../../../../view-model/bookings/booking-cancel-view-model'
import { formatDateBySetting, 
  formatHourShort, 
  convertTimeStampToDate,
  // convertDateToTimezone
} from '../../../../helpers/common'

let CancelBookingAlert = {
  props: {
    not_be_canceled_bookings: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      options,
    }
  },
  computed: {
    cancel_bookings(){
      let tmp_cancel_bookings = [...this.not_be_canceled_bookings]
      for(let i in tmp_cancel_bookings){
        let tmp_cancel_booking = tmp_cancel_bookings[i]
        let tmp_date = convertTimeStampToDate(tmp_cancel_booking.date_ts)
        // tmp_date = convertDateToTimezone(tmp_date)
        tmp_cancel_booking.date = moment(tmp_date).format(options.standard_date_format.ymd)
      }
      tmp_cancel_bookings = _.uniqBy(tmp_cancel_bookings, 'booking_id')
      return tmp_cancel_bookings
    },
    modal_title(){return this.$i18n.t('general.error')}
  },
  methods: {
    moment,
    hideModal(){
      this.$parent.$parent.hideDialogById('cancel-booking-alert-modal')
    },
    onCancel(){
      this.hideModal()
    },
  },
  template: '<b-modal id="cancel-booking-alert-modal" :title="modal_title" :no-close-on-backdrop="true" '+
                     'hide-footer class="cancel-booking-alert-modal">'+
              '<div class="validate-errors-wrapper">'+
                '<p>{{ $t("bookings.cancel-booking-intro") }}</p>'+
                '<ul class="validate-errors">'+
                  '<li v-for="(cancel, index) in cancel_bookings" :key="index">'+
                    '<span v-if="cancel.reason == options.can_not_cancel_reason.checked_out_booking">'+
                      '- {{ $t("bookings.booking-on") }} '+
                      '{{ cancel.date }} '+
                      '{{ $t("bookings.is-checked-out") }}.'+
                    '</span>'+
                    '<span v-if="cancel.reason == options.can_not_cancel_reason.paid_deposit_booking">'+
                      '- {{ $t("bookings.booking-deposit-of-the-booking-on") }} '+
                      '{{ cancel.date }} '+
                      '{{ $t("bookings.has-paid") }}.'+
                    '</span>'+
                    '<span v-if="cancel.reason == options.can_not_cancel_reason.paid_and_checked_out_booking">'+
                      '- {{ $t("bookings.booking-on") }} '+
                      '{{ cancel.date }} '+
                      '{{ $t("bookings.has-paid-and-checked-out") }}.'+
                    '</span>'+
                  '</li>'+
                '</ul>'+
              '</div>'+
              '<div class="modal-footer">'+
                '<button type="button" class="btn btn-default" @click="onCancel">{{ $t("general.close") }}</button>'+
              '</div>'+
            '</b-modal>'
}

export default {
  components: {
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'cancel-booking-alert': CancelBookingAlert
  },
  extends: component_base,
  data(){
    return {
      options,

      form_options: {
        delete: false
      },

      booking_cancel: new BookingCancelViewModel(),
      reason_options: [
        { id: options.booking_reason.not_selected,            name: 'bookings.not-selected'},
        { id: options.booking_reason.client_request,          name: 'bookings.client-request'},
        { id: options.booking_reason.booking_made_by_mistake, name: 'bookings.booking-made-by-mistake'},
        { id: options.booking_reason.duplicate_booking,       name: 'bookings.duplicate-booking'},
        { id: options.booking_reason.cancel_etc,              name: 'bookings.cancel-etc'},
      ],

      not_be_canceled_bookings: []
    }
  },
  computed:{
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('booking_cancel', {
      x_booking_cancel_action: 'getBookingCancelAction',
    }),
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('booking_cancel', [
      'addBookingCancelDataAsync'
    ]),
    formatDateBySetting,
    formatHourShort,
    hideModal(){
      this.hideDialogById('booking-cancel-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []
      
      this.booking_cancel = new BookingCancelViewModel()
      this.booking_cancel.fields = Object.assign(this.booking_cancel.fields, this.x_booking_cancel_action.data)
    },
    async onConfirm(){
      this.errors = []
      this.errors = this.booking_cancel.isValid()
      if(this.errors.length == 0) {
        if(this.booking_cancel.fields.reason == options.booking_reason.no_cancel){
          this.hideModal()
        }
        else {
          this.setAlertsData([])

          this.preLoader()
          let result = await this.addBookingCancelDataAsync(this.booking_cancel.fields)
          this.preLoader(false)

          if(this.x_alerts.length == 0){
            this.$emit('cancel-booking-success', result)
            this.hideModal()
          }
          else {
            this.showDialogById('cancel-booking-alert-modal')
            this.not_be_canceled_bookings = result.not_be_canceled_bookings
          }
        }
      }
    },
  }
}
</script>

<style lang="scss">
@import './cancel-booking.scss';
</style>