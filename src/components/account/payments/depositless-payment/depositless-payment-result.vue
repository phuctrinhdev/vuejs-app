<template>
  <main class="app-content">
    <div class="pay_result">
      <div class="in-txt">
        <p class="mb0">
          {{ $t('payment-result.info') }}
        </p>
      </div>
      <div class="in-txt">
        <p class="mb0">
          {{ data.name }} 예금주: (주)아하소프트
        </p>
      </div> 
    </div>
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
      type: Object,
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