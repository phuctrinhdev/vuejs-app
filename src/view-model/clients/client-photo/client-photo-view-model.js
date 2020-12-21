import ClientBaseViewModel from '../../clients/client-base-view-model'
import FileViewModel from '../../file-view-model'

export default class ClientPhotoViewModel extends ClientBaseViewModel {
  constructor() {
    super()
    this.fields.photo      = new FileViewModel().fields

    // viewing only
    this.fields.files      = []
  }
  mapFieldsFromApi(api_data){
    let tmp_photo_vm = new FileViewModel()
    tmp_photo_vm.mapFieldsFromApi(api_data)

    this.mapFieldsBaseFromApi(api_data)
    this.fields.photo        = tmp_photo_vm.fields
  }
  mapFieldsToApi(){
    // client
    let client_photo   = this.mapFieldsBaseToApi(this.fields)

    // photo
    let tmp_photo_vm = new FileViewModel()
    tmp_photo_vm.setFields(this.fields.photo)
    client_photo.photo = tmp_photo_vm.mapFieldsToApi()
    
    return client_photo
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