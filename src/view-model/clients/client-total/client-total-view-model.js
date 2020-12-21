import ViewModel from '../../view-model'

export default class ClientTotalViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      new: 0,
      repeat: 15,
      unregistered_client: 0
    }
  }

  mapFieldsFromApi(api_data){
    this.fields.new                 = api_data.newClients
    this.fields.repeat              = api_data.repeateClients
    this.fields.unregistered_client = api_data.unregisterClients
  }
}