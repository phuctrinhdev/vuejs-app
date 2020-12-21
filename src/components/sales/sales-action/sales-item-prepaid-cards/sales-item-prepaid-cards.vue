<template>
  <div class="sales-item-prepaid-cards">
    <div class="row">
      <div class="col-12 col-md-5 col-xl-6 prepaid-cards">
        <div class="title">{{ $t('sales.prepaid-card-list') }}</div>
        <div v-if="prepaid_cards.length > 0" class="have-cards">
          <ul class="row">
            <li v-for="(prepaid_card, i) in prepaid_cards" :key="i" 
                :class="{ active: prepaid_card.selected }" class="col-sm-6 col-md-12 col-xl-6"
                @click="onSelectPrepaidCard(prepaid_card)">
              <a>{{ prepaid_card.name }}</a>
            </li>
          </ul>
        </div>
        <div v-else class="no-cards">{{ $t('sales.please-select-prepaid-card-to-sell') }}</div>
      </div>
      <div v-if="prepaid_cards.length > 0" class="col-12 col-md-7 col-xl-6 prepaid-card-selected">
        <div class="title">{{ $t('sales.prepaid-card-information') }}</div>
        <div class="card-wrapper">
          <div class="card-detail form-wrapper">
            <div class="card-name">{{ prepaid_card.fields.name }}</div>
            
            <radio-gift-card-type v-if="is_view_radio_gift_card_type" 
                                  ref="radio_gift_card_type" 
                                  v-model="gift_card_type" 
                                  :prepaid_card_type="sales_options.sales_goods_type.prepaid_card" 
                                  @input="onInputGiftCardType"/>
            
            <div class="card-form">
              <div v-if="gift_card_type != sales_options.gift_card_type.redeem" class="form-group sales-price">
                <label>{{ $t('prepaid-cards.sales-price') }}</label>
                <input-money v-model="prepaid_card.fields.price" @input="onInputPrice"/>
              </div>
              <div v-if="gift_card_type != sales_options.gift_card_type.sales && prepaid_card.fields.prepaid_card_type != options.prepaid_card_type.discount_card" 
                   class="form-group initial-balance">
                <label>{{ $t('prepaid-cards.initial-balance') }}</label>
                <input-money v-model="prepaid_card.fields.charge_amount" @input="onInputChargeAmount"/>
              </div>
              <div v-if="gift_card_type != sales_options.gift_card_type.sales" class="form-group validity">
                <label>{{ $t('prepaid-cards.validity') }}</label>
                <div class="validity-value">
                  <input-money v-model="prepaid_card.fields.validity" :disabled="is_validity_no_limit" @input="onInputValidity"/>
                  <radio-group v-model="prepaid_card.fields.validity_type" :options="options.option_validity_type" 
                               :disabled="is_validity_no_limit" :buttons="true"
                               @input="onInputValidityType"/>
                </div>
                <b-form-checkbox v-model="is_validity_no_limit" checked @change="onCheckValidityNoLimit">
                  {{ $t('prepaid-cards.no-limit') }}
                </b-form-checkbox>
              </div>
            </div>
          </div>

          <div v-if="is_view_table_cards" class="client-prepaid-cards-wrapper">
            <div class="intro" v-html="client_prepaid_card_merge_balance"/>
            <div class="client-prepaid-cards">
              <view-table :data="table_data">
                <template slot="is_select" slot-scope="{ row }">
                  <b-form-checkbox v-model="row.is_selected" :value="true" @input="onSelectClientPrepaidCard(row)"/>
                </template>
                <template slot="prepaid_card_name" slot-scope="{ row }">
                  {{ row.prepaid_card_name }}
                  <!-- #todo: can not merge family's card -->
                  <template v-if="has_client && x_client.data.id != row.client_id">
                    <br><span class="family-card">({{ row.client_name }})</span>
                  </template>
                </template>
                <template slot="balance" slot-scope="{ row }">
                  {{ formatMoney(row.balance, 0) }}
                </template>
                <template slot="expiry_date_ts" slot-scope="{ row }">
                  {{ sales_ultils.formatNoLimitDateTs(row.expiry_date_ts) }}
                </template>
              </view-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { options } from '../../../../helpers/options'
