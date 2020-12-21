import ViewModel  from '../../view-model'
export default class SalesByItemServiceViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      category_name: '',
      service_name : '',
      sales: {
        quantity : 0,
        amount   : 0
      },
      refund: {
        quantity : 0,
        amount   : 0
      },
      balance_deduction: {
        quantity : 0,
        amount   : 0
      },
      service_deduction: {
        quantity : 0,
        amount   : 0
      },
      total: {
        quantity : 0,
        amount   : 0
      },
      average_unit_price: 0,
      points_deduction  : 0
    }
  }
  
  mapFieldsFromApi(api_data){
    let tmp_average_unit_price = 0
    if(api_data.totalQuantity > 0)
      tmp_average_unit_price = api_data.totalAmount / api_data.totalQuantity
    this.fields.category_name     = api_data.categoryName
    this.fields.service_name      = api_data.serviceName
    this.fields.sales             = this.mapValueFromApi(api_data.sales)
    this.fields.refund            = this.mapValueFromApi(api_data.refund)
    this.fields.balance_deduction = this.mapValueFromApi(api_data.balanceDeduction)
    this.fields.service_deduction = this.mapValueFromApi(api_data.serviceDeduction)
    this.fields.total             = this.mapValueTotalFromApi(api_data.totalQuantity, api_data.totalAmount)
    this.fields.average_unit_price= tmp_average_unit_price
    this.fields.points_deduction  = api_data.pointsDeductions
  }
  mapValueFromApi(api_data){
    return {
      quantity : api_data.quantity,
      amount   : api_data.amount,
    }
  }
  mapValueTotalFromApi(total_quantity, total_amount){
    return {
      quantity : total_quantity,
      amount   : total_amount
    }
  }
}