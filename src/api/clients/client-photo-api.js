// import ServicesBaseAPI         from '../services-base-api'
import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import ClientAvatarViewModel       from '../../view-model/clients/client-photo/client-avatar-view-model'
import ClientPhotoViewModel       from '../../view-model/clients/client-photo/client-photo-view-model'

// const url_read = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_READ, 1)
const url_cmd  = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_CMD, 1)

// Avatar
let url_cmd_client_avatar     = url_cmd  + '/ClientAvatar'

// Photo
// let url_read_client_photo     = url_read + '/ClientPhoto'
let url_cmd_client_photo      = url_cmd  + '/ClientPhoto'


export default class ClientPhotoApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  setResult(response, handleMapFieldsFromAPI) {
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    if (response.data.isOK) {
      handleMapFieldsFromAPI()
    }
  }

  // Avatar
  async addClientAvatarAsync(client_avatar_vm){
    let send_data = client_avatar_vm.mapFieldsToApi()
    try {
      let response = await this.http.post(url_cmd_client_avatar, send_data)
      this.setResult(response,()=>{
        let tmp_vm = new ClientAvatarViewModel()
        tmp_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_vm.getFields()
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async deleteClientAvatarAsync(client_avatar_vm){
    let send_data = {
      client_id: client_avatar_vm.client_id
    }
    try {
      const response = await this.http.delete(url_cmd_client_avatar, send_data)
      this.setResult(response,()=>{
        // let tmp_vm = new ClientAvatarViewModel()
        // tmp_vm.mapFieldsFromApi(response.data.result)
        // this.result.data = tmp_vm.getFields()
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  // Photo
  async getClientPhotosAsync(){ // query
    // let params = {
    //   client_id: query.client_id,
    //   shopId   : query.shop_id
    // }
    try {
      // const response = await this.http.post(url_read_client_photo, params)
      // this.setResult(response,()=>{
        
      // })
      let fake_data = [
        {
          file_id           : 1,
          file_size         : 100,
          original_file_name: 'f1',
          registration_date : '2020-10-05',
          url               : 'http://placehold.it/105x140'
        },
        {
          file_id           : 2,
          file_size         : 200,
          original_file_name: 'f2',
          registration_date : '2020-10-06',
          url               : 'http://placehold.it/105x140'
        }
      ]
      this.result.error_messages = []
      this.result.is_ok = true
      this.result.data = fake_data
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async addClientPhotosAsync(client_avatar_vm){
    try {
      const response = await this.http.post(url_cmd_client_photo, client_avatar_vm)
      this.setResult(response,()=>{
        let tmp_vm = new ClientPhotoViewModel()
        tmp_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_vm.getFields()
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async EditClientPhotoAsync(client_photo_edit_vm){
    try {
      const response = await this.http.put(url_cmd_client_photo, client_photo_edit_vm)
      this.setResult(response,()=>{
        // let tmp_vm = new ClientPhotoViewModel()
        // tmp_vm.mapFieldsFromApi(response.data.result)
        // this.result.data = tmp_vm.getFields()
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async deleteClientPhotoAsync(client_photo_delete_vm){
    try {
      const response = await this.http.delete(url_cmd_client_photo, client_photo_delete_vm)
      this.setResult(response,()=>{
        // let tmp_vm = new ClientPhotoViewModel()
        // tmp_vm.mapFieldsFromApi(response.data.result)
        // this.result.data = tmp_vm.getFields()
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}