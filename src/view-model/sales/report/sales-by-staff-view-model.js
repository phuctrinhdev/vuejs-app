import ViewModel  from '../../view-model'
export default class SalesByStaffViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      staff_name: '',
      services: {
        sales_amount   : 0,
        sales_quantity : 0,
        refund_amount  : 0,
        refund_quantity: 0
      },
      products: {
        sales_amount   : 0,
        sales_quantity : 0,
        refund_amount  : 0,
        refund_quantity: 0
      },
      total_service_product: {
        sales_amount   : 0,
        sales_quantity : 0,
        refund_amount  : 0,
        refund_quantity: 0
      },
      prepaid_cards: {
        sales_amount   : 0,
        sales_quantity : 0,
        refund_amount  : 0,
        refund_quantity: 0
      },
      prepaid_services: {
        sales_amount   : 0,
        sales_quantity : 0,
        refund_amount  : 0,
        refund_quantity: 0
      },
      total_prepaid_goods: {
        sales_amount   : 0,
        sales_quantity : 0,
        refund_amount  : 0,
        refund_quantity: 0
      },
    }
  }
  
  mapFieldsFromApi(api_data){
    this.fields.staff_name            = api_data.staffName
    this.fields.services              = this.mapValueFromApi(api_data.services)
    this.fields.products              = this.mapValueFromApi(api_data.products)
    this.fields.total_service_product = this.mapValueTotalServiceProductFromApi()
    this.fields.prepaid_cards         = this.mapValueFromApi(api_data.prepaidCards)
    this.fields.prepaid_services      = this.mapValueFromApi(api_data.prepaidServices)
    this.fields.total_prepaid_goods   = this.mapValueTotalPrepaidGoodsFromApi()
  }
  mapValueFromApi(api_data){
    return {
      sales_amount   : api_data.salesAmount,
      sales_quantity : api_data.salesQuantity,
      refund_amount  : api_data.refundAmount,
      refund_quantity: api_data.refundQuantity,
      total_amount   : api_data.salesAmount + api_data.refundAmount,
      total_quantity : api_data.salesQuantity + api_data.refundQuantity
    }
  }
  mapValueTotalServiceProductFromApi(){
    return {
      sales_amount   : this.fields.services.sales_amount   + this.fields.products.sales_amount,
      sales_quantity : this.fields.services.sales_quantity + this.fields.products.sales_quantity,
      refund_amount  : this.fields.services.refund_amount  + this.fields.products.refund_amount,
      refund_quantity: this.fields.services.refund_quantity+ this.fields.products.refund_quantity,
      total_amount   : this.fields.services.total_amount   + this.fields.products.total_amount,
      total_quantity : this.fields.services.total_quantity + this.fields.products.total_quantity,
    }
  }
  mapValueTotalPrepaidGoodsFromApi(){
    return {
      sales_amount   : this.fields.prepaid_cards.sales_amount   + this.fields.prepaid_services.sales_amount,
      sales_quantity : this.fields.prepaid_cards.sales_quantity + this.fields.prepaid_services.sales_quantity,
      refund_amount  : this.fields.prepaid_cards.refund_amount  + this.fields.prepaid_services.refund_amount,
      refund_quantity: this.fields.prepaid_cards.refund_quantity+ this.fields.prepaid_services.refund_quantity,
      total_amount   : this.fields.prepaid_cards.total_amount   + this.fields.prepaid_services.total_amount,
      total_quantity : this.fields.prepaid_cards.total_quantity + this.fields.prepaid_services.total_quantity,
    }
  }
}