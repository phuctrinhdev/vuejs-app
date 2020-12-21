import ViewModel from '../view-model.js'
import { GOODS_STATUS } from '../../config/constant'
import { options } from '../../helpers/options'

export default class ServiceViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      key                         : '',
      id                          : 0, 
      name                        : '',
      price                       : '', 
      estimated_time              : 0,
      salary_sales_value          : '',
      salary_sales_type           : options.salary_type.percent,
      salary_deduction_value      : 0,
      is_required_processing_time : false,
      processing_time             : 0,
      finishing_time              : 0,
      category                    : null,
      category_name               : '',
      enable_online_bookings      : true,
      online_description          : '',
      same_as_service_name        : false,
      service_details             : '',
      every_staff                 : true,
      choose_staffs               : [],
      status                      : GOODS_STATUS.ACTIVE,
      shop_id                     : 0,
      own_shop_id                 : 0
    }
  }
  mapFieldFromApi(service_api_data){
    this.fields.id                            = service_api_data.serviceId
    this.fields.name                          = service_api_data.serviceName
    this.fields.category                      = service_api_data.serviceCategoryId
    this.fields.category_name                 = service_api_data.serviceCategoryName
    this.fields.price                         = service_api_data.price
    this.fields.order_no                      = service_api_data.orderNo
    this.fields.estimated_time                = service_api_data.estimatedTime
    this.fields.is_required_processing_time   = service_api_data.isRequiredProcessingTime
    this.fields.processing_time               = service_api_data.processingTime
    this.fields.finishing_time                = service_api_data.finishingTime
    this.fields.enable_online_bookings        = service_api_data.enableOnlineBookings
    this.fields.online_description            = service_api_data.onlineDescription
    this.fields.service_details               = service_api_data.serviceDetails
    this.fields.salary_sales_value            = service_api_data.salarySalesValue
    this.fields.salary_sales_type             = service_api_data.salarySalesType
    this.fields.salary_deduction_value        = service_api_data.salaryDeductionValue
    this.fields.shop_id                       = service_api_data.shopId
    this.fields.status                        = service_api_data.status
    this.fields.shared_service                = service_api_data.shared
    this.fields.own_shop_id                   = service_api_data.OwnShopId
  }
  mapFieldToApi(){
    let tmp_salary_sales_value    = Number(this.fields.salary_sales_value)
    let tmp_salary_deduction_value= Number(this.fields.salary_deduction_value)
    return {
      serviceId               : this.fields.id,
      serviceCategoryId       : this.fields.category, 
      serviceCategoryName     : this.fields.category_name,
      serviceName             : this.fields.name,
      price                   : this.fields.price,
      estimatedTime           : this.fields.estimated_time,
      isRequiredProcessingTime: this.fields.is_required_processing_time,
      processingTime          : this.fields.processing_time,
      finishingTime           : this.fields.finishing_time,
      enableOnlineBookings    : this.fields.enable_online_bookings,
      onlineDescription       : this.fields.online_description,
      serviceDetails          : this.fields.service_details,
      salarySalesValue        : tmp_salary_sales_value,
      salarySalesType         : this.fields.salary_sales_type,
      salaryDeductionValue    : tmp_salary_deduction_value,
      shopId                  : this.fields.shop_id,
      status                  : this.fields.status,
      shared                  : this.fields.shared
    }
  }
  getKey(){
    return this.fields.id + '-' + this.fields.order_no
  }
  getValidations(){
    let validations = {
      category: {
        label:'services.category',
        rules: {
          require: '' ,
          numeric: ''
        }
      },
      name: {
        label:'services.service-name',
        rules: {
          require: '' ,
          maxLength: {
            max_value: 30
          } 
        }
      },
      price: {
        label:'services.price',
        rules: {
          require: '',
          numeric: '',
          minValue: {
            min_value: 0
          },
          maxValue: {
            max_value: 9999999999
          }, 
        }
      },
      estimated_time: {
        label:'services.estimated-time',
        rules: {
          require: '',
          numeric: '', 
          minValue: {
            min_value: 5
          },
        }
      },
      processing_time: {
        label:'services.processing-time',
        rules: {  
          customRule: {
            message: 'validate_messages.require',
            process(model) {
              if(model.is_required_processing_time ===true ) {
                if(model.processing_time < 5 || model.processing_time > 300) return false
              } 
              return true
            }
          }
        }
      },
      finishing_time: {
        label:'services.finishing-time',
        rules: {  
          customRule: {
            message: 'validate_messages.require',
            process(model) {
              if(model.is_required_processing_time ===true ) {
                if(model.finishing_time < 5 || model.finishing_time > 300) return false
              } 
              return true
            }
          }
        }
      },
      salary_sales_value: { 
        label:'services.salary-sales',
        rules: {
          numeric: '',
          customRule: {
            message: 'validate_messages.salary',
            process(model) {
              if(model.salary_sales_type == options.salary_type.percent) {
                if(model.salary_sales_value < 0 || model.salary_sales_value > 100) return false
              }
              if(model.salary_sales_type == options.salary_type.amount) {
                if(model.salary_sales_value < 0 || model.salary_sales_value > 9999999999) return false
              }
              return true
            }
          }
        }
      },
      salary_deduction_value: {
        label:'services.salary-deduction',
        rules: { 
          numeric: '',
          minValue: {
            min_value: 0
          },
          maxValue: {
            max_value: 9999999999
          }, 
        }
      },
      online_description: {
        label:'services.online-description',
        rules: { 
          maxLength: {
            max_value: 50
          } 
        }
      }
    }
    
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}