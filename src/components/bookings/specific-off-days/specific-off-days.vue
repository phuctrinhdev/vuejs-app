<template>
  <div class="row part-box-content clearfix">
    <div class="col-12 col-sm-6 calendar-wrapper">
      <div class="calendar-content">
        <div class="hide">{{ day }}</div>
        <div class="title">{{ $t('booking-opening-hours.select-off-days') }}</div>
        <div class="select-off-days">
          <v-date-picker v-model="off_days.fields.calendar_off_days"
                         :max-date="calendar_max_date"
                         :min-date="calendar_min_date"
                         :available-dates="available_dates"

                         :disabled-attribute="disabled_attribute"
                         :select-attribute="{contentStyle: {}}"
                         :formats="{ title: 'MM-YYYY' }"
                         mode="multiple" is-inline
                         @input="onLoadListOffDays"/>
        </div>
      </div>
    </div>
    <div class="col 12 col-sm-6 specific-off-days">
      <list-off-days :data="off_days" :list="list_off_days" type="list_off_days"
                     @change-dates="onChangeDates"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { options } from '../../../helpers/options'
import { setupCalendar, DatePicker} from 'v-calendar'
import moment from 'moment'
import list_off_days from '../list-off-days/list-off-days'
import { checkCalendarViewAllDates } from '../../../config/permission'
import { loadTextOfWeek, 
  guid, 
  formatDateBySetting,
  convertDateToTimezone,
  convertDateToTimeStamp,
} from '../../../helpers/common'


export default {
  components: {
    'v-date-picker': DatePicker,
    'list-off-days': list_off_days
  },
  props: {
    data: {
      type: Object,
      default: () => []
    },
    selected_days_max: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      options,

      off_days: this.data,
      list_off_days: [],

      calendar_max_date: null,
      calendar_min_date: null,
      available_dates: [],
      today: moment(convertDateToTimezone(new Date())).format(options.standard_date_format.ymd),
      disabled_attribute: {
        contentStyle: ({ isHovered }) => ({
          // textDecoration: 'line-through',
          color: '#ccc',
          opacity: 0.5,
          // Hide background and disable cursor on hover
          ...(isHovered && {
            cursor: 'default',
            backgroundColor: 'transparent'
          })
        })
      }
    }
  },
  computed: {
    day: {
      get: function () {
        this.loadCalendar(this.data)
        return ''
      } 
    },
    locale(){
      return this.$i18n.locale
    }
  },
  beforeMount(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })

    this.getCalendarLimitedDateByPermission()
  },
  methods: {
    convertDateToTimezone,
    
    // setting of calendar
    getCalendarLimitedDateByPermission(){
      // only chain-head can edit date in past
      let tmp_today = convertDateToTimezone(new Date())
      if(checkCalendarViewAllDates()) 
        this.calendar_min_date = moment(tmp_today).subtract(3, 'years').toDate() // no limit for chain-head
      else this.calendar_min_date = tmp_today
    },
    blockCalendar(){
      this.calendar_max_date = null
      this.calendar_min_date = null
    },
    unBlockCalendar(){
      this.getCalendarLimitedDateByPermission()
    },

    // UI
    loadCalendar(data){
      this.off_days = data
      this.off_days.fields.calendar_off_days = []
      
      for(let day in this.off_days.fields.specific_off_days){
        let off_day = this.off_days.fields.specific_off_days[day]
        off_day = moment(off_day).toDate()
        this.off_days.fields.calendar_off_days.push(off_day)
      }
      // load list of days
      this.onLoadListOffDays(this.off_days.fields.calendar_off_days)
    },
    // load list of days
    onLoadListOffDays(days){
      this.available_dates = days
      if(this.selected_days_max != null && days != null && days.length >= this.selected_days_max){
        this.blockCalendar()
      }
      else
        this.unBlockCalendar()

      this.list_off_days = []
      let list_day= []
      let pre_day = ''
      
      if(days != null && this.off_days.fields.booking_date){
        let tmp_booking_date = moment(this.off_days.fields.booking_date).format(options.standard_date_format.ymd)
        let tmp_calendar_off_days = this.off_days.fields.calendar_off_days.map(d => moment(d).format(options.standard_date_format.ymd))
        if(!tmp_calendar_off_days.includes(tmp_booking_date)){
          this.off_days.fields.calendar_off_days.push(moment(this.off_days.fields.booking_date).startOf('date').toDate())
        }
      }

      let tmp_calendar_sorted_dates = []
      for(let i in this.off_days.fields.calendar_off_days){
        let tmp_date = this.off_days.fields.calendar_off_days[i]
        tmp_calendar_sorted_dates.push({
          timestamp: convertDateToTimeStamp(tmp_date),
          date: tmp_date
        })
      }
      tmp_calendar_sorted_dates = _.sortBy(tmp_calendar_sorted_dates, ['timestamp'])
      this.off_days.fields.calendar_off_days = tmp_calendar_sorted_dates.map(d => d.date)
      days = this.off_days.fields.calendar_off_days

      for(let day in days){
        // check day in past
        let this_day = moment(days[day]).format(options.standard_date_format.ymd)
        if(this_day == pre_day) continue
        else pre_day = this_day

        let is_fixed_date = false
        if(this.off_days.fields.booking_date && convertDateToTimeStamp(this_day) == convertDateToTimeStamp(this.off_days.fields.booking_date)) 
          is_fixed_date = true

        this.list_off_days.push({
          id: guid(),
          date: formatDateBySetting(days[day]),
          name: loadTextOfWeek([moment(days[day]).format('d')]), 
          past: moment(this_day).isBefore(this.today),
          selected: false,
          is_fixed_date: is_fixed_date
        })
        list_day.push(moment(days[day]).format(options.standard_date_format.ymd))
      }
      this.off_days.fields.list_off_days = this.list_off_days
      this.off_days.fields.specific_off_days = list_day
      this.onChangeDates()
    },
    onChangeDates(){
      this.$emit('change-dates')
    }
  }
}
</script>

<style lang='scss'>
@import './specific-off-days.scss';
</style>