<template>
  <main class="app-content">
    <section class="content booking-calendar-settings">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('bookings.setup-booking') }}</h3>
        </article>
        <booking-links/> 
        <div class="booking-calendar-settings-part">
          <div class="part-title clearfix">
            <div class="title">{{ $t('booking-calendar-setting.booking-calendar-settings') }}</div>

            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-calendar-setting.booking-time-slot-interval') }}</label>
              </div> 
              <div class="col-md-2 col-sm-3 col-7" >   
                <b-form-select v-model="booking_calendar_setting.fields.booking_time_slot" :placeholder="$t('general.select')"
                               :options="time_options" value-field="id" text-field="name" 
                               @mouseleave.native="onMouseLeaveSelect"/>
              </div> 
              <div class="col-md-2 col-sm-4 col-3" >  
                <span >{{ $t('booking-calendar-setting.minutes') }}</span>
              </div> 
            </div>
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-calendar-setting.number-of-days-on-calendar') }}</label>
              </div> 
              <div class="col-md-2 col-sm-3 col-7" >   
                <b-form-select v-model="booking_calendar_setting.fields.number_of_day" :placeholder="$t('general.select')"
                               :options="day_options" value-field="id" text-field="name" 
                               @mouseleave.native="onMouseLeaveSelect"/>
              </div> 
              <div class="col-md-2 col-sm-4 col-3" >  
                <span >{{ $t('booking-calendar-setting.days') }}</span>
              </div> 
            </div>
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-calendar-setting.allow-duplicate-bookings') }}</label>
              </div>
              <div class="col-md-3 col-sm-3 col-12" >  
                <radio-group v-model="booking_calendar_setting.fields.allow_duplicate_bookings" :options="options.option_yes_no"
                             :buttons="true"/> 
              </div>
            </div> 
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-calendar-setting.show-waiting-list-if-booking-is-changed') }}</label>
              </div>
              <div class="col-md-7 col-sm-7 col-12" >   
                <radio-group v-model="booking_calendar_setting.fields.show_waiting_list" :options="options.option_yes_no"
                             :buttons="true"/> 
              </div>
            </div> 
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-calendar-setting.show-up-on-calendar') }}</label>
              </div>
              <div class="col-md-6 col-sm-8 col-12" >  
                <div class="row">
                  <div class="col-sm-3 col-6">
                    <b-form-checkbox v-model="booking_calendar_setting.fields.time_show_up" :value="true" >
                      {{ $t('booking-calendar-setting.time') }}</b-form-checkbox>
                  </div> 
                  <div class="col-sm-3 col-6">
                    <b-form-checkbox v-model="booking_calendar_setting.fields.service_show_up" :value="true" >
                      {{ $t('booking-calendar-setting.service') }}</b-form-checkbox>
                  </div> 
                  <div class="col-sm-3 col-6">
                    <b-form-checkbox v-model="booking_calendar_setting.fields.notes_show_up" :value="true" >
                      {{ $t('booking-calendar-setting.notes') }}</b-form-checkbox>
                  </div> 
                  <div class="col-sm-3 col-6">
                    <b-form-checkbox v-model="booking_calendar_setting.fields.member_number_show_up" :value="true" >
                      {{ $t('booking-calendar-setting.member-number') }}</b-form-checkbox>
                  </div> 
                </div> 
              </div> 
            </div>  

            <error-box :errors="booking_calendar_setting_errors" />
            <div class="modal-footer">
              <button class="btn btn-submit" @click="onConfirmAsync()">{{ $t('general.save') }}</button>
            </div>
          </div>  
        </div> 
      </div> 
    </section> 
    <alert-confirm :id="alert_id" :title="alert_title" :data_alerts="alert_data"  
                   @confirm="onAlertConfirmAsync" @cancel="onAlertCancel"/>  
  </main>
