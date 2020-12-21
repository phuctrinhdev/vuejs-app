<template>
  <main>
    <section class="contents-style common-style">
      <div class="inner">
        <div class="payment-section">
          <div class="pay-result">
            <virtual-account-list :is_result="true"/>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import component_base       from '../../../components/common/component-base/component-base'
import virtual_account_list                from '../../../components/account/payments/virtual-account-list/virtual-account-list.vue'

export default {
  components:{
    'virtual-account-list'       : virtual_account_list
  },
  extends: component_base
}

</script>