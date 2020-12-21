<!-- not using component -->
<template>
  <div class="part-box-content row">
    <div class="col-md-5 col-sm-12 repeat-week-options">
      <div class="form-group repeat-week-type">
        <radio-repeat-week-type v-model="off_days.fields.repeat_type" :offs="repeat_type_offs" @input="onChangeRepeatType"/>
      </div>
      <div class="form-group repeat-week-selected">
        <select-week-of-month v-model="off_days.fields.repeated_weeks" :disabled="repeated_weeks_disabled"/>
      </div>
      <div class="form-group repeat-day-of-week">
        <select-day-of-week v-model="off_days.fields.repeated_days_of_week" :disabled="repeated_days_of_week_disabled"/>
      </div>
    </div>
    <div class="col-md-3 col-sm-12 add-off-days"><a class="btn btn-large" @click="onClickAddOffDay">{{ $t('booking-opening-hours.add-off-days') }} ➝</a></div>
    <div :class="{ disabled: repeated_off_days_disabled }" class="col-md-4 col-sm-12 repeat-off-days">
      <list-off-days :data="off_days" :list="off_days.fields.repeated_off_days" type="repeated_off_days"/>
    </div>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'
import radio_repeat_week_type from '../../common/form/radio/radio-repeat-week-type/radio-repeat-week-type'
import select_day_of_week from '../../common/form/select/select-day-of-week/select-day-of-week'
import list_off_days from '../list-off-days/list-off-days'
import { loadTextOfWeek, guid } from '../../../helpers/common'
import _ from 'lodash'

export default {
  components: {
    'radio-repeat-week-type': radio_repeat_week_type,
    'select-day-of-week': select_day_of_week,
    'list-off-days': list_off_days
  },
  props: {
    data: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      // options
      options: options,

      repeat_type_offs: [ options.repeat_type.biweekly ],
      repeated_weeks_disabled: false,
      repeated_days_of_week_disabled: false,
      repeated_off_days_disabled: false,
    }
  },
  computed: {
    off_days(){ 
      return this.data
    },
  },
  methods: {
    // repeat off days
    onChangeRepeatType(){
      switch(this.off_days.fields.repeat_type){
        case options.repeat_type.none:
          this.repeated_weeks_disabled = true
          this.repeated_days_of_week_disabled = true
          this.repeated_off_days_disabled = true
          break
        case options.repeat_type.every_week:
          this.repeated_weeks_disabled = true
          this.repeated_days_of_week_disabled = false
          this.repeated_off_days_disabled = false
          break
        case options.repeat_type.biweekly:
          this.repeated_weeks_disabled = false
          this.repeated_days_of_week_disabled = false
          this.repeated_off_days_disabled = false
          break
      }
    },
    onClickAddOffDay() {
      switch(this.off_days.fields.repeat_type){
        case options.repeat_type.none: {
          this.off_days.fields.repeated_off_days = []
          break
        }
        case options.repeat_type.every_week: {
          let repeated_off_days_text = this.convertRepeatedOffDaysToText(this.off_days.fields.repeated_off_days)
          let repeated_type_text = 'booking-opening-hours.every-week'

          this.filterDuplicatedOffDays(repeated_off_days_text, repeated_type_text)
          break
        }
        case options.repeat_type.biweekly: {
          let repeated_off_days_text = this.convertRepeatedOffDaysToText(this.off_days.fields.repeated_off_days)

          for(let week in this.off_days.fields.repeated_weeks){
            let repeated_type_text = this.off_days.fields.repeated_weeks[week].translate
            this.filterDuplicatedOffDays(repeated_off_days_text, repeated_type_text)
          }
          break
        }
      }
    },
    convertRepeatedOffDaysToText(repeated_off_days){
      let repeated_off_days_text = ''
      if(repeated_off_days.length > 0) {
        repeated_off_days_text = repeated_off_days.map(day => day.name).toString()
      }
      return repeated_off_days_text
    },
    filterDuplicatedOffDays(repeated_off_days_text, repeated_type_text){
      for(let day in this.off_days.fields.repeated_days_of_week){
        let day_of_week_text = repeated_type_text        

        if(repeated_off_days_text.indexOf(day_of_week_text) == -1) this.off_days.fields.repeated_off_days.push({ 
          id: guid(),
          full: day_of_week_text + loadTextOfWeek([this.off_days.fields.repeated_days_of_week[day]]),
          date: day_of_week_text,
          name: loadTextOfWeek([this.off_days.fields.repeated_days_of_week[day]]), 
          selected: false,
          is_fixed_date: false
        })
      }
      this.off_days.fields.repeated_off_days = _.uniqBy(this.off_days.fields.repeated_off_days, 'full')
    }
  }
}
</script>

<style lang='scss'>
@import './repeat-off-days.scss';
</style>