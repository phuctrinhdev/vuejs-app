import ViewModel  from '../../view-model'
export default class SalesByItemPrepaidServiceViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      category_name: '',
      prepaid_service_name: '',
      sales: {
        quantity : 0,
        amount   : 0
      },
      service_deduction: {
        quantity : 0,
        amount   : 0
      },
      service_deduction_refund: {
        quantity : 0,
        amount   : 0
      },
      points_deduction: 0
    }
  }
  
  mapFieldsFromApi(api_data){
    this.fields.category_name           = api_data.categoryName
    this.fields.prepaid_service_name    = api_data.prepaidServiceName
    this.fields.sales                   = this.mapValueFromApi(api_data.sales)
    this.fields.service_deduction       = this.mapValueFromApi(api_data.serviceDeduction)
    this.fields.service_deduction_refund= this.mapValueFromApi(api_data.serviceDeductionRefund)
    this.fields.points_deduction        = api_data.pointsDeductions
  }
  mapValueFromApi(api_data){
    return {
      quantity : api_data.quantity,
      amount   : api_data.amount,
    }
  }
}