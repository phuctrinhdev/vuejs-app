import SecurityInfoViewModel from '../../security-info-view-model.js'
export default class DeleteBalanceMoveViewModel extends SecurityInfoViewModel{
  constructor(){
    super()
    this.fields.id          = 0
    this.fields.client_id   = 0
    this.fields.client_name = ''
    this.fields.family_id   = 0
  }
}