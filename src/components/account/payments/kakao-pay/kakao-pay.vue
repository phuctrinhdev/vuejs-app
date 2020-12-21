<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <div class="payment-section">
          <!-- //pay_select -->
          <div class="pay_result">
            <p class="fw-bold mb5">What is the ‘Kakao pay’?</p>
            <div class="in-txt">
              <p class="mb0">
                - Kakao pay is the service which you can pay easily and simply with password or fingerprint after registering credit card/debit card on Kakao talk. <br>
                - Available to use after registering your card or account on your smartphone.
              </p>
            </div>
            <table v-if="data==options.admin_sales_enums.payment_purpose.netmoney_charge" class="payment-table">
              <tr>
                <td class="pay-th">Amount</td>
                <td class="bd-none clearfix">
                  <span class="fll mt5"><input type="text"> (Please enter number without a comma (,))</span>	
                  <a href="#" class="btn secondary flr">Charge</a>
                </td>
              </tr>
            </table> 
            <table v-if="data==options.admin_sales_enums.payment_purpose.base_fee" class="normal payment-table">
              <tr>
                <td class="pay-th">Fees(/month)</td>
                <td class="bd-none">38,500 won</td>
              </tr>
              <tr>
                <td class="pay-th">Extension months</td>
                <td class="bd-none">
                  <select class="w70px">
                    <option>1</option>
                  </select> 
                  <span>
                    month (6~11month 5% discount,  12month 10% discount)
                  </span>
                </td>
              </tr>
              <tr>
                <td class="pay-th">Total</td>
                <td class="bd-none clearfix">
                  <span class="fw-bold mt5 fll">38,500 won</span> 
                  <a href="#" class="btn secondary flr">Payment progress</a>
                </td>
              </tr>
            </table>    
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

export default {
  components: {
  },
  extends: component_base,
  props: {
    data: {
      type: Number,
      default: () => ({})
    }
  },
  data() {
    return {
      options
    }
  }
}
</script>

<style lang="scss">
@import '../../../../pages/account/payments/payments.scss';
</style>