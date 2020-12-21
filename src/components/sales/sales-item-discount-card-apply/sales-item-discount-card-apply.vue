<template>
  <b-modal id="sales-item-discount-card-apply-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="sales-item-discount-card-apply-modal"
           @show="onLoadForm">
    <div class="discout-cards-wrapper">
      <div class="intro">{{ form_intro }}</div>
      <view-table :data="table_data">
        <template slot="prepaid_card_name_col" slot-scope="{ column }">
          {{ $t(column.label) }}<br>
          ({{ $t('sales.balance') }}, {{ $t('sales-prepaid-card-tab.expiry-date') }})
        </template>
        <template slot="prepaid_card_name" slot-scope="{ row }">
          {{ row.prepaid_card_name }}<br>
          ({{ row.balance }}, {{ formatExpiryDate(row.expiry_date_ts) }})
          <template v-if="has_client && x_client.data.id != row.client_id">
            <br><span class="family-card">({{ row.client_name }})</span>
          </template>
        </template>
        <template slot="is_selected" slot-scope="{ row }">
          <div class="btn" @click="onConfirm(row)">
            <template v-if="sales_item_goods_type == sales_options.sales_goods_type.service">{{ row.discount_for_service }}%</template>
            <template v-if="sales_item_goods_type == sales_options.sales_goods_type.product">{{ row.discount_for_product }}%</template>
          </div>
        </template>
      </view-table>

      <footer class="modal-footer">
        <div class="btn-action-group">
          <button class="btn btn-secondary" @click="onCancel">{{ $t('general.close') }}</button>
        </div>
      </footer>
    </div>
  </b-modal>
</template>


<script>

import moment from 'moment'
import { mapGetters } from 'vuex'
import { options }               from '../../../helpers/options'
import { sales_options }         from '../../../helpers/options/sales-options'
import SalesUtils from '../../../helpers/utils/sales-utils'
import SalesCache               from '../../../helpers/cache/sales-cache'
import component_base            from '../../common/component-base/component-base'
import view_table from '../../common/view-table/view-table'
// import { convertTimeStampToDate } from '../../../helpers/common'
// import { formatMoney }           from '../../../../../helpers/common'

export default {
  components: {
    'view-table': view_table
  },
  extends: component_base,
  data(){
    return {
      sales_options,

      sales_cache: new SalesCache(),
      sales_setup: {},

      form_options: {
        confirm: false,
        delete: false
      },

      sales_type_selected: {},
      sales_type_default: {
        id: 0,
        name: ''
      },

      sales_item_goods_type: sales_options.sales_goods_type.service
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales', {
      x_sales_action: 'getSalesAction',
      x_sales_item_action: 'getSalesItemAction',
      x_sales_action_helper: 'getSalesActionHelper',
    }),
    form_title(){return this.$i18n.t('sales.prepaid-card-discount')},
    form_intro(){return this.$i18n.t('sales.please-select-discount-card')},
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    table_data() {
      let tmp_discount_cards_to_apply = SalesUtils.getDiscountCardsToApply(this.sales_item_goods_type)

      return {
        fields: [
          { field: 'prepaid_card_name', label: 'prepaid-cards.prepaid-card-name',   width: '70%', sortable: false, expand: true, thClass: 'name', column_expand: true },
          { field: 'is_selected',       label: 'sales.discount-rate',               width: '30%', sortable: false, expand: true, thClass: 'rate', }
        ],
        rows: tmp_discount_cards_to_apply,
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        }
      }
    },
  },
  methods: {
    hideModal(){
      this.hideDialogById('sales-item-discount-card-apply-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.sales_item_goods_type = this.x_sales_action.options.sales_goods_type
    },
    onConfirm(discount_card){
      this.$emit('selected-discount-card', discount_card)
      this.hideModal()
    },
    formatExpiryDate(date_ts){
      let tmp_date = moment(date_ts * 1000).format(options.standard_date_format.ymd)
      if(date_ts == -1)
        tmp_date = 'No Limit'
      return tmp_date
    }
  }
}
</script>

<style lang="scss">
@import './sales-item-discount-card-apply.scss';
</style>