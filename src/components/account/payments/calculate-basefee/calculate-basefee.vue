<template>
  <main class="app-content">
    <section>
      <div class="inner">
        <div class="pay_result">
          <virtual-account-list v-if="payment_method==options.admin_sales_enums.payment_method.depositless_virtual" :is_result="false"/>
          <p class="fw-bold mb5">{{ form_title }} </p>
          <table class="normal payment-table">
            <tr>
              <td class="pay-th">{{ $t('payments.fees-months') }}</td>
              <td class="bd-none">{{ total_monthly_fee }} won</td>
            </tr>
            <tr>
              <td class="pay-th">{{ $t('payments.extension-months') }}</td>
              <td class="bd-none">
                <b-form-select
                  v-model="link_value_extend_month" :options="extend_month_select" class="w70"
                  value-field="id" text-field="text"                      
                  @change="onCalculateTotalFeeAmount"/>
                <span>
                  {{ $t('payments.months') }} ({{ $t('payments.discount1') }} {{ monthly_fee_info.month_6DC_rate }}% {{ $t('payments.discount') }},  {{ $t('payments.discount2') }} {{ monthly_fee_info.month_12DC_rate }}% {{ $t('payments.discount') }})
                </span>
              </td>
            </tr>
            <tr>
              <td class="pay-th">{{ $t('payments.total') }}</td>
              <td class="bd-none clearfix">
                <span class="fw-bold mt5 fll">{{ total_amount }} won</span> 
                <a v-if="payment_method == options.admin_sales_enums.payment_method.card || payment_method == options.admin_sales_enums.payment_method.real_time_bank_tansfer || payment_method == options.admin_sales_enums.payment_method.depositless_virtual" class="btn secondary flr" @click="goToImport()">{{ $t('payments.payment-progress') }}</a>
              </td>
            </tr>
          </table>
          <div v-if="payment_method == options.admin_sales_enums.payment_method.card || payment_method == options.admin_sales_enums.payment_method.real_time_bank_tansfer" class="in-txt">
            <p class="mb0" v-html="$i18n.t('payments.info1')" />
          </div>
          <div v-if="payment_method == options.admin_sales_enums.payment_method.depositless_virtual" class="in-txt">
            <p v-html="$i18n.t('virtual-account.info1')"/>
            <p v-html="$i18n.t('virtual-account.info2')"/>
            <p v-html="$i18n.t('payments.info1')"/>   
          </div>
        </div>
      </div>
    </section> 
    <!-- modal action -->
  </main>
</template>

<script>
import component_base from '../../../../components/common/component-base/component-base'
import { options } from '../../../../helpers/options'
import { mapGetters, mapMutations } from 'vuex'
import { calculateShopTotalMonthlyFee } from '../../../../helpers/common'
import _ from 'lodash'
import virtual_account_list                from '../../../../components/account/payments/virtual-account-list/virtual-account-list.vue'


export default {
  components: {
    'virtual-account-list'       : virtual_account_list

  },
  extends: component_base,
  props: {
    data: {
      type: Number,
      default: () => ({})
    },
    payment_method:{
      type: Number,
      default: () => ({})
    }
  },
  data() {
    return {
      options,
      purpose_check: this.data,
      form_title: '',
      monthly_fee_info: [],
      extend_month_select:[],
      link_value_extend_month:1,
      total_amount : 0,
      total_monthly_fee: 0,
      pg: '',
      iamport_paymethod:'',
    }
  },
  computed: {
    ...mapGetters('shop', {
      monthly_fee_info_data: 'getMonthlyFeeInfo'
    })
  },
  watch: {
    payment_method() {
      this.formatFormTitle()
    }
  },
  beforeMount(){
    let extend_months= [1,2,3,4,5,6,7,8,9,10,11,12]
    for (let e of extend_months ) {
      this.extend_month_select.push ( {value:e, text:e })
    }
  },
  mounted(){
    this.monthly_fee_info = this.monthly_fee_info_data.data
    this.total_monthly_fee = this.calShopTotalMonthlyFee()
    this.total_amount = this.calShopTotalMonthlyFee()
    this.formatFormTitle()
  },
  methods: {
    ...mapMutations('payment',[
      'setPaymentData'
    ]), 
    formatFormTitle(){
      if(this.payment_method == options.admin_sales_enums.payment_method.depositless){
        this.form_title = this.$i18n.t('depositless-payments.title2')
      }
      if(this.payment_method == options.admin_sales_enums.payment_method.card){
        this.form_title = this.$i18n.t('payments.card')
      }
      if(this.payment_method == options.admin_sales_enums.payment_method.real_time_bank_tansfer){
        this.form_title = this.$i18n.t('payments.real-time-bank-transfer')
      }
      if(this.payment_method == options.admin_sales_enums.payment_method.depositless_virtual){
        this.form_title = this.$i18n.t('payments.virtual-account')
      }
    },
    calShopTotalMonthlyFee(){
      return calculateShopTotalMonthlyFee(this.monthly_fee_info.shop_solution_amount, this.monthly_fee_info.shop_total_extra_amount, this.monthly_fee_info.shop_discount_amount, true)
    },
    onCalculateTotalFeeAmount(){
      let month= this.link_value_extend_month
      let discount_rate = 0.0
      if(Math.abs(month) >= 6 && Math.abs(month) <= 11)
        discount_rate = this.monthly_fee_info.month_6DC_rate * 0.01
      else if (Math.abs(month) >= 12)
        discount_rate = this.monthly_fee_info.month_12DC_rate * 0.01

      let amount = ((1.0 - discount_rate) * (this.total_monthly_fee)) * month
      this.total_amount = Math.round((amount - (amount % (this.monthly_fee_info.fee_truncate * 10))) * 10) / 10
    },
    goToImport(){
      let query = {
        pg: '',
        name: '',
        amount: '',
        purpose: this.purpose_check,
        months: 0,
        payment_method: 0
      }
      query.payment_gateway = options.admin_sales_enums.pg.lguplus
      query.product_name = _.find(options.admin_sales_enums.payment_purpose_type, x=> x.value == this.purpose_check).text + '/'+ this.link_value_extend_month
      query.months=this.link_value_extend_month
      query.amount = this.total_amount
      query.payment_method= this.payment_method
      if(query.months == 0 ) this.showAlert([ this.$i18n.t('payments.required-month')])
      else {
        this.setPaymentData(query)
        
        this.$router.push({ name: 'payment-iamport' })
      }
    }

  }
}
</script>

<style lang="scss">
@import '../../../../pages/account/payments/payments.scss';
</style>