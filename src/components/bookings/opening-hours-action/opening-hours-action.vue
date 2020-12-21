<template>
  <opening-hours-form @submit-opening-hour="onSubmitOpeningHour"/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import opening_hours_form from '../opening-hours-form/opening-hours-form.vue'
import { options } from '../../../helpers/options'
import component_base from '../../common/component-base/component-base'
export default {
  components: { 
    'opening-hours-form': opening_hours_form
  },
  extends: component_base,
  data(){
    return {
      options : options
    }
  },
  computed: {
    ...mapGetters('alert', {
      alerts_data: 'getAlerts',
    }),
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    ...mapActions('opening_hours', [
      'addOpeningHoursDataAsync',
      'updateOpeningHoursDataAsync',
      'deleteOpeningHoursDataAsync'
    ]),
    hideModal(){
      this.hideDialogById('action-opening-hours-modal')
    },
    async onSubmitOpeningHour(data, action){
      this.setAlertsData([])

      this.preLoader()
      if(action == options.form_actions.add) await this.addOpeningHoursDataAsync(data)
      else if(action == options.form_actions.edit) await this.updateOpeningHoursDataAsync(data)
      else if(action == options.form_actions.delete) await this.deleteOpeningHoursDataAsync(data)
      this.preLoader(false)
      
      if(this.alerts_data.length == 0) {
        this.$emit('submit-opening-hour')
        this.hideModal()
      }
    }
  }
}
</script>

<style lang="scss">
@import './opening-hours-action.scss';
</style>