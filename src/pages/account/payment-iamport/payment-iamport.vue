<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="imp-container inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('payments.online-payment') }}</h3>
        </article>
        <form>
          <div class="table-wrap-bg mb10">
            <table class="normal">
              <tbody>
                <tr>
                  <td class="bg-th">{{ $t('online-payment.pg') }}<strong class="color-red">*</strong></td>
                  <td class="tal">
                    <b-form-select v-model="iamport_data.fields.payment_gateway" :options="pgs" class="w50p" 
                                   value-field="value" text-field="label" disabled 
                                   @change="handlePg" />
                  </td> 
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('online-payment.payment-method') }}<strong class="color-red">*</strong></td>
                  <td class="tal"><span>{{ show_payment_method }}</span></td> 
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('online-payment.order') }}<strong class="color-red">*</strong></td>
                  <td class="tal"><span>{{ show_purpose }}</span></td> 
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('online-payment.amount') }}<strong class="color-red">*</strong></td>
                  <td class="tal"><input v-model="iamport_data.fields.amount" class="w50p" disabled></td> 
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('online-payment.name') }}<strong class="color-red">*</strong></td>
                  <td class="tal"><input v-model="iamport_data.fields.buyer_name" class="w50p"></td> 
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('online-payment.phone') }}<strong class="color-red">*</strong></td>
                  <td class="tal"><input v-model="iamport_data.fields.buyer_phone_number" class="w50p"></td> 
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('online-payment.email') }}</td>
                  <td class="tal"><input v-model="iamport_data.fields.buyer_email" class="w50p"></td> 
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div class="form-group"> 
            <dl class="clearfix list mb10">
              <dt>입금기한<strong class="color-red">*</strong></dt>
              <dd><input v-model="iamport_data.fields.vbankDue" class="w70"></dd>
            </dl> 
          </div> -->
          <div class="button-box">
            <b-button class="btn1 flr" style="margin: 5px;" @click="handleGoBack()" >
              {{ $t('online-payment.back') }}
            </b-button>
            <b-button class="btn1 flr" style="margin: 5px;" @click="sendOnlinePaymentPrepared()" >
              {{ $t('online-payment.check-out') }}
            </b-button>
          </div>
        </form>
        <iamport-result :send_result="send_result" />
      </div>
    </section>
  </main>
</template>

<script>
import { PGS } from './constants'
import Utils from './utils'
import iamportViewModel from '../../../view-model/account/iamport-view-model'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { options }          from '../../../helpers/options'
import component_base       from '../../../components/common/component-base/component-base'
import OnlinePaymentApi         from '../../../api/account/online-payment-api'
import iamport_result from '../../../components/account/payments/iamport-result/iamport-result'
import _ from 'lodash'

