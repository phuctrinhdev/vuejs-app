import OutstandingBaseViewModel from './outstanding-base-view-model'
export default class OutstandingEditViewModel extends OutstandingBaseViewModel{
  constructor(){
    super()
    this.fields.client_account_id   = 0
    this.fields.outstanding_balance = 0
    this.fields.new_balance         = ''
    this.fields.notes               = ''
  }
  
  mapFieldsToApi(){
    return {
      clientId           : this.fields.client_id,
      clientName         : this.fields.client_name,
      phoneNumber        : this.fields.phone_number,
      mobileNumber       : this.fields.mobile_number,
      clientAccountId    : this.fields.client_account_id,
      outstandingBalance : this.fields.outstanding_balance,
      newBalance         : this.fields.new_balance,
      notes              : this.fields.notes,
      createdById        : this.fields.created_by_id,
      createdByName      : this.fields.created_by_name,
      sessionToken       : this.fields.session_token,
      shopLocation       : this.fields.shop_location,
      shopId             : this.fields.shop_id
    }
  }

  setClientAccount(client_account){
    this.fields.client_account_id   = client_account.id
    this.fields.phone_number        = client_account.phone_number
    this.fields.mobile_number       = client_account.mobile_number
    this.fields.outstanding_balance = client_account.outstanding
    this.fields.client_id           = client_account.client_id
    this.fields.client_name         = client_account.client_name
    this.fields.family_id           = client_account.family_id
  }

  isValid(){
    let validation_rules = {
      new_balance : {
        label : '',
        rules : {
          numeric : '',
          maxLength : {
            max_value : 12
          },
          customRule : {
            message : 'receivables.new-balance-different-current-balance',
            process(model){
              if(Number(model.new_balance) == Number(model.outstanding_balance)){
                return false
              }
              return true
            }
          }
        }
      },
      notes : {
        lable : '',
        rules : {
          maxLength : {
            max_value : 500
          }
        }
      }
    }
    return super.isValid(validation_rules)
  }
}