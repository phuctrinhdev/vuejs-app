<template>
  <div> 
    <b-modal id="action-booking-item-modal"
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             class="action-booking-item-modal"
             @show="onLoadForm()">
      <form class="form-wrapper">
        <div class="row form-group">
          <div class="col-5">
            <label class="require">{{ $t('booking-item.item-name') }}</label>
          </div>
          <div class="col-7">
            <b-form-input v-model="booking_item.fields.booking_item_name" type="text"/>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-5">
            <label class="">{{ $t('services.estimated-time') }}</label>
          </div> 
          <div class="col-7">
            <b-form-select v-model="booking_item.fields.estimated_time" :placeholder="$t('general.select')"
                           :options="time_options" value-field="id" text-field="name"/>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-5">
            <label>{{ $t('booking-item.status') }}</label>
          </div> 
          <div class="col-7">
            <radio-group v-model="booking_item.fields.status" :options="options.option_goods_status" :buttons="true"/>
          </div> 
        </div> 
      </form> 

      <error-box :errors="booking_item_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" 
                          @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
      </div>
    </b-modal> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { options } from '../../../helpers/options'  
import BookingItemViewModel from '../../../view-model/bookings/booking-item-view-model.js'
import BookingItemApi from '../../../api/bookings/booking-item-api.js'
import view_table from '../../common/view-table/view-table' 
import radio_group from '../../../components/common/form/radio/radio-group/radio-group' 
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'

export default {
  components: {   
    'view-table': view_table,
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options,  
      booking_item: new BookingItemViewModel(),
      time_options:[],
      booking_item_errors: [],  
      form_title: '',
      form_options: {
        delete: false
      },
    } 
  },
  computed: {
    ...mapGetters('booking_item', {
      x_action_data: 'getBookingItemAction', 
      x_item_data: 'getBookingItems'
    }), 
  },
  methods: { 
    hideModal(){
      this.hideDialogById('action-booking-item-modal')
    },
    onCancel(){
      this.hideModal()
    },
    loadTime(){ 
      this.time_options=[]
      this.time_options.push({ id:0, name: this.$i18n.t('general.select') })
      for (var i = 5; i <= 300; i++) { 
        this.time_options.push({ id:i, name:i }) 
        i = i + 4
      }
    },
    onLoadForm(){ 
      this.loadTime() 
      this.form_options.delete = false
      if(this.x_action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('booking-item.add-item')
        this.booking_item = new BookingItemViewModel()
        this.booking_item.fields.t_id = Math.max(...this.x_action_data.options.booking_items.map(o => o.t_id), 0) + 1 
        this.booking_item.fields.id = this.booking_item.fields.t_id 
        this.booking_item.fields.use_service_code = this.x_action_data.data.use_service_code
      }
      if(this.x_action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('booking-item.edit-item')
        this.booking_item.fields = Object.assign(this.booking_item.fields, this.x_action_data.data)
        this.form_options.delete = true
      }
      
      this.booking_item_errors = []
    },
    onConfirm(){
      if(this.x_action_data.action == options.form_actions.add){
        this.submitActionAsync('addBookingItemAsync', 'update-item')
      }
      else if(this.x_action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateBookingItemAsync', 'update-item')
      }
    },
    onDelete(){
      this.submitActionAsync('deleteBookingItemAsync', 'delete-item')
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.booking_item.fields = Object.assign(this.booking_item.fields, this.shop_data) 
      // validate
      if(api_action != 'deleteBookingItemAsync'){
        this.booking_item_errors = this.booking_item.isValid()  
      }
      if(this.booking_item_errors.length == 0) {
        this.preLoader()
        let booking_item_api = new BookingItemApi() 
        let result = await booking_item_api[api_action](this.booking_item.fields)
        this.preLoader(false)
        
        if(result.is_ok) this.actionSuccess(result, success_action)
        else this.booking_item_errors = result.error_messages
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.booking_item_errors = result.error_messages
      }
    },
  }
}
</script>

<style lang="scss">
@import './booking-item-action.scss';
</style>