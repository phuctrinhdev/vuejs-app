import { options }              from '../options'
import { mapActions }           from 'vuex'
import BlockedTimeViewModel from '../../view-model/bookings/blocked-time-view-model'
export default {
  methods: {
    ...mapActions('blocked_time', [
      'setBlockedTimeActionData',
      'updateBlockedTimeDataToStoreOnly'
    ]),
    async onActionBlockedTime(action, blocked_time = new BlockedTimeViewModel(), 
      resource_setup_id = 0, 
      booking_date = new Date(), 
      booking_date_ts_miliseconds = 0,
      cross_date = false, 
      time ='00:00'){
      this.blocked_time_action = {
        action: action,
        data: blocked_time,
        options: {
          booking_resource_setup_id: resource_setup_id,
          booking_date: booking_date,
          booking_date_ts_miliseconds: booking_date_ts_miliseconds,
          cross_date: cross_date,
          start_time: time
        }
      }
      this.setBlockedTimeActionData(this.blocked_time_action)
      if(action == options.form_actions.add || action == options.form_actions.edit) {
        this.$root.$emit('bv::show::modal', 'blocked-time-action-modal') 
      }
    },
  }
}