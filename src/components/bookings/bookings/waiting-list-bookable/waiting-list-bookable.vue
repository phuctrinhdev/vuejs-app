<template>
  <b-modal id="waiting-list-bookable-modal" 
           :title="form_title" 
           :no-close-on-backdrop="true"
           hide-footer
           class="waiting-list-bookable-modal"
           @show="onLoadForm()">
    <div v-if="!isNullObject(x_data_noti)" class="box-form-search"> 
      <div v-if="!isNullObject(x_data_noti.noti_type) && x_data_noti.noti_type == options.notification_type.bookings_cancelled " class="row" >
        <div class="col-sm-12"> {{ formatDate(x_data_noti.modification_date) }} {{ $t(x_data_noti.title) }} 
          <span v-if="!isNullObject(x_data_noti.bookable_waiting_client_name) && x_data_noti.bookable_waiting_client_name != ''"> 
            {{ $t('notification.label-more-waiting').replace('{0}', x_data_noti.bookable_waiting_client_name) }}
          </span>
        </div>
      </div> 
      <div v-else-if="!isNullObject(x_data_noti.noti_type)" class="row">
        <div class="col-sm-7">
          {{ formatDate(x_data_noti.modification_date) }} {{ $t(x_data_noti.title) }} 
          ({{ formatDate(x_data_noti.booked_date) }} {{ x_data_noti.time }} {{ $t(x_data_noti.name_status ) }})
        </div>
        <div class="col-sm-5">
          {{ $t('waiting-list.resource') }}: {{ x_data_noti.resource }}
        </div>
      </div>
    </div>

    <waiting-items ref="waiting_items" :skin="bookings_options.waiting_list_skin.full" 
                   @canceled-waiting="onCanceledWaiting" @change-page="onChangePage"/>
    <error-box :errors="waiting_errors"/>
  </b-modal> 
</template> 
<script> 
import { mapGetters, mapActions } from 'vuex' 
import { options }         from '../../../../helpers/options'
import { bookings_options } from '../../../../helpers/options/bookings-options'
import BookingApi          from '../../../../api/bookings/booking-api'

import waiting_items       from '../waiting-items/waiting-items.vue'
import error_box           from '../../../common/form/error-box/error-box' 
import view_table          from '../../../common/view-table/view-table.vue'   
import component_base      from '../../../common/component-base/component-base'

import { formatDate, 
  cache_session, 
  isNullObject }           from '../../../../helpers/common' 


export default {
  components: {
    'view-table': view_table ,  
    'waiting-items': waiting_items ,  
    'error-box': error_box 
  },  
  extends: component_base,
  props: { 
    data_noti: {
      type: Object,
      default: function () {
        return {  }
      }
    }, 
  },
  data(){
    return {
      options,
      bookings_options,

      data_client:{},  
      this_year: new Date().getFullYear(),
      data_query:{ },
      waiting_errors : [], 
      form_title: '' ,  
      booking_setup:{} ,  
      booking_resources_setup:[],
      waiting_to_change_booking:{}, 
      data_notice: {date: new Date() },
      bookinge_notice :{}
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('waiting', {
      x_waiting_list: 'getWaitingList'
    }), 
    ...mapGetters('notification', {
      x_data_noti: 'getNoticesInBookableWaiting'
    }),  
  },
  methods: { 
    isNullObject ,
    formatDate, 
    ...mapActions('alert', [
      'setAlertsData',
      'setOptions'
    ]), 
    ...mapActions('waiting', [
      'setWaitingListData' 
    ]),  
    hideModal(){
      this.hideDialogById('waiting-list-bookable-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.data_notice = this.data_noti   
      if(!isNullObject(this.data_notice.items) && this.data_notice.items.length >0 ){
        this.bookinge_notice = this.data_notice.items[0] 
      } 
      this.booking_setup  = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      else{ 
        this.booking_resources_setup= this.booking_setup.booking_resources_setup.items
        this.form_title = this.$i18n.t('waiting-list.waiting-list')
        if(!isNullObject(this.x_data_noti) && this.x_data_noti.is_check_api) { 
          let booking_api = new BookingApi()  
          let data_send= {
            shop_id : this.shop_data.shop_id,
            booking_date: this.x_data_noti.booked_date,
          }
          let result = await booking_api.getBookableWaitingsAsync(data_send)
          this.setListData(result.data.waitings)
        }else{ 
          this.loadWaitingBookable() 
        }
      }
    },
    loadWaitingBookable(){ 
      if(!isNullObject(this.x_data_noti) && !isNullObject(this.x_data_noti.bookable_waiting)){
        this.setListData(this.x_data_noti.bookable_waiting)
      } 
    },
    setListData(bookable_waitings){ 
      let waitings = []
      if(!isNullObject(bookable_waitings)){
        waitings  = bookable_waitings
      } 
      let length = waitings.length
      let data = {
        items: waitings,
        pagination: {
          page_number: 1,
          page_size: length,
          total_items: length,
          total_pages: 1 
        }
      }
      this.setWaitingListData(data)
    },
    onClickShowInfoBookable(){
      this.showAlert([this.$i18n.t('waiting-list-bookable.search-bookable-waiting-content')], {title: this.$i18n.t('waiting-list-bookable.search-bookable-waiting') })
    },
    onChangePage(){
      //
    },
    onActionWaiting(action, waiting = {}){ 
      this.$refs.waiting_items.onActionWaiting(action, waiting)
    },
    onCanceledWaiting(){
      this.hideModal()
    },
  }
}
</script>

<style lang="scss">
@import './waiting-list-bookable.scss';
</style>