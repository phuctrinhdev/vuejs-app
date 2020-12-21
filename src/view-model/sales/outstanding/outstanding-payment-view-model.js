import HistoryBaseViewModel from '../base-view-model/history-base-view-model.js'
export default class OutstandingPaymentViewModel extends HistoryBaseViewModel{
  constructor(){
    super()
    this.fields.client_id                       = 0
    this.fields.staff_id                        = 0
    this.fields.staff_name                      = 0
    this.fields.earned_points                   = 0
    this.fields.outstanding_before_paid         = 0
    this.fields.total_paid                      = 0
    this.fields.outstanding                     = 0
    this.fields.notes                           = ''
    this.fields.payments                        = []
  }
}