import SalesBaseViewModel from './sales-base-view-model'
import SalesItemViewModel from '../sales-item/sales-item-view-model'
import { sales_options } from '../../../helpers/options/sales-options'
import { convertTimeStampMinusSettingzone } from '../../../helpers/common'

export default class SalesBriefViewModel extends SalesBaseViewModel {
  constructor(){
    super()

    this.fields.ref_type             = 1
    this.fields.ref_id               = 0
    this.fields.ref_status           = 1
    this.fields.modification_date_ts = 0 
    this.fields.items                = []

    // viewing for outstanding payment
    this.fields.staff_id             = 0 
    this.fields.staff_name           = 0

    // viewing
    this.fields.show_more_on_mobile  = false
  }
  mapFieldsFromApi(api_data){
    let tmp_balance_deduction = 0
    let tmp_sales_items = []
    if(api_data.items){
      for(let item of api_data.items){
        let tmp_sales_item = new SalesItemViewModel()
        tmp_sales_item.mapFieldsFromApi(item)
        tmp_sales_items.push(tmp_sales_item.getFields())
        tmp_balance_deduction += Number(item.deductionAmount)
      }
    }
    if(api_data.refType != sales_options.sales_ref_type.sales){
      tmp_balance_deduction = api_data.deductionBalance
    }

    this.mapFieldsBaseFromApi(api_data)

    this.fields.ref_type              = api_data.refType
    this.fields.ref_id                = api_data.refId
    this.fields.ref_status            = api_data.refStatus
    this.fields.client_name           = api_data.clientName
    this.fields.family_id             = api_data.familyId
    
    this.fields.booking_deposit_amount= api_data.bookingDepositAmount
    this.fields.balance_deduction     = tmp_balance_deduction
    this.fields.items                 = tmp_sales_items
    this.fields.staff_id              = api_data.staffId
    this.fields.staff_name            = api_data.staffName
    
    this.fields.created_by_id         = api_data.createdById
    this.fields.created_by_name       = api_data.createdByName
    this.fields.created_date_time_ts  = convertTimeStampMinusSettingzone(api_data.createdDateTimeTS)
    this.fields.edited_by_id          = api_data.editedById
    this.fields.edited_by_name        = api_data.editedByName
    this.fields.edited_date_time_ts   = convertTimeStampMinusSettingzone(api_data.editedDateTimeTS)
    this.fields.edited_sales_id       = api_data.editedSalesId
    this.fields.deleted_by_id         = api_data.deletedById
    this.fields.deleted_by_name       = api_data.deletedByName
    this.fields.deleted_date_time_ts  = convertTimeStampMinusSettingzone(api_data.deletedDateTimeTS)
    this.fields.modification_date_ts  = convertTimeStampMinusSettingzone(api_data.modificationDateTS)
  }
}