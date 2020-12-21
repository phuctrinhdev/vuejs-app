import HistoryBaseViewModel from '../base-view-model/history-base-view-model.js'
export default class OutstandingHistoryViewModel extends HistoryBaseViewModel{
  constructor(){
    super()
    this.fields.client_id                 = 0
    this.fields.client_name               = ''
    this.fields.mobile_number             = ''
    this.fields.phone_number              = ''
    this.fields.outstanding_before_change = 0
    this.fields.changed_amount            = 0
    this.fields.outstanding               = 0
    this.fields.notes                     = ''
    this.fields.outstanding_history_type  = 0
  }

  mapFieldsFromApi(data){
    this.fields.id                        = data.id
    this.fields.client_id                 = data.clientId
    this.fields.client_name               = data.clientName
    this.fields.mobile_number             = data.mobileNumber
    this.fields.phone_number              = data.phoneNumber
    this.fields.outstanding_before_change = data.outstandingBeforeChange
    this.fields.changed_amount            = data.changedAmount
    this.fields.outstanding               = data.outstanding
    this.fields.notes                     = data.notes
    this.fields.outstanding_history_type  = data.outstandingHistoryType
    this.fields.created_by_id             = data.createdById
    this.fields.created_by_name           = data.createdByName
    this.fields.invoice_date_time_ts      = data.invoiceDateTimeTS
    this.fields.created_date_time_ts      = data.registrationDateTS
  }
}
