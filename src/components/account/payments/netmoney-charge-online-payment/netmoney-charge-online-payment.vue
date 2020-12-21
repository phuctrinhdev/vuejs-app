<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <div class="payment-section">
          <!-- //pay_select -->
          <div class="pay_result">
            <virtual-account-list v-if="payment_method==options.admin_sales_enums.payment_method.depositless_virtual" :is_result="false"/>
            <p class="fw-bold mb5">{{ form_title }}</p>
            <table v-if="data==options.admin_sales_enums.payment_purpose.netmoney_charge" class="payment-table">
              <tr>
                <td class="pay-th">{{ $t('payments.amount') }}</td>
                <td class="bd-none clearfix">
                  <span class="fll mt5">
                    <b-form-select v-model="charge_amount" :options="netmoney_charge_amount" 
                                   value-field="value" 
                                   text-field="text"/>

                  </span>	
                  <a class="btn secondary flr" @click="goToImport">{{ $t('payments.payment-progress') }}</a>
                </td>
              </tr>
            </table>
            <div v-if="payment_method == options.admin_sales_enums.payment_method.depositless_virtual" class="in-txt">
              <p v-html="$i18n.t('virtual-account.info1')"/>
              <p v-html="$i18n.t('virtual-account.info2')"/>
              <p v-html="$i18n.t('payments.info1')"/>    
            </div>
            <div v-else class="in-txt">
              <p class="mb0" v-html="$i18n.t('payments.info1')" />
            </div>
            
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import component_base from '../../../../components/common/component-base/component-base'
import { options } from '../../../../helpers/options'
import _ from 'lodash'
import { mapMutations } from 'vuex'
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
      netmoney_charge_amount:[],
      charge_amount: 0,
      purpose_check: this.data,
      form_title: '',
    }
  },
  watch: {
    payment_method() {
      this.formatFormTitle()
      this.setNetmoneyChargeAmount()

    }
  },
  beforeMount(){
    this.setNetmoneyChargeAmount()
    if(_.find(this.netmoney_charge_amount, x=> x.value == 0) == undefined)
      this.netmoney_charge_amount.push({ value: 0, text: this.$i18n.t('payments.select-amount')})
  },
  mounted(){
    this.formatFormTitle()
  },
  methods:{
    ...mapMutations('payment',[
      'setPaymentData'
    ]), 
    setNetmoneyChargeAmount(){
      this.netmoney_charge_amount=[]
      this.netmoney_charge_amount = options.admin_sales_enums.netmoney_charge_amount
      this.charge_amount = 0
    },
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
    },
    goToImport(){
      let query = {
        payment_gateway: '',
        product_name: '',
        amount: '',
        purpose: this.purpose_check,
        months: 0,
        payment_method:0
      }
      query.payment_gateway = options.admin_sales_enums.pg.lguplus
      query.payment_method = options.admin_sales_enums.online_paymethod.card
      query.product_name = _.find(options.admin_sales_enums.payment_purpose_type, x=> x.value == this.purpose_check).text + '/'+ this.charge_amount
      query.amount = this.charge_amount
      query.payment_method= this.payment_method
      if(query.amount == 0 ) this.showAlert([ this.$i18n.t('payments.required-amount')])
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