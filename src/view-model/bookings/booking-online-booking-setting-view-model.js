import ViewModel from '../view-model.js'  
import store from '../../store/store'
import { COUNTRY } from '../../config/constant'

export default class BookingOnlineBookingSettingViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = { 
      id: 0,
      enable_online_booking: true,
      online_booking_approval: 1,
      can_choose_resource: true,
      send_text_message_to_manager: true,
      manager_mobile_number: '', 
      shop_id: 0
    }
  }

  mapFieldToApi(){
    return {
      id                            : this.fields.id,
      shopId                        : this.fields.shop_id,
      enableOnlineBooking           : this.fields.enable_online_booking,
      onlineBookingApproval         : this.fields.online_booking_approval,
      canChooseResource             : this.fields.can_choose_resource,  
      sendTextMessageToManager      : this.fields.send_text_message_to_manager, 
      managerMobileNumber           : this.fields.manager_mobile_number,  
    }
  }
  mapFieldFromApi(api_data){
    this.fields.id                            = api_data.id
    this.fields.enable_online_booking         = api_data.enableOnlineBooking
    this.fields.online_booking_approval       = api_data.onlineBookingApproval
    this.fields.can_choose_resource           = api_data.canChooseResource
    this.fields.send_text_message_to_manager  = api_data.sendTextMessageToManager
    this.fields.manager_mobile_number         = api_data.managerMobileNumber
    this.fields.shop_id                       = api_data.shopId
  }

  getValidations(){
    let validations = {
      manager_mobile_number: {
        label: 'booking-online-booking-settings.mobile-number',
        rules: { 
          customRule: {
            message: 'validate_messages.phone',
            process(model) {
              if(isNaN(model.manager_mobile_number) || model.manager_mobile_number.length > 12) {
                return false
              }
              return true 
            }
          }
        }
      },
    }

    let country = store.getters['user/getShop'].country
    if(country == COUNTRY.KR) {
      let custom_rule = validations.manager_mobile_number.rules['customRule']

      validations.manager_mobile_number.rules = {
        require: '',
        customRule: custom_rule
      }
    }

    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}