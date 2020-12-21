import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_FEE_READ, 1) // Read API URL, Version

let url_text_fee_by_shop_read = url_read + SERVICE_EXTEND_TYPES.BY_SHOP

export default class SolutionTextFeeApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapFieldFromApi(model){
    if (model == null) return null
    return {
      id                : model.solutionTextFeeId,
      country_code      : model.countryCode,
      solution_id       : model.solutionId,
      sms_fee           : model.smsFee,
      lms_fee           : model.lmsFee,
      mms_fee           : model.mmsFee,
      auto_sms_fee      : model.autoSMSFee,
      auto_lms_fee      : model.autoLMSFee,
      sms_max_bytes     : model.smsMaxBytes,
      lms_max_bytes     : model.lmsMaxBytes,
      mms_max_bytes     : model.mmsMaxBytes,
      time_zone         : model.timeZone,
    }
  }  

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getTextFeeByShopAsync(query) {
    try {
      let query_map = {
        countryCode: query.country_code,
        solutionId: query.solution_id,
        chainId: query.chain_id,
        shopId: query.shop_id
      }
      const response = await this.http.post(url_text_fee_by_shop_read, query_map)
      this.result.action = query.action
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}