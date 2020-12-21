import ClientBaseViewModel from '../../clients/client-base-view-model'
import FileViewModel from '../../file-view-model'

export default class ClientAvatarViewModel extends ClientBaseViewModel {
  constructor() {
    super()
    this.fields.avatar      = new FileViewModel().fields,

    // viewing only
    this.fields.files       = []
  }
  mapFieldsFromApi(api_data){
    let tmp_file_vm = new FileViewModel()
    tmp_file_vm.mapFieldsFromApi(api_data.avatar)
    let tmp_avatar = tmp_file_vm.fields

    this.mapFieldsBaseFromApi(api_data)
    this.fields.avatar    = tmp_avatar
  }
  mapFieldsToApi(){
    let tmp_file_vm = new FileViewModel()
    let tmp_avatar  = tmp_file_vm.mapFieldsToApi(this.fields.avatar)

    let client_avatar     = this.mapFieldsBaseToApi(this.fields)
    client_avatar.avatar  = tmp_avatar

    return client_avatar
  }
  mapAvatarFromFiles(){
    if(this.fields.files.length > 0){
      let tmp_file = this.fields.files[0]
    
      this.fields.avatar.file_id           = tmp_file.id
      this.fields.avatar.file_size         = tmp_file.size
      this.fields.avatar.original_file_name= tmp_file.name
      this.fields.avatar.storage_file_name = 'http://skysky.wo.tc:33885/images/contents1/nolan.png'
      this.fields.avatar.order_no          = 0
      this.fields.avatar.related_id        = 0
      this.fields.avatar.related_type      = '' // type
      this.fields.avatar.registration_date = ''
      this.fields.avatar.modification_date = ''
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