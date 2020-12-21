import ViewModel             from '../view-model'
import { common_options } from '../../helpers/options/common-options.js'
// import { inventory_options } from '../../../helpers/options/inventory-options.js'

export default class ExpenditureItemViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      id        : 0,
      item_name : '',
      status    : common_options.good_status.active,
      order_no  : 0,
      shop_id   : 0
    }
  }

  mapFieldsFromApi(data){
    this.fields.id          = data.id
    this.fields.item_name   = data.itemName
    this.fields.status      = data.status
    this.fields.order_no    = data.orderNo
    this.fields.shop_id     = data.shopId
  }
  mapFieldsToApi(){
    return {
      id        : this.fields.id,
      itemName  : this.fields.item_name,
      status    : this.fields.status,
      orderNo   : this.fields.order_no,
      shopId    : this.fields.shop_id,
    }
  }
  isValid(){
    let validations = {
      item_name: {
        rules: {
          maxLength: {
            max_value: 30
          }
        }
      },
    }
    return super.isValid(validations)
  }
}
