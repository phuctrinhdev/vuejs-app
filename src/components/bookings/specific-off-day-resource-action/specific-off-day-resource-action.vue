<template>
  <b-modal id="action-specific-off-day-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer  
           class="action-specific-off-day-modal"
           @show="onLoadForm()">
    <form class="form-wrapper"> 
      <specific-off-days :data="data_of_day"/>
    </form>

    <error-box :errors="off_days_errors"/>
    <div class="modal-footer"> 
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template> 
<script>
import _ from 'lodash'
import BookingResourcesApi from '../../../api/bookings/booking-resources-api.js'
import error_box from '../../common/form/error-box/error-box' 
import { options } from '../../../helpers/options'   
import specific_off_days from '../specific-off-days/specific-off-days' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base   from '../../common/component-base/component-base'

export default {
  components: {  
    'specific-off-days': specific_off_days, 
    'error-box': error_box,
 
    'btn-action-group': btn_action_group, 
  },
  extends: component_base,
  props: {
    data: {
      type: Object, 
      default: function () { return {} }
    }
  },
  data(){
    return {
      options,  
      // off days
      off_days: this.data, 
      off_days_old: '', 
      off_days_errors: [],
      form_title:'',
      form_options: {
        delete: false
      },
      is_first : true ,
      
    }
  },
  computed: {
    data_of_day(){
      this.loadData(this.data)
      return this.data
    }
  }, 
  methods: { 
    hideModal(){
      this.hideDialogById('action-specific-off-day-modal')
    },
    onCancel(){
      this.hideModal()
    },
    loadData(data){
      if(this.is_first && data.fields.specific_off_days.length > 0){
        this.off_days_old = JSON.stringify(data) 
        this.is_first = false
      } 
    },
    onLoadForm(){
      this.is_first = true 
      this.off_days_old = JSON.stringify(this.data) 
      this.form_title= this.$i18n.t('booking-resources.specific-off-days') 
    }, 
    async onConfirm(){
      this.off_days_errors = []

      this.preLoader() 
      let booking_resources_api = new BookingResourcesApi()

      let data_delete = _.cloneDeep(JSON.parse(this.off_days_old))
      let data_add    = _.cloneDeep(this.data_of_day)

      let result_delete = {
        is_ok: false
      }
      if(data_delete.fields.specific_off_days.length > 0){
        result_delete = await booking_resources_api.deleteSpecificOffDayAsync(data_delete)
        if(!result_delete.is_ok) this.off_days_errors.push(result_delete.error_messages)
      }
      
      let result_add = {
        is_ok: false
      }
      if(data_add.fields.specific_off_days.length > 0){
        result_add = await booking_resources_api.addSpecificOffDayAsync(data_add)
        if(!result_delete.is_ok) this.off_days_errors.push(result_add.error_messages)
      }

      this.$emit('update-success', this.data_of_day)
      this.preLoader(false)

      this.hideModal()  
    },
  }
}
</script>

<style lang='scss'>
@import './specific-off-day-resource-action.scss';
</style>