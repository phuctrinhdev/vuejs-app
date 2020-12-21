import ViewModel from '../view-model.js'
import { options } from '../../helpers/options'

export default class BookingDepositViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = { 
      deposit_type       : 1,
      due_date           : new Date(),
      due_time           : '00:00',
      amount             : '',
      payment_method_id  : 0,
      payment_method_name: 0,
      is_added_to_sales  : true,
      due_date_view      : ''
    }
  }
  getValidations(){
    let validations = {
      due_date: {
        label: 'bookings.due-date',
        rules: {
          customRule: {
            message: 'validate_messages.require',
            process(model) {
              if(model.deposit_type != options.deposit_type.pay_by_balance) {
                if(model.due_date == '') return false
              } 
              return true
            }
          }
        }
      },
      payment_method_id: {
        label: 'bookings.payment-method',
        rules: {
          customRule: {
            message: 'validate_messages.require',
            process(model) {
              if(model.deposit_type == options.deposit_type.paid) {
                if(model.payment_method_id == null || model.payment_method_id == 0) return false
              } 
              return true
            }
          }
        }
      },
      amount: {
        label: 'general.amount',
        rules: {
          require: '',
          numeric: '',
          minValue: {
            min_value: 0
          },
        }
      },
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}