<template>
  <div class="prepaid-services-wrapper">
    <div class="show-expired">
      <div class="show-expired-pc">
        <b-form-checkbox id="client-info-checkbox-2" 
                         v-model="table_filter.show_expired"
                         @input="onChangeShowExpiredAsync(table_filter.show_expired)">
          <span class="checkbox-text">{{ $t('sales-prepaid-service-tab.show-expired') }}</span>
        </b-form-checkbox>
      </div>
      <!-- <div class="show-expired-mobile">
        <b-dropdown id="dropdown-right" text="=" no-caret 
                    right variant="white">
          <b-dropdown-item @click="onChangeShowExpiredAsync(true)">{{ $t('sales-prepaid-card-tab.show-expired') }}</b-dropdown-item>
          <b-dropdown-item @click="onChangeShowExpiredAsync(false)">{{ $t('sales-prepaid-card-tab.hide-expired') }}</b-dropdown-item>
          <b-dropdown-item href="#">{{ $t('sales-prepaid-card-tab.close') }}</b-dropdown-item>
        </b-dropdown>
      </div> -->
    </div>
    <div class="">
      <view-table :data="table_data" @change-page="onChangePage">
        <!-- MOBILE -->
        <template slot="mobile" slot-scope="{row}">
          <div class="service-name-title"><p>{{ row.prepaid_service_name }}</p></div>
          <!-- <div><p>(Anyang BeomGye)</p></div> -->
          <div class="row">
            <p class="col-6">{{ $t('sales-prepaid-service-tab.remaining-quantity') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitNumber(row.quantity,0) }}</p>
          </div>
          <div class="row">
            <p class="col-6">{{ $t('sales-prepaid-service-tab.expiry-date') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}</p>
          </div>
          
          <div v-if="row.expand" class="row">
            <p class="col-6">{{ $t('sales-prepaid-service-tab.initial-quantity') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitNumber(row.initial_quantity,0) }}</p>
          </div>
          <div v-if="row.expand" class="row">
            <p class="col-6">{{ $t('sales-prepaid-service-tab.issue-date') }}</p>
            <p class="col-6">{{ sales_utils.formatNoLimitDateTs(row.invoice_date_time_ts) }}</p>
          </div>
          <div v-if="row.expand" class="row">
            <div class="col-12">
              <div class="group-button">
                <!-- <a class="btn" @click="onActionDeductPrepaidService(common_options.form_actions.edit,row)">{{ $t('general.deduct') }}</a> -->
                <a class="btn" @click="onActionEditPrepaidService(common_options.form_actions.edit,row)">{{ $t('general.edit') }}</a>
              </div>
            </div>
          </div>
          <div :class="{ expand: row.expand }" class="show-more-text" @click="row.expand = !row.expand">></div>
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
        <template slot="remaining_quantity" slot-scope="{row}">
          {{ sales_utils.formatNoLimitNumber(row.quantity,0) }}
        </template>
        <template slot="expiry_date_ts" slot-scope="{row}">
          {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}
        </template>
        <template slot="initial_quantity" slot-scope="{row}">
          {{ sales_utils.formatNoLimitNumber(row.initial_quantity,0) }}
        </template>
        <template slot="issue_date_ts" slot-scope="{row}">
          {{ sales_utils.formatNoLimitDateTs(row.invoice_date_time_ts) }}
        </template>
        <!-- <template slot="deduct" slot-scope="{row}">
          <a class="btn" @click="onActionDeductPrepaidService(common_options.form_actions.edit,row)">{{ $t('general.deduct') }}</a>
        </template> -->
        <template slot="edit" slot-scope="{row}">
          <a v-if="isDataOfCurrentShop(row)" class="btn" @click="onActionEditPrepaidService(common_options.form_actions.edit,row)">
            {{ $t('general.edit') }}
          </a>
        </template>
        
      </view-table>
    </div>
    
    <template v-if="is_load">
      <prepaid-services-action @reload-page="onReloadPage()"/>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import componentBase                from '../../common/component-base/component-base'
import { options }                  from '../../../helpers/options'
import {common_options}             from '../../../helpers/options/common-options'
import view_table                   from '../../../components/common/view-table/view-table'
import PrepaidServicesAPI           from '../../../api/sales/prepaid-services-api' 
import prepaid_services_action      from '../prepaid-services-action/prepaid-services-action.vue'
import SalesUtils                   from '../../../helpers/utils/sales-utils'

export default {
  components:{
    'view-table'             : view_table,
    'prepaid-services-action': prepaid_services_action,
  },
  extends: componentBase,
  data(){
    return{
      options,
      common_options,
      sales_utils : SalesUtils,
      prepaid_services_api : new PrepaidServicesAPI(),
      is_load : true,

      table_custom_fields: [
        { field : 'branch_number',           label :'sales-prepaid-service-tab.loc',                     width: '5%',    sortable: false, expand: true},
      ],
      
      table_data:{
        fields:[
          {field :'mobile',                  label : '',                                                 width: 'auto',  sortable: false, thClass: 'mobile', expand: true, tdClass : 'mobile', column_expand : true},
          {field :'prepaid_service_name',    label :'sales-prepaid-service-tab.prepaid-service-name',    width: '35%',   sortable: false},
          {field :'remaining_quantity',      label :'sales-prepaid-service-tab.remaining-quantity',      width: '10%',   sortable: false, expand: true},
          {field :'expiry_date_ts',          label :'sales-prepaid-service-tab.expiry-date',             width: '10%',   sortable: false, expand: true},
          {field :'initial_quantity',        label :'sales-prepaid-service-tab.initial-quantity',        width: '10%',   sortable: false, expand: true},
          {field :'issue_date_ts',           label :'sales-prepaid-service-tab.issue-date',              width: '10%',   sortable: false, expand: true},
          // {field :'deduct',                  label :'sales-prepaid-service-tab.deduct',                  width: '10%',   sortable: false, expand: true},
          {field :'edit',                    label :'sales-prepaid-service-tab.edit',                    width: '10%',   sortable: false, expand: true},
        ],
        rows       : [],
        pagination : {
          total_pages: 1
        },
        options : {
          pagination: true
        }
      },
      table_filter : {
        client_id             : 0,
        show_expired          : false,
        include_family_service: false,
        page_size             : common_options.pagination.default,
        page_number           : 1,
        shop_id               : 0
      }
    }
  },
  computed:{
    ...mapGetters('sales_prepaid_services',{
      x_prepaid_services        : 'getPrepaidServices',
      x_prepaid_services_action : 'getPrepaidServicesAction',
    }),
    ...mapGetters('client',{
      x_client_information : 'getClientInformation'
    }),
    no_limit(){
      return this.$i18n.t('sales-prepaid-service-tab.no-limit')
    }
  },
  async created(){
    this.table_filter.shop_id   = this.shop_data.shop_id
    this.table_filter.client_id = this.x_client_information.data.id

    if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client){
      this.table_data.fields = [...this.table_custom_fields, ...this.table_data.fields]
    }

    await this.loadDataTableAsync()
  },
  methods:{
    ...mapMutations('sales_prepaid_services',[
      'setPrepaidServices',
      'setPrepaidServicesAction',
      'setPrepaidServicesFilter'
    ]),
    ...mapActions('sales_prepaid_services',[
      'loadSalesPrepaidServicesAsyncData'
    ]),

    async loadDataTableAsync(){
      this.setPrepaidServicesFilter(this.table_filter)

      this.preLoader()
      let response = await this.loadSalesPrepaidServicesAsyncData(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.setTableData()

        for(let row of this.table_data.rows){
          if(!this.sales_utils.isExpiredCard(row.expiry_date_ts) && (row.quantity == -1 || row.quantity > 0)){
            row.status = options.good_status.active
          }
          else {
            row.status = options.good_status.inactive
          }
        }
      }
      else this.showAlertDialog(response.error_messages)
    },
    setTableData(){
      this.table_data.rows       = this.x_prepaid_services.items
      this.table_data.pagination = this.x_prepaid_services.pagination
    },
    async onChangeShowExpiredAsync(show_expired){
      this.table_filter.show_expired = show_expired
      this.table_filter.page_number  = 1
      await this.loadDataTableAsync()
    },
    async onChangePage(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },
    async onReloadPage(){
      await this.loadDataTableAsync()
    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },

    onActionDeductPrepaidService(action , prepaid_services){
      this.setPrepaidServicesAction({
        action : action,
        data   : prepaid_services 
      })   
      this.showDialogById('sales-action-modal')
    },

    onActionEditPrepaidService(action , prepaid_services){
      this.is_load = true
      this.setPrepaidServicesAction({
        action : action,
        data   : prepaid_services 
      })
      this.$nextTick(() => {
        this.showDialogById('prepaid-services-action-modal')
      })
    }
  }
}
</script>

<style lang="scss">
@import './sales-prepaid-services.scss';
</style>