<template>
  <div class="sales-prepaid-card-wrapper">
    <div class="show-expired">
      <div class="show-expired-pc">
        <div class="left">
          <b-form-checkbox v-model="table_filter.include_expired_card" @input="onChangeShowExpiredAsync(table_filter.include_expired_card)">
            <span class="checkbox-text">{{ $t('sales-prepaid-card-tab.show-expired') }}</span>
          </b-form-checkbox>
        </div>
        <div class="right">
          <button class="btn default fll move-balance" @click="onClickMoveBalance()">{{ $t('sales-prepaid-card-tab.move-balance') }}</button>
        </div>
      </div>
      <!-- <div class="show-expired-mobile">
        <b-dropdown id="dropdown-right" text="="
                    no-caret right variant="white">
          <b-dropdown-item @click="onChangeShowExpiredAsync(true)">{{ $t('sales-prepaid-card-tab.show-expired') }}</b-dropdown-item>
          <b-dropdown-item @click="onChangeShowExpiredAsync(false)">{{ $t('sales-prepaid-card-tab.hide-expired') }}</b-dropdown-item>
          <b-dropdown-item href="#">{{ $t('sales-prepaid-card-tab.close') }}</b-dropdown-item>
        </b-dropdown>
      </div> -->
    </div>
    <div class="cl-info-inner">
      <view-table :data="table_data" @change-page="onChangePage">
        <!-- MOBILE -->
        <template slot="mobile" slot-scope="{row}">
          <div class="card-name">
            <span>{{ row.prepaid_card_name }}</span>
          </div>
          <div class="row">
            <p class="col-6">{{ $t('sales-prepaid-card-tab.balance') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitNumber(row.balance,0) }}</p>
          </div>
          <div class="row">
            <p class="col-6">{{ $t('sales-prepaid-card-tab.expiry-date') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}</p>
          </div>
          <div v-if="row.expand" class="row">
            <p class="col-6">{{ $t('sales-prepaid-card-tab.initial-balance') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitNumber(row.initial_balance,0) }} </p>
          </div>
          <div v-if="row.expand" class="row">
            <p class="col-6">{{ $t('sales-prepaid-card-tab.issue-date') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitDateTs(row.invoice_date_time_ts) }}</p>
          </div>
          <div v-if="row.expand" class="row">
            <div class="col-12">
              <div class="group-button">
                <a class="btn" @click="onActionPrepaidCard(common_options.form_actions.edit, row)">{{ $t('general.edit') }}</a>
              </div>
            </div>
          </div>
          <div :class="{expand : row.expand}" class="show-more-text" @click="row.expand = !row.expand">></div>
        </template>

        <!-- PC -->
        <template slot="branch_number" slot-scope="{row}">
          <div :id="'tooltip-branch-number' + row.id">
            {{ row.branch_number }}
          </div>
          <b-tooltip :target="'tooltip-branch-number' + row.id" placement="bottom">
            {{ row.shop_name }}
          </b-tooltip>
        </template>
        <template slot="balance" slot-scope="{row}">
          {{ sales_utils.formatNoLimitNumber(row.balance,0) }}
        </template>
        <template slot="expiry_date" slot-scope="{row}">
          {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}
        </template>
        <template slot="initial_balance" slot-scope="{row}">
          {{ sales_utils.formatNoLimitNumber(row.initial_balance,0) }}
        </template>
        <template slot="issue_date" slot-scope="{row}">
          {{ sales_utils.formatNoLimitDateTs(row.invoice_date_time_ts) }}
        </template>
        <template slot="edit" slot-scope="{row}">
          <a v-if="isDataOfCurrentShop(row)" class="btn" @click="onActionPrepaidCard(common_options.form_actions.edit, row)">
            {{ $t('general.edit') }}
          </a>
        </template>
      </view-table>
    </div>
    
    <sales-prepaid-card-action @edited-prepaid-card="onEditedPrepaidCard"/>
    <sales-move-balance-action @added-move-balance="onAddedMoveBalance"/>
  </div>
</template>

<script>
const PAGE_NUMBER_DEFAULT = 1
import { mapActions, mapGetters, mapMutations } from 'vuex'
import component_base             from '../../common/component-base/component-base'
import sales_prepaid_card_action  from '../sales-prepaid-card-action/sales-prepaid-card-action.vue'
import sales_move_balance_action  from '../sales-move-balance-action/sales-move-balance-action.vue'
import view_table                 from '../../../components/common/view-table/view-table'
import PrepaidCardsAPI            from '../../../api/sales/prepaid-cards-api'
import { options }                from '../../../helpers/options'
import { common_options }         from '../../../helpers/options/common-options'
import { sales_options }          from '../../../helpers/options/sales-options'
import SalesUtils                 from '../../../helpers/utils/sales-utils'

// import { convertDateToTimeStamp } from '../../../helpers/common'

export default {
  components:{
    'view-table': view_table,
    'sales-prepaid-card-action': sales_prepaid_card_action,
    'sales-move-balance-action': sales_move_balance_action,

  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,
      sales_utils : SalesUtils,
      prepaid_cards_api : new PrepaidCardsAPI(),
      
      table_custom_fields: [
        { field:  'branch_number',     label: 'sales-prepaid-card-tab.loc',              width: '10%',   sortable: false, expand: true },
      ],

      table_data:{
        fields : [
          {field: 'mobile',            label: '',                                        width: 'auto',  sortable: false, expand: true, tdClass : 'mobile', thClass : 'mobile', column_expand : true},
          {field: 'prepaid_card_name', label: 'sales-prepaid-card-tab.card-name',        width: '30%',   sortable: false },
          {field: 'balance',           label: 'sales-prepaid-card-tab.balance',          width: '10%',   sortable: false, expand: true},
          {field: 'expiry_date',       label: 'sales-prepaid-card-tab.expiry-date',      width: '15%',   sortable: false, expand: true},
          {field: 'initial_balance',   label: 'sales-prepaid-card-tab.initial-balance',  width: '15%',   sortable: false, expand: true},
          {field: 'issue_date',        label: 'sales-prepaid-card-tab.issue-date',       width: '10%',   sortable: false, expand: true},
          {field: 'edit',              label: 'sales-prepaid-card-tab.edit',             width: '10%',   sortable: false, expand: true}
        ],
        rows       : [],
        pagination : {
          total_pages: 1
        },
        options : {
          pagination: true
        }
      },
      table_filter: {
        client_id            : 0,
        include_expired_card : false,
        include_family_card  : false,
        prepaid_card_type    : sales_options.prepaid_card_type.all,
        page_size            : common_options.pagination.default,
        page_number          : PAGE_NUMBER_DEFAULT,
        shop_id              : 0
      }
    }
  },
  computed:{
    ...mapGetters('sales_prepaid_card',{
      x_prepaid_cards : 'getSalesPrepaidCards'
    }),
    ...mapGetters('client', {
      x_client_information: 'getClientInformation',
    }),
    no_limit(){
      return this.$i18n.t('sales-prepaid-card-tab.no-limit')
    }
  },
  async created(){
    this.table_filter.client_id = this.x_client_information.data.id
    this.table_filter.shop_id   = this.shop_data.shop_id

    if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client){
      this.table_data.fields = [...this.table_custom_fields, ...this.table_data.fields]
    }
    
    await this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
  },
  methods:{
    ...mapActions('sales_prepaid_card', [
      'setSalesPrepaidCardActionData',
      'loadSalesPrepaidCardsAsyncData'
    ]),
    ...mapMutations('sales_prepaid_card',[
      'setSalesPrepaidCardsFilter'
    ]),
    ...mapActions('client', [
      'getClientInformationDataAsync'
    ]),

    async loadDataTableAsync(page_number = PAGE_NUMBER_DEFAULT){
      this.table_filter.page_number = page_number
      this.setSalesPrepaidCardsFilter(this.table_filter)
      
      this.preLoader()
      let response = await this.loadSalesPrepaidCardsAsyncData(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.table_data.rows       = this.x_prepaid_cards.items
        this.table_data.pagination = this.x_prepaid_cards.pagination
        
        for(let row of this.table_data.rows){
          if(row.prepaid_card_type == options.prepaid_card_type.deposit_card){
            if(!this.sales_utils.isExpiredCard(row.expiry_date_ts) && row.balance > 0){
              row.status = options.good_status.active
            }
            else {
              row.status = options.good_status.inactive
            }
          }
          if(row.prepaid_card_type == options.prepaid_card_type.discount_card){
            if(!this.sales_utils.isExpiredCard(row.expiry_date_ts)){
              row.status = options.good_status.active
            }
            else {
              row.status = options.good_status.inactive
            }
          }
        }
      }
      else this.showAlertDialog(response.error_messages)
    },
    async onChangeShowExpiredAsync(include_expired_card){
      this.table_filter.include_expired_card = include_expired_card
      await this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
    },
    async onChangePage(page_number){
      this.table_filter.page_number = page_number
      await this.loadDataTableAsync(page_number)
    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },

    // prepaid card
    onActionPrepaidCard(action, prepaid_card){
      this.prepaid_card_action = {action: action,data : prepaid_card}
      this.setSalesPrepaidCardActionData(this.prepaid_card_action)
      this.showDialogById('sales-prepaid-card-action-modal')
    },
    async onEditedPrepaidCard(){
      await this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
      await this.getClientInformationDataAsync({shop_id  : this.shop_data.shop_id,
        client_id: this.table_filter.client_id})
    },

    // balance move
    onClickMoveBalance(){
      this.showDialogById('move-balance-action-modal')
    },
    onAddedMoveBalance(){
      this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
    }
  }
}
</script>

<style lang="scss">
@import './sales-prepaid-cards.scss';
</style>