import { sales_options } from '../../../../helpers/options/sales-options'
import prepaid_card_mixin from '../../../../helpers/mixins/prepaid-card-mixin'
import PrepaidCardViewModel from '../../../../view-model/goods/prepaid-card-view-model'

import radio_gift_card_type from '../../../common/form/radio/radio-gift-card-type/radio-gift-card-type.vue'
import input_money from '../../../common/form/input/input-money/input-money'
import radio_group from '../../../common/form/radio/radio-group/radio-group'
import component_base from '../../../common/component-base/component-base'
import view_table from '../../../common/view-table/view-table'
import SalesUtils from '../../../../helpers/utils/sales-utils'
import { formatMoney, 
  convertTimeStampToDate
} from '../../../../helpers/common'

let _tmp_prepaid_card_selected = new PrepaidCardViewModel()

export default {
  components: {
    'radio-gift-card-type': radio_gift_card_type,
    'input-money': input_money,
    'radio-group': radio_group,
    'view-table': view_table
  },
  extends: component_base,
  mixins: [prepaid_card_mixin],
  data() {
    return {
      options,
      sales_options,
      sales_ultils: SalesUtils,

      prepaid_cards: [],
      prepaid_card: new PrepaidCardViewModel(),
      prepaid_cards_merged: [],

      gift_card_type: sales_options.gift_card_type.none,
      is_validity_no_limit: false,

      errors: [],
    }
  },
  computed:{
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales', {
      x_sales_action_helper: 'getSalesActionHelper'
    }),
    client_prepaid_card_merge_balance(){return this.$i18n.t('sales.client-prepaid-card-merge-balance')},
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    is_view_radio_gift_card_type(){
      return this.prepaid_card.fields.id != 0 && this.prepaid_card.fields.id != sales_options.max_value_goods_id
    },
    is_view_table_cards(){
      return this.prepaid_card.fields.prepaid_card_type == options.prepaid_card_type.deposit_card 
             && this.gift_card_type != sales_options.gift_card_type.sales
             && this.table_data.rows.length > 0
    },
    table_data() {
      let tmp_rows = []
      let client_prepaid_cards = this.x_sales_action_helper.client_prepaid_cards.filter(c => c.client_id == this.x_client.data.id)
      for(let client_prepaid_card of client_prepaid_cards){
        let client_prepaid_cards_used = _.find(this.x_sales_action_helper.balance_moves, { 'from_client_prepaid_card_id': client_prepaid_card.id })
        if(client_prepaid_cards_used == undefined && client_prepaid_card.balance != 0)
          tmp_rows.push(client_prepaid_card)
      }
      
      return {
        fields: [
          { field: 'is_select',         label: '',                                   width: '10%', sortable: false, expand: true },
          { field: 'prepaid_card_name', label: 'sales-prepaid-card-tab.card-name',   width: '40%', sortable: false, expand: true },
          { field: 'balance',           label: 'sales-prepaid-card-tab.balance',     width: '20%', sortable: false, expand: true },
          { field: 'expiry_date_ts',    label: 'sales-prepaid-card-tab.expiry-date', width: '30%', sortable: false, expand: true }
        ],
        rows: tmp_rows,
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        }
      }
    },
  },
  async created(){
    await this.loadPrepaidCardsAsync()
  },
  methods: {
    formatMoney,
    convertTimeStampToDate,

    async loadPrepaidCardsAsync(){
      this.preLoader()
      let result = await this.getPrepaidCardsAsyncMixin()
      this.preLoader(false)

      if(result.is_ok){
        let tmp_prepaid_cards = []
        let tmp_customized_card = new PrepaidCardViewModel().getFields()
        tmp_customized_card.id   = sales_options.max_value_goods_id
        tmp_customized_card.name = 'Customized Card'
        
        tmp_prepaid_cards = [...result.data.items]
        if(this.canUseCustomizedPrepaidGoods()){
          tmp_prepaid_cards.unshift(tmp_customized_card)
        }
        
        for(let i in tmp_prepaid_cards){
          tmp_prepaid_cards[i].selected = false
        }
        this.prepaid_cards = tmp_prepaid_cards
        this.onSelectPrepaidCard(tmp_prepaid_cards[0])
      } else {
        this.showAlert(result.error_messages)
      }
    },
    onSelectPrepaidCard(prepaid_card_selected){
      this.updateUIForListPrepaidCard(prepaid_card_selected)
      this.setPrepaidCardToForm(prepaid_card_selected)
      this.checkClientPrepaidCardsToMergeBalance()

      if(!this.is_view_radio_gift_card_type){
        this.gift_card_type = sales_options.gift_card_type.none
      }
      else {
        this.$nextTick(() => {
          this.gift_card_type = sales_options.gift_card_type.none
          if(this.$refs.radio_gift_card_type)
            this.$refs.radio_gift_card_type.is_gift_card = false
        })
      }
    },
    updateUIForListPrepaidCard(prepaid_card_selected){
      for(let prepaid_card of this.prepaid_cards){
        if(prepaid_card.id == prepaid_card_selected.id)
          prepaid_card.selected = true
        else
          prepaid_card.selected = false
      }
      this.$forceUpdate()
    },
    setPrepaidCardToForm(prepaid_card_selected){
      _tmp_prepaid_card_selected.setFields(prepaid_card_selected)
      this.prepaid_card.setFields(prepaid_card_selected)

      if(this.prepaid_card.fields.validity == -1) 
        this.is_validity_no_limit = true
      else
        this.is_validity_no_limit = false
      this.onEmitPrepaidCardSelected()
    },

    // card detail ui
    onInputGiftCardType(gift_card_type){
      this.gift_card_type = gift_card_type

      if(gift_card_type == sales_options.gift_card_type.redeem){
        this.prepaid_card.fields.price = 0
      } else {
        this.prepaid_card.fields.price = _tmp_prepaid_card_selected.fields.price
      }
      this.onEmitPrepaidCardSelected()
    },
    onInputPrice(){
      this.onEmitPrepaidCardSelected()
    },
    onInputChargeAmount(){
      this.onEmitPrepaidCardSelected()
    },
    onInputValidity() {
      this.onEmitPrepaidCardSelected()
    },
    onInputValidityType(){
      this.onEmitPrepaidCardSelected()
    },
    onCheckValidityNoLimit(){
      this.is_validity_no_limit = !this.is_validity_no_limit
      if(this.is_validity_no_limit){
        this.prepaid_card.fields.validity = -1
      }
      this.onEmitPrepaidCardSelected()
    },

    // client prepaid cards merged ui
    checkClientPrepaidCardsToMergeBalance(){
      if(this.is_view_table_cards){
        for(let row of this.table_data.rows){
          if(this.prepaid_card.fields.id == row.prepaid_card_id){
            row.is_selected = true
          } else {
            row.is_selected = false
          }
        }
      }
      else {
        this.table_data.rows.map(r => r.is_selected = false)
      }
      this.onEmitPrepaidCardSelected()
    },
    onSelectClientPrepaidCard(row_selected){
      for(let row of this.table_data.rows){
        if(row.id == row_selected.id){
          row.is_selected = row_selected.is_selected
        }
      }
      this.onEmitPrepaidCardSelected()
    },

    // handle event
    onEmitPrepaidCardSelected(){
      if(this.prepaid_card.fields.prepaid_card_type == options.prepaid_card_type.discount_card){
        this.prepaid_card.fields.charge_amount = 0
      }
      this.prepaid_cards_merged = []
      if(this.is_view_table_cards){
        this.prepaid_cards_merged = this.table_data.rows.filter(r => r.is_selected)
      }

      // if(this.prepaid_card.fields.id > 0){
      //   this.$emit('selected-prepaid-card', this.prepaid_card.fields, this.gift_card_type, this.prepaid_cards_merged)
      // }
    },
    isSingleShop(){
      return this.shop_data.chain_id == null || this.shop_data.chain_id == 0
    },
    canUseCustomizedPrepaidGoods(){
      return this.isSingleShop() || this.shop_data.chain_sharing_settings.allow_shop_service
    }
  }
}
</script>

<style lang='scss'>
@import './sales-item-prepaid-cards.scss';
</style>