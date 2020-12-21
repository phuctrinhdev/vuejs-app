import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'

// const url_read = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_FIELD_SETUP_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_FIELD_SETUP_CMD, 1) // Command API URL, Version

export default class ClientFieldSetupApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapFieldToApi(model){
    return {
      address        : model.address,
      referralSource : model.referral_source,
      birthday       : model.birthday,
      clientGroup    : model.client_group,
      clientRating   : model.client_rating,
      email          : model.email,
      member         : model.member,
      mobileNumber2  : model.mobile_number2,
      phoneNumber    : model.phone_number,
      preferredStaff : model.preferred_staff,
      recommender    : model.recommender,
      sex            : model.sex
    }
  }

  mapFieldFromApi(model){
    return {
      address         : model.address,
      referral_source : model.referralSource,
      birthday        : model.birthday,
      client_group    : model.clientGroup,
      client_rating   : model.clientRating,
      email           : model.email,
      member          : model.member,
      mobile_number2  : model.mobileNumber2,
      phone_number    : model.phoneNumber,
      preferred_staff : model.preferredStaff,
      recommender     : model.recommender,
      sex             : model.sex,
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
  }

  // async getClientFieldSetupsAsync(data) {
  //   try {
  //     let send_data = {
  //       shopId: data
  //     }
  //     const response = await this.http.post(url_read, send_data)
  //     this.setResult(response)
  //   }
  //   catch(e){
  //     return this.http.loadError(e)
  //   }
  //   return this.result
  // }

  async updateClientFieldSetupsAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.shopId = data.shopId
    
    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}