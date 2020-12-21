<template>
  <div class="input-month-range">
    <label>{{ $t('input-date-range.date-range') }}</label>
    <div class="field from-month">
      <label>{{ $t('general.month') }}</label>
      <b-form-select v-model="month_range.from_month" :options="month_options" 
                     @input="onInputFromMonth" 
                     @mouseleave.native="onMouseLeaveSelect"/>
    </div>
    <div class="field from-year">
      <label>{{ $t('general.year') }}</label>
      <b-form-select v-model="month_range.from_year" :options="year_options" 
                     @input="onInputFromYear"
                     @mouseleave.native="onMouseLeaveSelect"/>
    </div>
    <div class="between">~</div>
    <div class="field to-month">
      <label>{{ $t('general.month') }}</label>
      <b-form-select v-model="month_range.to_month" :options="month_options" 
                     @input="onInputToMonth"
                     @mouseleave.native="onMouseLeaveSelect"/>
    </div>
    <div class="field to-year">
      <label>{{ $t('general.year') }}</label>
      <b-form-select v-model="month_range.to_year" :options="year_options" 
                     @input="onInputToYear"
                     @mouseleave.native="onMouseLeaveSelect"/>
    </div>
  </div>
</template>

<script>
import moment                        from 'moment'
import component_base                from '../../../component-base/component-base.vue'
import { options }                   from '../../../../../helpers/options'
import { 
  convertDateToTimeStamp, 
  convertDateToTimezone,
  // convertDateFromLocalToTimezone   
} from '../../../../../helpers/common.js'


export default {
  extends : component_base,
  data(){
    return {
      month_range : {
        from_date_ts  : 0,
        to_date_ts    : 0,
        to_date_end_ts: 0,

        from_date   : new Date(),
        to_date     : new Date(),

        from_month  : 0,
        to_month    : 0,

        from_year   : 0,
        to_year     : 0
      },

      date_timezone: new Date(),
      month_options: [],
      year_options : [],

      errors : []
    }
  },
  computed:{
    end_date_can_not_before_start_date(){
      return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')
    },
  },
  created(){
    this.date_timezone = convertDateToTimezone(new Date())
    this.generateMonthOptions()
    this.generateYearOptions()
    this.setMonthRangeDefault()
    this.emitEvent()
  },
  methods:{
    generateMonthOptions(){
      // options
      let tmp_options = []
      for(let i = 1; i <= 12; i++){
        let tmp_option = {
          value: i,
          text: i
        }
        if(i < 10){
          tmp_option.text = `0${i}`
        }
        tmp_options.push(tmp_option)
      }
      this.month_options = tmp_options
    },
    generateYearOptions(){
      // options
      let tmp_options = []
      for(let i = 0; i <= 10; i++){
        let tmp_year = this.date_timezone.getFullYear() - i
        tmp_options.push({
          value: tmp_year,
          text : tmp_year
        })
      }
      this.year_options = tmp_options
    },
    setMonthRangeDefault(){
      let tmp_from_date = moment(this.date_timezone).startOf('year').toDate()
      let tmp_to_date   = moment(this.date_timezone).endOf('month').toDate()

      this.month_range.from_date_ts   = convertDateToTimeStamp(tmp_from_date)
      this.month_range.to_date_ts     = convertDateToTimeStamp(tmp_to_date)
      this.month_range.to_date_end_ts = this.getDateEndTS(this.month_range.to_date_ts)

      this.month_range.from_date   = tmp_from_date
      this.month_range.to_date     = tmp_to_date

      this.month_range.from_month  = 1
      this.month_range.to_month    = tmp_to_date.getMonth() + 1

      this.month_range.from_year   = tmp_to_date.getFullYear()
      this.month_range.to_year     = tmp_to_date.getFullYear()
    },
    getDateEndTS(date_start_ts){
      return date_start_ts + options.seconds_of_24h - 1
    },

    // input
    onInputFromMonth(){
      this.month_range.from_date    = moment(this.month_range.from_date).set('month', this.month_range.from_month - 1).toDate()
      this.month_range.from_date_ts = convertDateToTimeStamp(this.month_range.from_date)

      this.emitEvent()
    },
    onInputFromYear(){
      this.month_range.from_date    = moment(this.month_range.from_date).set('year', this.month_range.from_year).toDate()
      this.month_range.from_date_ts = convertDateToTimeStamp(this.month_range.from_date)

      this.emitEvent()
    },
    onInputToMonth(){
      this.month_range.to_date        = moment(this.month_range.to_date).set('month', this.month_range.to_month - 1).toDate()
      this.month_range.to_date_ts     = convertDateToTimeStamp(this.month_range.to_date)
      this.month_range.to_date_end_ts = this.getDateEndTS(this.month_range.to_date_ts)
      
      this.emitEvent()
    },
    
    onInputToYear(){
      this.month_range.to_date        = moment(this.month_range.to_date).set('year', this.month_range.to_year).toDate()
      this.month_range.to_date_ts     = convertDateToTimeStamp(this.month_range.to_date)
      this.month_range.to_date_end_ts = this.getDateEndTS(this.month_range.to_date_ts)

      this.emitEvent()
    },

    // emit event
    emitEvent(){
      this.$emit('input', this.month_range, this.errors)
    },
  }
}
</script>

<style lang="scss">
@import './input-month-range.scss';
</style>