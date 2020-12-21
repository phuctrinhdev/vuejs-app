import ViewModel from '../view-model.js'

export default class ClientBaseViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      client_id   : 0,
      client_name : '',
    }
  }
  mapFieldsBaseFromApi(api_data){
    this.fields.client_id     = api_data.clientId
    this.fields.client_name   = api_data.clientName
  }
  mapFieldsBaseToApi(){
    return {
      clientId      : this.fields.client_id,
      clientName    : this.fieldsclient_name,
    }
  }
  getValidations() {
    let validations = {

    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}