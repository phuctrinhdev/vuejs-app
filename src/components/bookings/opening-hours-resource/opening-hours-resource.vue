<template> 
  <opening-hours-form @submit-opening-hour="onSubmitOpeningHour"/>
</template>

<script>
import { options } from '../../../helpers/options' 
import OpeningHoursViewModel from '../../../view-model/bookings/opening-hours-view-model.js'  
import component_base from '../../common/component-base/component-base'
import opening_hours_form from '../opening-hours-form/opening-hours-form'


export default {
  components: { 
    'opening-hours-form': opening_hours_form
  },
  extends: component_base,
  data(){
    return {
      options,  
      opening_hours: new OpeningHoursViewModel()
    }
  },
  methods: {
    hideModal(){
      this.hideDialogById('action-opening-hours-modal')
    },
    onSubmitOpeningHour(data, action){
      this.opening_hours.fields = data

      if(action == options.form_actions.add){
        this.$emit('update-success', this.opening_hours.fields, options.form_actions.add)
      }
      else if(action == options.form_actions.edit){
        this.$emit('update-success', this.opening_hours.fields, options.form_actions.edit)
      }
      else if(action == options.form_actions.delete){
        this.$emit('update-success', this.opening_hours.fields, options.form_actions.delete)
      }

      this.hideModal()
    }
  }
}
</script>

<style lang="scss">
@import './opening-hours-resource.scss';
</style>