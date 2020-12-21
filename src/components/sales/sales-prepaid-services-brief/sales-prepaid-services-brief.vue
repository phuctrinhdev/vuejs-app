<template>
  <div class="sales-prepaid-services-brief">
    <div v-if="table_data.rows.length > 0" class="prepaid-services-wrapper">
      <view-table :data="table_data" max_height="272px"
                  @change-page="onChangePage" @click-rows="onClickRow">
        <template slot="prepaid_service_name" slot-scope="{ row }">
          {{ row.prepaid_service_name }}<br>
          <template v-if="!isDataOfCurrentShop(row)">({{ row.shop_name }})</template>
        </template>
        <template slot="quantity" slot-scope="{ row }">
          {{ sales_utils.formatNoLimitNumber(row.quantity,0) }}
        </template>
        <template slot="expiry_date_ts" slot-scope="{ row }">
          {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}
        </template>
      </view-table>
    </div>
    <div v-else class="prepaid-service-wrapper">
      <div class="empty-message">{{ $t('bookings.there-is-no-prepaid-service') }}</div>
    </div>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'
import component_base from '../../common/component-base/component-base'
import client_prepaid_services_mixin from '../../../helpers/mixins/client-prepaid-services-mixin'
import SalesUtils from '../../../helpers/utils/sales-utils'
import view_table from '../../common/view-table/view-table'
import service_mixin from '../../../helpers/mixins/service-mixin'

export default {
  components: {
    'view-table': view_table
  },
  extends: component_base,
  mixins: [client_prepaid_services_mixin, service_mixin],
  props: {
    client: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      sales_utils: SalesUtils,
      
      table_data:{
        fields:[
          {field: 'prepaid_service_name', label: 'sales-prepaid-service-tab.prepaid-service-name',width: '50%', sortable: false, expand: true},
          {field: 'quantity',             label: 'general.qty',                                   width: '20%', sortable: false, expand: true},
          {field: 'expiry_date_ts',       label: 'sales-prepaid-service-tab.expiry-date',         width: '30%', sortable: false, expand: true},
        ],
        rows      : [],
        pagination: {
          total_pages: 1
        },
        options: {
          pagination: true,
          fixed_header: true
        }
      }
    }
  },
  methods: {
    async loadClientPrepaidServicesAsync(){
      this.preLoader()
      let response = await this.getClientPrepaidServicesAsyncMixin(this.client.fields.id, true)
      this.preLoader(false)

      if(response.is_ok){
        this.table_data.rows = response.data.items
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onChangePage(){
      this.loadClientPrepaidServicesAsync()
    },
    async onClickRow(event_data){
      this.preLoader()
      let response = await this.loadServiceAsync(event_data.row.related_service_id)
      this.preLoader(false)

      if(response.is_ok){
        this.$emit('select-prepaid-service', event_data.row, response.data)
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },
  }
}
</script>

<style lang="scss">
@import './sales-prepaid-services-brief.scss';
</style>