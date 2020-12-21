import ViewModel from '../../view-model.js'
export default class BalancePointsEditHistoryViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      history_type               : 0,
      registration_date_ts       : 0,
      client_id                  : 0,
      family_id                  : 0,
      client_name                : '',
      mobile_number              : '',
      old_value                  : 0,
      new_value                  : 0,
      prepaid_goods_name         : '',
      client_points_history_type : 1,
      family_points_history_type : 1,
      created_by_name            : '',
      notes                      : ''
    }
  }

  mapFieldsFromApi(data){
    this.fields.history_type                = data.historyType
    this.fields.registration_date_ts        = data.registrationDateTS
    this.fields.client_id                   = data.clientId
    this.fields.family_id                   = data.familyId
    this.fields.client_name                 = data.clientName
    this.fields.mobile_number               = data.mobileNumber
    this.fields.old_value                   = data.oldValue
    this.fields.new_value                   = data.newValue
    this.fields.prepaid_goods_name          = data.prepaidGoodsName
    this.fields.client_points_history_type  = data.clientPointsHistoryType
    this.fields.family_points_history_type  = data.familyPointsHistoryType
    this.fields.created_by_name             = data.createdByName,
    this.fields.notes                       = data.notes
  }
}
