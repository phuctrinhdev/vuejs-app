<template>
  <b-modal id="repeat-booking-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           class="repeat-booking-action-modal"
           @show="onLoadForm()">
    <div class="form-wrapper">
      <b-tabs>
        <b-tab :title="$t('bookings.repeat-by-week-of-day')"
               :active="repeat_booking.fields.repeat_by == options.repeat_by.week_of_day" 
               :disabled="repeat_booking.fields.repeat_by == options.repeat_by.date && repeat_booking.fields.list_off_days.length > 1" 
               class="repeat-by-week-of-day" @click="onSelectTabRepeatByWeekOfDay">
          <div class="row">
            <div class="col-12 col-sm-7 repeat-options-wrapper">
              <div class="form-group repeat-week-type">
                <radio-repeat-week-type v-model="repeat_booking.fields.repeat_type" :disabled_options="repeat_type_disabled_options"
                                        @input="onChangeRepeatWeekType"/>
              </div>
              <div class="form-group repeat-day-of-week">
                <select-day-of-week v-model="repeat_booking.fields.repeated_day_of_week" 
                                    :fixed_days="[booking_day]"
                                    @input="onSelectDayOfWeek"/>
              </div>
              <div class="form-group repeat-times">
                <label>{{ $t('bookings.repeat') }}</label>
                <b-form-select v-model="repeat_booking.fields.repeat_times" :options="repeat_times_options"
                               @input="onChangeRepeatTimes"/>
                <span>{{ $t('general.times') }}</span>
                <p class="guide">(* {{ $t('general.maximum') }} {{ repeat_times_max }} {{ $t('general.days') }})</p>
              </div>
            </div>
            <div class="col-12 col-sm-5 list-days-wrapper">
              <list-off-days :data="repeat_booking.fields" :list="repeat_booking.fields.repeat_dates_view" type="repeat_booking"/>
            </div>
          </div>
        </b-tab>

        <b-tab :title="$t('bookings.repeat-by-date')" 
               :active="repeat_booking.fields.repeat_by == options.repeat_by.date"
               :disabled="repeat_booking.fields.repeat_by == options.repeat_by.week_of_day && repeat_booking.fields.repeat_dates_view.length > 1" 
               class="repeat-by-date" @click="onSelectTabRepeatByDate">
          <specific-off-days ref="specific_off_days" :data="repeat_booking" 
                             :selected_days_max="repeat_times_max"/>
          <p class="guide">(* {{ $t('general.maximum') }} {{ repeat_times_max }} {{ $t('general.days') }})</p>
        </b-tab>
      </b-tabs>
    </div>

    <error-box :errors="repeat_booking_errors"/>
    <footer class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </footer>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { options }                  from '../../../../helpers/options'
import RepeatBookingViewModel       from '../../../../view-model/bookings/repeat-booking-view-model'

import radio_repeat_week_type       from '../../../common/form/radio/radio-repeat-week-type/radio-repeat-week-type'
import select_day_of_week           from '../../../common/form/select/select-day-of-week/select-day-of-week'
import error_box                    from '../../../common/form/error-box/error-box' 
import component_base               from '../../../common/component-base/component-base'
import btn_action_group             from '../../../common/button/btn-action-group/btn-action-group'
import list_off_days                from '../../list-off-days/list-off-days'
import specific_off_days            from '../../specific-off-days/specific-off-days'
import { loadTextOfWeek, 
  guid, 
  formatDateBySetting,
  convertDateToTimeStamp
  // convertDateToTimezone,
} from'../../../../helpers/common'

