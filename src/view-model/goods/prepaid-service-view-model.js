import ViewModel from '../view-model.js'
import { VALIDITY_TYPE, GOODS_STATUS } from '../../config/constant'
import { options } from '../../helpers/options'


export default class PrepaidServiceViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      service_category_id   : 0,
      service_category_name : '',
      related_service_id    : 0,
      related_service_name  : '',
      id                    : 0, 
      name                  : '', 
      unit_price            : 0,
      quantity              : 0,
      quantity_no_limit     : false,
      price                 : 0,
      salary_sales_value    : '',
      salary_sales_type     : options.salary_type.percent,
      validity              : '',
      validity_no_limit     : false,
      validity_type         : VALIDITY_TYPE.MONTHS,
      status                : GOODS_STATUS.ACTIVE,
      shop_id               : 0,
      own_shop_id           : 0
    }
  }
  mapFieldFromApi(api_data){
    this.fields.service_category_id   = api_data.serviceCategoryId
    this.fields.service_category_name = api_data.serviceCategoryName
    this.fields.related_service_id    = api_data.relatedServiceId
    this.fields.related_service_name  = api_data.relatedServiceName
    this.fields.id                    = api_data.prepaidServiceId
    this.fields.name                  = api_data.prepaidServiceName
    this.fields.unit_price            = api_data.unitPrice
    this.fields.quantity              = api_data.quantity
    this.fields.quantity_no_limit     = api_data.quantityNoLimit
    this.fields.price                 = api_data.price
    this.fields.salary_sales_value    = api_data.salarySalesValue
    this.fields.salary_sales_type     = api_data.salarySalesType
    this.fields.validity              = api_data.validity
    this.fields.validity_no_limit     = api_data.validityNoLimit
    this.fields.validity_type         = api_data.validityType
    this.fields.status                = api_data.status
    this.fields.shop_id               = api_data.shopId
    this.fields.shared_service        = api_data.shared
    this.fields.own_shop_id           = api_data.OwnShopId
  }
  mapFieldToApi(){
    let tmp_salary_sales_value = Number(this.fields.salary_sales_value)
    return {
      serviceCategoryId   : this.fields.service_category_id,
      serviceCategoryName : this.fields.service_category_name,
      relatedServiceId    : this.fields.related_service_id,
      relatedServiceName  : this.fields.related_service_name,
      prepaidServiceId    : this.fields.id,
      prepaidServiceName  : this.fields.name,
      unitPrice           : this.fields.unit_price,
      quantity            : this.fields.quantity,
      // quantityNoLimit     : this.fields.quantity_no_limit,
      price               : this.fields.price,
      salarySalesValue    : tmp_salary_sales_value,
      salarySalesType     : this.fields.salary_sales_type,
      validity            : this.fields.validity,
      // validityNoLimit     : this.fields.validity_no_limit,
      validityType        : this.fields.validity_type,
      status              : this.fields.status,
      shopId              : this.fields.shop_id,
      shared              : this.fields.shared
    }
  }
  mapFieldFromService(service){
    this.fields.service_category_id   = service.category
    this.fields.service_category_name = service.category_name
    this.fields.related_service_id    = service.id
    this.fields.related_service_name  = service.name
    this.fields.id                    = 0
    this.fields.name                  = service.name
    this.fields.unit_price            = service.price
    this.fields.quantity              = 1
    this.fields.quantity_no_limit     = false
    this.fields.price                 = service.price
    this.fields.salary_sales_value    = service.salary_sales_value
    this.fields.salary_sales_type     = service.salary_sales_type
    this.fields.validity              = 0
    this.fields.validity_no_limit     = false
    this.fields.validity_type         = VALIDITY_TYPE.MONTHS
    this.fields.status                = GOODS_STATUS.ACTIVE
    this.fields.shop_id               = service.shop_id
    this.fields.shared                = service.shared,
    this.fields.own_shop_id           = service.OwnShopId
  }
  getValidations(){
    let validations = {
      service_category_id: {
        label: 'prepaid-services.category',
        rules: {
          require: ''
        }
      },
      related_service_id: {
        label: 'prepaid-services.service-name',
        rules: {
          require: ''
        }
      },
      name: {
        label: 'prepaid-services.prepaid-service-name',
        rules: {
          require: '',
          maxLength: {
            max_value:50
          }
        }
      },
      unit_price: {
        label: 'prepaid-services.unit-price',
        rules: {
          require: '',
          numeric: '',
          maxLength: {
            max_value:12
          }
        }
      },
      quantity: {
        label: 'prepaid-services.quantity',
        rules: {
          require: '',
          numeric: '',
          maxLength: {
            max_value:4
          }
        }
      },
      price: {
        label: 'prepaid-services.sales-price',
        rules: {
          require: '',
          numeric: '',
          maxLength: {
            max_value:12
          }
        }
      },
      salary_sales_value: {
        label: 'prepaid-services.salary-sales',
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
      validity: {
        label: 'prepaid-services.validity',
        rules: {
          require: '',
          numeric: '',
          maxLength: {
            max_value:4
          }
        }
      }
    }
    return validations
  }
  isValid(is_custom){
    let validations = this.getValidations()
    if(is_custom){
      validations.price.label = 'prepaid-services.amount'
    }
    return super.isValid(validations)
  }
}