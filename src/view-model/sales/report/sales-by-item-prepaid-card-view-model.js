import ViewModel  from '../../view-model'
export default class SalesByItemPrepaidCardViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      prepaid_card_name: '',
      sales: {
        quantity : 0,
        amount   : 0
      },
      refund: {
        quantity : 0,
        amount   : 0
      },
      total      : 0
    }
  }
  
  mapFieldsFromApi(api_data){
    this.fields.prepaid_card_name = api_data.prepaidCardName
    this.fields.sales             = this.mapValueFromApi(api_data.sales)
    this.fields.refund            = this.mapValueFromApi(api_data.refund)
    this.fields.total             = this.fields.sales.amount - this.fields.refund.amount
  }
  mapValueFromApi(api_data){
    return {
      quantity : api_data.quantity,
      amount   : api_data.amount,
    }
  }
}