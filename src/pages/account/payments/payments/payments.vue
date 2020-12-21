<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('payments.title') }}</h3>
        </article>
        <div class="payment-section">
          <p class="txt1 clearfix">
            <span>{{ shop_name }}</span>
            <span>
              {{ $t('payments.netmoney-balance') }} : {{ formatMoney(shop_netmoney_balance, 2) }}
            </span>
            <span>{{ $t('payments.expiry-date') }} : {{ formatTimeStampToDate(shop_expiry_date) }}</span>
          </p>
          <div v-if="depositless_payment_success == false">
            <div class="pay_select">
              <table class="normal payment-table">
                <tr>
                  <td class="pay-th">{{ $t('payments.purpose') }}</td>
                  <td class="bd-none">
                    <span v-if="!monthly_fee_info.auto_transfer" class="radio-tab">
                      <radio-group v-model="purpose_check" 
                                   :options="options.admin_sales_enums.payment_purpose_options" name="purpose-options"
                                   class="dib"
                                   @input="onChangePurpose"/>
                    </span>
                    <span v-else class="radio-tab">
                      <radio-group v-model="purpose_check" 
                                   :options="options.admin_sales_enums.payment_purpose_options_for_auto_transfer" name="purpose-options"
                                   class="dib"
                                   @input="onChangePurpose"/>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="pay-th">{{ $t('payments.payment-method') }}</td>
                  <td class="bd-none">
                    <span class="radio-tab">
                      <radio-group v-model="method_check" :options="payment_method_check" name="method-options" 
                                   class="dib" @input="onChangePayment"/>
                    </span>                  
                  </td>
                </tr>
              </table>
            </div>
            <div>
              <calcualte-basefee v-if="purpose_check==options.admin_sales_enums.payment_purpose.base_fee" :data="purpose_check" :payment_method="method_check" />
              <!-- component -->
              <netmoney-charge-online-payment v-if="purpose_check==options.admin_sales_enums.payment_purpose.netmoney_charge && is_online_payment" :data="purpose_check" :payment_method="method_check" />
              <depositless-payment v-if="method_check == options.admin_sales_enums.payment_method.depositless" :data="purpose_check" @success="onReloadSuceessPage"/>
              <kako-pay v-if="method_check == options.admin_sales_enums.payment_method.kakao_pay" :data="purpose_check"/>
              <automatic-transfer v-if="method_check == options.admin_sales_enums.payment_method.automatic_transfer
              && purpose_check == options.admin_sales_enums.payment_purpose.netmoney_charge"/>
              <using-netmoney v-if="method_check == options.admin_sales_enums.payment_method.netmoney && options.admin_sales_enums.payment_purpose.base_fee" />
              <!-- /component -->
            </div>
          </div>
          <div v-if="depositless_payment_success == true">
            <depositless-payment-result :data="result_data"/>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import component_base              from '../../../../components/common/component-base/component-base'
import { options }                 from '../../../../helpers/options.js'
import { ADMIN_SALES_ENUMS }       from '../../../../config/constant'
import PaymentShopUsageApi         from '../../../../api/account/payment-shop-info-api'
import automatic_transfer          from '../../../../components/account/payments/automatic-transfer/automatic-transfer.vue'
import depositless_payment         from '../../../../components/account/payments/depositless-payment/depositless-payment.vue'
import kako_pay                    from '../../../../components/account/payments/kakao-pay/kakao-pay.vue'
import netmoney_charge_online_payment                 from '../../../../components/account/payments/netmoney-charge-online-payment/netmoney-charge-online-payment.vue'

import using_netmoney              from '../../../../components/account/payments/using-netmoney/using-netmoney.vue'
import depositless_payment_result  from '../../../../components/account/payments/depositless-payment/depositless-payment-result.vue'
import calculate_basefee           from '../../../../components/account/payments/calculate-basefee/calculate-basefee.vue'
import radio_group                 from '../../../../components/common/form/radio/radio-group/radio-group'
import { formatDate
  , convertTimeStampToDate
  , formatMoney }                  from '../../../../helpers/common'