</template> 
<script>
import { options } from '../../../helpers/options'
import { cache_session } from '../../../helpers/common'
import error_box from '../../../components/common/form/error-box/error-box' 
import radio_group from '../../../components/common/form/radio/radio-group/radio-group'
import component_base    from '../../../components/common/component-base/component-base' 
import alert_confirm from '../../../components/common/alert/alert-confirm' 
import booking_links from '../../../components/bookings/booking-links/booking-links'     
import { differentObject } from '../../../helpers/common'
import BookingCalendarSettingApi from '../../../api/bookings/booking-calendar-setting-api' 
import BookingResourcesApi from '../../../api/bookings/booking-resources-api' 
import BookingCalendarSettingViewModel from '../../../view-model/bookings/booking-calendar-setting-view-model.js'  
var calendar_settings_next_route = ''
export default {
  components: {
    'booking-links': booking_links,  
    'error-box': error_box,
    'radio-group': radio_group, 
    'alert-confirm': alert_confirm  
  },
  extends: component_base,
  data() {
    return {
      alert_id :'booking_calendar_setting_confirm_id',
      alert_title :'',
      alert_data:[ this.$i18n.t('general.alert-save-data') ],
      time: '',
      options,  
      time_options:[ 
        { id:5, name:'5' },
        { id:10, name:'10' },
        { id:15, name:'15' },
        { id:30, name:'30' },
        { id:60, name:'60' },
      ],
      day_options:[
        { id:1, name:'1' },
      ],
      booking_calendar_setting: new BookingCalendarSettingViewModel(),
      booking_calendar_setting_errors : [],

      // alert save data
      data_saved: {}
    }
  }, 
  mounted() {
    this.loadPage() 
  },
  beforeRouteLeave(to, from, next) {
    calendar_settings_next_route = to.name
    // compare data & change page
    let data_current = {
      data: JSON.stringify(this.booking_calendar_setting)
    }
    if(differentObject(this.data_saved, data_current)) { 
      this.showDialogById(this.alert_id)
    } 
    else next()
  },
  methods: {
    async loadPage(){   
      this.preLoader()
      let booking_resources_api = new BookingResourcesApi()
      let result = await booking_resources_api.getBookingResourcesAsync(this.shop_data) 
      let errors = []
      if(result.is_ok){
        this.day_options = []
        let number_of_resources = 1
        if(!this.isNullObject(result.data.items) && result.data.items.length>0)
          number_of_resources = result.data.items.filter(r => r.status == options.good_status.active).length
        let total_days = Math.floor(options.calendar_max_cols/number_of_resources)
        for(let i = 1; i<= total_days; i++)
          this.day_options.push({ id: i, name: i })
      }
      else {
        errors = [...result.error_messages]
      }

      let booking_calendar_setting_api = new BookingCalendarSettingApi() 
      result = await booking_calendar_setting_api.getBookingCalendarSettingAsync(this.shop_data.shop_id)
      if(result.is_ok){
        this.booking_calendar_setting = result.data
        let calendar_days_number = this.booking_calendar_setting.fields.number_of_day
        let index_of_calendar_days_number = this.day_options.filter(o => o.id == calendar_days_number)
        if(index_of_calendar_days_number.length == 0){
          this.day_options.unshift({ id: calendar_days_number, name: calendar_days_number })
        }
      }
      else {
        errors = [...errors, ...result.error_messages]
      }

      if(errors.length > 0){
        this.showAlert(errors)
      }

      this.saveDataForCompare()
      this.preLoader(false) 
    }, 
    saveDataForCompare(){
      this.data_saved = {
        data: JSON.stringify(this.booking_calendar_setting)
      }
    }, 
    //event's handlers
    onAlertCancel(){
      //stay at the current page and do not save
      this.hideDialogById(this.alert_id)
      calendar_settings_next_route=''
    },
    async onAlertConfirmAsync(){
      //move to the next page and do not save
      this.saveDataForCompare()
      this.$router.push(calendar_settings_next_route)
      this.hideDialogById(this.alert_id)
    }, 
    async onConfirmAsync(){
      this.preLoader()
      let booking_calendar_setting_api = new BookingCalendarSettingApi() 
      let result={}
      this.booking_calendar_setting.updateShopData(this.shop_data)
      this.booking_calendar_setting_errors = this.booking_calendar_setting.isValid()  
      if(this.booking_calendar_setting_errors.length == 0) {
       
        if(this.booking_calendar_setting.fields.id>0){ 
          result = await booking_calendar_setting_api.updateBookingCalendarSettingAsync(this.booking_calendar_setting)
        }
        else{
          result = await booking_calendar_setting_api.addBookingCalendarSettingAsync(this.booking_calendar_setting)
        }
     
        if(result.is_ok) {
          this.booking_calendar_setting = result.data 
          cache_session.clearSessionBookingSetup()
        } 
        else this.booking_calendar_setting_errors = result.error_messages
      } 
      this.saveDataForCompare()
      this.preLoader(false) 
    },
  }
}
</script>

<style lang='scss'>
@import './booking-calendar-settings.scss';
</style>