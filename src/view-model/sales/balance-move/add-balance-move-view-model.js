import SecurityInfoViewModel from '../../security-info-view-model.js'
import { convertTimeStampPlusLocalzone } from '../../../helpers/common'


export default class AddBalanceMoveViewModel extends SecurityInfoViewModel{
  constructor(){
    super()
    this.fields.client_id                   = 0
    this.fields.client_name                 = ''
    this.fields.family_id                   = 0
    this.fields.from_client_prepaid_card_id = 0
    this.fields.to_client_prepaid_card_id   = 0
    this.fields.balance_move_date_time_ts   = 0

    this.fields.chain_id                    = null
    this.fields.branch_number               = 0
    this.fields.shop_name                   = ''
    this.fields.client_shop_id              = 0
    this.fields.client_shop_name            = ''
  }

  mapFieldsToApi(){
    let tmp_chain_id = this.fields.chain_id
    if(tmp_chain_id == 0)
      tmp_chain_id = null

    return {
      clientId                 : this.fields.client_id,
      clientName               : this.fields.client_name,
      familyId                 : this.fields.family_id,
      fromClientPrepaidCardId  : this.fields.from_client_prepaid_card_id,
      toClientPrepaidCardId    : this.fields.to_client_prepaid_card_id,
      balanceMoveDateTimeTS    : convertTimeStampPlusLocalzone(this.fields.balance_move_date_time_ts),

      createdById              : this.fields.created_by_id,
      createdByName            : this.fields.created_by_name,
      sessionToken             : this.fields.session_token,
      shopLocation             : this.fields.shop_location,
      shopId                   : this.fields.shop_id,

      chainId                  : tmp_chain_id,
      branchNumber             : this.fields.branch_number,
      shopName                 : this.fields.shop_name,
      clientShopId             : this.fields.client_shop_id,
      clientShopName           : this.fields.client_shop_name,
    }
  }
} 