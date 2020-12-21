import ViewModel  from '../../../view-model.js'
export default class SalesTotalViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      sales_item: '',
      sales     : {
        quantity: 0,
        amount  : 0
      },
      refund    : {
        quantity: 0,
        amount  : 0
      },
    }
  }
  
  mapFieldsFromApi(api_data){
    this.fields.sales_item= api_data.salesItem
    this.fields.sales     = this.mapValueFromApi(api_data.sales)
    this.fields.refund    = this.mapValueFromApi(api_data.refund)
  }
  mapValueFromApi(api_data){
    return {
      quantity : api_data.quantity,
      amount   : api_data.amount
    }
  }
}