<template>
  <b-modal id="sales-items-adding-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="sales-items-adding-action-modal"
           @show="onLoadForm"
           @hide="onCancel">
    <div class="row sales-items-adding-action-wrapper">
      <sales-goods-types ref="sales_goods_types" :is_show_modal="false" class="col-12" 
                         @clicked-goods-type="onClickedGoodsType"/>

      <div class="col-12 col-md-9 col-xl-10">
        <div class="sales-goods-content-wrapper">
          <div v-if="is_viewed_services" :class="{ 'hide': !showed_sales_goods_types[0].showed }"
               class="sales-item-services">
            <select-service-panel ref="select_service_panel" 
                                  :is_show_service_price="is_show_service_price"
                                  @get-selected-services="onGetSelectedServices"/>
          </div>
          <sales-item-products v-if="is_viewed_products" 
                               ref="sales_item_products" 
                               :class="{ 'hide': !showed_sales_goods_types[1].showed }"
                               @select-product="onSelectProduct"/>
          <sales-item-packages v-if="is_viewed_packages" 
                               ref="sales_item_packages" 
                               :class="{ 'hide': !showed_sales_goods_types[2].showed }"
                               @selected-package-items="onSelectPackageItems"/>
          <sales-item-prepaid-cards v-if="is_viewed_prepaid_cards" 
                                    ref="sales_item_prepaid_cards"
                                    :class="{ 'hide': !showed_sales_goods_types[3].showed }"/>
          <sales-item-prepaid-services v-if="is_viewed_prepaid_services" 
                                       ref="sales_item_prepaid_services" 
                                       :class="{ 'hide': !showed_sales_goods_types[4].showed }"
                                       @change-prepaid-services-tab="onChangePrepaidServicesTab"
                                       @selected-deduct-prepaid-service="onSelectedDeductPrepaidService"
                                       @selected-sale-prepaid-service="onSelectedSalePrepaidService"
                                       @selected-customize-prepaid-service="onSelectedCustomizePrepaidService"/>
        </div>
      </div>

      <div class="col-12 col-md-3 col-xl-2">
        <div class="sales-items-selected-wrapper">
          <div class="modal-footer view-pc">
            <div class="btn-action-group">
              <button v-show="!showed_sales_goods_types[2].showed" class="btn btn-default" @click="onConfirm">{{ $t('general.confirm') }}</button>
              <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
            </div>
          </div>

          <div class="staffs-selected">
            <label>{{ $t('sales.select-staff') }}</label>
            <b-form-select v-model="staff.fields.staff_id" :options="staff_options"
                           value-field="staff_id" text-field="staff_name"
                           @input="onInputStaff"/>
          </div>

          <!-- goods selected -->
          <div v-if="is_goods_selected"
               class="sales-items-selected services-products">
            <label v-if="sales_items_selected.type == sales_options.sales_goods_type.service">{{ $t('services.services') }}</label>
            <label v-if="sales_items_selected.type == sales_options.sales_goods_type.product">{{ $t('products.products') }}</label>
            <table>
              <thead>
                <tr>
                  <th>{{ $t('bookings.selected-items') }}</th>
                  <th>{{ $t('general.del') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sales_item, i) in sales_items_selected.items" :key="i">
                  <td>{{ sales_item.goods_name }}</td>
                  <td><a class="btn" @click="onRemoveSalesItemGoods(sales_item.key)">x</a></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- deduct_prepaid_service -->
          <div v-if="is_deduct_prepaid_service_selected"
               class="sales-items-selected deduct-prepaid-services">
            <label>{{ $t('services.services') }}</label>
            <table>
              <colgroup>
                <col width="50%">
                <col width="30%">
                <col width="20%">
              </colgroup>
              <thead>
                <tr>
                  <th>{{ $t('bookings.selected-items') }}</th>
                  <th>{{ $t('sales.q-ty') }}</th>
                  <th>{{ $t('general.del') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sales_item, i) in sales_items_selected.items" :key="i">
                  <td>{{ sales_item.related_service_name }}</td>
                  <td><input-money v-model="sales_item.quantity" :decimal="0"/></td>
                  <td><a class="btn" @click="onRemoveSalesItemGoods(sales_item.key)">x</a></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- sale_prepaid_service -->
          <div v-if="is_sale_prepaid_service_selected"
               class="sales-items-selected sale-prepaid-services">
            <radio-gift-card-type ref="radio_gift_card_type"
                                  :prepaid_card_type="sales_options.sales_goods_type.prepaid_service" @input="onInputSalePrepaidServiceGiftCardType"/>
            <table>
              <thead>
                <tr>
                  <th>{{ sale_prepaid_service.fields.name }}</th>
                </tr>
              </thead>
              <tbody v-if="sales_items_selected.items[0].gift_card_type != sales_options.gift_card_type.sales">
                <tr>
                  <td class="use-now">
                    <b-form-checkbox v-model="sale_prepaid_service_extend.use_now" :value="true" :unchecked-value="false"
                                     class="use-now-checkbox" @input="onInputSalePrepaidServiceUseNow">
                      {{ $t('sales.use-now') }}
                    </b-form-checkbox>
                    <input-money v-model="sale_prepaid_service_extend.use_now_quantity" :decimal="0" :disabled="!sale_prepaid_service_extend.use_now"
                                 @input="onInputSalePrepaidServiceUseNowQuantity"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- customize_prepaid_service -->
          <div v-if="is_customize_prepaid_service_selected"
               class="sales-items-selected customize-prepaid-services">
            <table>
              <thead>
                <tr>
                  <th>{{ customize_prepaid_service.fields.related_service_name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="unit-price">
                    <label class="require">{{ $t('prepaid-services.unit-price') }}</label>
                    <input-money v-model="customize_prepaid_service.fields.unit_price" :decimal="0" @input="onInputCustomizePrepaidServiceUnitPrice"/>
                  </td>
                </tr>
                <tr>
                  <td class="quantity">
                    <label class="require">{{ $t('sales.q-ty') }}</label>
                    <input-money v-model="customize_prepaid_service.fields.quantity" :decimal="0" :disabled="customize_prepaid_service.fields.quantity_no_limit"
                                 @input="onInputCustomizePrepaidServiceQuantity"/>
                    <b-form-checkbox v-model="customize_prepaid_service.fields.quantity_no_limit" :value="true" :unchecked-value="false"
                                     class="no-limit" @input="onInputCustomizePrepaidServiceQuantityNoLimit">{{ $t('prepaid-services.no-limit') }}</b-form-checkbox>
                  </td>
                </tr>
                <tr>
                  <td class="amount">
                    <label>{{ $t('sales.amount') }}</label>
                    <input-money v-model="customize_prepaid_service.fields.price" :decimal="0" :disabled="!customize_prepaid_service.fields.quantity_no_limit"/>
                  </td>
                </tr>
                <tr>
                  <td class="validity">
                    <label class="require">{{ $t('sales.validity') }}</label>
                    <input-money v-model="customize_prepaid_service.fields.validity" :decimal="0" :disabled="customize_prepaid_service.fields.validity_no_limit"/>
                    <radio-group v-model="customize_prepaid_service.fields.validity_type" :options="options.option_validity_type" 
                                 :disabled="customize_prepaid_service.fields.validity_no_limit" :buttons="true"
                                 @input="onInputCustomizePrepaidServiceValidityType"/>
                    <b-form-checkbox v-model="customize_prepaid_service.fields.validity_no_limit" :value="true" :unchecked-value="false"
                                     class="no-limit" @input="onInputCustomizePrepaidServiceValidityNolimit">{{ $t('prepaid-services.no-limit') }}</b-form-checkbox>
                  </td>
                </tr>
                <tr>
                  <td class="use-now">
                    <b-form-checkbox v-model="customize_prepaid_service_extend.use_now" :value="true" :unchecked-value="false"
                                     class="use-now-checkbox">{{ $t('sales.use-now') }}</b-form-checkbox>
                    <input-money v-model="customize_prepaid_service_extend.use_now_quantity" :decimal="0" :disabled="!customize_prepaid_service_extend.use_now"
                                 @input="onInputCustomizePrepaidServiceUseNowQuantity"/>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="customize-prepaid-service-name">
              <label>{{ $t('prepaid-services.prepaid-service-name') }}</label>
              <input v-model="customize_prepaid_service.fields.name">
            </div>
          </div>

          <div class="modal-footer view-mobile">
            <div class="btn-action-group">
              <button v-show="!showed_sales_goods_types[2].showed" class="btn btn-default" @click="onConfirm">{{ $t('general.confirm') }}</button>
              <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <alert-confirm :id="alert_id" :data_alerts="alert_data"
                   @confirm="onAlertConfirm" @cancel="onAlertCancel"/>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapMutations }   from 'vuex'
import { DatePicker }                 from 'v-calendar'
import { options }                    from '../../../../helpers/options'
import { sales_options }              from '../../../../helpers/options/sales-options'
import SalesCache                     from '../../../../helpers/cache/sales-cache'
import SalesItemViewModel             from '../../../../view-model/sales/sales-item/sales-item-view-model.js'
import SalesItemStaffViewModel        from '../../../../view-model/sales/sales-item/sales-item-staff-view-model'
import ClientPrepaidCardViewModel     from '../../../../view-model/sales/prepaid-card/prepaid-card-view-model'
import ClientPrepaidCardApi           from '../../../../api/sales/prepaid-cards-api'
import PrepaidCardViewModel           from '../../../../view-model/goods/prepaid-card-view-model'
import PrepaidServiceViewModel        from '../../../../view-model/goods/prepaid-service-view-model'
import ClientPrepaidServiceViewModel  from '../../../../view-model/sales/prepaid-service/prepaid-service-view-model'
import ServiceApi                     from '../../../../api/goods/service-api'

import component_base                 from '../../../common/component-base/component-base'
import view_table                     from '../../../common/view-table/view-table'
import select_hour                    from '../../../common/form/select/select-hour/select-hour'
import error_box                      from '../../../common/form/error-box/error-box' 
import sales_goods_types              from '../sales-goods-types/sales-goods-types.vue'
import select_service_panel           from '../../../common/select-services-panel/select-services-panel.vue'
import sales_item_products            from '../sales-item-products/sales-item-products.vue'
import sales_item_packages            from '../sales-item-packages/sales-item-packages.vue'
import sales_item_prepaid_cards       from '../sales-item-prepaid-cards/sales-item-prepaid-cards.vue'
import sales_item_prepaid_services    from '../sales-item-prepaid-services/sales-item-prepaid-services.vue'
import radio_gift_card_type           from '../../../common/form/radio/radio-gift-card-type/radio-gift-card-type'
import input_money                    from '../../../common/form/input/input-money/input-money'
import radio_group                    from '../../../common/form/radio/radio-group/radio-group'
import alert_confirm                  from '../../../common/alert/alert-confirm'

import { guid,
  convertDateToTimeStamp,
  convertDateToTimezone }             from '../../../../helpers/common'


export default {
  components: {
    'view-table': view_table,
    'select-hour': select_hour,
    'v-date-picker': DatePicker,
    'error-box': error_box,

    'sales-goods-types': sales_goods_types,
    'select-service-panel': select_service_panel,
    'sales-item-products': sales_item_products,
    'sales-item-packages': sales_item_packages,
    'sales-item-prepaid-cards': sales_item_prepaid_cards,
    'sales-item-prepaid-services': sales_item_prepaid_services,

    'radio-gift-card-type': radio_gift_card_type,
    'input-money': input_money,
    'radio-group': radio_group,
    'alert-confirm': alert_confirm,
  },
  extends: component_base,
  props: {
    has_client: {
      type: Boolean,
      default: false
    },
    staffs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options,
      sales_options,

      is_viewed_services: false,
      is_viewed_products: false,
      is_viewed_packages: false,
      is_viewed_prepaid_cards: false,
      is_viewed_prepaid_services: false,

      sales_cache: new SalesCache(),
      sales_setup: {},

      sales_items_selected: {
        type: sales_options.sales_goods_type.service,
        items: []
      },

      selected_products: [],

      // prepaid card
      client_prepaid_card_api: new ClientPrepaidCardApi(),
      prepaid_card_selected: new PrepaidCardViewModel(),
      
      // deposit card
      prepaid_card_add_to_store: new ClientPrepaidCardViewModel(),
      prepaid_cards_balance_moves: [],

      // discount card
      prepaid_card_discount_add_to_store: new ClientPrepaidCardViewModel(),

      // prepaid service
      client_prepaid_service_add_to_store: new ClientPrepaidServiceViewModel(),
      deduct_prepaid_services_selected: [],
      service_api: new ServiceApi(),

      sale_prepaid_service: new PrepaidServiceViewModel(),
      sale_prepaid_service_extend: {
        use_now: false,
        use_now_quantity: 1
      },

      customize_prepaid_service: new PrepaidServiceViewModel(),
      customize_prepaid_service_extend: {
        use_now: false,
        use_now_quantity: 1
      },
      
      staff: new SalesItemStaffViewModel(),

      alert_id: 'warning-selected-sales-items-not-save',
      alert_data: [],
      alert_sales_goods_type: 0,

      errors: [],
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_sales_action: 'getSalesAction',
      x_sales_action_helper: 'getSalesActionHelper'
    }),
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    text_no_limit(){return this.$i18n.t('prepaid-services.no-limit')},
    text_times(){return this.$i18n.t('report.times')},
    form_title(){return this.$i18n.t('sales.add-sales-item')},
    customized_prepaid_service(){return this.$i18n.t('sales.customized-prepaid-service')},
    warning_change_sales_item_tab(){return this.$i18n.t('sales.warning-selected-sales-items-not-save')},
    warning_deduct_qty_larger_existing_qty(){return this.$i18n.t('sales.warning-deduct-qty-larger-existing-qty')},
    warning_prepaid_card_can_not_merge_from_merged_card(){return this.$i18n.t('sales.warning-prepaid-card-can-not-merge-from-merged-card')},
    showed_sales_goods_types(){
      let tmp_types = [
        { id: sales_options.sales_goods_type.service,         showed: false },
        { id: sales_options.sales_goods_type.product,         showed: false },
        { id: sales_options.sales_goods_type.package,         showed: false },
        { id: sales_options.sales_goods_type.prepaid_card,    showed: false },
        { id: sales_options.sales_goods_type.prepaid_service, showed: false }
      ]
      for(let i in tmp_types){
        if(tmp_types[i].id == this.x_sales_action.options.sales_goods_type)
          tmp_types[i].showed = true
        else
          tmp_types[i].showed = false
      }
      return tmp_types
    },
    staff_options(){
      let tmp_option_not_selected = {
        sales_item_staff_id: 0,
        staff_id: 0,
        staff_name: 'Not Selected',
        amount: 0,
        selected: true
      }

      return [tmp_option_not_selected, ...this.staffs]
    },
    is_show_service_price(){
      return this.sales_setup.sales_general_setup.show_price_on_goods_selection_window
    },
    is_goods_selected(){
      return this.sales_items_selected.items.length > 0
             && (this.sales_items_selected.type == sales_options.sales_goods_type.service || this.sales_items_selected.type == sales_options.sales_goods_type.product)
    },
    is_deduct_prepaid_service_selected(){
      return this.sales_items_selected.items.length > 0 
             && this.sales_items_selected.type == sales_options.sales_goods_type.deduct_prepaid_service
    },
    is_sale_prepaid_service_selected(){
      return this.sales_items_selected.items.length > 0 
             && this.sales_items_selected.type == sales_options.sales_goods_type.sale_prepaid_service
    },
    is_customize_prepaid_service_selected(){
      return this.customize_prepaid_service.fields.related_service_id > 0 
             && this.sales_items_selected.type == sales_options.sales_goods_type.customize_prepaid_service
    }
  },
  methods: {
    ...mapMutations('sales', [
      'setSalesActionShowedGoodsType',
      'setSalesActionHelperClientPrepaidCards',
      'setSalesActionHelperClientPrepaidCardsAll',
      'setSalesActionHelperBalanceMoves',
      'addItemToClientPrepaidServicesAll',
      'updateItemQuantityToClientPrepaidServicesAll'
    ]),
    hideModal(){
      this.prepaid_card_add_to_store = new ClientPrepaidCardViewModel()
      this.setSalesActionShowedGoodsType(sales_options.sales_goods_type.service)
      this.$refs['sales_goods_types'].sales_goods_type_selected = sales_options.sales_goods_type.service
      this.hideDialogById('sales-items-adding-action-modal')
    },
    onCancel(){
      this.hideModal()

      this.is_viewed_services         = false
      this.is_viewed_products         = false
      this.is_viewed_packages         = false
      this.is_viewed_prepaid_cards    = false
      this.is_viewed_prepaid_services = false
    },
    async onLoadForm(){
      // sales setup
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }

      this.errors = []
      this.staff = new SalesItemStaffViewModel()

      this.viewGoodsTypeContent()
      
      if(this.has_client && this.sales_setup.sales_general_setup.auto_select_staff_when_sales && this.staff_options.length > 1){
        this.onInputStaff(this.x_client.data.preferred_staff_id)
      }
    },
    onClickedGoodsType(sales_goods_type){
      if(this.sales_items_selected.items.length > 0 && this.sales_items_selected.items[0].goods_id != sales_options.max_value_goods_id){
        this.alert_sales_goods_type = sales_goods_type
        this.alert_data = [this.warning_change_sales_item_tab]
        this.showDialogById(this.alert_id)
      }
      else {
        this.setSalesActionShowedGoodsType(sales_goods_type)
        this.viewGoodsTypeContent()
      }
    },
    viewGoodsTypeContent(){
      if(this.x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.service){
        this.is_viewed_services = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.service)

        let ref_select_service_panel = this.$refs['select_service_panel']
        if(ref_select_service_panel){
          ref_select_service_panel.onSelectServiceCategory(0)
          ref_select_service_panel.resetSelectedServices()
        }
      }
      if(this.x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.product){
        this.is_viewed_products = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.product)
        this.selected_products = []

        let ref_sales_item_products = this.$refs['sales_item_products']
        if(ref_sales_item_products){
          ref_sales_item_products.table_filter.product_category_id = 0
          ref_sales_item_products.table_filter.key_word = ''
        }
      }
      if(this.x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.package){
        this.is_viewed_packages = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.package)
      }
      if(this.x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_card){
        this.is_viewed_prepaid_cards = true
        
        let ref_sales_item_prepaid_cards = this.$refs['sales_item_prepaid_cards']
        if(ref_sales_item_prepaid_cards){
          ref_sales_item_prepaid_cards.loadPrepaidCardsAsync()
          ref_sales_item_prepaid_cards.onInputGiftCardType(sales_options.gift_card_type.none)
          ref_sales_item_prepaid_cards.setPrepaidCardToForm(new PrepaidCardViewModel().getFields())
          ref_sales_item_prepaid_cards.checkClientPrepaidCardsToMergeBalance()
          this.prepaid_card_selected = new PrepaidCardViewModel()
          this.prepaid_card_add_to_store = new ClientPrepaidCardViewModel()
        }
        this.resetSalesItemsSelected(sales_options.sales_goods_type.prepaid_card)
      }
      if(this.x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_service){
        this.is_viewed_prepaid_services = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.prepaid_service)
        this.deduct_prepaid_services_selected = []

        let ref_sales_item_prepaid_services = this.$refs['sales_item_prepaid_services']
        if(ref_sales_item_prepaid_services){
          ref_sales_item_prepaid_services.tab_index = 0
        }
      }
    },
    resetSalesItemsSelected(sales_goods_type){
      this.sales_items_selected.type = sales_goods_type
      this.sales_items_selected.items = []
      // this.staff.fields.staff_id = 0
    },
    
    // goods
    onRemoveSalesItemGoods(key){
      if(this.sales_items_selected.type == sales_options.sales_goods_type.service){
        this.onRemoveSalesItemService(key)
      }
      if(this.sales_items_selected.type == sales_options.sales_goods_type.product){
        this.onRemoveSalesItemProduct(key)
      }
      if(this.sales_items_selected.type == sales_options.sales_goods_type.deduct_prepaid_service){
        this.onRemoveSalesItemDeductPrepaidService(key)
      }
    },

    // service
    onGetSelectedServices(selected_services){
      this.mapServicesToSalesItems(selected_services)
    },
    async mapServicesToSalesItems(selected_services){
      let tmp_sales_items = []
      for(let service of selected_services){
        let tmp_sales_item = new SalesItemViewModel()
        
        tmp_sales_item.fields.goods_type              = sales_options.sales_goods_type.service
        tmp_sales_item.fields.goods_category_id       = service.category
        tmp_sales_item.fields.goods_category_name     = service.category_name
        tmp_sales_item.fields.goods_id                = service.id
        tmp_sales_item.fields.goods_name              = service.name
        tmp_sales_item.fields.unit_price              = service.price
        tmp_sales_item.fields.amount                  = service.price
        tmp_sales_item.fields.key                     = service.key

        tmp_sales_items.push(tmp_sales_item.getFields())
      }
      this.sales_items_selected.items = tmp_sales_items
    },
    onRemoveSalesItemService(service_key){
      this.$refs['select_service_panel'].onRemoveService(service_key)
    },

    // product
    onSelectProduct(selected_product){
      this.selected_products.push(selected_product)
      for(let i in this.selected_products){
        this.selected_products[i].key = i
      }
      this.mapProductsToSalesItems(this.selected_products)
    },
    mapProductsToSalesItems(selected_products){
      let tmp_sales_items = []
      for(let product of selected_products){
        let tmp_sales_item = new SalesItemViewModel()

        tmp_sales_item.fields.goods_type              = sales_options.sales_goods_type.product
        tmp_sales_item.fields.goods_category_id       = product.product_category_id
        tmp_sales_item.fields.goods_category_name     = product.product_category_name
        tmp_sales_item.fields.goods_id                = product.id
        tmp_sales_item.fields.goods_name              = product.name
        tmp_sales_item.fields.unit_price              = product.retail_price
        tmp_sales_item.fields.amount                  = product.retail_price
        tmp_sales_item.fields.key                     = product.key

        tmp_sales_item.fields.product_code            = product.code
        tmp_sales_item.fields.product_supplier_price  = product.supplier_price
        
        tmp_sales_items.push(tmp_sales_item.getFields())
      }
      this.sales_items_selected.items = tmp_sales_items
    },
    onRemoveSalesItemProduct(product_key){
      this.selected_products = this.selected_products.filter(p => p.key != product_key)
      this.mapProductsToSalesItems(this.selected_products)
    },

    // package
    async onSelectPackageItems(package_items){
      this.mapPackageItemToSalesItems(package_items)
      await this.onConfirm()
    },
    async mapPackageItemToSalesItems(package_items){
      let tmp_sales_items = []
      for(let package_item of package_items){
        let tmp_sales_item = new SalesItemViewModel()
        
        tmp_sales_item.fields.goods_type          = package_item.item_type
        tmp_sales_item.fields.goods_category_id   = package_item.goods_category_id
        tmp_sales_item.fields.goods_category_name = package_item.goods_category_name
        tmp_sales_item.fields.goods_id            = package_item.goods_id
        tmp_sales_item.fields.goods_name          = package_item.name
        tmp_sales_item.fields.unit_price          = package_item.price
        tmp_sales_item.fields.amount              = package_item.price
        tmp_sales_item.fields.key                 = package_item.key
        
        if(package_item.item_type == sales_options.sales_goods_type.product){
          tmp_sales_item.fields.product_code = package_item.product_code
          // tmp_sales_item.fields.product_supplier_price = package_item.product_supplier_price
        }

        if(package_item.item_type == sales_options.sales_goods_type.prepaid_card
        || package_item.item_type == sales_options.sales_goods_type.prepaid_service){
          tmp_sales_item.fields.goods_ref                    = package_item
          tmp_sales_item.fields.prepaid_goods_guid           = guid()
          tmp_sales_item.fields.prepaid_goods_expiry_date_ts = this.getPrepaidGoodsExpiryDateTS(package_item.validity, package_item.validity_type)

          tmp_sales_item.fields.discount_for_client  = package_item.discount_for_client
          tmp_sales_item.fields.discount_for_service = package_item.discount_for_service
          tmp_sales_item.fields.discount_for_product = package_item.discount_for_product
        }

        if(package_item.item_type == sales_options.sales_goods_type.prepaid_card){
          tmp_sales_item.fields.prepaid_card_initial_balance = package_item.charge_amount
          if(package_item.charge_amount == 0){
            tmp_sales_item.fields.prepaid_card_type = options.prepaid_card_type.discount_card
          }
          else {
            tmp_sales_item.fields.prepaid_card_type = options.prepaid_card_type.deposit_card
          }
        }

        if(package_item.item_type == sales_options.sales_goods_type.prepaid_service){
          tmp_sales_item.fields.prepaid_service_initial_quantity = package_item.quantity
          tmp_sales_item.fields.related_service_id               = package_item.related_service_id
          // tmp_sales_item.fields.related_service_name             = package_item.related_service_name,
          // tmp_sales_item.fields.related_service_unit_price       = package_item.related_service_unit_price
        }
        
        tmp_sales_items.push(tmp_sales_item.getFields())
      }
      this.sales_items_selected.items = tmp_sales_items
    },
    getPrepaidGoodsExpiryDateTS(validity, validity_type){
      let tmp_date = convertDateToTimezone(new Date())
      let tmp_expiry_date_ts = 0

      if(validity == -1)
        tmp_expiry_date_ts = -1
      else {
        if(validity_type == options.validity_type.months){
          tmp_date = moment(tmp_date).add(validity, 'months')
        }
        if(validity_type == options.validity_type.days){
          tmp_date = moment(tmp_date).add(validity, 'days')
        }
        tmp_date = tmp_date.add(1, 'days')
        tmp_date = tmp_date.format(options.standard_date_format.ymd)
        tmp_expiry_date_ts = convertDateToTimeStamp(tmp_date) - 1
      }
      return tmp_expiry_date_ts
    },

    // prepaid card
    onSelectedPrepaidCard(prepaid_card, gift_card_type, client_prepaid_cards_merged){
      this.prepaid_card_selected.setFields(prepaid_card)
      this.mapPrepaidCardToSalesItems(prepaid_card, gift_card_type, client_prepaid_cards_merged)
    },
    mapPrepaidCardToSalesItems(prepaid_card, gift_card_type, client_prepaid_cards_merged){
      let tmp_sales_items = []
      let tmp_sales_item = new SalesItemViewModel()
      
      tmp_sales_item.fields.goods_ref           = prepaid_card
      tmp_sales_item.fields.goods_type          = sales_options.sales_goods_type.prepaid_card
      tmp_sales_item.fields.goods_id            = prepaid_card.id
      tmp_sales_item.fields.goods_name          = prepaid_card.name
      tmp_sales_item.fields.unit_price          = prepaid_card.price
      tmp_sales_item.fields.amount              = prepaid_card.price
      tmp_sales_item.fields.key                 = prepaid_card.key

      tmp_sales_item.fields.gift_card_type      = gift_card_type,
      tmp_sales_item.fields.prepaid_card_type   = prepaid_card.prepaid_card_type,
      tmp_sales_item.fields.prepaid_goods_guid           = guid()
      tmp_sales_item.fields.prepaid_goods_expiry_date_ts = this.getPrepaidGoodsExpiryDateTS(prepaid_card.validity, prepaid_card.validity_type)
      tmp_sales_item.fields.prepaid_card_initial_balance = prepaid_card.charge_amount

      tmp_sales_item.fields.discount_for_client  = prepaid_card.discount_for_client
      tmp_sales_item.fields.discount_for_service = prepaid_card.discount_for_service
      tmp_sales_item.fields.discount_for_product = prepaid_card.discount_for_product
      
      tmp_sales_item.fields.is_head_quarter_goods = prepaid_card.shared
      if(prepaid_card.id == sales_options.max_value_goods_id)
        tmp_sales_item.fields.is_customize_prepaid_goods = true

      tmp_sales_items.push(tmp_sales_item.getFields())
      
      this.sales_items_selected.items = tmp_sales_items
      
      // client prepaid card deposit new to store
      if(prepaid_card.prepaid_card_type == options.prepaid_card_type.deposit_card){
        this.prepaid_card_add_to_store.setFields({
          id                   : tmp_sales_item.fields.prepaid_goods_guid,
          client_id            : this.x_client.data.id,
          client_name          : this.x_client.data.client_name,
          prepaid_card_id      : prepaid_card.id,
          prepaid_card_name    : prepaid_card.name,
          prepaid_card_type    : prepaid_card.prepaid_card_type,
          is_head_quarter_goods: prepaid_card.shared,
          sales_price          : prepaid_card.price,
          initial_balance      : prepaid_card.charge_amount,
          balance              : prepaid_card.charge_amount,
          discount_for_client  : prepaid_card.discount_for_client,
          discount_for_service : prepaid_card.discount_for_service,
          discount_for_product : prepaid_card.discount_for_product,
          salary_sales_value   : prepaid_card.salary_sales_value,
          salary_sales_type    : prepaid_card.salary_sales_type,
          expiry_date_ts       : tmp_sales_item.fields.prepaid_goods_expiry_date_ts,
          invoice_date_time_ts : convertDateToTimeStamp(new Date(), true, true),
          shop_id              : this.shop_data.shop_id,
          expand               : false,
          is_selected          : false,
        })

        // balance moves by merging client prepaid card
        let tmp_balance_moves = []
        for(let client_prepaid_card of client_prepaid_cards_merged){
          let tmp_balance_move = {
            from_client_prepaid_card_id : client_prepaid_card.id,
            move_balance                : client_prepaid_card.balance,
            to_client_prepaid_card_id   : 0,
            to_prepaid_card_guid        : tmp_sales_item.fields.prepaid_goods_guid
          }
          tmp_balance_moves.push(tmp_balance_move)
        }
        this.prepaid_cards_balance_moves = tmp_balance_moves
      }

      // client prepaid card discount new to store
      // if(prepaid_card.prepaid_card_type == options.prepaid_card_type.discount_card
      // || (prepaid_card.prepaid_card_type == options.prepaid_card_type.deposit_card && prepaid_card.discount_for_client)){
      //   this.prepaid_card_discount_add_to_store.setFields({
      //     id                   : tmp_sales_item.fields.prepaid_goods_guid,
      //     client_id            : this.x_client.data.id,
      //     prepaid_card_id      : prepaid_card.id,
      //     prepaid_card_name    : prepaid_card.name,
      //     prepaid_card_type    : prepaid_card.prepaid_card_type,
      //     sales_price          : prepaid_card.price,
      //     initial_balance      : prepaid_card.charge_amount,
      //     balance              : prepaid_card.charge_amount,
      //     discount_for_client  : prepaid_card.discount_for_client,
      //     discount_for_service : prepaid_card.discount_for_service,
      //     discount_for_product : prepaid_card.discount_for_product,
      //     expiry_date_ts       : tmp_sales_item.fields.prepaid_goods_expiry_date_ts,
      //     invoice_date_time_ts : convertDateToTimeStamp(new Date(), true, true),
      //     shop_id              : this.shop_data.shop_id,
      //     expand               : false,
      //     is_selected          : false,
      //   })
      // }
    },
    updatePrepaidCardInStore(){ // after add client prepaid card
      let tmp_client_prepaid_cards = this.x_sales_action_helper.client_prepaid_cards

      // update client prepaid card in store after merged cards
      if(this.prepaid_card_add_to_store.fields.id != 0){
        if(this.prepaid_cards_balance_moves.length > 0){
          for(let tmp_balance_move of this.prepaid_cards_balance_moves){
            // new card: increase balance from merged cards
            if(tmp_balance_move.to_prepaid_card_guid == this.prepaid_card_add_to_store.fields.id){
              this.prepaid_card_add_to_store.fields.balance += tmp_balance_move.move_balance
            }
            // merged cards: remove out of store
            for(let client_prepaid_card of tmp_client_prepaid_cards){
              if(tmp_balance_move.from_client_prepaid_card_id == client_prepaid_card.id){
                tmp_client_prepaid_cards = tmp_client_prepaid_cards.filter(c => c.id != tmp_balance_move.from_client_prepaid_card_id)
              }
            }
          }
        }
        if(this.prepaid_card_add_to_store.fields.prepaid_card_type == options.prepaid_card_type.deposit_card
        && this.sales_items_selected.items.length > 0
        && this.sales_items_selected.items[0].gift_card_type != sales_options.gift_card_type.sales){
          tmp_client_prepaid_cards.push(_.cloneDeep(this.prepaid_card_add_to_store.fields))
        }
      }
      this.setSalesActionHelperClientPrepaidCards(tmp_client_prepaid_cards)
    },

    // PREPAID SERVICE
    onChangePrepaidServicesTab(sales_goods_type){
      this.deduct_prepaid_services_selected = []
      this.sale_prepaid_service = new PrepaidServiceViewModel()
      this.sale_prepaid_service_extend = {
        use_now: false,
        use_now_quantity: 1
      }
      this.customize_prepaid_service = new PrepaidServiceViewModel(),
      this.customize_prepaid_service_extend = {
        use_now: false,
        use_now_quantity: 1
      },
      this.resetSalesItemsSelected(sales_goods_type)
    },
    onInputPrepaidServiceUseNowQuantity(prepaid_service_extend){
      prepaid_service_extend.use_now_quantity = Math.round(prepaid_service_extend.use_now_quantity)
      if(prepaid_service_extend.use_now_quantity < 1)
        prepaid_service_extend.use_now_quantity = 1
    },

    // deduct prepaid service
    onSelectedDeductPrepaidService(deduct_prepaid_service){
      this.sales_items_selected.type = sales_options.sales_goods_type.deduct_prepaid_service
      
      this.deduct_prepaid_services_selected.push(deduct_prepaid_service)
      this.resetKeyOfDeductPrepaidServicesSelected()
      
      this.mapDeductPrepaidServicesToSalesItems(this.deduct_prepaid_services_selected)
    },
    async mapDeductPrepaidServicesToSalesItems(deduct_prepaid_services){
      let tmp_sales_items = []
      for(let deduct_prepaid_service of deduct_prepaid_services){
        let tmp_sales_item = new SalesItemViewModel()
        
        tmp_sales_item.fields.goods_type          = sales_options.sales_goods_type.prepaid_service
        tmp_sales_item.fields.goods_category_id   = deduct_prepaid_service.service_category_id
        tmp_sales_item.fields.goods_category_name = deduct_prepaid_service.service_category_name
        tmp_sales_item.fields.goods_id            = deduct_prepaid_service.related_service_id
        tmp_sales_item.fields.goods_name          = deduct_prepaid_service.related_service_name
        tmp_sales_item.fields.unit_price          = deduct_prepaid_service.related_service_unit_price
        tmp_sales_item.fields.amount              = 0 // When DeductionType is PrepaidService, The Amount's value must be zero
        tmp_sales_item.fields.key                 = deduct_prepaid_service.key

        tmp_sales_item.fields.prepaid_goods_guid                = guid()
        tmp_sales_item.fields.deduction_type                    = sales_options.deduction_type.prepaid_service
        tmp_sales_item.fields.deducted_prepaid_goods_ref_name   = deduct_prepaid_service.prepaid_service_name
        tmp_sales_item.fields.deducted_prepaid_goods_ref        = 0
        tmp_sales_item.fields.deducted_by_prepaid_goods_guid    = ''
        tmp_sales_item.fields.related_service_id                = deduct_prepaid_service.related_service_id
        tmp_sales_item.fields.related_service_name              = deduct_prepaid_service.related_service_name // only viewing in Deduct Prepaid Service Tab

        if(deduct_prepaid_service.client_prepaid_service_id > 0)
          tmp_sales_item.fields.deducted_prepaid_goods_ref      = deduct_prepaid_service.client_prepaid_service_id // deducted from existing prepaid service
        else
          tmp_sales_item.fields.deducted_by_prepaid_goods_guid  = deduct_prepaid_service.client_prepaid_service_id // deducted from new prepaid service

        tmp_sales_item.fields.is_head_quarter_goods           = deduct_prepaid_services.is_head_quarter_goods

        tmp_sales_items.push(tmp_sales_item.getFields())
      }
      // keep edited quantity of deduct_prepaid_services_selected
      this.sales_items_selected.items = Object.assign(tmp_sales_items, this.sales_items_selected.items)
    },
    onRemoveSalesItemDeductPrepaidService(key){
      this.deduct_prepaid_services_selected = this.deduct_prepaid_services_selected.filter(p => p.key != key)
      this.resetKeyOfDeductPrepaidServicesSelected()
      
      this.sales_items_selected.items = this.sales_items_selected.items.filter(i => i.key != key)
      for(let i in this.sales_items_selected.items){
        this.sales_items_selected.items[i].key = i
      }
    },
    resetKeyOfDeductPrepaidServicesSelected(){
      for(let i in this.deduct_prepaid_services_selected){
        this.deduct_prepaid_services_selected[i].key = i
      }
    },

    // sale prepaid service
    onSelectedSalePrepaidService(sale_prepaid_service){
      this.sales_items_selected.type = sales_options.sales_goods_type.sale_prepaid_service
      this.sale_prepaid_service.setFields(sale_prepaid_service)
      this.mapSalePrepaidServiceToSalesItems(sale_prepaid_service)
      this.sale_prepaid_service_extend = {
        use_now: false,
        use_now_quantity: 1
      }
      
      this.$nextTick(() => {
        this.$refs.radio_gift_card_type.is_gift_card = false
      })
    },
    mapSalePrepaidServiceToSalesItems(sale_prepaid_service){
      let tmp_sales_items = []
      let tmp_sales_item = new SalesItemViewModel()
      
      tmp_sales_item.fields.goods_ref           = sale_prepaid_service
      tmp_sales_item.fields.goods_type          = sales_options.sales_goods_type.prepaid_service
      tmp_sales_item.fields.goods_category_id   = sale_prepaid_service.service_category_id
      tmp_sales_item.fields.goods_category_name = sale_prepaid_service.service_category_name
      tmp_sales_item.fields.goods_id            = sale_prepaid_service.id
      tmp_sales_item.fields.goods_name          = sale_prepaid_service.name
      tmp_sales_item.fields.unit_price          = sale_prepaid_service.price
      tmp_sales_item.fields.amount              = sale_prepaid_service.price
      tmp_sales_item.fields.key                 = sale_prepaid_service.key

      tmp_sales_item.fields.prepaid_goods_guid              = guid()
      tmp_sales_item.fields.prepaid_goods_expiry_date_ts    = this.getPrepaidGoodsExpiryDateTS(sale_prepaid_service.validity, sale_prepaid_service.validity_type)
      tmp_sales_item.fields.deducted_prepaid_goods_ref_name = sale_prepaid_service.name
      tmp_sales_item.fields.prepaid_service_initial_quantity= sale_prepaid_service.quantity
      tmp_sales_item.fields.related_service_id              = sale_prepaid_service.related_service_id
      tmp_sales_item.fields.related_service_name            = sale_prepaid_service.related_service_name
      tmp_sales_item.fields.related_service_unit_price      = sale_prepaid_service.unit_price

      tmp_sales_item.fields.is_head_quarter_goods           = sale_prepaid_service.shared_service
      tmp_sales_items.push(tmp_sales_item.getFields())
      
      this.sales_items_selected.items = tmp_sales_items

      // client_prepaid_service_add_to_store
      this.client_prepaid_service_add_to_store.setFields({
        id                              : tmp_sales_item.fields.prepaid_goods_guid,
        loc                             : '',
        client_prepaid_service_id       : tmp_sales_item.fields.prepaid_goods_guid,
        client_id                       : this.x_client.data.id,
        client_name                     : this.x_client.data.client_name,
        service_category_id             : sale_prepaid_service.service_category_id,
        service_category_name           : sale_prepaid_service.service_category_name,
        related_service_id              : sale_prepaid_service.related_service_id,
        related_service_name            : sale_prepaid_service.related_service_name,
        related_service_unit_price      : sale_prepaid_service.unit_price,
        deducted_prepaid_goods_ref_name : sale_prepaid_service.name,
        prepaid_service_id              : sale_prepaid_service.id,
        prepaid_service_name            : sale_prepaid_service.name,
        unit_price                      : sale_prepaid_service.price,
        initial_quantity                : sale_prepaid_service.quantity,
        quantity                        : sale_prepaid_service.quantity,
        is_head_quarter_goods           : sale_prepaid_service.shared_service,
        expiry_date_ts                  : tmp_sales_item.fields.prepaid_goods_expiry_date_ts,
        invoice_date_time_ts            : 0,
        registration_date_ts            : 0,
        modification_date_ts            : 0,
        shop_id                         : 0,
        expand                          : false,
        deduction_quantity              : 0,
        refund_amount                   : 0,
      })
    },
    mapSalePrepaidServiceUseNowToDeductService(){
      if(this.sales_items_selected.items[0].gift_card_type != sales_options.gift_card_type.sales 
      && this.sale_prepaid_service_extend.use_now){
        let tmp_sales_item = new SalesItemViewModel()
        
        tmp_sales_item.fields.goods_type          = sales_options.sales_goods_type.prepaid_service
        tmp_sales_item.fields.goods_category_id   = this.sale_prepaid_service.fields.service_category_id
        tmp_sales_item.fields.goods_category_name = this.sale_prepaid_service.fields.service_category_name
        tmp_sales_item.fields.goods_id            = this.sale_prepaid_service.fields.id
        tmp_sales_item.fields.goods_name          = this.sale_prepaid_service.fields.related_service_name
        tmp_sales_item.fields.unit_price          = this.sale_prepaid_service.fields.unit_price
        tmp_sales_item.fields.amount              = 0 // When DeductionType is PrepaidService, The Amount's value must be zero
        tmp_sales_item.fields.key                 = this.sale_prepaid_service.fields.key

        tmp_sales_item.fields.prepaid_goods_guid              = guid()
        tmp_sales_item.fields.deduction_type                  = sales_options.deduction_type.prepaid_service
        tmp_sales_item.fields.deducted_prepaid_goods_ref_name = this.sale_prepaid_service.fields.name
        tmp_sales_item.fields.deducted_by_prepaid_goods_guid  = this.sales_items_selected.items[0].prepaid_goods_guid
        tmp_sales_item.fields.quantity                        = this.sale_prepaid_service_extend.use_now_quantity
        
        tmp_sales_item.fields.is_head_quarter_goods           = this.sale_prepaid_service.fields.shared_service

        if(this.sales_items_selected.items.length > 1){
          this.sales_items_selected.items = this.sales_items_selected.items.slice(0, 1)
        }
        this.sales_items_selected.items.push(tmp_sales_item.getFields())
      }
      else {
        this.sales_items_selected.items = this.sales_items_selected.items.slice(0, 1)
      }
    },
    mapSalePrepaidServiceToGiftCardRedeem(){
      this.sales_items_selected.items[0].unit_price = 0
      this.sales_items_selected.items[0].amount     = 0
    },
    onInputSalePrepaidServiceGiftCardType(gift_card_type_selected){
      this.sales_items_selected.items[0].gift_card_type = gift_card_type_selected
      if(gift_card_type_selected != sales_options.gift_card_type.none){
        this.sales_items_selected.items = this.sales_items_selected.items.slice(0, 1)
      }
      if(gift_card_type_selected == sales_options.gift_card_type.redeem){
        this.mapSalePrepaidServiceToGiftCardRedeem()
      }
    },
    onInputSalePrepaidServiceUseNow(){
      this.mapSalePrepaidServiceUseNowToDeductService()
    },
    onInputSalePrepaidServiceUseNowQuantity(){
      this.onInputPrepaidServiceUseNowQuantity(this.sale_prepaid_service_extend)
      this.mapSalePrepaidServiceUseNowToDeductService()
    },

    // customize prepaid service
    onSelectedCustomizePrepaidService(selected_service){
      this.sales_items_selected.type = sales_options.sales_goods_type.customize_prepaid_service
      this.mapSelectedServiceToCustomizePrepaidService(selected_service)

      this.customize_prepaid_service_extend = {
        use_now: false,
        use_now_quantity: 1
      }
    },
    mapSelectedServiceToCustomizePrepaidService(selected_service){
      this.customize_prepaid_service.mapFieldFromService(selected_service)
      this.customize_prepaid_service.fields.validity = 12
      this.generateCustomizePrepaidServiceName()
    },
    mapCustomizePrepaidServiceToSalesItems(customize_prepaid_service){
      let tmp_sales_items = []
      let tmp_sales_item = new SalesItemViewModel()
      
      tmp_sales_item.fields.goods_ref           = customize_prepaid_service
      tmp_sales_item.fields.goods_type          = sales_options.sales_goods_type.prepaid_service
      tmp_sales_item.fields.goods_category_id   = customize_prepaid_service.service_category_id
      tmp_sales_item.fields.goods_category_name = customize_prepaid_service.service_category_name
      tmp_sales_item.fields.goods_id            = customize_prepaid_service.related_service_id
      tmp_sales_item.fields.goods_name          = customize_prepaid_service.name
      tmp_sales_item.fields.unit_price          = customize_prepaid_service.price
      tmp_sales_item.fields.amount              = customize_prepaid_service.price
      tmp_sales_item.fields.key                 = customize_prepaid_service.key
      
      tmp_sales_item.fields.prepaid_goods_guid              = guid()
      tmp_sales_item.fields.deducted_prepaid_goods_ref_name = customize_prepaid_service.name
      tmp_sales_item.fields.prepaid_goods_expiry_date_ts    = this.getPrepaidGoodsExpiryDateTS(customize_prepaid_service.validity, customize_prepaid_service.validity_type)
      tmp_sales_item.fields.prepaid_service_initial_quantity= Number(customize_prepaid_service.quantity)
      tmp_sales_item.fields.related_service_id              = customize_prepaid_service.related_service_id
      tmp_sales_item.fields.related_service_name            = customize_prepaid_service.related_service_name
      tmp_sales_item.fields.related_service_unit_price      = customize_prepaid_service.unit_price

      tmp_sales_item.fields.is_head_quarter_goods         = false
      tmp_sales_item.fields.is_customize_prepaid_goods    = true
      tmp_sales_items.push(tmp_sales_item.getFields())

      this.sales_items_selected.items = tmp_sales_items

      if(this.customize_prepaid_service_extend.use_now && this.customize_prepaid_service_extend.use_now_quantity > 0){
        let tmp_sales_item = new SalesItemViewModel()
        
        tmp_sales_item.fields.goods_type          = sales_options.sales_goods_type.prepaid_service
        tmp_sales_item.fields.goods_category_id   = customize_prepaid_service.service_category_id
        tmp_sales_item.fields.goods_category_name = customize_prepaid_service.service_category_name
        tmp_sales_item.fields.goods_id            = customize_prepaid_service.related_service_id
        tmp_sales_item.fields.goods_name          = customize_prepaid_service.related_service_name
        tmp_sales_item.fields.unit_price          = customize_prepaid_service.unit_price
        tmp_sales_item.fields.amount              = 0 // When DeductionType is PrepaidService, The Amount's value must be zero
        tmp_sales_item.fields.key                 = customize_prepaid_service.key

        tmp_sales_item.fields.prepaid_goods_guid              = guid()
        tmp_sales_item.fields.deduction_type                  = sales_options.deduction_type.prepaid_service
        tmp_sales_item.fields.deducted_prepaid_goods_ref_name = customize_prepaid_service.name
        tmp_sales_item.fields.deducted_by_prepaid_goods_guid  = this.sales_items_selected.items[0].prepaid_goods_guid
        tmp_sales_item.fields.quantity                        = this.customize_prepaid_service_extend.use_now_quantity

        this.sales_items_selected.items.push(tmp_sales_item.getFields())
      }
    },
    onInputCustomizePrepaidServiceUnitPrice(){
      this.updateCustomizePrepaidServiceAmount()
    },
    onInputCustomizePrepaidServiceQuantity(){
      this.updateCustomizePrepaidServiceAmount()
      this.generateCustomizePrepaidServiceName()
    },
    onInputCustomizePrepaidServiceQuantityNoLimit(){
      if(this.customize_prepaid_service.fields.quantity_no_limit){
        this.customize_prepaid_service.fields.quantity = -1

        if(this.customize_prepaid_service.fields.validity_no_limit)
          this.customize_prepaid_service.fields.validity_no_limit = false
      }
      else 
        this.customize_prepaid_service.fields.quantity = 0

      this.updateCustomizePrepaidServiceAmount()
      this.generateCustomizePrepaidServiceName()
    },
    updateCustomizePrepaidServiceAmount(){
      let tmp_unit_price = Number(this.customize_prepaid_service.fields.unit_price)
      let tmp_quantity = Number(this.customize_prepaid_service.fields.quantity)
      if(tmp_quantity >= 0){
        this.customize_prepaid_service.fields.price = tmp_unit_price * tmp_quantity
      }
    },
    onInputCustomizePrepaidServiceValidityType(){
      if(this.customize_prepaid_service.fields.validity_type == options.validity_type.months){
        this.customize_prepaid_service.fields.validity = 12
      }
    },
    onInputCustomizePrepaidServiceValidityNolimit(){
      if(this.customize_prepaid_service.fields.validity_no_limit){
        this.customize_prepaid_service.fields.validity = -1

        if(this.customize_prepaid_service.fields.quantity_no_limit)
          this.customize_prepaid_service.fields.quantity_no_limit = false
      }
      else
        this.customize_prepaid_service.fields.validity = 0
    },
    onInputCustomizePrepaidServiceUseNowQuantity(){
      this.onInputPrepaidServiceUseNowQuantity(this.customize_prepaid_service_extend)
    },
    generateCustomizePrepaidServiceName(){
      let tmp_service_name = this.customize_prepaid_service.fields.related_service_name
      let tmp_quantity     = this.customize_prepaid_service.fields.quantity
      if(tmp_quantity == -1)
        tmp_quantity = this.text_no_limit
      this.customize_prepaid_service.fields.name = `${tmp_service_name} ${tmp_quantity} ${this.text_times}`
    },

    // staffs
    onInputStaff(staff_id){
      let tmp_staffs = this.staff_options.filter(s => s.staff_id == staff_id)
      if(tmp_staffs.length > 0){
        this.staff.setFields(tmp_staffs[0])
      }
    },

    // alert confirm
    onAlertConfirm(){
      this.setSalesActionShowedGoodsType(this.alert_sales_goods_type)
      this.viewGoodsTypeContent()
    },
    onAlertCancel(){
      this.hideDialogById(this.alert_id)
    },

    async onConfirm(){
      // prepaid card deposit
      if(this.sales_items_selected.type == sales_options.sales_goods_type.prepaid_card){
        // get card
        let tmp_prepaid_card         = this.$refs.sales_item_prepaid_cards.prepaid_card.fields
        let tmp_gift_card_type       = this.$refs.sales_item_prepaid_cards.gift_card_type
        let tmp_prepaid_cards_merged = this.$refs.sales_item_prepaid_cards.prepaid_cards_merged
        this.onSelectedPrepaidCard(tmp_prepaid_card, tmp_gift_card_type, tmp_prepaid_cards_merged)

        // customize card
        if(this.prepaid_card_selected.fields.id == sales_options.max_value_goods_id){
          let errors = this.prepaid_card_selected.isValid()
          if(errors.length > 0){
            let tmp_errors = []
            for(let error of errors){
              let tmp_error = error.replace('price', 'sales price')
              tmp_error = tmp_error.replace('charge amount', 'initial balance')
              tmp_errors.push(tmp_error)
            }
            this.showAlert(tmp_errors)
            return
          }
        }
        // deposit card
        if(this.prepaid_card_add_to_store.fields.id != 0){
          for(let tmp_balance_move of this.prepaid_cards_balance_moves){
            if(isNaN(tmp_balance_move.from_client_prepaid_card_id)){
              this.showAlert([this.warning_prepaid_card_can_not_merge_from_merged_card])
              return
            }
          }

          let tmp_balance_moves = [...this.x_sales_action_helper.balance_moves, ...this.prepaid_cards_balance_moves]
          this.setSalesActionHelperBalanceMoves(tmp_balance_moves)
          this.updatePrepaidCardInStore()
        }
        // discount card
        if(this.prepaid_card_discount_add_to_store.fields.id != 0){
          let tmp_client_prepaid_cards_all = this.x_sales_action_helper.client_prepaid_cards_all
          tmp_client_prepaid_cards_all.push(this.prepaid_card_discount_add_to_store.fields)
          this.setSalesActionHelperClientPrepaidCardsAll(tmp_client_prepaid_cards_all)
        }
      }

      // deduct prepaid services
      if(this.sales_items_selected.type == sales_options.sales_goods_type.deduct_prepaid_service){
        for(let deduct_prepaid_service of this.deduct_prepaid_services_selected){
          let tmp_same_deduct_prepaid_services = this.sales_items_selected.items.filter(ps => ps.goods_id == deduct_prepaid_service.related_service_id)
          let tmp_deduct_quantity_selected = tmp_same_deduct_prepaid_services.reduce((sum, ps) => sum + Number(ps.quantity), 0)
          let tmp_deduct_quantity_max = deduct_prepaid_service.quantity
          
          if(tmp_deduct_quantity_max != -1 && tmp_deduct_quantity_selected > tmp_deduct_quantity_max){
            this.showAlert([this.warning_deduct_qty_larger_existing_qty])
            return
          }
        }
        // update store
        for(let sales_item of this.sales_items_selected.items){
          let deducted_prepaid_goods_ref = sales_item.deducted_prepaid_goods_ref   // deducted from existing prepaid service
          if(!sales_item.deducted_prepaid_goods_ref > 0){
            deducted_prepaid_goods_ref = sales_item.deducted_by_prepaid_goods_guid // deducted from new prepaid service
          }
          let tmp_client_prepaid_service_ref = _.find(this.x_sales_action_helper.client_prepaid_services_all, ps => ps.id == deducted_prepaid_goods_ref)

          if(tmp_client_prepaid_service_ref != undefined && tmp_client_prepaid_service_ref.initial_quantity != -1){
            let tmp_quantity = tmp_client_prepaid_service_ref.quantity - sales_item.quantity
            this.updateClientPrepaidServiceQuantityToStore(tmp_client_prepaid_service_ref.id, tmp_quantity)
          }
        }
      }

      // sale prepaid service
      if(this.sales_items_selected.type == sales_options.sales_goods_type.sale_prepaid_service){
        if(this.sales_items_selected.items[0].gift_card_type != sales_options.gift_card_type.sales){
          if(this.sale_prepaid_service_extend.use_now && this.sale_prepaid_service.fields.quantity != -1){
            if(this.sale_prepaid_service_extend.use_now_quantity > this.sale_prepaid_service.fields.quantity){
              this.showAlert([this.warning_deduct_qty_larger_existing_qty])
              return
            } 
            else {
              // change quantity by use-now
              this.client_prepaid_service_add_to_store.fields.quantity -= this.sale_prepaid_service_extend.use_now_quantity
            }
          }
          // update store
          let tmp_client_prepaid_service_add_to_store = _.cloneDeep(this.client_prepaid_service_add_to_store)
          this.addItemToClientPrepaidServicesAll(tmp_client_prepaid_service_add_to_store.getFields())
        }
      }

      // customize prepaid service
      if(this.sales_items_selected.type == sales_options.sales_goods_type.customize_prepaid_service){
        if(this.customize_prepaid_service.fields.related_service_id > 0){
          let errors = this.customize_prepaid_service.isValid(true)
          if(errors.length == 0){
            if(this.customize_prepaid_service.fields.quantity != -1
            && this.customize_prepaid_service_extend.use_now
            && this.customize_prepaid_service_extend.use_now_quantity > this.customize_prepaid_service.fields.quantity){
              this.showAlert([this.warning_deduct_qty_larger_existing_qty])
              return
            }
            else {
              this.mapCustomizePrepaidServiceToSalesItems(this.customize_prepaid_service.getFields())
            }
          }
          else {
            this.showAlert(errors)
            return
          }
        }
      }

      // staffs
      for(let sales_item of this.sales_items_selected.items){
        if(this.staff.fields.staff_id > 0){
          let tmp_item_amount = sales_item.amount
          if(sales_item.deduction_type == sales_options.deduction_type.prepaid_service){
            tmp_item_amount = sales_item.quantity * sales_item.unit_price
          }
          this.staff.fields.amount = tmp_item_amount
          sales_item.staffs = [_.cloneDeep(this.staff.fields)]
        }
        else 
          sales_item.staffs = []
      }
      this.$emit('add-sales-items', this.sales_items_selected.items)
      this.hideModal()
    },
    updateClientPrepaidServiceQuantityToStore(client_prepaid_service_id, new_quantity){
      let tmp_client_prepaid_service_changed_quantity = {
        id          : client_prepaid_service_id,
        new_quantity: new_quantity
      }
      this.updateItemQuantityToClientPrepaidServicesAll(tmp_client_prepaid_service_changed_quantity)
    },
  }
}
</script>

<style lang='scss'>
@import './sales-items-adding-action.scss';
</style>