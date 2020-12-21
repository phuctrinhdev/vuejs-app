import ViewModel from '../../view-model.js'
import store from '../../../store/store'
import { 
  convertDateToTimeStamp, 
  convertDateToTimezone,
  convertTimeStampPlusLocalzone,
  convertTimeStampMinusSettingzone
} from '../../../helpers/common'

export default class SalesDeleteViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      client_id               : 0,
      client_name             : '',
      family_id               : 0,
      sales_number            : '',
      deleted_by_id           : 0,
      deleted_by_name         : '',
      deleted_date_time_ts    : 0,
      session_token           : '',
      shop_location           : '',
      shop_id                 : 0
    }
  }
  mapFieldsFromApi(api_data){
    this.fields.client_id               = api_data.clientId
    this.fields.client_name             = api_data.clientName
    this.fields.family_id               = api_data.familyId
    this.fields.sales_number            = api_data.salesNumber
    this.fields.deleted_by_id           = api_data.deletedById
    this.fields.deleted_by_name         = api_data.deletedByName
    this.fields.deleted_date_time_ts    = convertTimeStampMinusSettingzone(api_data.deletedDateTimeTS)
    this.fields.session_token           = api_data.sessionToken
    this.fields.shop_location           = api_data.shopLocation
    this.fields.shop_id                 = api_data.shopId
  }
  mapFieldsToApi(){
    return {
      clientId          : this.fields.client_id,
      clientName        : this.fields.client_name,
      familyId          : this.fields.family_id,
      salesNumber       : this.fields.sales_number,
      deletedById       : this.fields.deleted_by_id,
      deletedByName     : this.fields.deleted_by_name,
      deletedDateTimeTS : convertTimeStampPlusLocalzone(this.fields.deleted_date_time_ts),
      sessionToken      : this.fields.session_token,
      shopLocation      : this.fields.shop_location,
      shopId            : this.fields.shop_id
    }
  }
  setSalesDeleteFromSales(sales){
    let user = store.getters['user/getUser']
    let shop = store.getters['user/getShop']
    let current_date_time_ts = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)

    this.fields.client_id               = sales.client_id
    this.fields.client_name             = sales.client_name
    this.fields.family_id               = sales.family_id
    this.fields.sales_number            = sales.sales_number
    this.fields.deleted_by_id           = user.user_id
    this.fields.deleted_by_name         = user.user_name
    this.fields.deleted_date_time_ts    = current_date_time_ts
    this.fields.session_token           = user.session_token
    this.fields.shop_location           = shop.shop_location
    this.fields.shop_id                 = shop.shop_id
  }
}