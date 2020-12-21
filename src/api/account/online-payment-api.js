import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi } from '../../helpers/common' 

const url_admin_sales_command = getServiceUrl(SERVICE_TYPES.ADMIN_SALES.ADMIN_SALES_CMD, 1)
const url_admin_sales_read = getServiceUrl(SERVICE_TYPES.ADMIN_SALES.ADMIN_SALES_READ, 1)

let url_online_payment_prepared = url_admin_sales_command + SERVICE_EXTEND_TYPES.ONLINE_PAYMENT_PREPARED

let url_online_payment_read = url_admin_sales_read +  SERVICE_EXTEND_TYPES.ONLINE_PAYMENT
let url_valid_virtual_accoount_by_shop = url_online_payment_read +  SERVICE_EXTEND_TYPES.VALID_VIRTUAL_ACCOUNT



export default class OnlinePaymentApi {
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
      countryCode : model.country_code,
      shopId: model.shop_id,
      paymentGateway:  model.payment_gateway,
      paymentMethod: model.payment_method,
      productName: model.product_name,
      amount: model.amount,
      buyerName: model.buyer_name,
      buyerPhoneNumber:  model.buyer_phone_number,
      buyerEmail: model.buyer_email
    }
  }

  mapFieldFromApi(model){
    return {
      online_payment_id     : model.onlinePaymentId,
      shop_id               : model.ShopId,
      payment_request       : model.paymentRequest
    }
  }

  mapFieldFromOnlinePaymentApi(model){
    return {
      online_payment_id     : model.onlinePaymentId,
      modification_date     : model.modificationDate,
      registration_date     : model.registrationDate,
      iamport_id               : model.iamportId,
      payment_gateway_transaction_id       : model.paymentGatewayTransactionId,
      paid_date              : model.paidDate,
      receipt_url             : model.receiptUrl,
      paid_online_payment_response : model.paidOnlinePaymentResponse,
      credit_card_company_name     : model.creditCardCompanyName,
      apply_number                : model.applyNumber,
      installment_plan_period     : model.installmentPlanPeriod,
      failed_reason               : model.failedReason,
      failed_date                 : model.failedDate,
      virtual_bank_expiration_date : model.virtualBankExpirationDate,
      virtual_bank_account_holder   : model.virtualBankAccountHolder,
      virtual_bank_account            : model.virtualBankAccount,
      virtual_bank_name                 : model.virtualBankName,
      country_code                      : model.countryCode,
      merchant_id                       : model.merchantId,
      payment_gateway                   : model.paymentGateway,
      payment_method                    : model.paymentMethod,
      payment_status                    : model.paymentStatus,
      product_name                      : model.productName,
      amount                            : model.amount,
      buyer_name                        : model.buyerName,
      buyer_phone_number                : model.buyerPhoneNumber,
      buyer_email                       : model.buyerEmail,
      buyer_user_name                     : model.buyerUserID,
      shop_name                          : model.shopName,
      notes                               : model.notes,
      shop_id                             : model.shopId
    }
  }
  async preparedOnlinePaymentAsync(query) {
    let data_send = this.mapFieldToApi(query)
    try {
      const response = await this.http.post(url_online_payment_prepared, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getOnlinePaymentAsync(query) {
    let data_send = {
      merchantId : query.merchant_id
    }
    try {
      const response = await this.http.post(url_online_payment_read, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(response.data.isOK) this.result.data = this.mapFieldFromOnlinePaymentApi(response.data.result)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getValidVirtualAccountsAsync(shop_id) {
    let query_map = 
    {
      shopId : shop_id
    }
    
    try {
      const response = await this.http.post(url_valid_virtual_accoount_by_shop, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapFieldFromOnlinePaymentApi(response.data.result.items[item]))
        }
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

}