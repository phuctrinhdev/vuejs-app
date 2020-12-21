import ViewModel from './view-model.js'
export default class SecurityInfoViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      shop_id         : 0,
      created_by_id   : 0,
      created_by_name : '',
      session_token   : '',
      shop_location   : ''
    }
  }
}