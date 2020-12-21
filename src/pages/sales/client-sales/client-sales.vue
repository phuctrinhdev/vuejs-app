<template>
  <main class="app-content">
    <client-information v-if="has_client" :client_id="x_client_id_using_sales" :type="type" 
                        style-class="sales-history" class="content client-sales"/>

    <alert-confirm :id="alert_id" :data_alerts="alert_data" 
                   :hide_yes="true" :label_no="alert_label_no"
                   @cancel="onAlertCancel"/>
  </main>
</template>
<script>
import { mapGetters, mapMutations }       from 'vuex'
import { PAGE_MODAL_CHECK } from '../../../config/constant'

import staff_mixin        from '../../../helpers/mixins/staff-mixin'

import client_information from '../../../components/clients/client-information/client-information.vue'
import component_base     from '../../../components/common/component-base/component-base'
import alert_confirm      from '../../../components/common/alert/alert-confirm'


export default {
  components: {
    'alert-confirm': alert_confirm,
    'client-information': client_information,
  },
  extends: component_base,
  mixins: [staff_mixin],
  data(){
    return {
      type: PAGE_MODAL_CHECK.PAGE,

      alert_id: 'warning-client-not-found',
      alert_data: [],
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_client_id_using_sales: 'getClientIdUsingSales'
    }),
    warning_client_not_found(){return this.$i18n.t('client-sales.warning-client-not-found')},
    alert_label_no(){return this.$i18n.t('general.close')},
    has_client(){
      return this.x_client_id_using_sales > 0
    }
  },
  async created(){
    this.$nextTick(() => {
      if(!this.has_client){
        this.$router.push('/sales')
      }
    })
    await this.loadStaffOptions()
  },
  beforeRouteLeave(to, from, next) {
    this.resetState()
    next()
  },
  methods: {
    ...mapMutations('booking',[
      'resetState'
    ]),
    ...mapMutations('staff',[
      'setStaffOptions',
    ]),
    
    async loadStaffOptions(){
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok)
        this.setStaffOptions(result.data.items)
      else this.showAlert(result.error_messages)
    },
    onAlertCancel(){
      this.$router.push('/sales')
    },
  }
}
</script>

<style lang="scss">
@import './client-sales.scss';
</style>