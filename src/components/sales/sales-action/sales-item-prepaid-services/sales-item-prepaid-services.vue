<template>
  <div class="sales-item-prepaid-services">
    <b-tabs v-model="tab_index" content-class="mt-3">

      <b-tab :title="$t('sales.deduct-prepaid-service')" active class="deduct-prepaid-services" 
             @click="onClickDeductPrepaidServicesTab">
        <view-table :data="table_prepaid_services" @click-rows="onSelectDeductPrepaidService">
          <template slot="prepaid_service_name" slot-scope="{row}">
            {{ row.prepaid_service_name }}
            <template v-if="has_client && x_client.data.id != row.client_id">
              <br><span class="family-card">({{ row.client_name }})</span>
            </template>
          </template>
          <template slot="remaining_quantity" slot-scope="{row}">
            {{ sales_utils.formatNoLimitNumber(row.quantity,0) }}
          </template>
          <template slot="expiry_date_ts" slot-scope="{row}">
            {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}
          </template>
        </view-table>
      </b-tab>

      <b-tab :title="$t('sales.sale-prepaid-service')" class="sale-prepaid-services" @click="onClickSalePrepaidServicesTab">
        <div class="row">
          <div class="col-lg-6 service-categorys-wrapper">
            <div class="title">{{ $t('services.category') }}</div>
            <div class="service-categorys">
              <ul class="row">
                <li v-for="(service_category, i) in service_categorys" :key="i" 
                    :class="{ active: service_category.selected }" class="col-sm-6">
                  <a @click="onSelectServiceCategory(service_category)">{{ service_category.name }}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-lg-6 prepaid-services-wrapper">
            <div class="title">{{ $t('services.prepaid-services') }}</div>
            <div class="prepaid-services">
              <ul v-if="service_category_selected" class="row">
                <li v-for="(prepaid_service, i) in service_category_selected.prepaid_services" :key="i" 
                    :class="{ active: prepaid_service.selected }" class="col-sm-6">
                  <a @click="onSelectPrepaidService(prepaid_service)">{{ prepaid_service.name }}</a>
                </li>
              </ul>

              <div :class="{ 'show': show_load_more }" class="load-more">
                <button class="btn" @click="onLoadMorePrepaidServices">{{ $t('general.load-more') }}</button>
              </div>
            </div>
          </div>
        </div>
      </b-tab>

      <b-tab v-if="canUseCustomizedPrepaidGoods()"
             :title="$t('sales.customize-prepaid-service')" class="customize-prepaid-services" @click="onClickCustomizePrepaidServicesTab">
        <div>
          <select-service-panel ref="select_service_panel" 
                                @get-selected-services="onGetSelectedServicesToCustomize"/>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { options } from '../../../../helpers/options'
import { sales_options } from '../../../../helpers/options/sales-options'
import SalesUtils        from '../../../../helpers/utils/sales-utils'

import service_mixin from '../../../../helpers/mixins/service-mixin'
import view_table from '../../../common/view-table/view-table'
import component_base from '../../../common/component-base/component-base'
import select_service_panel from '../../../common/select-services-panel/select-services-panel.vue'

// import { formatMoney } from '../../../../helpers/common'

