<template>
  <div> 
    <b-modal id="repeat-off-days-action-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer  
             class="repeat-off-days-action-modal"
             @show="onLoadForm()">
      <div class="form-wrapper repeat-week-options">
        <div class="form-group repeat-week-type">
          <radio-repeat-week-type v-model="repeat_off_days.repeat_type" :disabled_options="repeat_type_disabled_options" 
                                  @input="onChangeRepeatType"/>
        </div>
        <div class="form-group repeat-week-selected">
          <select-week-of-month v-model="repeat_off_days.repeated_weeks" :disabled="repeated_weeks_disabled"/>
        </div>
        <div class="form-group repeat-day-of-week">
          <select-day-of-week v-model="repeat_off_days.repeated_days_of_week" :disabled="repeated_days_of_week_disabled"/>
        </div>
      </div>

      <error-box :errors="action_errors"/>
      <div class="modal-footer clearfix"> 
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal> 
  </div>
</template> 
<script> 
import { options } from '../../../helpers/options'
import radio_repeat_week_type from '../../common/form/radio/radio-repeat-week-type/radio-repeat-week-type'
import select_week_of_month from '../../common/form/select/select-week-of-month/select-week-of-month'
import select_day_of_week from '../../common/form/select/select-day-of-week/select-day-of-week'
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base from '../../common/component-base/component-base'
export default {
  components: {
    'radio-repeat-week-type': radio_repeat_week_type,
    'select-week-of-month': select_week_of_month,
    'select-day-of-week': select_day_of_week,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  props: {
    data: {
      type: Object, 
      default: () => []
    },
    action_errors: {
      type: Array, 
      default: () => []
    }
  },
  data(){
    return {
      options,

      form_title: '',
      form_options: {
        delete: false
      },

      repeat_type_disabled_options: [ options.repeat_type.biweekly ],
      repeated_weeks_disabled: false,
      repeated_days_of_week_disabled: false,
    }
  },
  computed: { 
    repeat_off_days(){
      return this.data
    },
  }, 
  methods: {
    hideModal(){
      this.hideDialogById('repeat-off-days-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.$emit('load-action-modal')
      this.form_title = this.$i18n.t('booking-opening-hours.repeat-off-days')
    },
    onConfirm(){
      if(this.repeat_off_days.repeat_type == options.repeat_type.none) {
        this.repeat_off_days.repeated_weeks = []
        this.repeat_off_days.repeated_days_of_week = []
      }
      else if(this.repeat_off_days.repeat_type == options.repeat_type.every_week) this.repeat_off_days.repeated_weeks = []

      this.$emit('submit-action-modal', this.repeat_off_days)
    },
    onChangeRepeatType(){
      switch(this.repeat_off_days.repeat_type){
        case options.repeat_type.none:
          this.repeated_weeks_disabled = true
          this.repeated_days_of_week_disabled = true
          break
        case options.repeat_type.every_week:
          this.repeated_weeks_disabled = true
          this.repeated_days_of_week_disabled = false
          this.repeat_off_days.repeated_weeks = []
          break
        case options.repeat_type.monthly:
          this.repeated_weeks_disabled = false
          this.repeated_days_of_week_disabled = false
          break
      }
    },
  }
}
</script>

<style lang='scss'>
@import './repeat-off-days-action.scss';
</style>