<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <div class="payment-section">
          <!-- //pay_select -->
          <div class="pay_result">
            <p class="fw-bold mb5">Depositless payment(Virtual Account)</p>
            <table v-if="data==options.admin_sales_enums.payment_purpose.netmoney_charge" class="payment-table">
              <tr>
                <td class="pay-th">Amount</td>
                <td class="bd-none clearfix">
                  <span class="fll mt5"><input type="text"> won (Please enter number without a comma (,))</span>	
                  <a href="#" class="btn secondary flr">Payment progress</a>
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
            <div class="in-txt">
              <p>
                ※ Virtual Account<br>
                - Single-use deposit account, Upon completion of the deposit, the 
                <strong>Netmoney charge / Expiry Date Extension</strong>will be immediately done.
              </p>
              <p>
                ※ Virtual Account Progress Guide<br>
                - When you make the payment, the account number to be deposited will be issued.<br>
                - Please make a bank transfer to internet banking or CD / ATM machine (cash machine).<br>
                (Please note: CD / ATM equipment must be transferred using bankbook or card (no cash deposit available))<br>
                - Once the deposit is completed, the system will process it automatically (instantly Netmoney charged)<br>
                - Deposits can only be made with the correct amount. (Depositors may be different.)<br>
                - Deposit time is 24 hours (please get a new virtual account number when you make a deposit later)<br>
                - Unable to transfer cash card or alliance card from stock firm<br>
                - Charge bank fees and booking transfer is not allowed
              </p>
              <p>
                ※ If you pay by Virtual Account / Credit Card / Real-time bank transfer, you will 
                <strong>not receive a tax invoice. You can print</strong> your credit card sales slip or cash receipt (proof of expenditure) and 
                <strong>use it as a tax invoice.</strong>
              </p>
            </div>
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