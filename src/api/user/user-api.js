import Http from '../../helpers/http'
// import { options } from '../../helpers/options'
import { options }       from '../../helpers/options'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_auth_aggr = getServiceUrl(SERVICE_TYPES.AUTH_AGGR, 1)
const url_read = url_auth_aggr + SERVICE_EXTEND_TYPES.LOGIN_SUBSCRIBER

const countries =[
  {country_code:'',   timezone:'+00:00', date_format: options.standard_date_format.ymd },
  {country_code:'KR', timezone:'+09:00', date_format: options.standard_date_format.ymd },
  {country_code:'VN', timezone:'+07:00', date_format: options.standard_date_format.ymd }
]
export function getTimezone (country) {
  const c = countries.find(x => x.country_code == country)  
  const r = (c) ? c.timezone : ''
  return r
}
export function getDateFormat (country) {
  const c = countries.find(x => x.country_code == country)
  const r = (c) ? c.date_format : ''
  return r
}

export default class UserApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapFieldFromApi(model){
    let userAuthInfo= {
      user_id              : model.userAuthInfo.userAccountId,
      country              : model.userAuthInfo.countryCode,
      solution_id          : model.userAuthInfo.solutionId,
      shop_id              : model.userAuthInfo.shopId,
      user_name            : model.userAuthInfo.userID,
      user_full_name       : model.userAuthInfo.name,
      language             : model.userAuthInfo.language.toLowerCase(),
      user_role_code       : model.userAuthInfo.userRoleCode,
      shop_user_role_code  : model.userAuthInfo.shopUserRoleCode,
      shop_user_role_id    : model.userAuthInfo.shopUserRoleId,
      api_token            : model.userAuthInfo.authToken,
      lastest_login_date   : model.userAuthInfo.lastestLoginDate,
      timezone             : getTimezone(model.userAuthInfo.countryCode),
      format_date          : getDateFormat(model.userAuthInfo.countryCode),
    }
    let shopBasicInfo = {
      shop_id                     : model.shopBasicInfo.shopId,
      shop_name                   : model.shopBasicInfo.shopName,
      chain_id                    : model.shopBasicInfo.chainInfo.chainId,
      branch_number               : model.shopBasicInfo.chainInfo.branchNumber,
      branch_type                 : model.shopBasicInfo.chainInfo.branchType,
      share_client                : model.shopBasicInfo.chainInfo.shareClient,
      share_service               : model.shopBasicInfo.chainInfo.shareService,
      share_product               : model.shopBasicInfo.chainInfo.shareProduct,
      use_other_shop_prepaidgoods : model.shopBasicInfo.chainInfo.useOtherShopPrepaidGoods,
      allow_shop_service          : model.shopBasicInfo.chainInfo.allowShopService,
      allow_shop_product          : model.shopBasicInfo.chainInfo.allowShopProduct,
      solution_name               : model.shopBasicInfo.solutionName,
      service_type_code           : model.shopBasicInfo.serviceTypeCode,
      business_type_code          : model.shopBasicInfo.businessTypeCode,
      chain_info                  :[],
      netmoney_balance            : model.shopBasicInfo.netmoneyBalance,
      phone_number                : model.shopBasicInfo.phoneNumber
    }
    shopBasicInfo.chain_info = (this.mapChainInfoFromApi(model.shopBasicInfo.chainInfo))
    return {
      user_auth_info : userAuthInfo,
      shop_basic_info: shopBasicInfo
      // user_id              :model.userAccountId,
      // country              : model.countryCode,
      // solution_id          : model.solutionId,
      // shop_id              : model.shopId,
      // user_name            : model.userID,
      // user_full_name       : model.name,
      // language             : model.language,
      // user_role_code       : model.userRoleCode,
      // shop_user_role_code  : model.shopUserRoleCode,
      // shop_user_role_id    : model.shopUserRoleId,
      // api_token            : model.authToken,
    }
  }  
  mapChainInfoFromApi(model){
    return {
      chain_id                    : model.chainId,
      branch_type                 : model.branchType,
      share_client                : model.shareClient,
      share_service               : model.shareService,
      share_product               : model.shareProduct,
      use_other_shop_prepaidgoods : model.useOtherShopPrepaidGoods,
      allow_shop_service          : model.allowShopService,
      allow_shop_product          : model.allowShopProduct,
      board_type                  : model.boardType

    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getUserAsync(query) {
    try {
      let send_data = {
        userID: query.user_id,
        password: query.password,
        // eslint-disable-next-line no-undef
        solutionId: process.env.SALONADMIN_SOLUTION_ID
      }
      const response = await this.http.post(url_read, send_data)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}