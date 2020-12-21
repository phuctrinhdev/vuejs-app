import ViewModel from '../view-model.js'  
import { options } from '../../helpers/options'
// import RESOURCE_TYPE from '../../config/constant'  
export default class BookingResourcesViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id: 0, 
      resource_id: 0,
      resource_name: '',
      resource_type: 1,
      order_no: '',
      working_hours_are_same_as_salon: true,
      allow_online_booking: true,
      opening_hours: [],
      specific_off_days: [],
      status: 1,
      shop_id: 0
    }
  }
  getValidations(){
    let validations = { 
      resource_name: {
        label: 'booking-resources.resource-name',
        rules: {
          require: '',
          maxLength: {
            max_value:50
          }
        }
      }, 
      resource_id: {
        label: 'booking-resources.staff',
        rules: {  
          customRule: {
            message: 'validate_messages.require',
            process(model) {  
              if(model.resource_type === options.resource_type.staff) {
                if(model.resource_id <= 0  ) return false
              } 
              return true
            }
          }
        }
      },
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}