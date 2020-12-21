import ViewModel             from '../view-model'
import { ADMIN_SALES_ENUMS } from '../../config/constant'

//import i18n                     from '../../../translate/translate.js'

export default class PaymentBankTransferViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id: 0,
      shop_id                           : null,
      country_code                      : 'KR',
      amount                            : null,
      bank_account_id                   : null,
      depositor                         : null,
      bank_transfer_notice_link_type    : null,
      link_value                        : null,      
      mobile_phone                      : null,
      notes                             : null
    }
  }  

  mapFieldToApi(ui_data = this.fields){
    return {
      shopId                          : ui_data.shop_id, 
      countryCode                     : ui_data.country_code,
      amount                          : ui_data.amount,
      bankAccountId                   : ui_data.bank_account_id,
      depositor                       : ui_data.depositor,
      bankTransferNoticeLinkType      : ui_data.bank_transfer_notice_link_type,
      linkValue                       : ui_data.link_value,
      mobilePhone                     : ui_data.mobile_phone,
      notes                           : ui_data.notes
    }
  }
  
  mapFieldFromApi(api_data){
    return {
      id                                : api_data.bankTransferNoticeId, 
      registration_date                 : api_data.registrationDate, 
      created_by_user_id                : api_data.createdByUserId,
      shop_id                           : api_data.shopId,
      country_code                      : api_data.countryCode,
      amount                            : api_data.amount,
      bank_account_id                   : api_data.bankAccountId,
      depositor                         : api_data.depositor,
      bank_transfer_notice_link_type    : api_data.bankTransferNoticeLinkType,
      link_value                        : api_data.link_value, 
      mobile_phone                      : api_data.mobilePhone,
      notes                             : api_data.notes
    }
  }

  getValidations(){
    let validations = {       
      country_code: {
        rules: {
          require: '',
          maxLength: {
            max_value: 10
          }
        }
      },
      bank_account_id: {
        rules: {
          require: ''
        }
      },
      bank_transfer_notice_link_type: {
        rules: {
          require: ''
        }
      },
      amount: {
        rules: {
          numeric: '',
          require: '',
          maxLength: {
            max_value:10,
          },
          decimalLength: {
            decimal_value: 2
          },
          minValue: {
            min_value: 0
          }
        }
      },
      mobile_phone: {
        rules: {
          numbers: '',
          maxLength: {
            max_value: 12
          }
        }
      },
      notes: {
        rules: {
          maxLength: {
            max_value: 1000
          }
        }
      },
      depositor: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      link_value: {
        rules: {
          
        }
      }
    }    
    
    if(this.fields.bank_transfer_notice_link_type == ADMIN_SALES_ENUMS.BANK_TRANSFER_NOTICE_LINK_TYPE.BASEFEEANDNETMONEY)
      Object.assign(validations.link_value.rules , { require: '', minValue: { min_value: 0 }, numbers: '' })
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
  //   errors = super.isValid(validation_rules)
  //   if(this.fields.bank_transfer_notice_link_type == 3){
  //     if(this.fields.link_value == null || this.fields.link_value == 0)
  //       errors.push('Link value should be over 0')
  //   }
  //   return errors
  // }
}