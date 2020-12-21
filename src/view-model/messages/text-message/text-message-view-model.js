import ViewModel from '../../view-model'
import { options } from '../../../helpers/options'
import { MESSAGES_ENUMS } from '../../../config/constant'
import { checkNullAndEmptyAndUndefined, checkNullAndEmpty } from '../../../helpers/common'

let receivers_validation = {
  receivers: {
    rules: {
      customRule: {
        message: 'validate_messages.receiver-number', 
        process(model) {
          let flag = true
          model.receivers.forEach(e => {
            if(/^[0-9+]*$/.test(e.receiver_phone) == false || checkNullAndEmptyAndUndefined(e.receiver_phone)){
              flag = false
            }
          })
          return flag
        }
      }
    }
  },
}
export default class TextMessageViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      message_type : MESSAGES_ENUMS.MESSAGE_TYPE.SMS,
      source_type  : MESSAGES_ENUMS.MESSAGE_SOURCE_TYPE.NONE,
      is_auto_send : false,
      is_send_now  : true,
      send_type    : MESSAGES_ENUMS.SEND_TYPE.MANUAL,
      receivers    : [],
      contents     : null,
      variableData : null,
      target_count : 0,
      image_url    : '',
      image_base64 : ''
    }
  }
  
  getValidations(){
    let validations = {       
      target_count: {
        rules: {
          minValue: {
            min_value: 1
          }
        }
      },
      message_type: {
        rules: {
          customRule: {
            process(model) {
              if(model.message_type == MESSAGES_ENUMS.MESSAGE_TYPE.MMS){
                if(checkNullAndEmptyAndUndefined(model.image_url) && checkNullAndEmptyAndUndefined(model.image_base64)) {
                  this.message = 'validate_messages.mms-image'
                  return false
                }
                else return true
              } else { // SMS, LMS
                if(checkNullAndEmpty(model.contents)) {
                  this.message = 'validate_messages.sms-lms-require'
                  return false
                }
                else return true
              }
            }
          }
        }
      }
    }
    Object.assign(validations, receivers_validation)

    return validations
  }
  isValid(type = null){
    if(type == options.messages_enums.send_page.unregister_clients)
      return super.isValid(Object.assign({}, receivers_validation))
    else 
      return super.isValid(this.getValidations())
  }
}