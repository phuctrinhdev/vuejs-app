<template>
  <div class="input-date-range-by-date-type">
    <b-form-radio-group 
      id="date-type" 
      v-model="date_filter.date_type" 
      :options="date_type_options" 
      class="date-type"
      @input="onInputDateType"/>
    <div class="date-view">
      <v-date-picker v-if="date_filter.date_type == common_options.date_type.date"
                     v-model="date_setting" 
                     :popover="{ placement: 'bottom' }"
                     :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                     class="select-date"
                     @input="onInputDate"/>
      <b-form-select v-if="date_filter.date_type == common_options.date_type.month"
                     v-model="current_month" 
                     :options="month_options"
                     class="select-month"
                     @input="onInputMonth"
                     @mouseleave.native="onMouseLeaveSelect"/> 
      <input-date-range v-if="date_filter.date_type == common_options.date_type.date_range" 
                        ref="input_date_range"
                        :label="false" 
                        class="select-date-range"
                        @input="onInputDateRange"/>
    </div>
  </div>
</template>

<script>
import { DatePicker,setupCalendar }       from 'v-calendar'
import _                                  from 'lodash'
import { common_options }                 from '../../../../../helpers/options/common-options.js'  
import component_base                     from  '../../../component-base/component-base.vue'
import input_date_range           from '../input-date-range/input-date-range.vue'
import { 
  convertDateFromLocalToTimezone, 
  convertDateToTimeStamp }                from '../../../../../helpers/common.js'
export default {
  components : {
    'input-date-range' : input_date_range,
    'v-date-picker'            : DatePicker
  },
  extends : component_base,
  props   : {
    value : {
      type     : Object,
      required : true
    }
  },
  data(){
    return {
      common_options,
      date_setting   : {},
      current_month  : {},
      errors         : []
    }
  },
  computed:{
    date_filter:{
      get (){ 
        return this.value
      }
    },
    date_type_options(){
      return [
        { text : this.$i18n.t('general.date')       , value : common_options.date_type.date},
        { text : this.$i18n.t('general.month')      , value : common_options.date_type.month},
        { text : this.$i18n.t('general.date-range') , value : common_options.date_type.date_range}
      ]
    },
    month_options(){
      let tmp_months = []
      let date  = convertDateFromLocalToTimezone(new Date())
      let year  = date.getFullYear()
      let month = date.getMonth()
      month += 1

      for(let i = 1; i <= 12; i ++){
        tmp_months.push({
          text  : month < 10 ? `0${month}-${year}` : `${month}-${year}`, 
          value : {month : month, year : year }
        })
        if(month > 1){
          month -= 1
        }
        else {
          year -= 1
          month = 12
        }
      }
      return tmp_months
    }
  },
  created(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })

    this.date_setting  = convertDateFromLocalToTimezone(new Date()) // YYYY-MM-DD of zone.
    this.current_month = {
      month : this.date_setting.getMonth() + 1,
      year  : this.date_setting.getFullYear()
    }
    this.onInputDateType()
  },
  methods:{
    onInputDateType(){
      switch(this.date_filter.date_type){
        case common_options.date_type.date:
          this.onInputDate(this.date_setting)
          break
        case common_options.date_type.month:
          this.onInputMonth(this.current_month)
          break
      }
    },
    onInputDate(date){
      if(date != null && date != undefined){
        this.date_filter.from_date.value = convertDateToTimeStamp(date)
        this.date_filter.to_date.value   = convertDateToTimeStamp(_.cloneDeep(date).setDate(date.getDate() + 1)) - 1
        this.validateDates()
      }
      else {
        this.date_setting = convertDateFromLocalToTimezone(new Date())
      }
    },
    onInputMonth(value){
      if(value != null && value != undefined){
        let from_date = new Date(value.year,value.month - 1)
        let to_date   = new Date(value.year,value.month)
        this.date_filter.from_date.value = convertDateToTimeStamp(from_date)
        this.date_filter.to_date.value   = convertDateToTimeStamp(to_date) - 1
        this.validateDates()
      }
    },
    onInputDateRange(data){
      this.date_filter.from_date    = data.value.from_date
      this.date_filter.to_date      = data.value.to_date
      this.validateDates()
    },
    validateDates(){
      this.date_filter.from_date_ts = this.date_filter.from_date.value
      this.date_filter.to_date_ts   = this.date_filter.to_date.value

      this.errors = []
      if(this.date_filter.from_date.value > this.date_filter.to_date.value){
        this.errors = [this.$refs.input_date_range.end_date_can_not_before_start_date]
      }
    }
  }
}
</script>
<style lang="scss">
@import './input-date-range-by-date-type.scss';
</style>