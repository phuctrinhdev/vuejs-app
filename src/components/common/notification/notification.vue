<template>
  <dd class="notification">
    <button v-b-modal.notification-modal class="notification-icon">
      <span class="notification-count">{{ x_count_notices }}</span>
    </button>
    <b-modal id="notification-modal" 
             :title="$t('notification.notification-list')" 
             :ok-title="$t('notification.view-more')"  
             :ok-disabled="disable_btn_more"
             :cancel-title="$t('general.cancel')" 
             :no-close-on-backdrop="true"
             class="notification-modal" size="lg" 
             @ok.prevent="onShowMore">
      <ul class="notification-list">
        <li v-for="notice in notices" :key="notice.index">
          <b-btn @click="onClickBookable(notice)">
            {{ loadTitle(notice) }} 
          </b-btn> 
          <b-btn class="remove" @click="onClickDeleteNotices(notice)">X </b-btn> 
        </li>
      </ul> 
    </b-modal>

    <waiting-list-bookable :data_noti="data_bookable"/> 
  </dd>
</template>

<script>
import _ from 'lodash'
import { options } from '../../../helpers/options'
import { formatDate, formatHourShort, isNullObject, guid, convertHourToTimezone } from '../../../helpers/common'
import { mapGetters, mapActions } from 'vuex'
import bootstrap_modal from 'bootstrap-vue/es/components/modal/modal'
import * as signalR from '@aspnet/signalr' 
import BookingApi from '../../../api/bookings/booking-api'
import WaitingApi from '../../../api/bookings/waiting-api'
import waiting_list_bookable from '../../bookings/bookings/waiting-list-bookable/waiting-list-bookable' 
import component_base    from '../../common/component-base/component-base'