export default {
  components: {
    'radio-repeat-week-type': radio_repeat_week_type,
    'select-day-of-week': select_day_of_week,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'list-off-days': list_off_days,
    'specific-off-days': specific_off_days
  },
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: () => []
    },
    booking_date: {
      type: Date,
      default: () => new Date()
    },
  },
  data(){
    return {
      options,

      form_title: '',
      form_options: {
        delete: false
      },

      // repeat by week of day
      repeat_booking: new RepeatBookingViewModel(),
      repeat_type_disabled_options: [ options.repeat_type.none, options.repeat_type.monthly ],
      repeat_times_max: 20, // fixed
      repeat_times_options: [],
      repeat_booking_errors: [],
    }
  },
  computed: {
    ...mapGetters('booking', {
      x_booking_action: 'getBookingAction'
    }),
    booking_date_ts() {
      return convertDateToTimeStamp(this.booking_date)
    },
    booking_day() {
      return this.booking_date.getDay()
    },
  },
  mounted(){
    this.createRepeatTimesOptions(this.repeat_times_max)
  },
  methods: {
    hideModal(){
      this.hideDialogById('repeat-booking-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.form_title = this.$i18n.t('bookings.repeat-bookings')

      // reset popup UI
      if(this.repeat_booking.fields.repeat_type == options.repeat_type.none)
        this.repeat_booking.fields.repeat_type = options.repeat_type.every_week

      // get data
      this.repeat_booking.fields = Object.assign(this.repeat_booking.fields, this.data)
      if(this.repeat_booking.fields.repeat_dates.length == 0)
        this.repeat_booking = new RepeatBookingViewModel()
      else {
        if(this.repeat_booking.fields.repeated_day_of_week.length == 0) {
          this.repeat_booking.fields.repeat_by = options.repeat_by.date
        }
      }
      
      // generate repeat_dates_view for viewing in list-date-box
      this.repeat_booking.fields.booking_date = this.booking_date
      let tmp_booking_date = moment(this.repeat_booking.fields.booking_date).format(options.standard_date_format.ymd)
      let tmp_repeat_dates = this.repeat_booking.fields.repeat_dates.map(date => moment(date).format(options.standard_date_format.ymd))

      if(!tmp_repeat_dates.includes(tmp_booking_date))
        this.repeat_booking.fields.repeat_dates = [this.repeat_booking.fields.booking_date, ...this.repeat_booking.fields.repeat_dates]
      
      this.generateRepeatBookingTabs(this.repeat_booking.fields.repeat_dates)
    },
    generateRepeatBookingTabs(repeat_dates){
      // repeat by week of day
      let repeat_dates_view = []
      for(let i in repeat_dates){
        let date = moment(repeat_dates[i], options.standard_date_format.ymd).toDate()
        let repeat_date_view = this.generateDatesForListDateBox(date)
        repeat_dates_view.push(repeat_date_view)
      }
      repeat_dates_view = _.sortBy(repeat_dates_view, ['date_order'])
      this.repeat_booking.fields.repeat_dates_view = repeat_dates_view

      if(!this.repeat_booking.fields.repeated_day_of_week.includes(this.booking_day))
        this.repeat_booking.fields.repeated_day_of_week.push(this.booking_day)
      
      // repeat by date
      let tmp_specific_off_days = []
      for(let i in repeat_dates_view){
        tmp_specific_off_days.push(repeat_dates_view[i].date)
      }
      this.repeat_booking.fields.specific_off_days = tmp_specific_off_days
    },
    onSelectTabRepeatByWeekOfDay(){
      this.repeat_booking.fields.repeat_by = options.repeat_by.week_of_day
      this.clearRepeatDaysInBox()
    },
    onSelectTabRepeatByDate(){
      this.repeat_booking.fields.repeat_by = options.repeat_by.date
      this.clearRepeatDaysInBox()
    },
    onChangeRepeatWeekType(){
      this.clearRepeatDaysInBox()
    },
    onSelectDayOfWeek(){
      let max_repeat_times = this.repeat_times_max
      if(this.repeat_booking.fields.repeated_day_of_week.length > 0){
        max_repeat_times = Math.floor(this.repeat_times_max / this.repeat_booking.fields.repeated_day_of_week.length)
      }
      this.createRepeatTimesOptions(max_repeat_times)
      this.clearRepeatDaysInBox()
    },
    onChangeRepeatTimes(){
      this.generateRepeatDays()
    },
    generateRepeatDays(){
      if(this.repeat_booking.fields.repeated_day_of_week.length > 0){
        let booking_day = this.booking_date.getDay()
        let repeat_times = this.repeat_booking.fields.repeat_times
        let repeat_dates = []
        
        for(let i = 0; i < this.repeat_booking.fields.repeat_times; i++){
          for(let ii in this.repeat_booking.fields.repeated_day_of_week){
            let repeat_day = this.repeat_booking.fields.repeated_day_of_week[ii]
            let diff_day = this.calculateDiffDays(i, repeat_day, booking_day)
            let repeat_date_i = moment(this.booking_date).add(diff_day, 'days').toDate()

            let repeat_date = this.generateDatesForListDateBox(repeat_date_i)
            repeat_dates.push(repeat_date)
          }
        }
        if(repeat_times < 1)
          repeat_dates = [this.generateDatesForListDateBox(this.booking_date)]

        this.repeat_booking.fields.repeat_dates_view = _.sortBy(repeat_dates, ['date_order'])
      }
    },
    clearRepeatDaysInBox(){
      // reset form
      this.repeat_booking_errors = []
      if(this.repeat_booking.fields.repeat_by == options.repeat_by.week_of_day)
        this.repeat_booking.fields.repeat_times = ''
      else
        this.repeat_booking.fields.repeat_times = 1

      let tmp_dates = this.repeat_booking.fields.repeat_dates_view.filter(d => d.is_fixed_date)
      if(tmp_dates.length > 0){
        let tmp_booking_date = tmp_dates[0]
        this.repeat_booking.fields.repeat_dates_view = [tmp_booking_date]
        this.repeat_booking.fields.specific_off_days = [tmp_booking_date.date]
        this.repeat_booking.fields.calendar_off_days = [moment(tmp_booking_date.date).toDate()]
        this.repeat_booking.fields.list_off_days     = [tmp_booking_date]

        this.$refs.specific_off_days.loadCalendar(this.repeat_booking)
      }
    },
    onConfirm(){
      let repeat_booking = _.cloneDeep(this.repeat_booking)

      if(repeat_booking.fields.repeat_by == options.repeat_by.week_of_day){
        repeat_booking.fields.repeat_dates = repeat_booking.fields.repeat_dates_view.map(date => moment(date.date).toDate())

        repeat_booking.fields.specific_off_days = []
        repeat_booking.fields.list_off_days = []
        this.$refs.specific_off_days.list_off_days = []
      }
      else if(repeat_booking.fields.repeat_by == options.repeat_by.date){
        let repeat_dates = repeat_booking.fields.specific_off_days.map(day => moment(day).toDate())
        repeat_booking.fields.repeat_dates = repeat_dates
        repeat_booking.fields.repeat_dates_view = []
      }

      // remove booking-date from repeat-dates
      repeat_booking.fields.repeat_dates = _.filter(repeat_booking.fields.repeat_dates, 
        date => convertDateToTimeStamp(date) != convertDateToTimeStamp(repeat_booking.fields.booking_date))

      this.repeat_booking_errors = repeat_booking.isValid()
      if(this.repeat_booking_errors.length == 0){
        this.$emit('submit-repeat-booking', repeat_booking.fields)
        this.hideModal()
      }
    },
    createRepeatTimesOptions(max){
      this.repeat_times_options = []
      for(let i = 1; i <= max; i++){
        this.repeat_times_options.push(i)
      }
    },
    generateDatesForListDateBox(date){
      let day = date.getDay()
      let is_fixed_date = false

      if(convertDateToTimeStamp(date) == this.booking_date_ts) is_fixed_date = true
      return {
        id: guid(),
        date: formatDateBySetting(date),
        date_order: moment(date).format(options.standard_date_format.ymd),
        name: loadTextOfWeek([day]), 
        selected: false,
        is_fixed_date: is_fixed_date
      }
    },
    calculateDiffDays(repeat_times, repeat_day, booking_day){
      let diff_day = 0
      if(this.repeat_booking.fields.repeat_type == options.repeat_type.every_week){
        diff_day = (repeat_times * 7) + repeat_day - booking_day
        if(repeat_day < booking_day) diff_day += 7
      }
      else if(this.repeat_booking.fields.repeat_type == options.repeat_type.biweekly){
        diff_day = (repeat_times * 14) + repeat_day - booking_day
        if(repeat_day < booking_day) diff_day += 14
      }
      return diff_day
    },
  }
}
</script>

<style lang='scss'>
@import './repeat-booking-action.scss';
</style>