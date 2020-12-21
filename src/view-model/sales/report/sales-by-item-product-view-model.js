import ViewModel  from '../../view-model'
export default class SalesByItemProductViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      product_code: '',
      product_name: '',
      sales: {
        quantity : 0,
        amount   : 0,
      },
      refund: {
        quantity : 0,
        amount   : 0
      },
      total: {
        quantity : 0,
        amount   : 0
      },
      supplier_price: 0,
      purchase_amount: 0,
      sales_profit  : 0
    }
  }
  
  mapFieldsFromApi(api_data){
    this.fields.product_code   = api_data.productCode
    this.fields.product_name   = api_data.productName
    this.fields.sales          = this.mapValueFromApi(api_data.sales)
    this.fields.refund         = this.mapValueFromApi(api_data.refund)
    this.fields.total          = this.mapValueTotalFromApi()
    this.fields.supplier_price = api_data.supplierPrice
    this.fields.purchase_amount= api_data.sales.quantity * api_data.supplierPrice
    this.fields.sales_profit   = this.fields.total.amount - this.fields.purchase_amount
  }
  mapValueFromApi(api_data){
    return {
      quantity : api_data.quantity,
      amount   : api_data.amount,
    }
  }
  mapValueTotalFromApi(){
    return {
      quantity : this.fields.sales.quantity + this.fields.refund.quantity,
      amount   : this.fields.sales.amount + this.fields.refund.amount
    }
  }
}