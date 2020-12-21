<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <div class="payment-section">
          <!-- //pay_select -->
          <div class="pay_result">
            <p class="fw-bold mb5">Automatic transfer
            </p>
            <table class="payment-table">
              <tr>
                <td class="pay-th">Charge amount</td>
                <td class="bd-none clearfix">
                  <span class="fll mt5"><input type="text"> (Please enter number without a comma (,))</span>	
                  <a href="#" class="btn secondary flr">Charge</a>
                </td>
              </tr>
            </table>
            <div class="in-txt">
              <p class="mb0">
                ※ The Charged amount will be summed up with the usage fees for automatic withdrawal. <br>
                ※ Maximum monthly charge can be up to 300,000 won.
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