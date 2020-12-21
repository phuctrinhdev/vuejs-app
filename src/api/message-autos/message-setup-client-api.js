import ServicesBaseAPI             from '../services-base-api'
import { getServiceUrl }           from '../../helpers/api-url-generator'
import { SERVICE_TYPES
  , SERVICE_EXTEND_TYPES }         from '../../config/constant'
import MessageSetupClientViewModel from '../../view-model/message-autos/message-setup-client/message-setup-client-view-model'

const url_command = getServiceUrl(SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_CLIENT_CMD, 1)
const url_read = url_command + SERVICE_EXTEND_TYPES.READ

export default class MessageSetupClientApi extends ServicesBaseAPI {
  constructor() {
    super()
  }

  async getMessageSetupClientAsync(query) {
    let query_map = {
      shopId : query
    }
    try {
      let response = await this.http.post(url_read, query_map)
      this.setResult(response, () => {
        let message_setup_client = new MessageSetupClientViewModel()
        message_setup_client.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_client
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async createMessageSetupClientAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.post(url_command, params)
      this.setResult(response, () => {
        let message_setup_client = new MessageSetupClientViewModel()
        message_setup_client.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_client
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateMessageSetupClientAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.put(url_command, params)
      this.setResult(response, () => {
        let message_setup_client = new MessageSetupClientViewModel()
        message_setup_client.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_client
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteMessageSetupClientAsync(model) {
    let params = model.mapDeleteFieldsToApi()
    try {
      let response = await this.http.delete(url_command, params)
      this.setResult(response, () => {
        let message_setup_client = new MessageSetupClientViewModel()
        message_setup_client.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_client
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}