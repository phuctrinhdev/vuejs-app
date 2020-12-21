import ViewModel from '../view-model.js'
import { ADMIN_ENUMS } from '../../config/constant.js'


export default class ShopEnvironmentSetupViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      shop_id: 0,
      country_code: '',
      solution_id: 0,
      van: null,
      van_name: null,
      van_model: null,
      van_model_name: null,
      van_supplier_name: null,
      cid: null,
      cid_name: null,
      sales_type: ADMIN_ENUMS.SALES_TYPE.NOT_SELECTED,
      review_posted:true,
      time_zone: 0,
      logo_image_path: null,
      netmoney_alarm: true,
      netmoney_alarm_amount: 0,
      vat_rate: 0,
      date_format: null,
      money_digit: 0
    }
  }

  getValidations() {
    let validations = {       
      netmoney_alarm_amount: {
        rules: {
          minValue: {
            min_value: 0
          }
        }
      }
    }
    return validations
  }

  mapFieldsFromApi(data, shop_id){
    let tmp_cid_accounts = []
    for(let item in data.cidAccounts){
      let cidAccount = {
        cid_account_id       : data.cidAccounts[item].cidAccountId,
        cid_login_id         : data.cidAccounts[item].cidLoginID,
        cid_login_password   : data.cidAccounts[item].cidLoginPassword,
        mac_address          : data.cidAccounts[item].macAddress,
        manager_id           : data.cidAccounts[item].managerID,
        manager_name         : data.cidAccounts[item].managerName,
        shop_id              : data.cidAccounts[item].shopId,
        status               : data.cidAccounts[item].status
      }
      tmp_cid_accounts.push(cidAccount)
    }
    if(!data) return
    this.fields.shop_id                 = shop_id
    this.fields.country_code            = data.countryCode
    this.fields.solution_id             = data.solutionId
    this.fields.van                     = data.van
    this.fields.van_name                = data.vanName
    this.fields.van_model               = data.vanModel
    this.fields.van_model_name          = data.vanModelName
    this.fields.van_supplier_name              = data.vanSupplierName
    this.fields.cid                            = data.cid
    this.fields.cid_name                       = data.cid_name
    this.fields.sales_type                     = data.sales_type
    this.fields.review_posted                  = data.reviewPosted
    this.fields.time_zone                      = data.timeZone
    this.fields.logo_image_path                = data.logoImagePath
    this.fields.netmoney_alarm                 = data.netmoneyAlarm
    this.fields.netmoney_alarm_amount          = data.netmoneyAlarmAmount
    this.fields.vat_rate                       = data.vatRate
    this.fields.date_format                    = data.dateFormat
    this.fields.money_digit                    = data.moneyDigit,
    this.fields.cid_accounts                   = tmp_cid_accounts
  }

  mapFieldsNetmoneyAlarmFromApi(data, shop_id){
    if(!data) return
    this.fields.shop_id                        = shop_id
    this.fields.netmoney_alarm                 = data.netmoneyAlarm
    this.fields.netmoney_alarm_amount          = data.netmoneyAlarmAmount
  }
  mapFieldsToNetmoneyAlarmApi() {
    return {
      shopId        : this.fields.shop_id,
      netmoneyAlarm : this.fields.netmoney_alarm,
      netmoneyAlarmAmount : this.fields.netmoney_alarm_amount
    }
  }

  mapFieldsVATRateFromApi(data, shop_id){
    if(!data) return
    this.fields.shop_id                        = shop_id
    this.fields.vat_rate          = data.vatRate
  }
  mapFieldsToVATRateApi() {
    return {
      shopId        : this.fields.shop_id,
      vatRate : this.fields.vat_rate
    }
  }

  isValid() {
    return super.isValid(this.getValidations())
  }
}