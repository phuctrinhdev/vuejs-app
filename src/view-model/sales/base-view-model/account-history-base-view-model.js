import SecurityInfoViewModel from '../../security-info-view-model.js'
export default class AccountHistoryBaseViewModel extends SecurityInfoViewModel{
  constructor(){
    super()
    this.fields.id               = 0
    this.fields.client_id        = 0
    this.fields.history_ref_type = 0
    this.fields.history_ref_id   = 0
  }
}