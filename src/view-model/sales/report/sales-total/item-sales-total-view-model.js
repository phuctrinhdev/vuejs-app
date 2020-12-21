import ViewModel from '../../../view-model'

export default class ItemSalesTotalViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      service: { quantity: 0, amount: 0 },
      product: { quantity: 0, amount: 0 },
      prepaid_card: { quantity: 0, amount: 0 },
      prepaid_service: { quantity: 0, amount: 0 },
      total: { quantity: 0, amount: 0 }
    }
  }
}