import { sales_options }        from '../../../helpers/options/sales-options'
import SecurityInfoViewModel    from '../../security-info-view-model.js'

export default class UpdatePrepaidCardViewModel extends SecurityInfoViewModel{
  constructor(){
    super()
    this.fields.id                        = 0
    this.fields.client_id                 = 0
    this.fields.family_id                 = 0
    this.fields.client_name               = ''
    this.fields.prepaid_card_history_type = sales_options.prepaid_card_history_type_enum.sales_edited
    this.fields.balance                   = 0
    this.fields.expiry_date_ts            = 0
  }
  
  mapFieldsToApi(){
    return {
      createdById            : this.fields.created_by_id,
      createdByName          : this.fields.create_by_name,
      prepaidCardHistoryType : this.fields.prepaid_card_history_type,
      id                     : this.fields.id,
      clientId               : this.fields.client_id,
      familyId               : this.fields.family_id,
      clientName             : this.fields.client_name,
      balance                : this.fields.balance,
      expiryDateTS           : this.fields.expiry_date_ts,
      sessionToken           : this.fields.session_token,
      shopLocation           : this.fields.shop_location,
      shopId                 : this.fields.shop_id
    }
  }
}