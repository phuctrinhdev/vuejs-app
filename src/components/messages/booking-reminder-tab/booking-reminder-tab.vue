<template>
  <table class="normal booking-reminder-tab">
    <thead>
      <tr>
        <td class="status">{{ $t('general.status') }}</td>
        <td class="type">{{ $t('messages.message-type') }}</td>
        <td class="edit">{{ $t('general.edit') }}</td>
      </tr> 
    </thead>
    <tbody>
      <tr>
        <td>          
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.booking.the_day_before)"/>
        </td>
        <td>{{ $t('message-autos.the-day-before') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.booking.the_day_before)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.booking.on_the_day)"/>
        </td>
        <td>{{ $t('message-autos.on-the-day') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.booking.on_the_day)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.booking.hours_before)"/>
        </td>
        <td>{{ $t('message-autos.hours-before') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.booking.hours_before)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.booking.registered)"/>
        </td>        
        <td>{{ $t('message-autos.booking-registration-notification') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.booking.registered)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.booking.online_confirm)"/>
        </td>        
        <td>{{ $t('message-autos.online-booking-confirm') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.booking.online_confirm)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.booking.canceled)"/>
        </td>        
        <td>{{ $t('message-autos.booking-cancel-confirm') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.booking.canceled)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.booking.online_cancel)"/>
        </td>        
        <td>{{ $t('message-autos.online-booking-cancel-confirm') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.booking.online_cancel)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { options }      from '../../../helpers/options'
import { mapMutations } from 'vuex'
import component_base   from '../../common/component-base/component-base'
import MessageSetupBookingApi       from '../../../api/message-autos/message-setup-booking-api'

export default {
  extends : component_base,
  data(){
    return {
      options: options,
      message_setup_booking_api: {},
      message_setup_booking_list: {},
      shop_id: 0,      
    }
  },
  created(){
    this.message_setup_booking_api = new MessageSetupBookingApi()
    this.message_setup_booking_list = new Map()
    this.shop_id = this.shop_data.shop_id
  },
  methods: {
    ...mapMutations('setup_automatic_messaging', [
      'setSetupAutomaticMessagingInfo',
    ]),
    async onLoadForm(){
      await this.loadDataTableAsync()
    }, 
    async loadDataTableAsync() { 
      this.preLoader()
      let result = await this.message_setup_booking_api.getMessageSetupBookingsAsync(this.shop_id)
      this.preLoader(false)
      if(result.is_ok){
        result.data.items.forEach(e => {
          this.message_setup_booking_list.set(e.fields.setup_type, e)
          this.message_setup_booking_list = new Map(this.message_setup_booking_list.set(e.fields.setup_type, e))
        })
      }
      else{
        this.showAlert(result.error_messages)
      }
    },
    onActionSetup(type){
      this.setSetupAutomaticMessagingInfo({        
        tab  : options.messages_enums.setup_automatic_messaging_tab.booking,
        type : type,
      })
      this.$router.push('setup-automatic-messaging-info')
    },
    onSetStatusClass(type){
      let class_name = ''
      let message_setup = this.message_setup_booking_list.get(type)        
      {
        if(message_setup == null) class_name = 'not-setting-btn'
        else if(message_setup.fields.status == options.common_status.active) class_name = 'active-btn'
        else if(message_setup.fields.status == options.common_status.inactive) class_name = 'inactive-btn'
      }
      return class_name
    },
  }
}
</script>

<style lang="scss">
  .booking-reminder-tab {
    thead {
      tr {
        td {
          &.status {
            width: 20%;
          }
          &.type {
            width: 60%;
          }
          &.edit {
            width: 20%;
          }
        }
      }
    }
  }
</style>