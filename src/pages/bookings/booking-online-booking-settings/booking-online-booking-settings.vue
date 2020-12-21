<template>
  <main class="app-content">
    <section class="content  booking-online-booking-settings">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('bookings.setup-booking') }}</h3>
        </article>
        <booking-links/> 
        <div class="booking-online-booking-settings-part">
          <div class="part-title clearfix">
            <div class="title">{{ $t('booking-online-booking-settings.online-booking-settings') }}</div>
             
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-online-booking-settings.enable-online-booking') }}</label>
              </div>
              <div class="col-md-3 col-sm-3 col-12" >  
                <radio-group v-model="online_booking_setting.fields.enable_online_booking" :options="options.option_yes_no" 
                             :buttons="true"/>  
              </div> 
            </div> 
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-online-booking-settings.online-booking-settings') }}</label>
              </div>
              <div class="col-md-3 col-sm-3 col-12" >  
                <radio-group v-model="online_booking_setting.fields.online_booking_approval" :options="options.option_approval_type"
                             :buttons="true"/> 
              </div> 
            </div>  
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-online-booking-settings.allow-client-to-choose-resources') }}</label>
              </div>
              <div class="col-md-3 col-sm-3 col-12" >  
                <radio-group v-model="online_booking_setting.fields.can_choose_resource" :options="options.option_yes_no"
                             :buttons="true"/>  
              </div> 
            </div> 
            <div class="row form-group">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label>{{ $t('booking-online-booking-settings.send-text-message') }}</label>
              </div>
              <div class="col-md-7 col-sm-7 col-12" >  
                <radio-group v-model="online_booking_setting.fields.send_text_message_to_manager" :options="options.option_yes_no"
                             :buttons="true"/>  
              </div> 
            </div> 
            <div class="row form-group mobile-number">
              <div class="col-md-3 col-sm-4 col-12" >  
                <label class="label-mobile">{{ $t('booking-online-booking-settings.mobile-number') }}</label>
              </div>
              <div class="col-md-9 col-sm-8 col-12" >  
                <div class="row">
                  <div class="col-md-3 col-5 mobile-input">
                    <b-form-input v-model="online_booking_setting.fields.manager_mobile_number" type="text" class="text-mobile" 
                                  readonly/> 
                  </div> 
                  <div class="col-md-6 col-sm-6 col-6">
                    <ul class="btn-group clearfix">
                      <li><a class="btn btn-large" @click="onClickAdd">{{ $t('general.add') }}</a></li>
                      <li><a class="btn btn-large" @click="onClickDelete">{{ $t('general.delete') }}</a></li>
                    </ul>
                  </div>
                </div> 
              </div>
            </div>
            
            <error-box :errors="online_booking_setting_errors" />
            <div class="modal-footer">
              <button class="btn " @click="onConfirmAsync()">{{ $t('general.save') }}</button>
            </div> 
          </div>  
        </div> 
      </div> 
    </section>  
    <alert-confirm :id="alert_id" :title="alert_title" :data_alerts="alert_data"  
                   @confirm="onAlertConfirmAsync" @cancel="onAlertCancel"/>  
    <add-mobile-number :data="online_booking_setting.fields.manager_mobile_number" @update-success="onUpdateMobileNumber" />
  </main>
</template> 

<script>
import { options } from '../../../helpers/options'
import { cache_session } from '../../../helpers/common'
import error_box from '../../../components/common/form/error-box/error-box' 
import radio_group from '../../../components/common/form/radio/radio-group/radio-group' 
import booking_links from '../../../components/bookings/booking-links/booking-links'   
import component_base    from '../../../components/common/component-base/component-base'
import alert_confirm from '../../../components/common/alert/alert-confirm' 
import add_mobile_number from '../../../components/bookings/add-mobile-number/add-mobile-number'     
import { differentObject } from '../../../helpers/common'
import BookingOnlineBookingSettingApi from '../../../api/bookings/booking-online-booking-setting-api' 
import BookingOnlineBookingSettingViewModel from '../../../view-model/bookings/booking-online-booking-setting-view-model.js'
var online_booking_settings_next_route = ''

export default {
  components: {
    'booking-links': booking_links,
    'error-box': error_box,
    'add-mobile-number': add_mobile_number,   
    'radio-group':radio_group,
    'alert-confirm': alert_confirm  
  },
  extends: component_base,
  data() {
    return {
      alert_id :'booking_online_booking_setting_confirm_id',
      alert_title :'',
      alert_data:[ this.$i18n.t('general.alert-save-data') ],
      time: '',
      options,   
      online_booking_setting:{},
      online_booking_setting_errors:[]
    }
  }, 
   
  beforeMount(){
    this.online_booking_setting = new BookingOnlineBookingSettingViewModel()
  },
  mounted() { 
    this.loadPage()
  },
  beforeRouteLeave (to, from, next) {
    online_booking_settings_next_route = to.name
    // compare data & change page
    let data_current = {
      data: JSON.stringify(this.online_booking_setting)
    }  
    if(differentObject(this.data_saved, data_current)) { 
      this.showDialogById(this.alert_id)
    }
    else next()
  },
  methods: {  
    async loadPage(){
      this.preLoader()
      this.online_booking_setting_errors =[]
      let online_booking_setting_api = new BookingOnlineBookingSettingApi() 
      let result = await online_booking_setting_api.getBookingOnlineBookingSettingAsync(this.shop_data.shop_id)
      if(result.is_ok){
        this.online_booking_setting = result.data
      }
      else {
        this.showAlert(result.error_messages)
      }
      this.saveDataForCompare()
      this.preLoader(false)  
    }, 
    onClickAdd(){
      this.showDialogById( 'add-mobile-number-modal')
    },
    onClickDelete(){
      this.online_booking_setting.fields.manager_mobile_number = ''
    },
    onUpdateMobileNumber(data){
      this.online_booking_setting.fields.manager_mobile_number = data
    }, 
    saveDataForCompare(){
      this.data_saved = {
        data: JSON.stringify(this.online_booking_setting)
      }
    }, 
    //event's handlers
    onAlertCancel(){
      //stay at the current page and do not save
      online_booking_settings_next_route=''
      this.hideDialogById(this.alert_id)
    },
    async onAlertConfirmAsync(){
      //move to the next page and do not save
      this.saveDataForCompare()
      this.$router.push(online_booking_settings_next_route)
      this.hideDialogById(this.alert_id)
    }, 
    async onConfirmAsync(){
      this.preLoader()
      this.online_booking_setting_errors = []
      let online_booking_setting_api = new BookingOnlineBookingSettingApi() 
      let result={}
      this.online_booking_setting.updateShopData(this.shop_data)
      this.online_booking_setting_errors = this.online_booking_setting.isValid()  
      if(this.online_booking_setting_errors.length == 0) {
        if(this.online_booking_setting.fields.id > 0){ 
          result = await online_booking_setting_api.updateBookingOnlineBookingSettingAsync(this.online_booking_setting)
        }else{
          result = await online_booking_setting_api.addBookingOnlineBookingSettingAsync(this.online_booking_setting)
        }
        
        if(result.is_ok) {
          this.online_booking_setting = result.data
          cache_session.clearSessionBookingSetup()
        } 
        else this.online_booking_setting_errors = result.error_messages
      } 
      this.saveDataForCompare()
      this.preLoader(false) 
    },
  }
}
</script>

<style lang='scss'>
@import './booking-online-booking-settings.scss';
</style>