export default {
  components:{
    'iamport-result'         : iamport_result,
  },
  extends: component_base,
  data() {
    return {
      options : options,
      iamport_data: {},
      initialMerchantUid: `mid_${new Date().getTime()}`,
      pgs: PGS,
      methods: Utils.getMethodsByPg(),
      shop_info: {fields:{}},
      payment_request: {},
      send_result:{},
      online_paymet_data:{},
      counter: 0,
      show_payment_method: '',
      show_purpose:'',
      online_payment_types:[],
      merchant_uid_from_iamport: '',
      online_payment_method: '',
      errors: []
    }
  },
  computed: {
    ...mapGetters('shop', {
      shop_info_data: 'getShopInfoAction'
    }),
    ...mapGetters('payment', {
      payment_data: 'getPaymentData'
    })
  },
  beforeMount(){
    this.iamport_data = new iamportViewModel()
  },
  mounted(){
    let jqueryScript = document.createElement('script')
    jqueryScript.setAttribute('src', 'https://code.jquery.com/jquery-1.12.4.min.js')
    document.head.appendChild(jqueryScript)
    let iamportScript = document.createElement('script')
    iamportScript.setAttribute('src', 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js')
    document.head.appendChild(iamportScript)

    this.online_payment_types = options.admin_sales_enums.online_paymethod_types
    this.iamport_data.fields = Object.assign(this.iamport_data.fields, this.payment_data)
    this.loadTableData()
    this.iamport_data.fields.payment_method = _.find(this.online_payment_types, x=> x.value == this.iamport_data.fields.payment_method).text 
    this.show_payment_method = this.formatPaymentMethod(this.iamport_data.fields.payment_method)
    this.show_purpose = this.formatPurpose(this.payment_data.purpose, this.payment_data.months)
  },
  methods: {
    ...mapActions('shop', [      
      'setShopInfoActionDataAsync'
    ]),
    ...mapMutations('payment',[
      'setVirtualAccountResultData'
    ]), 
    formatPurpose(purpose, extend_months){
      if(purpose == options.admin_sales_enums.payment_purpose.netmoney_charge) return this.$i18n.t('payments.netmoney-charge') 
      if(purpose == options.admin_sales_enums.payment_purpose.base_fee) return this.$i18n.t('payments.expiry-date-extension') +'/'+extend_months + this.$i18n.t('payments.months')
    },
    formatPaymentMethod(payment_method){
      if(payment_method== options.admin_sales_enums.online_paymethod.card) return this.$i18n.t('payments.card')
      if(payment_method== options.admin_sales_enums.online_paymethod.real_time_account_transfer) return this.$i18n.t('payments.real-time-bank-transfer')
      if(payment_method== options.admin_sales_enums.online_paymethod.virtual_account) return this.$i18n.t('payments.virtual-account')
    },
    async loadTableData() {
      this.preLoader()      
      let tf= await this.loadShopInfo()
      if (tf) {
        this.setShopInfo()
      }
      this.preLoader(false)
    },
    async loadShopInfo() {
      let query = {
        shop_id: this.shop_data.shop_id,          
        action: options.form_actions.edit
      }
      await this.setShopInfoActionDataAsync(query)       
      if(this.shop_info_data.is_ok){
        this.shop_info.fields = Object.assign({}, this.shop_info_data.data)         
        return true
      }
      else this.showAlert(this.shop_info_data.error_messages)
      return false
    },
    setShopInfo(){
      this.iamport_data.fields.buyer_name = this.shop_info.fields.owner_name
      this.iamport_data.fields.buyer_phone_number = this.shop_info.fields.owner_mobile_number
      this.iamport_data.fields.buyer_email = this.shop_info.fields.email
      this.iamport_data.fields.shop_id = this.shop_data.shop_id
      this.iamport_data.fields.country_code = this.shop_data.country
    },
    async sendOnlinePaymentPrepared(){
      this.errors = this.iamport_data.isValid()
      if(this.errors.length == 0)
      {
        let online_payment_api = new OnlinePaymentApi()
        this.preLoader(true)
        let prepared_result = await online_payment_api.preparedOnlinePaymentAsync(this.iamport_data.fields)
        this.preLoader(false)
        if(prepared_result.is_ok){
          this.payment_request = prepared_result.data.payment_request
          this.handleSubmit(this.payment_request)
        }
        else this.showAlert(prepared_result.error_messages)

      }
      else this.showAlert(this.errors)
    },
    handleSubmit(request) {
      const { IMP } = window
      IMP.init(Utils.getUserCodeByPg(request.pg))
      const data = request
      IMP.request_pay(data, this.callback)
    },
    handlePg(pg) {
      const newMethods = Utils.getMethodsByPg(pg)
      const [{ value }] = newMethods

      this.methods = Utils.getMethodsByPg(pg)
      this.form.setFieldsValue({
        payMethod: value,
      })

      this.setVisible(pg, value)
    },
    setVisible(pg, method) {
      // 가상계좌 입금기한 렌더링 여부
      const vbankDueVisible = method === 'vbank'
      this.vbankDueVisible = vbankDueVisible

      // 사업자 번호 렌더링 여부
      this.bizNumVisible = pg === 'danal_tpay' && vbankDueVisible

      // 할부개월수 렌더링 여부
      this.quotaVisible = method === 'card'
    },
    handleGoBack() {
      this.$router.push('/payments')
    },
    async callback(response) {
      this.preLoader(true)
      // 본인인증 종료 후 result 페이지로 이동
      const query = {
        ...response,
        type: 'payment',
      }
      this.send_result = query
      if(this.send_result.success)
      {
        this.merchant_uid_from_iamport = this.send_result.merchant_uid
        this.online_payment_method = this.send_result.pay_method
        this.setDelayToCheckOnlinePayment()
      }
      else
      {
        this.showAlert([this.send_result.error_msg])
        this.preLoader(false)
      } 
    },
    async setDelayToCheckOnlinePayment(){
      await setTimeout( () => this.checkOnlinePaymentStatus(this.merchant_uid_from_iamport), 1000)
    },
    async checkOnlinePaymentStatus(merchant_uid){
      let status =0
      status = await this.getOnlinePaymentStatus(merchant_uid)
      if(status == options.admin_sales_enums.online_payment_status.paid)
      {
        if(this.payment_data.purpose == options.admin_sales_enums.payment_purpose.netmoney_charge) 
          this.$router.push('/netmoney-history')
        if(this.payment_data.purpose == options.admin_sales_enums.payment_purpose.base_fee)
          this.$router.push('/extension-expiry-date')
        this.preLoader(false)
      }
      else if(status == options.admin_sales_enums.online_payment_status.awaiting && this.online_payment_method== options.admin_sales_enums.iamport_pay_method.virtual_account)
      {
        this.setVirtualAccountResultData(this.online_payment_data)
        this.$router.push('/virtual-account-result')
        this.preLoader(false)
      }
      else
      {
        if(this.counter<10){
          this.counter++
          this.setDelayToCheckOnlinePayment()
        }
        else {
          this.showAlert([ this.$i18n.t('payment-result.failed-pay')])
        }
        this.preLoader(false)
      }
    },
    async getOnlinePaymentStatus(merchant_uid){
      let send_data={
        merchant_id: merchant_uid
      }
      let online_payment_api = new OnlinePaymentApi()
      this.preLoader(true)
      let result = await online_payment_api.getOnlinePaymentAsync(send_data)
      this.preLoader(false)
      if(result.is_ok){
        this.online_payment_data = result.data
        return this.online_payment_data.payment_status
      }
      else
      {
        this.showAlert(result.error_messages)
        return false
      } 
    }
  }
}
</script>

