<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <div class="payment-section">
          <!-- //pay_select -->
          <div class="pay_result">
            <p class="fw-bold mb5">Using Netmoney
            </p>
            <div class="extended-period">
              <table class="normal payment-table">
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
                <p class="mb0">
                  ※ Extend the service period to a Netmoney balance.
                </p>
              </div>
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

export default {
  components: {
  },
  extends: component_base,
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
@import '../../../../pages/account/payments/payments.scss';
</style>