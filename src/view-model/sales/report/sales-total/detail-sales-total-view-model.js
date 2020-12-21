import ViewModel from '../../../view-model'
import ItemSalesTotalViewModel from './item-sales-total-view-model'

export default class DetailSalesTotalViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = [
      {
        name: 'sales',
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'refund',
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'net-sales-total',
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'balance-deduction',
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'service-deduction',
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'deduction-total', 
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'grand-total',
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'number-of-sales-&-amount-per-sale',
        ...new ItemSalesTotalViewModel()
      },
      {
        name: 'points-deduction',
        ...new ItemSalesTotalViewModel()
      }
    ]
  }

  mapFieldFromApi(api_data){
    for (const item of api_data) {
      switch (item.salesItem) {
        case 'Service':
          this.fields[0].fields.service = this.mapGoodsItem(item.sales)
          this.fields[1].fields.service = this.mapDeductionItem(item.refund)
          this.fields[2].fields.service = this.mapNetSalesTotalItem(this.fields[0].fields.service, this.fields[1].fields.service)
          this.fields[3].fields.service = this.mapGoodsItem(item.balanceDeduction)
          this.fields[4].fields.service = this.mapDeductionItem(item.serviceDeduction)
          this.fields[5].fields.service = this.mapTotalItem(this.fields[3].fields.service, this.fields[4].fields.service)
          this.fields[6].fields.service = this.mapTotalItem(this.fields[2].fields.service, this.fields[5].fields.service)
          this.fields[7].fields.service = this.mapNumberOfSalesAndAmountPerSale(item.numberSalesOfService, this.fields[6].fields.service.amount)
          this.fields[8].fields.service = this.mapGoodsItem(item.pointDeduction)

          break
        case 'Product':
          this.fields[0].fields.product = this.mapGoodsItem(item.sales)
          this.fields[1].fields.product = this.mapDeductionItem(item.refund)
          this.fields[2].fields.product = this.mapNetSalesTotalItem(this.fields[0].fields.product, this.fields[1].fields.product)
          this.fields[3].fields.product = this.mapGoodsItem(item.balanceDeduction)
          this.fields[4].fields.product = this.mapDeductionItem(item.serviceDeduction)
          this.fields[5].fields.product = this.mapTotalItem(this.fields[3].fields.product, this.fields[4].fields.product)
          this.fields[6].fields.product = this.mapTotalItem(this.fields[2].fields.product, this.fields[5].fields.product)
          this.fields[7].fields.product = this.mapNumberOfSalesAndAmountPerSale(item.numberSalesOfProduct, this.fields[6].fields.product.amount)
          this.fields[8].fields.product = this.mapGoodsItem(item.pointDeduction)

          break
        case 'PrepaidCard':
          this.fields[0].fields.prepaid_card = this.mapGoodsItem(item.sales)
          this.fields[1].fields.prepaid_card = this.mapDeductionItem(item.refund)
          this.fields[2].fields.prepaid_card = this.mapNetSalesTotalItem(this.fields[0].fields.prepaid_card, this.fields[1].fields.prepaid_card)
          this.fields[3].fields.prepaid_card = this.mapGoodsItem(item.balanceDeduction)
          this.fields[4].fields.prepaid_card = this.mapDeductionItem(item.serviceDeduction)
          this.fields[8].fields.prepaid_card = this.mapGoodsItem(item.pointDeduction)

          break
        case 'PrepaidService':
          this.fields[0].fields.prepaid_service = this.mapGoodsItem(item.sales)
          this.fields[1].fields.prepaid_service = this.mapDeductionItem(item.refund)
          this.fields[2].fields.prepaid_service = this.mapNetSalesTotalItem(this.fields[0].fields.prepaid_service, this.fields[1].fields.prepaid_service)
          this.fields[3].fields.prepaid_service = this.mapGoodsItem(item.balanceDeduction)
          this.fields[4].fields.prepaid_service = this.mapDeductionItem(item.serviceDeduction)
          this.fields[8].fields.prepaid_service = this.mapGoodsItem(item.pointDeduction)

          break
      }
      this.fields[0].fields.total = this.mapTotalAllItem(this.fields[0].fields.service, this.fields[0].fields.product, this.fields[0].fields.prepaid_card, this.fields[0].fields.prepaid_service)
      this.fields[1].fields.total = this.mapTotalAllItem(this.fields[1].fields.service, this.fields[1].fields.product, this.fields[1].fields.prepaid_card, this.fields[1].fields.prepaid_service)

      this.fields[2].fields.total.quantity = this.fields[0].fields.total.quantity + this.fields[1].fields.total.quantity
      this.fields[2].fields.total.amount = this.fields[0].fields.total.amount + this.fields[1].fields.total.amount

      this.fields[3].fields.total = this.mapTotalAllItem(this.fields[3].fields.service, this.fields[3].fields.product, this.fields[3].fields.prepaid_card, this.fields[3].fields.prepaid_service)
      this.fields[4].fields.total = this.mapTotalAllItem(this.fields[4].fields.service, this.fields[4].fields.product, this.fields[4].fields.prepaid_card, this.fields[4].fields.prepaid_service)
      this.fields[8].fields.total = this.mapTotalAllItem(this.fields[8].fields.service, this.fields[8].fields.product, this.fields[8].fields.prepaid_card, this.fields[8].fields.prepaid_service)
    }
    return this.fields
  }

  mapGoodsItem(item){
    if(item) return { quantity: item.quantity, amount: item.amount }
    return { quantity: 0, amount: 0 }
  }

  mapDeductionItem(item){
    if(item) return { quantity: -item.quantity, amount: -item.amount }
    return { quantity: 0, amount: 0 }
  }

  mapNetSalesTotalItem(sales, refund){
    return { quantity: sales.quantity - refund.quantity, amount: sales.amount - refund.amount }
  }

  mapTotalItem(one, two){
    return { quantity: one.quantity + two.quantity, amount: one.amount + two.amount }
  }

  mapNumberOfSalesAndAmountPerSale(quantity, amount){
    return { quantity: quantity, amount: amount / quantity }
  }

  mapTotalAllItem(service, product, prepaid_card, prepaid_service){
    return { 
      quantity: service.quantity + product.quantity + prepaid_card.quantity + prepaid_service.quantity, 
      amount: service.amount + product.amount + prepaid_card.amount + prepaid_service.amount 
    }
  }
}