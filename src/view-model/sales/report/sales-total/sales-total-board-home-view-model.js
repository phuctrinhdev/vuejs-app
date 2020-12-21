import ViewModel from '../../../view-model'

export default class SalesTotalBoardHomeViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      service: 0,
      product: 0,
      prepaid_card: 0,
      prepaid_service: 0,
      sales_total: 0,
      refund: 0,
      net_sales_total: 0
    }
  }

  mapFieldFromApi(api_data){
    this.fields = api_data.reduce((acc, cur) => {
      if(cur.salesItem === 'Service')
        acc.service = this.getSalesItem(cur)
      if(cur.salesItem === 'Product')
        acc.product = this.getSalesItem(cur)
      if(cur.salesItem === 'PrepaidCard')
        acc.prepaid_card = this.getSalesItem(cur)
      if(cur.salesItem === 'PrepaidService')
        acc.prepaid_service = this.getSalesItem(cur)

      acc.sales_total = acc.service + acc.product + acc.prepaid_card + acc.prepaid_service
      acc.refund += -cur.refund.amount
      acc.net_sales_total = acc.sales_total - acc.refund
      return acc
    }, this.fields)
  }

  getSalesItem(cur){
    return cur.sales.amount
  }
}