export default {
  components: {
    'view-table': view_table,
    'select-service-panel': select_service_panel,
  },
  extends: component_base,
  mixins: [service_mixin],
  data() {
    return {
      options,
      sales_options,
      sales_utils: SalesUtils,

      tab_index: 0,

      // sale prepaid services
      service_categorys: [],
      sale_prepaid_services_pagination: {},
      show_load_more: false,

      errors: [],
    }
  },
  computed:{
    ...mapGetters('client',{
      x_client : 'getClientInformation'
    }),
    ...mapGetters('sales', {
      // x_sales_action: 'getSalesAction',
      x_sales_action_helper: 'getSalesActionHelper'
    }),
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },

    // deduct prepaid service
    table_prepaid_services() {
      let tmp_client_prepaid_services = _.filter(this.x_sales_action_helper.client_prepaid_services_all, ps => ps.quantity == -1 || ps.quantity > 0)

      return {
        fields: [
          {field :'prepaid_service_name',    label :'sales-prepaid-service-tab.prepaid-service-name',    width: '45%',   sortable: false, expand: true, tdClass: 'prepaid-service-name'},
          {field :'remaining_quantity',      label :'sales-prepaid-service-tab.remaining-quantity',      width: '20%',   sortable: false, expand: true},
          {field :'expiry_date_ts',          label :'sales-prepaid-service-tab.expiry-date',             width: '35%',   sortable: false, expand: true},
        ],
        rows: tmp_client_prepaid_services,
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: false
        }
      }
    },

    service_category_selected(){
      return _.find(this.service_categorys, { 'selected': true })
    },
  },
  methods: {
    // shared ui
    emitEventChangePrepaidServiceTab(sales_goods_type){
      this.$emit('change-prepaid-services-tab', sales_goods_type)
    },

    // deduct prepaid services
    onClickDeductPrepaidServicesTab(){
      this.emitEventChangePrepaidServiceTab(sales_options.sales_goods_type.deduct_prepaid_service)
    },
    onSelectDeductPrepaidService(deduct_prepaid_service){
      let tmp_deduct_prepaid_service = deduct_prepaid_service.row
      this.$emit('selected-deduct-prepaid-service', _.cloneDeep(tmp_deduct_prepaid_service))
    },

    // sale prepaid services
    async onClickSalePrepaidServicesTab(){
      await this.loadPrepaidServicePanel()
      this.emitEventChangePrepaidServiceTab(sales_options.sales_goods_type.sale_prepaid_service)
    },
    async loadPrepaidServicePanel(){
      await this.loadServiceCategorys()

      if(this.service_categorys.length > 0){
        await this.loadPrepaidServices(this.service_categorys[0].id, 1)
      }
    },
    async loadServiceCategorys(){
      let result_categorys = await this.loadServiceCategorysAsync()
      if(result_categorys.is_ok) {
        let tmp_service_categorys = result_categorys.data.items
        for(let i in tmp_service_categorys){
          let tmp_service_category = tmp_service_categorys[i]
          if(i == 0){
            tmp_service_category.selected = true
          } else {
            tmp_service_category.selected = false
          }
        }
        this.service_categorys = tmp_service_categorys
      }
      else {
        this.showAlert(result_categorys.error_messages)
      }
    },
    async loadPrepaidServices(category_id, page_number){
      this.preLoader()
      let result_prepaid_services = await this.loadPrepaidServicesAsync(category_id, page_number)
      this.preLoader(false)

      if(result_prepaid_services.is_ok){
        for(let category of this.service_categorys){
          if(!category.prepaid_services) category.prepaid_services = []
          
          let tmp_prepaid_services = result_prepaid_services.data.items
          for(let prepaid_service of tmp_prepaid_services){
            prepaid_service.selected = false
            if(category.id == prepaid_service.service_category_id){
              prepaid_service.service_category_name = category.name
              category.prepaid_services.push(prepaid_service)
            }
          }
        }
        this.sale_prepaid_services_pagination = result_prepaid_services.data.pagination
        if(this.sale_prepaid_services_pagination.page_number < this.sale_prepaid_services_pagination.total_pages) 
          this.show_load_more = true
        else 
          this.show_load_more = false

        this.$forceUpdate()
      }
      else {
        this.showAlert(result_prepaid_services.error_messages)
      }
    },
    async onLoadMorePrepaidServices(){
      await this.loadPrepaidServices(this.service_category_selected.id, ++this.sale_prepaid_services_pagination.page_number)
    },
    onSelectServiceCategory(service_category_selected){
      this.updateUIForServiceCategorys(service_category_selected)

      this.service_categorys.map(c => c.prepaid_services = [])
      this.loadPrepaidServices(service_category_selected.id, 1)
    },
    updateUIForServiceCategorys(service_category_selected){
      for(let service_category of this.service_categorys){
        if(service_category.id == service_category_selected.id)
          service_category.selected = true
        else
          service_category.selected = false
      }
      this.$forceUpdate()
    },
    onSelectPrepaidService(prepaid_service_selected){
      for(let prepaid_service of this.service_category_selected.prepaid_services){
        if(prepaid_service.id == prepaid_service_selected.id)
          prepaid_service.selected = true
        else
          prepaid_service.selected = false
      }
      this.$forceUpdate()
      this.$emit('selected-sale-prepaid-service', prepaid_service_selected)
    },

    // customize prepaid services
    async onClickCustomizePrepaidServicesTab(){
      this.$nextTick(() => {
        this.$refs.select_service_panel.onSelectServiceCategory(0)
      })
      this.emitEventChangePrepaidServiceTab(sales_options.sales_goods_type.customize_prepaid_service)
    },
    onGetSelectedServicesToCustomize(selected_services){
      if(selected_services.length > 0){
        let selected_service = _.cloneDeep(_.last(selected_services))

        this.$emit('selected-customize-prepaid-service', selected_service)
        this.$refs['select_service_panel'].resetSelectedServices()
      }
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
@import './sales-item-prepaid-services.scss';
</style>