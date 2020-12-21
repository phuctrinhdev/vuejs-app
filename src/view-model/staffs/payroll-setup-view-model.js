import ViewModel             from '../view-model'

export default class PayrollSetupViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      sales_service_percent         : 0,
      sales_product_percent         : 0,
      sales_prepaid_card_percent    : 0,
      sales_prepaid_service_percent : 0,
      deduction_service_percent     : 0,
      deduction_product_percent     : 0,
      include_point_deduction       : true,
      shop_id                       : 0
    }
  }

  mapFieldsFromApi(data){
    this.fields.sales_service_percent            = data.salesServicePercent
    this.fields.sales_product_percent            = data.salesProductPercent
    this.fields.sales_prepaid_card_percent       = data.salesPrepaidCardPercent
    this.fields.sales_prepaid_service_percent    = data.salesPrepaidServicePercent
    this.fields.deduction_service_percent        = data.deductionServicePercent
    this.fields.deduction_product_percent        = data.deductionProductPercent
    this.fields.include_point_deduction          = data.includePointDeduction
    this.fields.shop_id                          = data.shopId
  }

  mapFieldsToApi(){
    return {
      salesServicePercent        : this.fields.sales_service_percent,
      salesProductPercent        : this.fields.sales_product_percent,
      salesPrepaidCardPercent    : this.fields.sales_prepaid_card_percent,
      salesPrepaidServicePercent : this.fields.sales_prepaid_service_percent,
      deductionServicePercent    : this.fields.deduction_service_percent,
      deductionProductPercent    : this.fields.deduction_product_percent,
      includePointDeduction      : this.fields.include_point_deduction,
      shopId                     : this.fields.shop_id,
    }
  }

  isValid(){
    let validations = {
      sales_service_percent: {
        label:'payroll.err_sales_service_percent',
        rules: {
          numeric: '',
          customRule: {
            message: 'payroll.err_sales_service_percent',
            process(model) {
              if(model.sales_service_percent < 0 || model.sales_service_percent > 100)
                return false
              return true
            }
          }
        }
      },
      sales_product_percent: {
        label:'payroll.err_sales_product_percent',
        rules: {
          numeric: '',
          customRule: {
            message: 'payroll.err_sales_product_percent',
            process(model) {
              if(model.sales_product_percent < 0 || model.sales_product_percent > 100)
                return false
              return true
            }
          }
        }
      },
      sales_prepaid_card_percent: {
        label:'payroll.err_sales_prepaid_card_percent',
        rules: {
          numeric: '',
          customRule: {
            message: 'payroll.err_sales_prepaid_card_percent',
            process(model) {
              if(model.sales_prepaid_card_percent < 0 || model.sales_prepaid_card_percent > 100)
                return false
              return true
            }
          }
        }
      },
      sales_prepaid_service_percent: {
        label:'payroll.err_sales_prepaid_service_percent',
        rules: {
          numeric: '',
          customRule: {
            message: 'payroll.err_sales_prepaid_service_percent',
            process(model) {
              if(model.sales_prepaid_service_percent < 0 || model.sales_prepaid_service_percent > 100)
                return false
              return true
            }
          }
        }
      },
      deduction_service_percent: {
        label:'payroll.err_deduction_service_percent',
        rules: {
          numeric: '',
          customRule: {
            message: 'payroll.err_deduction_service_percent',
            process(model) {
              if(model.deduction_service_percent < 0 || model.deduction_service_percent > 100)
                return false
              return true
            }
          }
        }
      },
      deduction_product_percent: {
        label:'payroll.err_deduction_product_percent',
        rules: {
          numeric: '',
          customRule: {
            message: 'payroll.err_deduction_product_percent',
            process(model) {
              if(model.deduction_product_percent < 0 || model.deduction_product_percent > 100)
                return false
              return true
            }
          }
        }
      },
    }
    return super.isValid(validations)
  }
}
