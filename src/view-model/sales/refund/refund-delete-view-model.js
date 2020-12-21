import ViewModel from '../../view-model.js'
import { convertTimeStampPlusLocalzone } from '../../../helpers/common'

export default class RefundDeleteViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      client_id           : 0,
      family_id           : 0,
      client_name         : '',
      refund_id           : 0,
      deleted_by_id       : 0,
      deleted_by_name     : '',
      deleted_date_time_ts: 0,
      session_token       : '',
      shop_location       : '',
      shop_id             : 0
    }
  }
  mapFieldsToApi(){
    return {
      clientId          : this.fields.client_id,
      familyId          : this.fields.family_id,
      clientName        : this.fields.client_name,
      refundId          : this.fields.refund_id,
      deletedById       : this.fields.deleted_by_id,
      deletedByName     : this.fields.deleted_by_name,
      deletedDateTimeTS : convertTimeStampPlusLocalzone(this.fields.deleted_date_time_ts),
      sessionToken      : this.fields.session_token,
      shopLocation      : this.fields.shop_location,
      shopId            : this.fields.shop_id,
    }
  }
}