import { mapActions, mapGetters} from 'vuex'
import { COUNTRY } from '../../../../config/constant.js'

export default {
  components: {
    'automatic-transfer'         : automatic_transfer,
    'depositless-payment'        : depositless_payment,
    'kako-pay'                   : kako_pay,
    'using-netmoney'             : using_netmoney,
    'depositless-payment-result' : depositless_payment_result,
    'radio-group'                : radio_group,
    'calcualte-basefee'          : calculate_basefee,
    'netmoney-charge-online-payment'    : netmoney_charge_online_payment
  },
  extends: component_base,
  data() {
    return {
      options: options,
      purpose_check: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE,
      method_check: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS,

      shop_name: '',
      shop_netmoney_balance: 0,
      shop_expiry_date: '',
      payment_method_check: null,

      depositless_payment_success: false,
      result_data: null,
      monthly_fee_info:[],
      is_online_payment: false
    }
  },
  computed: {
    ...mapGetters('shop', {
      monthly_fee_info_data: 'getMonthlyFeeInfo'
    })
  },
  mounted(){
    this.loadShopUsage()
  },
  methods: {
    ...mapActions('shop', [      
      'setMonthlyFeeInfoDataAsync'
    ]),
    formatMoney,
    onChangePurpose(){
      if(this.shop_data.country == COUNTRY.KR){
        if(this.purpose_check == ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE)
          this.payment_method_check = this.options.admin_sales_enums.netmoney_charge_payment_method_options_kr
        else
          this.payment_method_check = this.options.admin_sales_enums.base_fee_payment_method_options_kr

      }
      else{
        if(this.purpose_check == ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE)
          this.payment_method_check = this.options.admin_sales_enums.netmoney_charge_payment_method_options
        else
          this.payment_method_check = this.options.admin_sales_enums.base_fee_payment_method_options

      }
      this.method_check = ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS
    },
    onChangePayment(){
      this.is_online_payment = false
      if(this.method_check == ADMIN_SALES_ENUMS.PAYMENT_METHOD.CARD 
      || this.method_check == ADMIN_SALES_ENUMS.PAYMENT_METHOD.REAL_TIME_BANK_TRANSFER 
      || this.method_check == ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL) this.is_online_payment = true
      else this.is_online_payment = false 
    },
    async loadShopUsage(){
      this.is_online_payment = false
      await this.setMonthlyFeeInfoDataAsync(this.shop_data.shop_id)
      this.monthly_fee_info= this.monthly_fee_info_data.data
      // init
      this.purpose_check = ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE
      this.method_check = ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS
      if(this.shop_data.country == COUNTRY.KR)
        this.payment_method_check = this.options.admin_sales_enums.netmoney_charge_payment_method_options_kr
      else
        this.payment_method_check = this.options.admin_sales_enums.netmoney_charge_payment_method_options
      this.depositless_payment_success = false
      
      let data_send = {
        shop_ids: [ this.shop_data.shop_id ]
      }
      let payment_shop_usage_api = new PaymentShopUsageApi()
      this.preLoader(true)
      data_send = {
        shop_id: this.shop_data.shop_id
      }
      let shop_usage_result = await payment_shop_usage_api.getPaymentShopUsageAsync(data_send)
      this.preLoader(false)
      if(shop_usage_result.is_ok){
        this.shop_netmoney_balance = shop_usage_result.data.net_money_balance
        this.shop_expiry_date = shop_usage_result.data.expiry_date_ts
        this.shop_name = shop_usage_result.data.shop_name
      }
      else this.showAlert(shop_usage_result.error_messages)

    },
    formatTimeStampToDate(ts) {
      if (ts == 0) return '' 
      return formatDate(convertTimeStampToDate(ts, true), this.shop_data.format_date)
    },
    onReloadSuceessPage(result){
      this.result_data = result
      this.depositless_payment_success = true
    }
  }
}
</script>

<style lang="scss">
@import '../payments.scss';
</style>