<template>
  <main class="app-content">
    <section>
      <div class="inner">
        <div>
          <div class="pay_result">            
            <div class="in-txt">
              <p class="mb0" v-html="$i18n.t('depositless-payments.info')"/>
            </div>
            <p class="fw-bold mb5">{{ $t('depositless-payments.title') }}</p>
            <div class="slide-x small">
              <table class="normal">
                <tbody>
                  <tr>
                    <td class="bg-th">{{ $t('depositless-payments.deposit-amount') }} <strong class="color-red">*</strong></td>
                    <td class="tal">
                      <input v-model="bank_transfer.fields.amount" type="text"> 
                      <span class="mobile-br">{{ $t('depositless-payments.deposit-amount-info') }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg-th">{{ $t('depositless-payments.deposit-bank') }} <strong class="color-red">*</strong></td>
                    <td class="tal">
                      <b-form-select v-model="bank_transfer.fields.bank_account_id" :options="bank_account_select" value-field="id" 
                                     text-field="code_name"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg-th">{{ $t('depositless-payments.depositor') }} <strong class="color-red">*</strong></td>
                    <td class="tal">
                      <input v-model="bank_transfer.fields.depositor" type="text">
                    </td>
                  </tr>
                  <tr>
                    <td class="bg-th">{{ $t('payments.purpose') }} <strong class="color-red">*</strong></td>
                    <td class="tal">
                      <span class="radio-tab">
                        <b-form-radio-group v-model="purpose_check" name="link-type-options" class="dib">
                          <b-form-radio :value="options.admin_sales_enums.bank_transfer_notice_link_type.netmoney_charge">{{ $t('depositless-payments.netmoney-charge') }}</b-form-radio>
                          <b-form-radio :value="options.admin_sales_enums.bank_transfer_notice_link_type.base_fee">{{ $t('depositless-payments.usage-fees') }}</b-form-radio>
                          <b-form-radio :value="options.admin_sales_enums.bank_transfer_notice_link_type.base_fee_netmoney" ><input v-model="bank_transfer.fields.link_value" type="text" class="w70"> {{ $t('depositless-payments.monthly-fees-netmoney') }}</b-form-radio>
                        </b-form-radio-group>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg-th">{{ $t('depositless-payments.mobile-phone-number') }}</td>
                    <td class="tal">
                      <input v-model="bank_transfer.fields.mobile_phone" type="text"> 
                      <span class="mobile-br" v-html="$i18n.t('depositless-payments.mobile-phone-number-info')"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg-th">{{ $t('depositless-payments.memo') }}</td>
                    <td class="tal">
                      <input v-model="bank_transfer.fields.notes" type="text" class="w100">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <error-box :errors="bank_transfer_errors"/>
            <div class="buttonbox tac mt10">
              <button class="btn-default" @click="submitAction()">{{ $t('general.save') }}</button>
            </div>
            <div class="in-txt">
              <p class="mb0" v-html="$i18n.t('depositless-payments.info2')"/>
            </div>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import component_base               from '../../../../components/common/component-base/component-base'
import { options }                  from '../../../../helpers/options'
import PaymentBankTransferApi       from '../../../../api/account/payment-bank-transfer-api'
import PaymentMiscCodeApi           from '../../../../api/account/payment-misc-codes-api'
import PaymentBankTransferViewModel from '../../../../view-model/account/payment-bank-transfer-view-model'
import depositless_payment_result   from '../../../../components/account/payments/depositless-payment/depositless-payment-result.vue'
import error_box                    from '../../../../components/common/form/error-box/error-box'
import { emptyValue } from '../../../../helpers/common'

export default {
  components: {
    'error-box': error_box,
    'depositless-payment-result': depositless_payment_result
  },
  extends: component_base,
  props: {
    data: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      options,
      bank_account_select: [],
      bank_transfer: {},
      shop:{},
      bank_transfer_errors:[],
      purpose_check: this.data,
    }
  },
  watch: { 
    data: function(newVal) {
      this.purpose_check = newVal
    }
  },
  beforeMount(){
    this.bank_transfer = new PaymentBankTransferViewModel()
  },
  mounted() {
    this.onLoadForm()
  },
  methods: {
    async onLoadForm(){
      this.bank_transfer = new PaymentBankTransferViewModel()
      this.bank_transfer.fields.shop_id = this.shop_data.shop_id
      this.bank_transfer_errors = []
      this.onLoadSelect()
    },
    async onLoadSelect(){
      // Shop DropdownList
      let data_send = {
        misc_code_type: options.admin_sales_enums.misc_codes_type.bank_account,
        status: options.common_status.active
      }
      let bank_account_list_api = new PaymentMiscCodeApi()
      this.preLoader()
      let result = await bank_account_list_api.getMiscCodeBankAccountAsync(data_send)
      this.preLoader(false)

      if(result.is_ok){
        for(var item in result.data.items)
        {
          if(result.data.items[item].is_admin_only == false)
          {
            this.bank_account_select.push(result.data.items[item])
          }
        }
      } 
      else this.showAlert(result.error_messages)
    },
    async submitAction(){
      if(emptyValue(this.bank_transfer.fields.mobile_phone)) this.bank_transfer.fields.mobile_phone=null
      this.bank_transfer.fields.bank_transfer_notice_link_type = this.purpose_check
      this.bank_transfer_errors = this.bank_transfer.isValid()
      if(this.bank_transfer_errors.length == 0) {
        this.preLoader(true)
        let payment_bank_transfer_api = new PaymentBankTransferApi()
        let result = await payment_bank_transfer_api.createBankTransferNoticeAsync(this.bank_transfer)
        this.preLoader(false)
        if(result.is_ok){
          let send_bank_data = {
            number: this.bank_account_select.find(x => x.id == result.data.bank_account_id).id,
            name: this.bank_account_select.find(x => x.id == result.data.bank_account_id).code_name
          }
          this.$emit('success', send_bank_data)
        } 
        else this.bank_transfer_errors = result.error_messages
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../../pages/account/payments/payments.scss';
</style>