<template>
  <div class="sales-history client-information-box">
    <client-info-summary ref="client_info" 
                         :type="type" 
                         @added-outstanding="reloadSalesHistoryTabAsync()"/>
    <client-sales-summary v-if="is_loaded_client" ref="client_sales" :type="type"/>
  </div>
</template>

<script>
import SalesCache                 from '../../../helpers/cache/sales-cache'
import client_info_summary        from '../../../components/clients/client-information/client-info-summary.vue'
import client_sales_summary       from '../../../components/clients/client-information/client-sales-summary.vue'
import component_base             from '../../../components/common/component-base/component-base'
import { PAGE_MODAL_CHECK }       from '../../../config/constant'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'client-info-summary' : client_info_summary,
    'client-sales-summary': client_sales_summary
  },
  extends: component_base,
  props: {
    client_id: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: PAGE_MODAL_CHECK.MODAL
    },
    styleClass: {
      type: String,
      default: ''
    }
  },
  data(){
    return{
      sales_cache: new SalesCache(),
      sales_setup: {},
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation',
    }),
    ...mapGetters('sales', {
      x_client_shop_id_using_sales: 'getClientShopIdUsingSales',
    }),
    is_loaded_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0 && this.x_client.data.id == this.client_id
    }
  },
  watch: {
    'client_id'(){
      this.setClientData()
    }
  },

  async created(){
    if(this.type == PAGE_MODAL_CHECK.PAGE)
      await this.setClientData()
  },

  methods: {
    ...mapActions('client', [
      'getClientInformationDataAsync',
      'updateClientInformationData'
    ]),
    ...mapActions('sales_client_account',[
      'setSalesClientAccountDataAsync',
    ]),

    onLoadForm(){
      this.setClientData()
      this.$refs.client_info.initImg()
    },
    
    async setClientData(){
      this.preLoader()
      await this.getClientInformationDataAsync(Object.assign({}, { client_id: this.client_id, shop_id: this.x_client_shop_id_using_sales }))
      this.preLoader(false)
      if(!this.x_client.is_ok)
        this.showAlert(this.x_client.error_messages)
    },
    async loadClientAccountAsync(){
      let response = await this.setSalesClientAccountDataAsync({ client_id: this.client_id,   shop_id: this.x_client_shop_id_using_sales })
      if(!response.is_ok) this.showAlert(response.error_messages)
    },
    async reloadSalesHistoryTabAsync(){
      this.$refs.client_sales.reloadRelatedPagesAsync(true)
    },
  }
}
</script>

<style lang="scss">
@import './client-information.scss';
</style>