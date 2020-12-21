import ViewModel from './view-model.js'

export default class FileViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      file_id           : 0,
      file_size         : 0,
      original_file_name: '',
      storage_file_name : '',
      order_no          : 0,
      related_id        : 0,
      related_type      : 0,
      registration_date : '',
      modification_date : '',

      // viewing only
      is_checked        : false,
    }
  }
  mapFieldsFromApi(api_data){
    this.fields = {
      file_id           : api_data.id,
      file_size         : api_data.fileSize,
      original_file_name: api_data.originalFileName,
      storage_file_name : api_data.storageFileName,
      order_no          : api_data.orderNo,
      related_id        : api_data.relatedId,
      related_type      : api_data.relatedType,
      registration_date : api_data.registrationDate,
      modification_date : api_data.modificationDate,
    }
  }
  mapFieldsToApi(){
    const { 
      file_id, file_size, original_file_name, storage_file_name, order_no,
      related_id, related_type, registration_date, modification_date 
    } = this.fields
    
    return {
      id                : file_id,
      fileSize          : file_size,
      originalFileName  : original_file_name,
      storageFileName   : storage_file_name,
      orderNo           : order_no,
      relatedId         : related_id,
      relatedType       : related_type,
      registrationDate  : registration_date,
      modificationDate  : modification_date,
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