import SecurityInfoViewModel    from '../../security-info-view-model.js'
export default class UpdatePrepaidServiceViewModel extends SecurityInfoViewModel{
  constructor(){
    super()
    this.fields.prepaid_service_history_type = undefined
    this.fields.id                           = 0
    this.fields.client_id                    = 0
    this.fields.family_id                    = 0
    this.fields.client_name                  = ''
    this.fields.quantity                     = 0
    this.fields.expiry_date_ts               = 0
  }

  mapFieldsToApi(){
    return {
      createdById              : this.fields.created_by_id ,
      createdByName            : this.fields.created_by_name,
      prepaidServiceHistoryType: this.fields.prepaid_service_history_type,
      id                       : this.fields.id,
      clientId                 : this.fields.client_id,
      familyId                 : this.fields.family_id,
      clientName               : this.fields.client_name,
      quantity                 : this.fields.quantity,
      expiryDateTS             : this.fields.expiry_date_ts,
      sessionToken             : this.fields.session_token,
      shopLocation             : this.fields.shop_location,
      shopId                   : this.fields.shop_id
    }
  }
}