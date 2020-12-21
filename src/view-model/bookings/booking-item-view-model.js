import ViewModel from '../view-model.js'  

export default class BookingItemViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id: 0, 
      order_no: '',
      use_service_code: '',
      booking_item_name: '',
      estimated_time: 15, 
      status: 1,
      shop_id: 0
    }
  }
  getValidations(){
    let validations = { 
      booking_item_name: {
        label: 'booking-item.item-name',
        rules: {
          require: '',
          maxLength: {
            max_value:50
          }
        }
      },
      estimated_time: {
        label: 'booking-item.estimated-time',
        rules: {  
          customRule: {
            message: 'validate_messages.require',
            process(model) {  
              if(model.is_required_processing_time ===true ) {
                if(model.estimated_time < 5 || model.estimated_time > 300) return false
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