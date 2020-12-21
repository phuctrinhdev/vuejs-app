<template>
  <div class="radio-client-prepaid-card">
    <!-- <button class="btn default fll move-balance" @click="onClickMoveBalance()">{{ $t('sales-prepaid-card-tab.move-balance') }}</button> -->
    
    <view-table :data="table_data" class="table-client-prepaid-card" @click-rows="onClickRowClientPrepaidCard">
      <template slot="id" slot-scope="{ row }">
        <b-form-radio v-model="client_prepaid_card_id_selected" :value="row.id"/>
      </template>
      <template slot="prepaid_card_name" slot-scope="{ row }">
        {{ row.prepaid_card_name }}
        <template v-if="has_client && x_client.data.id != row.client_id">
          <br><span class="family-card">({{ row.client_name }})</span>
        </template>
      </template>
      <template slot="balance" slot-scope="{ row }">
        {{ formatMoney(row.balance, 0) }}
      </template>
    </view-table>

    <sales-move-balance-action ref="sales_move_balance_action" 
                               :is_submit_to_api="false" @added-balance-move="onAddedBalanceMoveAsync"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import { sales_options } from '../../../../../helpers/options/sales-options'
import ClientPrepaidCardViewModel from '../../../../../view-model/sales/prepaid-card/prepaid-card-view-model'
import sales_move_balance_action from '../../../../sales/sales-move-balance-action/sales-move-balance-action.vue'
import view_table from '../../../view-table/view-table'
import component_base from '../../../component-base/component-base'
import { formatMoney } from '../../../../../helpers/common'

export default {
  components: {
    'view-table': view_table,
    'sales-move-balance-action': sales_move_balance_action
  },
  extends: component_base,
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    is_exclude_prepaid_cards: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {
      sales_options,

      client_prepaid_card_selected: new ClientPrepaidCardViewModel()
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales', {
      x_sales_action_helper: 'getSalesActionHelper',
      x_sales_item_action: 'getSalesItemAction',
    }),
    ...mapGetters('refund', {
      x_refund_action: 'getRefundAction',
    }),
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    table_data() {
      let tmp_client_prepaid_cards = this.x_sales_action_helper.client_prepaid_cards.filter(c => c.balance > 0)
      tmp_client_prepaid_cards = _.orderBy(tmp_client_prepaid_cards, ['balance'], ['desc'])

      if(this.x_sales_item_action.data.goods_type == sales_options.sales_goods_type.prepaid_card){
        tmp_client_prepaid_cards = tmp_client_prepaid_cards.filter(c => {
          return c.id != this.x_sales_item_action.data.prepaid_goods_guid
        })
      }

      if(this.is_exclude_prepaid_cards && this.x_refund_action && this.x_refund_action.data && this.x_refund_action.data.refund_items){
        for(let refund_item of this.x_refund_action.data.refund_items){
          if(refund_item.goods_type == sales_options.sales_goods_type.prepaid_card){
            tmp_client_prepaid_cards = tmp_client_prepaid_cards.filter(c => c.id != refund_item.goods_id)
          }
        }
      }

      return {
        fields: [
          { field: 'id',                label: '',                            width: '5%',  sortable: false, expand: true },
          { field: 'prepaid_card_name', label: 'prepaid-cards.prepaid-cards', width: '55%', sortable: false, expand: true },
          { field: 'balance',           label: 'sales.balance',               width: '40%', sortable: false, expand: true }
        ],
        rows: tmp_client_prepaid_cards,
        pagination:{
          total_pages: 1
        },
        options: {
          // 
        }
      }
    },
    client_prepaid_card_id_selected: {
      get(){
        return this.value
      },
      set(new_value){
        this.$emit('input', new_value)
        this.$emit('input-card', _.find(this.x_sales_action_helper.client_prepaid_cards, { 'id': new_value }))
      }
    }
  },
  methods: {
    ...mapMutations('sales_prepaid_card',[
      'setSalesPrepaidCards'
    ]),
    formatMoney,

    // balance move
    onClickMoveBalance(){
      let tmp_prepaid_cards = {
        items     : this.table_data.rows
      }
      this.setSalesPrepaidCards(tmp_prepaid_cards)
      this.showDialogById('move-balance-action-modal')
    },
    onAddedBalanceMoveAsync(balance_move_vm){
      this.$refs['sales_move_balance_action'].hideModal()

      // #todo: add balance to sales
      console.log('balance_move_vm', balance_move_vm)
      // let tmp_balance_move = {
      //   from_client_prepaid_card_id : client_prepaid_card.id,
      //   move_balance                : client_prepaid_card.balance,
      //   to_client_prepaid_card_id   : 0,
      //   to_prepaid_card_guid        : tmp_sales_item.fields.prepaid_goods_guid
      // }
    },

    // deduction balance
    onClickRowClientPrepaidCard(row){
      this.client_prepaid_card_id_selected = row.row.id
    }
  }
}
</script>

<style lang="scss">
.radio-client-prepaid-card {
  .move-balance {
    float: right;
    margin-bottom: 10px;
    &:hover {
      color: $white;
    }
  }
  .table-client-prepaid-card {
    clear: both;
    .family-card {
      font-style: italic;
      color: $blue;
      font-size: 13px;
    }
  }
}
</style>