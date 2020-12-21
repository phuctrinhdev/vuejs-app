import ViewModel        from '../view-model.js'
import { GOODS_STATUS } from '../../config/constant'
import { options }      from '../../helpers/options.js'
import i18n             from '../../translate/translate.js'

export default class PrepaidCardViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id                  : 0,
      name                : '',
      price               : '',
      charge_amount       : '',
      salary_sales_value  : 0,
      salary_sales_type   : options.salary_type.percent,
      validity            : 0,
      validity_type       : 1,
      prepaid_card_type   : 1,
      discount_for_client : 0,
      discount_for_service: 0,
      discount_for_product: 0,
      status              : GOODS_STATUS.ACTIVE,
      shop_id             : 0,
    }
  }
  mapFieldFromApi(api_data){
    this.fields.id                   = api_data.prepaidCardId,
    this.fields.name                 = api_data.prepaidCardName,
    this.fields.price                = api_data.price,
    this.fields.charge_amount        = api_data.chargeAmount,
    this.fields.salary_sales_value   = api_data.salarySalesValue,
    this.fields.salary_sales_type    = api_data.salarySalesType,
    this.fields.validity             = api_data.validity,
    this.fields.validity_type        = api_data.validityType,
    this.fields.prepaid_card_type    = api_data.prepaidCardType,
    this.fields.discount_for_client  = api_data.discountForClient,
    this.fields.discount_for_service = api_data.discountForService,
    this.fields.discount_for_product = api_data.discountForProduct,
    this.fields.status               = api_data.status,
    this.fields.shop_id              = api_data.shopId,
    this.fields.own_shop_id          = api_data.ownShopId,
    this.fields.shared               = api_data.shared
  }
  mapFieldToApi(){
    let tmp_salary_sales_value = Number(this.fields.salary_sales_value)
    return {
      prepaidCardId      : this.fields.id,
      prepaidCardName    : this.fields.name,
      price              : this.fields.price,
      chargeAmount       : this.fields.charge_amount,
      salarySalesValue   : tmp_salary_sales_value,
      salarySalesType    : this.fields.salary_sales_type,
      validity           : this.fields.validity,
      validityType       : this.fields.validity_type,
      prepaidCardType    : this.fields.prepaid_card_type,
      shopId             : this.fields.shop_id,
      discountForClient  : this.fields.discount_for_client,
      discountForService : this.fields.discount_for_service,
      discountForProduct : this.fields.discount_for_product,
      status             : this.fields.status,
    }
  }
  isValid(){
    /**
     * If prepaid_card_type == Discount card then
     * - Charge amount not require
     * - At Least Discount for Services or Discount for Product must have discount rate > 0 (value limited in 0 - 100)
     */
    let errors = []
    let validations = {
      name: {
        rules: {
          require: ''
        }
      },
      price: {
        rules: {
          numeric: '',
          require: '',
          maxLength: {
            max_value: 10,
          },
          decimalLength: {
            decimal_value: 2
          },
          minValue: {
            min_value: 0
          }
        }
      },
      charge_amount: {
        rules: {
          numeric: '',
          maxLength: {
            max_value:10,
          },
          decimalLength: {
            decimal_value: 2
          },
          minValue: {
            min_value: 0
          },
          customRule: {
            message: 'prepaid-cards.warning-discount-card-can-not-have-charge-amount',
            process(model) {
              if(model.prepaid_card_type == options.prepaid_card_type.deposit_card && Number(model.price) > Number(model.charge_amount)){
                this.message = 'prepaid-cards.warning-deposit-card-price-can-not-larger-than-charge-amount'
                return false
              }
              if(model.prepaid_card_type == options.prepaid_card_type.discount_card && model.charge_amount > 0){
                this.message = 'prepaid-cards.warning-discount-card-can-not-have-charge-amount'
                return false
              }
              return true
            }
          }
        }
      },
      salary: { 
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
      validity: {
        rules:{
          require: '',
          numeric: '',
          maxLength: {
            max_value: 5
          }
        }
      },
      validity_type: {
        rules: {
          require: ''
        }
      }
    }
    if(this.fields.prepaid_card_type == options.prepaid_card_type.deposit_card){
      validations.charge_amount.rules.require = ''
    }
    if(this.fields.discount_for_client){
      let temp_validations = {
        discount_for_service: {
          rules:{
            numeric: '',
            decimalLength: {
              decimal_value: 1
            },
            between: {
              min_value: 0,
              max_value: 100
            }
          }
        },
        discount_for_product: {
          rules:{
            numeric: '',
            decimalLength: {
              decimal_value: 1
            },
            between: {
              min_value: 0,
              max_value: 100
            }
          }
        }
      }
      validations = Object.assign(validations, temp_validations)
    }
    errors = errors.concat(super.isValid(validations))

    if(this.fields.discount_for_service == 0 && 
       this.fields.discount_for_product == 0 &&
       this.fields.discount_for_client){
      errors.push(i18n.t('prepaid-cards.discount-services-products-error-message'))
    }
    return errors
  }
}