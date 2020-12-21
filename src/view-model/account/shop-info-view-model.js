import ViewModel from '../view-model'

export default class ShopInfoViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id: 0,
      owner_name          : null,
      owner_mobile_number : null,
      manager_name        : null,
      manager_title       : null,
      mobile_number       : null,
      phone_number        : null,
      email               : null,      
      post_code           : null,
      address1            : null,
      address2            : null,
    }
  }  
  mapFieldToApi(ui_data = this.fields){
    return {
      shopId            : ui_data.id, 
      ownerName         : ui_data.owner_name,
      ownerMobileNumber : ui_data.owner_mobile_number,
      managerName       : ui_data.manager_name,
      managerTitle      : ui_data.manager_title,
      mobileNumber      : ui_data.mobile_number,
      phoneNumber       : ui_data.phone_number,
      email             : ui_data.email,
      postCode          : ui_data.post_code,
      address1          : ui_data.address1,
      address2          : ui_data.address2,
    }
  }
  mapFieldFromApi(api_data){
    return {
      id                    : api_data.shopId, 
      modification_date     : api_data.modificationDate, 
      registration_date     : api_data.registrationDate, 
      country_code          : api_data.countryCode,
      solution_id           : api_data.solutionId,
      solution_name         : api_data.solutionName,
      service_type_code     : api_data.serviceTypeCode,
      service_type_name     : api_data.serviceTypeName,
      business_type_code    : api_data.businessTypeCode,
      business_type_name    : api_data.businessTypeName,
      shop_name             : api_data.shopName,
      
      owner_name            : api_data.ownerName,
      owner_mobile_number   : api_data.ownerMobileNumber,
      manager_name          : api_data.managerName,
      manager_title         : api_data.managerTitle,
      mobile_number         : api_data.mobileNumber,
      message_rejected      : api_data.messageRejected,
      phone_number          : api_data.phoneNumber,
      email                 : api_data.email,
      email_rejected        : api_data.emailRejected,
      post_code             : api_data.postCode,
      address1              : api_data.address1,
      address2              : api_data.address2,

      status                : api_data.shopStatus,
      shop_rating_number    : api_data.shopRatingNumber,      
      expiry_date           : api_data.expiryDateTS,
      overdue_month         : api_data.overdueMonths,
      tax_invoice_request   : api_data.taxInvoiceRequest,
      tax_invoice_info_id   : api_data.taxInvoiceInfoId,      
      branch_type           : api_data.branchType,
      chain_id              : api_data.chainId,
    }
  }


  getValidations(){
    let validations = {
      owner_name: {
        rules: {
          maxLength: {
            max_value: 50
          }
        }
      },
      owner_mobile_number: {
        rules: {
          numbers: '',
          maxLength: {
            max_value: 12
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
      manager_title: {
        rules: {
          maxLength: {
            max_value: 12
          }
        }
      },
      mobile_number: {
        rules: {
          numbers: '',
          maxLength: {
            max_value: 12
          }
        }
      },
      phone_number: {
        rules: {
          numbers: '',
          maxLength: {
            max_value: 20
          }
        }
      },
      email: {
        rules: {
          email: '',
          maxLength: {
            max_value: 50
          },
        }
      },      
      post_code: {
        rules: {
          maxLength: {
            max_value: 20
          }
        }
      },
      address1: {
        rules: {
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
    }    
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}