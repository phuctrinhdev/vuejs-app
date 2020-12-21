<template>
  <b-form-select v-model="hour_value" :disabled="disabled" placeholder=""  
                 class="select-hour" 
                 @input="onInput" @change="onChange">
    <option v-for="(hour, index) in hour_options" :key="index" :value="hour.value">
      {{ hour.text }}
    </option>
  </b-form-select>
</template>

<script>
import _ from 'lodash'
import { options } from '../../../../../helpers/options'
import { convertHoursToMinutes, convertMinutesToHours } from '../../../../../helpers/common'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    select_hour_options: {
      type: Object,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      options,

      undefined: ':undefined',
      set: ''
    }
  },
  computed: { 
    hour_value: {
      set(value){
        this.set = value
      },
      get(){
        let temp = this.value.split(':')
        let hour = temp[0]
        let minute = temp[1]
        let time = hour + ':' + minute
        
        return time
      },
    },
    hour_options(){
      let tmp_options = []
      let start_minutes = convertHoursToMinutes(this.select_hour_options.start)
      let step_minutes = convertHoursToMinutes(this.select_hour_options.step)
      let end_minutes = convertHoursToMinutes(this.select_hour_options.end)
      let n =  Math.floor((end_minutes - start_minutes) / step_minutes)

      for(let i = 0; i <= n; i++){
        let option = {}
        let value_minutes = start_minutes + (i * step_minutes)
        option.id = value_minutes

        option.value = convertMinutesToHours(value_minutes)
        this.convertHourToText24h(option, value_minutes)

        tmp_options.push(option)
      }

      let option_index = _.filter(tmp_options, ['value', this.hour_value])
      if(option_index.length == 0 && this.hour_value != this.undefined) {
        let tmp_option = {}
        let tmp_value_minutes = convertHoursToMinutes(this.hour_value)

        tmp_option.id   = tmp_value_minutes
        tmp_option.value= this.hour_value
        this.convertHourToText24h(tmp_option, tmp_value_minutes)
        tmp_options.unshift(tmp_option)
      }
      return tmp_options
    }
  },
  methods: {
    convertHourToText24h(option, value_minutes){
      if(value_minutes < options.minutes_of_24h) {
        option.text = option.value
      }
      else {
        let tmp_value = convertMinutesToHours(value_minutes - options.minutes_of_24h)
        option.text = this.$i18n.t('booking-resources.next-day') + ' ' + tmp_value
      }
      
      if(option.value == '00:00:00' || option.value == '24:00:00') option.text += ' AM'
      if(option.value == '12:00:00' || option.value == '36:00:00') option.text += ' PM'
    },
    onInput(){
      if(this.set == this.undefined){ 
        this.set = ''
      } 
      this.$emit('input', this.set)
    },
    onChange(){
      this.$emit('change', this.set)
    },
  }, 
}
</script> 
<style lang='scss'>
.select-hour.custom-select {
  height: 30px;
  padding-left: 10px;
  font-size: 14px;
  option {
    height: 30px;
    padding: 5px 0;
  }
}
</style>