export default {
  components: {
    'b-modal': bootstrap_modal,
    'waiting-list-bookable': waiting_list_bookable
  },   
  extends: component_base,
  data() {
    return {
      options, 
      notices:[],
      notice:{ 
        noti_type: '', 
        noti_data: '',
        data_type:'',
        date: '',
        title: '',
        status: '', 
        resource: '', 
      },
      list_label :[
        {type: options.notification_type.bookings_created, title: 'notification.label-bookings-created'},
        {type: options.notification_type.bookings_updated, title: 'notification.label-bookings-updated'},
        {type: options.notification_type.bookings_cancelled, title: 'notification.label-bookings-cancelled'},
        {type: options.notification_type.waitings_created, title: 'notification.label-waitings-created' }, 
        {type: options.notification_type.waitings_updated, title: 'notification.label-waitings-updated' }, 
        {type: options.notification_type.waitings_cancelled, title: 'notification.label-waitings-cancelled' }
      ],
      disable_btn_more : true,
      item_show : options.pagination.notification,
      item_index: 0,
      data_type: {
        booking: 1,
        waiting: 2
      },
      data_bookable:{},
      connection_signalr: undefined,
      is_stop:false 
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
    ...mapGetters('notification', {
      x_notices: 'getNotices',
      x_count_notices: 'getCountNotices',
      x_token_booking: 'getTokenBooking'
    }), 
  },
  mounted(){
    this.setUpConnection()
  }, 
  methods: {
    formatDate,
    ...mapActions('notification', [
      'resetStateNotices',
      'addNotices',
      'deleteNotices',
      'getTokenBookingData',
      'setNoticesInBookableWaitingData'
    ]),
    ...mapActions('booking', [
      'addBookingNotificationData',
      'updateBookingNotificationData',
      'setDatePickerData',
      'setCalendarForcedReloadKeyData'
    ]),
    ...mapActions('booking_cancel', [
      'addBookingCancelNotificationData'
    ]),
    ...mapActions('waiting', [
      'addWaitingNotificationData',
      'updateWaitingNotificationData',
      'setWaitingListData'
    ]),
    loadNotice(notices=[]){   
      let clone = Object.assign([], notices)
      this.item_index = 0
      if( notices.length ){
        this.notices = clone.splice(0, this.item_show )
      } 
      this.disable_btn_more = true 
      if(this.x_count_notices > this.item_show  )
        this.disable_btn_more = false 
      return this.notices 
    }, 
    onShowMore(){
      let form_index = (this.item_index + 1) * this.item_show 
      let clone = Object.assign([], this.x_notices)
      if( clone.length >0){
        let more_notices = clone.splice(form_index, this.item_show ) 
        for(let i in more_notices){
          this.notices.push(more_notices[i])
        } 
        this.item_index += 1 
      } 
      this.disable_btn_more =  true
      if(this.x_count_notices > (form_index + this.item_show + 1)){
        this.disable_btn_more = false 
      }
      
      return this.notices 
    },
    async setUpConnection(){
      this.resetStateNotices()
      let token = await this.getToken()
      this.notices=[]
      this.item_index =0  
      this.is_stop = false
      if(token != undefined && token != '' ){
        if(this.connection_signalr != undefined){
          this.connection_signalr.stop()
          this.is_stop =true
          this.connection_signalr = undefined
        } 
        let connection  = this.connection(token) 
        connection.start() 
        this.connection_signalr = connection 
      }
      return 
    },
    onClickBookable(noti_data){ 
      if(noti_data.data_type == this.data_type.booking && 
        (noti_data.noti_type == options.notification_type.bookings_updated  || 
        noti_data.noti_type == options.notification_type.bookings_cancelled )) {
        this.data_bookable = noti_data 
        if(noti_data.noti_type == options.notification_type.bookings_cancelled  || (!isNullObject(noti_data.bookable_waiting) && noti_data.bookable_waiting.length >0 ) ){
          let length = noti_data.bookable_waiting.length 
          let data = {
            items: noti_data.bookable_waiting,
            pagination: {
              page_number: 1,
              page_size: length,
              total_items: length,
              total_pages: 1 
            }
          }
          this.setWaitingListData(data) 
        }
        else{
          noti_data.is_check_api = true
        }
        this.setNoticesInBookableWaitingData(noti_data)
        this.showDialogById('waiting-list-bookable-modal')
        this.hideDialogById('notification-modal')  
      }
      else if(noti_data.data_type == this.data_type.booking 
           && noti_data.noti_type == options.notification_type.bookings_created){
        this.$router.push('calendar')
        this.setDatePickerData(convertHourToTimezone(noti_data.booked_date))
        //force to update the calendar 
        //in case the current calendar date and the booked date are the same
        this.setCalendarForcedReloadKeyData(guid())
        this.hideDialogById('notification-modal')  
      }
    },
    onClickDeleteNotices(noti_data){
      this.notices.splice(this.notices.indexOf(noti_data), 1) 
      this.deleteNotices(noti_data)
    },
    connection(key){
      let connection = new signalR.HubConnectionBuilder()
        // eslint-disable-next-line no-undef
        .withUrl(process.env.NOTIFICATION_READ_API_BASEURL, {
          accessTokenFactory: async () => {  
            return key
          }
        })
        // .configureLogging(signalR.LogLevel.Error)
        .build()
  
      connection.on('SendMessage', (noti_type, data) => {
        let result = JSON.parse(data)
        // console.log(noti_type, result)

        if(this.user_data && result.sessionToken === this.user_data.session_token) return
        this.addNotice(noti_type, result)

        if(noti_type == options.notification_type.bookings_created || noti_type == options.notification_type.bookings_updated){
          let booking_api = new BookingApi()

          let booking = booking_api.mapBookingsFromApi([result.booking]) 
          if(noti_type == options.notification_type.bookings_created){
            this.addBookingNotificationData(booking.items)
          }
          else if(noti_type == options.notification_type.bookings_updated){
            this.updateBookingNotificationData(booking.items[0])
          }
        }
        if(noti_type == options.notification_type.bookings_cancelled){ 
          let booking_api = new BookingApi() 
          let bookings = booking_api.mapBookingsFromApi(result.bookings)  
          let bookings_cancelled = []
          if(!isNullObject(bookings.items)){
            for(let i in bookings.items){
              let item = {
                id: bookings.items[i].id,
                cancel_booking_id: 1
              }
              bookings_cancelled.push(item) 
            }
            this.addBookingCancelNotificationData(bookings_cancelled)
          }
        }

        if(noti_type == options.notification_type.waitings_created || 
          noti_type == options.notification_type.waitings_updated || 
          noti_type == options.notification_type.waitings_changed_to_bookings){
          let waiting_api = new WaitingApi()
          let waiting = waiting_api.mapFieldFromApi(result)   
          if(noti_type == options.notification_type.waitings_created){
            this.addWaitingNotificationData(waiting)
          }
          else if(noti_type == options.notification_type.waitings_updated || noti_type == options.notification_type.waitings_changed_to_bookings){ 
            this.updateWaitingNotificationData(waiting)
          }  
        } 
      })
       
      connection.onclose(async () => { 
        if(this.is_stop == false)
          await this.reConnect(key)
        else 
          this.is_stop = false
      })
      return connection
    },
    async reConnect(key) {
      try {
        let connection = this.connection(key)
        await connection.start()
      } 
      catch (errors) {
        setTimeout(() => this.reConnect(key), 2000)
      }
    },
    addWaitingToNotices(noti_type, data_type, noti_data){
      let label = this.list_label.filter(t=>t.type == noti_type) 
      if(label != undefined && label.length >0 ){ 
        let str_from_time = ' '+ formatHourShort(noti_data.from_time) 
        let str_to_time = ' '+ formatHourShort(noti_data.to_time) 
        let notice = { 
          noti_type: noti_type, 
          data_type: data_type, 
          data: noti_data,
          modification_date: noti_data.modification_date ,
          booked_date: noti_data.booking_date ,
          title: label[0].title,
          name_status: '', 
          time:  str_from_time + ' ~ ' + str_to_time, 
          resource : noti_data.resource_name
        } 
        this.addNotices(notice)
      }
    },
    addBookingToNotices(noti_type, data_type, noti_data, bookable_waitings){
      if(isNullObject(noti_data.items) && noti_data.items.length == 1) return
      let label = this.list_label.filter(t=>t.type == noti_type) 
      let title = label[0].title
      let bookable_waiting_client_name = ''
      if(label != undefined && label.length > 0){ 
        let name_status =''
        let resource =''
        for(let i in noti_data.items){
          bookable_waiting_client_name = ''
          let booking = noti_data.items[i]
          let bookable_waiting = bookable_waitings.filter(t=>t.booking_date_ts == booking.booking_date_ts)
          if(noti_type == options.notification_type.bookings_cancelled){  
            name_status = 'booking-status.canceled'  
            if(bookable_waiting.length >0){
              title = 'notification.label-bookable-waiting' 
              bookable_waiting_client_name = bookable_waiting[0].client_name  
            }
          }
          else if(noti_type == options.notification_type.bookings_updated){ 
            name_status = 'notification.change' 
            if(booking.status == options.booking.booking_status.no_show){
              name_status = 'booking-status.no-show' 
            }
          }  
          let resources = _.uniqBy(booking.booked_items,'resource_name') 
          resource = resources.map(x => x.resource_name).join(', ') 
          let booked_items =  _.sortBy( booking.booked_items, 'start_time') 
          if(label != undefined && label.length >0 ){  
            let notice = { 
              noti_type: noti_type, 
              data_type: data_type, 
              data: booking,
              modification_date: booking.modification_date,
              booked_date:  booking.booking_date, 
              title: title ,  
              name_status: name_status, 
              time: formatHourShort(booked_items[0].start_time),
              resource : resource, 
              bookable_waiting: bookable_waiting,
              bookable_waiting_client_name : bookable_waiting_client_name,
            }  
            this.addNotices(notice)
          } 
        }
      }
    },
    addNotice(noti_type, result){
      let waiting_api = new WaitingApi()
      if(noti_type == options.notification_type.bookings_created || 
        noti_type == options.notification_type.bookings_updated  || 
        noti_type == options.notification_type.bookings_cancelled ){
        let booking_api = new BookingApi()
        let booking = {}
        let bookable_waiting = []
        if(!isNullObject(result.bookableWaitings) && result.bookableWaitings.length > 0){ 
          bookable_waiting = waiting_api.mapWaitingsFromApi(result.bookableWaitings).items 
        }
        if(noti_type == options.notification_type.bookings_cancelled){ 
          booking = booking_api.mapBookingsFromApi(result.bookings)
        }
        else{ 
          booking = booking_api.mapBookingsFromApi([result.booking]) 
        } 
        this.addBookingToNotices(noti_type, this.data_type.booking, booking, bookable_waiting) 
      } 
      else if(noti_type == options.notification_type.waitings_created || noti_type == options.notification_type.waitings_updated){ 
        let waiting = waiting_api.mapFieldFromApi(result)
        this.addWaitingToNotices(noti_type, this.data_type.waiting, waiting) 
      }
      this.loadNotice(this.x_notices)
    },
    async getToken(){ 
      let query = {
        shop_id: this.shop_data.shop_id,
        life_time: '1'
      }
      return await this.getTokenBookingData(query) 
    },
    loadTitle(notice){  
      let title = this.$i18n.t(notice.title)
      let more_info = this.$i18n.t(notice.name_status) 
      if (notice.noti_type == options.notification_type.bookings_created){
        title = title + ' ' + notice.data.client_name +'.'
        more_info = notice.resource
      }
      else if(notice.noti_type == options.notification_type.bookings_cancelled){    
        if(!isNullObject(notice.bookable_waiting) 
        && !isNullObject(notice.bookable_waiting_client_name) 
        && notice.bookable_waiting_client_name != ''){
          var name_clinet = this.$i18n.t('notification.label-more-waiting')
          title += name_clinet.replace('{0}', notice.bookable_waiting_client_name) 
        } 
        return '['+ formatDate(notice.modification_date) +'] '+ title  
      }
      if(more_info != undefined && more_info !=''){
        more_info = ', ' + more_info
      }
      let full_title = '['+ formatDate(notice.modification_date) +'] '+ title 
      if(notice.noti_type != options.notification_type.bookings_cancelled){
        full_title +=' ('+ formatDate(notice.booked_date)+', ' + notice.time + more_info +')'
      }
      return full_title
    }, 
  }
}
</script>

<style lang='scss' scoped>
@import './notification.scss';
</style>