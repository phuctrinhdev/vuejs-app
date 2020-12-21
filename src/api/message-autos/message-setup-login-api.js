import ServicesBaseAPI            from '../services-base-api'
import { getServiceUrl }          from '../../helpers/api-url-generator'
import { SERVICE_TYPES }          from '../../config/constant'
import MessageSetupLoginViewModel from '../../view-model/message-autos/message-setup-login/message-setup-login-view-model'

const url_command = getServiceUrl(SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_LOGIN_CMD, 1)

export default class MessageSetupLoginApi extends ServicesBaseAPI {
  constructor() {
    super()
  }

  async addOrUpdateMessageSetupLoginAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.post(url_command, params)
      this.setResult(response, () => {
        let message_setup_login = new MessageSetupLoginViewModel()
        message_setup_login.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_login
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}