import ViewModel             from '../view-model'
import { common_options } from '../../helpers/options/common-options.js'
import { convertTimeStampToDate,
  // convertDateToTimezone,
  // convertTimeStampPlusLocalzone,
  // convertDateToTimeStamp
} from '../../helpers/common'

export default class ExpenditureHistoryViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      id                 : 0,
      item_id            : '',
      item_name          : '',
      payment_method_id  : common_options.good_status.active,
      amount             : 0,
      notes              : '',
      expenditure_date_ts: 0,
      shop_id            : 0,

      // ui
      date                : new Date()
    }
  }
  mapFieldsFromApi(data){
    this.fields.id                  = data.id
    this.fields.item_id             = data.itemId
    this.fields.item_name           = data.itemName
    this.fields.payment_method_id   = data.paymentMethodId
    this.fields.amount              = data.amount
    this.fields.notes               = data.notes
    this.fields.expenditure_date_ts = data.expenditureDateTS
    this.fields.shop_id             = data.shopId

    // ui
    this.fields.date                = convertTimeStampToDate(data.expenditureDateTS)
  }
  mapFieldsToApi(){
    return {
      id                : this.fields.id,
      itemId            : this.fields.item_id,
      itemName          : this.fields.item_name,
      paymentMethodId   : this.fields.payment_method_id,
      amount            : this.fields.amount,
      notes             : this.fields.notes,
      expenditureDateTS : this.fields.expenditure_date_ts,
      shopId            : this.fields.shop_id
    }
  }
  isValid(){
    let validations = {
      amount: {
        rules: {
          numeric: '',
          maxLength: {
            max_value: 10
          }
        }
      },
      notes: {
        rules: {
          maxLength: {
            max_value: 200
          }
        }
      },
    }
    return super.isValid(validations)
  }
}
