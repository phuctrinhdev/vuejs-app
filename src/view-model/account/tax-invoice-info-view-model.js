import ViewModel from '../view-model'
//import { TAX_INVOICE_REQUEST, ISSUE_BASE_ON_TYPE } from '../../config/constant'
import { ADMIN_ENUMS } from '../../config/constant'

export default class TaxInvoiceInfoViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id: 0,
      shop_id: 0,
      tax_invoice_request: ADMIN_ENUMS.TAX_INVOICE_REQUEST.NOT_REQUIRED,
      business_number: null,
      business_name: null,
      sub_business_number: null,
      owner_name: null,
      postcode: null,
      address1: null,
      address2: null, 
      business_type: null,
      business_item: null,
      issue_based_on_type: ADMIN_ENUMS.ISSUE_BASE_ON_TYPE.INPUT_BASE,
      email: null,
      manager_name: null,
      phone_number: null,
      mobile_number: null      
    }
  }
  
  mapFieldToApi(ui_data = this.fields){
    return {
      taxInvoiceId      : ui_data.id,
      shopId            : ui_data.shop_id,
      taxInvoiceRequest : ui_data.tax_invoice_request,
      businessNumber    : ui_data.business_number,
      businessName      : ui_data.business_name,
      subBusinessNumber : ui_data.sub_business_number,
      ownerName         : ui_data.owner_name,
      postcode          : ui_data.postcode,
      address1          : ui_data.address1,
      address2          : ui_data.address2,
      businessType      : ui_data.business_type,
      businessItem      : ui_data.business_item,
      issueBasedOnType  : ui_data.issue_based_on_type,
      email             : ui_data.email,
      managerName       : ui_data.manager_name,
      phoneNumber       : ui_data.phone_number,
      mobileNumber      : ui_data.mobile_number
    }
  }
  
  mapFieldFromApi(api_data){
    return {
      id                  : api_data.taxInvoiceInfoId,
      shop_id             : api_data.shopId,      
      tax_invoice_request : this.setTaxInvoiceReqsutRemoveNotSelected(api_data.taxInvoiceRequest),
      business_number     : api_data.businessNumber,
      business_name       : api_data.businessName,
      sub_business_number : api_data.subBusinessNumber,
      owner_name          : api_data.ownerName,
      postcode            : api_data.postcode,
      address1            : api_data.address1,
      address2            : api_data.address2,
      business_type       : api_data.businessType,
      business_item       : api_data.businessItem,
      issue_based_on_type : api_data.issueBasedOnType,
      email               : api_data.email,
      manager_name        : api_data.managerName,
      phone_number        : api_data.phoneNumber,
      mobile_number       : api_data.mobileNumber
    }
  } 
  
  setTaxInvoiceReqsutRemoveNotSelected(x) {
    if (x == ADMIN_ENUMS.TAX_INVOICE_REQUEST.NOT_SELETED)
      return ADMIN_ENUMS.TAX_INVOICE_REQUEST.NOT_REQUIRED
    else return x 
  }

  getValidations(){
    let validations = { 
      business_number: {
        rules: {
          require: '',
          maxLength: {
            max_value: 12
          },
          customRule: {
            process(model) {
              this.message = 'validate_messages.business-number'
              if(/[0-9]{3}-[0-9]{2}-[0-9]{5}/.test(model.business_number) == false) return false
              else return true
            }
          }
        }
      },
      sub_business_number: {
        rules: {
          maxLength: {
            max_value: 20
          }
        }
      },
      business_name: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      owner_name: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      postcode: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      address1: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      address2: {
        rules: {
          maxLength: {
            max_value: 50
          }
        }
      },
      business_type: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      business_item: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      email: {
        rules: {
          email: '',
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      manager_name: {
        rules: {
          maxLength: {
            max_value: 50
          }
        }
      },
      phone_number: {
        rules: {
          maxLength: {
            max_value: 20
          }
        }
      },
      mobile_number: {
        rules: {
          maxLength: {
            max_value: 12
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