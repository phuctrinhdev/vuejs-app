import _ from 'lodash'
import { mapActions }           from 'vuex'
import { options } from '../../helpers/options'

export default {
  methods: {
    ...mapActions('booking_deposit', [
      'setBookingDepositActionData'
    ]),
    onActionBookingDeposit(booking_deposit, action, booking, deposit_from){ 
      let booking_deposit_action = {
        data: booking_deposit,
        action: action,
        options: {
          booking: _.cloneDeep(booking),
          deposit_from: deposit_from
        }
      }
      this.setBookingDepositActionData(booking_deposit_action)

      let modal_id = ''
      if(deposit_from == options.deposit_from.booking_calendar)
        modal_id = 'booking-deposit-action-modal-from-booking-calendar'
      if(deposit_from == options.deposit_from.booking_list)
        modal_id = 'booking-deposit-action-modal-from-booking-list'
      this.showDialogById(modal_id)
    }, 
  }
}