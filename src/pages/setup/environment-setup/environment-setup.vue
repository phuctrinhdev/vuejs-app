<template>
  <main class="app-content">
    <section class="contents-style environment-setup common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('environment-setup.environment-setup') }}</h3>
        </article>
        
        <div class="section-part">
          <div>
            <table class="second tal">
              <thead>
                <tr>
                  <td>{{ $t('environment-setup.basic') }}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.country') }}</dt>
                      <dd>
                        <input :value="formatCountry(shop_evnrionment_setup.fields.country_code)" type="text" class="w100p block" 
                               disabled >
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.currency') }}</dt>
                      <dd>
                        <input :value="formatCurrency(shop_evnrionment_setup.fields.country_code)" type="text" class="w100p block" 
                               disabled >
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.time-zone') }}</dt>
                      <dd>
                        <b-form-select v-model="shop_evnrionment_setup.fields.time_zone"
                                       :options="time_zone_options"
                                       class="custom-select w100p timezone" disabled/>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.value-added-tax') }}</dt>
                      <dd>
                        <span>
                          <input v-model="vat_rate" type="text" class="w70p" >
                        </span> 
                        <span>%
                        </span>
                        <span>
                          <button class="btn dib" @click="saveVATRateAsync">{{ $t('general.apply') }}</button>
                        </span>
                      </dd>
                    </dl>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-part">
          <div>
            <table class="second tal">
              <thead>
                <tr>
                  <td>{{ $t('environment-setup.sales') }}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.client-searching-default') }}</dt>
                      <dd>
                        <select v-model="client_environment_model.fields.client_search_condition" class="custom-select w100p" @change="onChangeClientSetup(CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.CLIENT_SEARCH_CONDITION)">>
                          <option :value="options.clients_enums.client_search_condition_type.name_or_phone">{{ $t('environment-setup.client-name-or-mobile') }}</option>    
                          <option :value="options.clients_enums.client_search_condition_type.name_or_number">{{ $t('environment-setup.client-name-or-member-no') }}</option>    
                          <option :value="options.clients_enums.client_search_condition_type.notes">{{ $t('environment-setup.notes') }}</option>             
                        </select>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.automatic-staff-selection-when-sales') }}</dt>
                      <dd>
                        <div class="switch">
                          <b-form-radio-group v-model="sales_general_setup.fields.auto_select_staff_when_sales" buttons @change="onChangeAutoSelectStaffWhenSalesAsync()">
                            <b-form-radio :value="common_options.yes_no.yes">{{ $t('general.yes') }}</b-form-radio>
                            <b-form-radio :value="common_options.yes_no.no">{{ $t('general.no') }}</b-form-radio>
                          </b-form-radio-group>
                        </div>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-omit-staff-when-adding-service-sales') }}</dt>
                      <dd>
                        <select v-model="sales_general_setup.fields.allow_omit_staff_when_add_service_sales" class="custom-select w100p" @change="onChangeSalesGeneralSetupAsync()">
                          <option :value="sales_options.omit_staff_type_enum.allow">{{ $t('environment-setup.allow') }}</option>                       
                          <option :value="sales_options.omit_staff_type_enum.not_allow">{{ $t('environment-setup.not-allow') }}</option>
                        </select>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-omit-staff-when-adding-product-sales') }}</dt>
                      <dd>
                        <select v-model="sales_general_setup.fields.allow_omit_staff_when_add_product_sales" class="custom-select w100p" @change="onChangeSalesGeneralSetupAsync()">
                          <option :value="sales_options.omit_staff_type_enum.allow">{{ $t('environment-setup.allow') }}</option>
                          <option :value="sales_options.omit_staff_type_enum.not_allow">{{ $t('environment-setup.not-allow') }}</option>
                        </select>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.discounts-input-window-default') }}</dt>
                      <dd>
                        <select v-model="sales_general_setup.fields.discount_input_default_window" class="custom-select w100p" @change="onChangeSalesGeneralSetupAsync()">
                          <option :value="sales_options.discount_input_default_window_type_enum.number_keypad">{{ $t('environment-setup.number-keypad') }}</option> 
                          <option :value="sales_options.discount_input_default_window_type_enum.discount_category">{{ $t('environment-setup.discount-category') }}</option>                     
                        </select>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.client-sales-information-default') }}</dt>
                      <dd>
                        <b-form-select v-model="sales_general_setup.fields.client_sales_information_default" 
                                       :options="sales_information_options" 
                                       class="custom-select w100p" 
                                       @change="onChangeSalesGeneralSetupAsync()" />
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.show-price-on-service-selection-wwindow') }}</dt>
                      <dd>
                        <div class="switch">
                          <b-form-radio-group v-model="sales_general_setup.fields.show_price_on_goods_selection_window" buttons @change="onChangeShowPriceOnGoodsSelectionWindowAsync()">
                            <b-form-radio :value="common_options.yes_no.yes">{{ $t('general.yes') }}</b-form-radio>
                            <b-form-radio :value="common_options.yes_no.no">{{ $t('general.no') }}</b-form-radio>
                          </b-form-radio-group>
                        </div>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.business-hours-ccriteria-for-sales-report') }}</dt>
                      <dd>
                        <b-form-select v-model="selected_hours" :options="range_of_hours" class="custom-select w100p" 
                                       @change="onChangeSalesGeneralSetupAsync()"/>
                      </dd>
                    </dl>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-part">
          <div>
            <table class="second tal">
              <thead>
                <tr>
                  <td>{{ $t('environment-setup.data-protection-and-security') }}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.hiding-client-phone-address-for-manager') }}</dt>
                      <dd>
                        <b-form-select v-model="client_environment_model.fields.contact_info_to_manager"
                                       :options="contact_info_hiding_type_options"
                                       class="custom-select w100p"  
                                       @change="onChangeClientSetup(CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.CONTACT_INFO_TO_MANAGER)"/>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.hiding-client-phone-address-for-staff') }}</dt>
                      <dd>
                        <!-- contact_info_hiding_type_options -->
                        <b-form-select v-model="client_environment_model.fields.contact_info_to_staff"
                                       :options="contact_info_hiding_type_options"
                                       class="custom-select w100p"
                                       @change="onChangeClientSetup(CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.CONTACT_INFO_TO_STAFF)"/>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-edit-client-information') }}</dt>
                      <dd>
                        <b-form-select v-model="client_environment_model.fields.allow_edit_client"
                                       :options="security_level_options"
                                       class="custom-select w100p"  
                                       @change="onChangeClientSetup(CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.ALLOW_EDIT_CLIENT)"/>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-delete-client-information') }}</dt>
                      <dd>
                        <b-form-select v-model="client_environment_model.fields.allow_delete_client"
                                       :options="security_level_options"
                                       class="custom-select w100p"  
                                       @change="onChangeClientSetup(CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.ALLOW_DELETE_CLIENT)"/>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-edit-balance-loyaltypoints-prepaidservices-remaining') }}</dt>
                      <dd>
                        <b-form-select v-model="data_protection_security.fields.allow_edit_balance_royalty_points_prepaid_services_remaining" 
                                       :options="security_level_options" 
                                       class="custom-select w100p" 
                                       @change="onChangeDataProtectionAndSecurityAsync()" />
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-edit-before-today-sales-invoices') }}</dt>
                      <dd>
                        <b-form-select v-model="data_protection_security.fields.allow_edit_before_today_sales_invoices" 
                                       :options="security_level_options" 
                                       class="custom-select w100p" 
                                       @change="onChangeDataProtectionAndSecurityAsync()" />
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-edit-today-sales-invoices') }}</dt>
                      <dd>
                        <b-form-select v-model="data_protection_security.fields.allow_edit_today_sales_invoices" 
                                       :options="security_level_options" 
                                       class="custom-select w100p" 
                                       @change="onChangeDataProtectionAndSecurityAsync()" />
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-to-edit-invoice-date') }}</dt>
                      <dd>
                        <b-form-select v-model="data_protection_security.fields.allow_edit_invoice_date" 
                                       :options="security_level_options" 
                                       class="custom-select w100p" 
                                       @change="onChangeDataProtectionAndSecurityAsync()" />
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.sales-report-and-invoices-date-range-a-manager-can-search') }}</dt>
                      <dd>
                        <b-form-select v-model="data_protection_security.fields.sales_report_and_invoices_date_range_manager_can_search" 
                                       :options="date_range_manager_search_options" 
                                       class="custom-select w100p" 
                                       @change="onChangeDataProtectionAndSecurityAsync()" />
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.sales-report-and-invoices-date-range-a-staff-can-search') }}</dt>
                      <dd>
                        <b-form-select v-model="data_protection_security.fields.sales_report_and_invoices_date_range_staff_can_search" 
                                       :options="date_range_options" 
                                       class="custom-select w100p" 
                                       @change="onChangeDataProtectionAndSecurityAsync()" />
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-a-manager-to-print-invoices-and-sales-report') }}</dt>
                      <dd>
                        <div class="switch">
                          <b-form-radio-group v-model="data_protection_security.fields.allow_manager_print_invoices_and_sales_report" buttons @change="onChangeAllowManagerPrintInvoicesSalesReportAsync()">
                            <b-form-radio :value="common_options.yes_no.yes">{{ $t('general.yes') }}</b-form-radio>
                            <b-form-radio :value="common_options.yes_no.no">{{ $t('general.no') }}</b-form-radio>
                          </b-form-radio-group>
                        </div>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.allow-a-staff-to-send-text-messages') }}</dt>
                      <div class="switch">
                        <b-form-radio-group v-model="type4_staff_txtmsg" buttons>
                          <b-form-radio value="active">{{ $t('general.yes') }}</b-form-radio>
                          <b-form-radio value="inactive">{{ $t('general.no') }}</b-form-radio>
                        </b-form-radio-group>
                      </div>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.use-id-rating-to-see-payroll') }}</dt>
                      <dd>
                        <select class="custom-select w100p">
                          <option value="">{{ $t('environment-setup.master') }}</option> 
                          <option value="">{{ $t('environment-setup.manager-and-master') }}</option>
                        </select>
                      </dd>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.send-login-alarm-text-messages') }}</dt>
                      <dd>
                        <div class="switch">
                          <b-form-radio-group v-model="message_setup_login.fields.status" buttons
                                              @change="onChangeMessageSetupLoginAsync()">
                            <b-form-radio :value="options.common_status.active">{{ $t('general.yes') }}</b-form-radio>
                            <b-form-radio :value="options.common_status.inactive">{{ $t('general.no') }}</b-form-radio>
                          </b-form-radio-group>
                        </div>
                        <div class="inbox mt5">
                          <span class="fz13">{{ $t('environment-setup.mobile-number') }}</span>
                          <span>
                            <input v-model="receiver_phone" 
                                   :disabled="message_setup_login.fields.status == options.common_status.inactive" type="text">
                          </span>
                          <span v-show="message_setup_login.fields.status == options.common_status.active">
                            <button class="btn dib" @click="onChangeReceiverPhoneAsync()">{{ $t('general.apply') }}</button>
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-part">
          <div>
            <table class="second tal">
              <thead>
                <tr>
                  <td>{{ $t('environment-setup.etc') }}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <dl class="clearfix">
                      <dt>{{ $t('environment-setup.net-money-alarm') }}</dt>
                      <dd>
                        <div class="switch">
                          <b-form-radio-group v-model="shop_evnrionment_setup.fields.netmoney_alarm" buttons @change="onChangeNetmoneyAlarmAsync()">
                            <b-form-radio :value="common_options.yes_no.yes">{{ $t('general.yes') }}</b-form-radio>
                            <b-form-radio :value="common_options.yes_no.no">{{ $t('general.no') }}</b-form-radio>
                          </b-form-radio-group>
                        </div>
                        <div class="inbox mt5">
                          <span class="fz13">{{ $t('environment-setup.if-less-than') }}</span>
                          <span>
                            <input-money v-model="netmoney_alarm_amount" :zero="true" :disabled="shop_evnrionment_setup.fields.netmoney_alarm == common_options.yes_no.no" 
                                         class="netmoney_alarm_amount" />
                          </span>
                          <span v-show="shop_evnrionment_setup.fields.netmoney_alarm == common_options.yes_no.yes">
                            <button class="btn dib" @click="onChangeNetmoneyAmountAsync()">{{ $t('general.apply') }}</button>
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import EnvironmentSetupAPI                from '../../../api/sales/environment-setup-api'
import ClientEnvironmentSetupApi          from '../../../api/clients/client-environment-setup-api'
import SalesGeneralSetupAPI               from '../../../api/sales/sales-general-setup-api' 
import DataProtectionAndSecurityAPI       from '../../../api/sales/data-protection-and-security-api'
import MessageSetupLoginApi               from '../../../api/message-autos/message-setup-login-api'
import ShopEnvironmentNetmoneyApi         from '../../../api/account/shop-environment-api'

import ClientEnvironmentSetupViewModel    from '../../../view-model/clients/client-environment-setup-view-model.js'

import SalesGeneralSetupViewModel         from '../../../view-model/sales/sales-general-setup-view-model.js'
import DataProtectionAndSecurityViewModel from '../../../view-model/sales/data-protection-and-security-view-model.js'
import ShopEnvironmentSetupViewModel            from '../../../view-model/account/shop-environment-setup-view-model'
import MessageSetupLoginViewModel         from '../../../view-model/message-autos/message-setup-login/message-setup-login-view-model'


import component_base                     from '../../../components/common/component-base/component-base'
import SalesCacheHelper                   from '../../../helpers/cache/sales-cache'
import ClientsCache                       from '../../../helpers/cache/clients-cache'
import { options }                        from '../../../helpers/options'
import { common_options }                 from '../../../helpers/options/common-options.js'
import { sales_options }                  from '../../../helpers/options/sales-options.js' 
import { CLIENTS_ENUMS }                  from '../../../config/constant'
import input_money                        from '../../../components/common/form/input/input-money/input-money.vue' 

export default {
  components: {
    'input-money': input_money,
  },
  extends: component_base,
  data() {
    return {
      sales_options,
      common_options,
      options,
      CLIENTS_ENUMS,
      shop_id                          : 0,
      client_environment_model         : {},
      sales_general_setup              : {},
      data_protection_security         : {},
      message_setup_login              : {},
      sales_general_setup_api          : {},
      data_protection_and_security_api : {},
      environment_setup_api            : {},
      message_setup_login_api          : {},
      shop_evnrionment_setup           : {},

      range_of_hours                   : [],
      selected_hours                   : '00:00',
      type2_show_price_service         : 'active',
      type4_staff_txtmsg               : 'inactive',
      type6_netmoney                   : 'active',
      checked                          : true,
      receiver_phone                   : null,
      temp_receiver_phone              : null,
      netmoney_alarm_amount            : 0,
      temp_netmoney_alarm_amount             : 0,
      vat_rate: 0
    }
  },
  computed:{
    date_range_options(){
      let date_range_options = []
      for(let index = 1 ; index <= sales_options.NUMBER_OF_DATE; index++){
        date_range_options[index] = {
          value : index, text : `${index} ${this.$i18n.t('general.days').toLowerCase()}`
        }
      }
      return date_range_options
    },
    date_range_manager_search_options(){
      let date_range = [
        {value : sales_options.sale_report_invoices_date_range_a_manager_can_search.forty_five_days , text : this.$i18n.t('environment-setup.forty-five-days')},
        {value : sales_options.sale_report_invoices_date_range_a_manager_can_search.sixty_days      , text : this.$i18n.t('environment-setup.sixty-days')},
        {value : sales_options.sale_report_invoices_date_range_a_manager_can_search.ninety_days     , text : this.$i18n.t('environment-setup.ninety-days')}
      ]
      return date_range
    },
    security_level_options(){
      let security_level = [
        {value : sales_options.security_level_enum.staff_or_higher    , text : this.$i18n.t('general.all')},
        {value : sales_options.security_level_enum.manager_or_higher  , text : this.$i18n.t('environment-setup.manager-and-master')},
        {value : sales_options.security_level_enum.master             , text : this.$i18n.t('environment-setup.master')}
      ]
      return security_level
    },
    sales_information_options(){
      let sales_information =  [
        {value : sales_options.client_sales_information_default_type_enum.sales_history     , text : this.$i18n.t('environment-setup.sales-history')},
        {value : sales_options.client_sales_information_default_type_enum.bookings          , text : this.$i18n.t('environment-setup.bookings')},
        {value : sales_options.client_sales_information_default_type_enum.prepaid_cards     , text : this.$i18n.t('environment-setup.prepaid-cards')},
        {value : sales_options.client_sales_information_default_type_enum.prepaid_services  , text : this.$i18n.t('environment-setup.prepaid-services')},
        {value : sales_options.client_sales_information_default_type_enum.messages          , text : this.$i18n.t('environment-setup.messages')},
        {value : sales_options.client_sales_information_default_type_enum.photos            , text : this.$i18n.t('environment-setup.photos')}
      ]
      return sales_information
    },
    contact_info_hiding_type_options(){
      let type = [
        {value : options.clients_enums.contact_info_hiding_type.showall                        , text : this.$i18n.t('environment-setup.show-all')},
        {value : options.clients_enums.contact_info_hiding_type.hide_except_registered_today   , text : this.$i18n.t('environment-setup.hide-except-registered-today')},
        {value : options.clients_enums.contact_info_hiding_type.hideall                        , text : this.$i18n.t('environment-setup.hide-all')}
      ]
      return type
    },
    time_zone_options(){
      let time_zone_type = [
        {value : options.time_zone_options.seoul, text : this.$i18n.t('general.time-zone-seoul')},
        {value : options.time_zone_options.ho_chi_minh, text : this.$i18n.t('general.time-zone-hochiminh')}
      ]
      return time_zone_type
    } 
  },
  created() {
    this.environment_setup_api            = new EnvironmentSetupAPI(),

    this.client_environment_setup_api     = new ClientEnvironmentSetupApi()
    this.client_environment_model         = new ClientEnvironmentSetupViewModel(),

    this.shop_evnrionment_setup           = new ShopEnvironmentSetupViewModel(),

    this.sales_general_setup_api          = new SalesGeneralSetupAPI(),
    this.sales_general_setup              = new SalesGeneralSetupViewModel(),

    this.data_protection_and_security_api = new DataProtectionAndSecurityAPI(),
    this.data_protection_security         = new DataProtectionAndSecurityViewModel()

    this.message_setup_login_api          = new MessageSetupLoginApi(),
    this.message_setup_login              = new MessageSetupLoginViewModel() 
    
    this.shop_id                          = this.shop_data.shop_id,

    this.shop_environment_netmoney_api          = new ShopEnvironmentNetmoneyApi(),
    this.generateRangeOfHours()
  },
  beforeMount(){
    this.loadDataTableAsync()
  },
  methods: {  
    async loadDataTableAsync() {
      this.preLoader()
      let result = await this.environment_setup_api.getEnvironmentSetupAsync(this.shop_id, this.shop_data.country)
      this.preLoader(false)
      if(result.is_ok){
        this.sales_general_setup      = result.data.salesGeneralSetup
        this.data_protection_security = result.data.salesDataProtectionAndSecuritySetup
        this.client_environment_model = result.data.clientEnvironmentSetup
        this.message_setup_login      = result.data.messageSetupLogin
        this.selected_hours           = this.sales_general_setup.fields.business_hours_for_sales_report_from
        this.shop_evnrionment_setup   = result.data.shopEnvironmentSetup
        SalesCacheHelper.setEnvironmentSetupToCache(this.shop_id,{
          sales_general_setup      : this.sales_general_setup,
          data_protection_security : this.data_protection_security,
          client_environment       : this.client_environment_model
        })
        this.receiver_phone = this.message_setup_login.fields.receiver_phone
        this.netmoney_alarm_amount = this.shop_evnrionment_setup.fields.netmoney_alarm_amount
        this.vat_rate = this.shop_evnrionment_setup.fields.vat_rate
      }
      else{
        this.showAlert(result.error_messages)
      }
    },

    async onChangeShowPriceOnGoodsSelectionWindowAsync(){
      this.sales_general_setup.fields.show_price_on_goods_selection_window = !this.sales_general_setup.fields.show_price_on_goods_selection_window
      await this.saveSalesGeneralSetupAsync()
    },

    async onChangeAutoSelectStaffWhenSalesAsync(){
      this.sales_general_setup.fields.auto_select_staff_when_sales = !this.sales_general_setup.fields.auto_select_staff_when_sales
      await this.saveSalesGeneralSetupAsync()
    },

    async onChangeSalesGeneralSetupAsync(){
      await this.saveSalesGeneralSetupAsync()
    },

    async onChangeAllowManagerPrintInvoicesSalesReportAsync(){
      this.data_protection_security.fields.allow_manager_print_invoices_and_sales_report = !this.data_protection_security.fields.allow_manager_print_invoices_and_sales_report
      await this.saveDataProtectionAndSecurityAsync()
    },

    async onChangeDataProtectionAndSecurityAsync(){
      await this.saveDataProtectionAndSecurityAsync()
    },

    async saveSalesGeneralSetupAsync(){
      let result = {}
      let errors = this.sales_general_setup.isValid()

      if(errors.length > 0){
        this.showAlert(errors)
      }
      else{
        this.sales_general_setup.fields.shop_id                              = this.shop_id
        this.sales_general_setup.fields.business_hours_for_sales_report_from = this.selected_hours
        this.sales_general_setup.fields.business_hours_for_sales_report_to   = this.selected_hours
        
        this.preLoader()
        result = await this.sales_general_setup_api.addOrUpdateSalesGeneralSetupAsync(this.sales_general_setup)
        this.preLoader(false)

        if(result.is_ok){
          this.sales_general_setup = result.data
          this.selected_hours      = this.sales_general_setup.fields.business_hours_for_sales_report_from
          SalesCacheHelper.setEnvironmentSetupToCache(this.shop_id,{
            sales_general_setup      : this.sales_general_setup,
            data_protection_security : this.data_protection_security,
            client_environment       : this.client_environment_model
          })

          SalesCacheHelper.clearAllSalesSetupCache()
        }
        else{
          this.showAlert(result.error_messages)
          let environment_setup_cache = await SalesCacheHelper.getEnvironmentSetupCacheAsync(this.shop_id)
          Object.assign(this.sales_general_setup, environment_setup_cache.sales_general_setup)
        }
      }
    },

    async saveDataProtectionAndSecurityAsync(){
      let result = {}
      let errors = this.data_protection_security.isValid()

      if(errors.length > 0){
        this.showAlert(errors)
      }
      else{
        this.data_protection_security.fields.shop_id = this.shop_id

        this.preLoader()
        result = await this.data_protection_and_security_api.addOrUpdateDataProtectionAndSecurityAsync(this.data_protection_security)
        this.preLoader(false)

        if(result.is_ok){
          this.data_protection_security = result.data
          SalesCacheHelper.setEnvironmentSetupToCache(this.shop_id,{
            sales_general_setup      : this.sales_general_setup,
            data_protection_security : this.data_protection_security,
            client_environment       : this.client_environment_model
          })

          SalesCacheHelper.clearAllSalesSetupCache()
        }
        else{
          this.showAlert(result.error_messages)
          let environment_setup_cache = await SalesCacheHelper.getEnvironmentSetupCacheAsync(this.shop_id)
          Object.assign(this.data_protection_security,environment_setup_cache.data_protection_security)
        }
      }
    },

    async onChangeReceiverPhoneAsync(){
      this.temp_receiver_phone = this.message_setup_login.fields.receiver_phone
      this.message_setup_login.fields.receiver_phone = this.receiver_phone
      await this.saveMessageSetupLoginAsync(true)
    },

    async onChangeMessageSetupLoginAsync(){
      if(this.message_setup_login.fields.status == options.common_status.active)
        this.message_setup_login.fields.status = options.common_status.inactive
      else
        this.message_setup_login.fields.status = options.common_status.active
      if(!(this.message_setup_login.fields.id == 0 && this.message_setup_login.fields.status == options.common_status.inactive)){
        this.receiver_phone = this.message_setup_login.fields.receiver_phone
        await this.saveMessageSetupLoginAsync()
      }
    },
    async saveMessageSetupLoginAsync(is_receiver_phone_change = false){
      this.message_setup_login.fields.country_code = this.shop_data.country
      let result = {}
      let errors = this.message_setup_login.isValid()

      if(errors.length > 0){
        this.showAlert(errors)
        if(is_receiver_phone_change) this.message_setup_login.fields.receiver_phone = this.temp_receiver_phone
      }
      else{
        this.message_setup_login.fields.shop_id = this.shop_id

        this.preLoader()
        result = await this.message_setup_login_api.addOrUpdateMessageSetupLoginAsync(this.message_setup_login)
        this.preLoader(false)

        if(result.is_ok){
          this.message_setup_login = result.data
        }
        else{
          this.showAlert(result.error_messages)
          if(is_receiver_phone_change) this.message_setup_login.fields.receiver_phone = this.temp_receiver_phone
        }
      }
    },
    async onChangeNetmoneyAmountAsync(){
      this.temp_netmoney_alarm_amount = this.shop_evnrionment_setup.fields.netmoney_alarm_amount
      this.shop_evnrionment_setup.fields.netmoney_alarm_amount = this.netmoney_alarm_amount
      await this.saveNetmoneyAlarmAsync(true)
    },
    async onChangeNetmoneyAlarmAsync(){
      if(this.shop_evnrionment_setup.fields.netmoney_alarm == common_options.yes_no.yes)
        this.shop_evnrionment_setup.fields.netmoney_alarm = common_options.yes_no.no
      else
        this.shop_evnrionment_setup.fields.netmoney_alarm = common_options.yes_no.yes
      if(this.shop_evnrionment_setup.fields.netmoney_alarm != common_options.yes_no.no){
        this.netmoney_alarm_amount = this.shop_evnrionment_setup.fields.netmoney_alarm_amount
      }
      await this.saveNetmoneyAlarmAsync()
    },
    async saveNetmoneyAlarmAsync(is_netmoney_alarm_amount_change = false){
      let result = {}
      let errors = this.shop_evnrionment_setup.isValid()

      if(errors.length > 0){
        this.showAlert(errors)
        if(is_netmoney_alarm_amount_change) this.shop_evnrionment_setup.fields.netmoney_alarm_amount = this.temp_netmoney_alarm_amount
      }
      else{
        this.shop_evnrionment_setup.fields.shop_id = this.shop_id
        this.preLoader()
        result = await this.shop_environment_netmoney_api.updateNetmoneyAsync(this.shop_evnrionment_setup)
        this.preLoader(false)

        if(result.is_ok){
          this.shop_evnrionment_setup.netmoney_alarm = result.data.netmoney_alarm
          this.shop_evnrionment_setup.netmoney_alarm_amount = result.data.netmoney_alarm_amount
        }
        else{
          this.showAlert(result.error_messages)
          if(is_netmoney_alarm_amount_change) this.shop_evnrionment_setup.fields.netmoney_alarm_amount = this.temp_netmoney_alarm_amount
        }
      }
    },

    async updateClientEnvironmentSetupAsync(setup_type, value){
      let send_data = {
        shop_id: this.shop_data.shop_id,
        value: value,
        setup_type: setup_type
      }
      //validate
      let client_environment_model_errors = this.client_environment_model.isValid() 
      if(client_environment_model_errors.length != 0) {
        this.showAlert(client_environment_model_errors)
        return
      }
      //save
      this.preLoader()
      let result = await this.client_environment_setup_api.updateEnvironmentSetupAsync(send_data)
      await (ms => new Promise(resolve => setTimeout(resolve, ms)))(250) //show applied feeling
      this.preLoader(false)
      if(result.is_ok) {
        this.client_environment_model.setFields(result.data)
        SalesCacheHelper.setEnvironmentSetupToCache(this.shop_id,{
          sales_general_setup      : this.sales_general_setup,
          data_protection_security : this.data_protection_security,
          client_environment       : this.client_environment_model
        })

        SalesCacheHelper.clearAllSalesSetupCache()
        ClientsCache.clearAllClientsSetupCache()
      }
      else {
        this.showAlert(result.error_messages)
      }
    },

    onChangeClientSetup(setup_type){
      let value=0
      switch(setup_type){
        case CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.ALLOW_DELETE_CLIENT: 
          value = this.client_environment_model.fields.allow_delete_client
          break
        case CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.ALLOW_EDIT_CLIENT:
          value = this.client_environment_model.fields.allow_edit_client
          break
        case CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.CLIENT_SEARCH_CONDITION: 
          value = this.client_environment_model.fields.client_search_condition
          break
        case CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.CONTACT_INFO_TO_MANAGER: 
          value = this.client_environment_model.fields.contact_info_to_manager
          break
        case CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.CONTACT_INFO_TO_STAFF: 
          value = this.client_environment_model.fields.contact_info_to_staff
          break
        default: return
      }
      this.updateClientEnvironmentSetupAsync(setup_type, value)
    },

    generateRangeOfHours(){
      for(let index = 0 ; index < sales_options.NUMBER_OF_HOURS; index++){
        this.range_of_hours[index] = index < 10 ? 
          {value : `0${index}:00`, text : `0${index}:00 - 0${index}:00`}:
          {value : `${index}:00`, text : `${index}:00 - ${index}:00`}
      }
    },
    formatCountry(country_code){
      if(country_code == options.country_code.kr) return options.country_name.kr
      if(country_code == options.country_code.vi) return options.country_name.vi
      if(country_code == options.country_code.cn) return options.country_name.cn
    },
    formatCurrency(country_code){
      if(country_code == options.country_code.kr) return 'KRW(₩)'
      if(country_code == options.country_code.vi) return 'VND(₫)'
    },
    async saveVATRateAsync(){
      let result = {}
      let data_send={
        shop_id : this.shop_id,
        vat_rate : this.vat_rate
      }
      this.preLoader()
      result = await this.shop_environment_netmoney_api.updateVATRateAsync(data_send)
      this.preLoader(false)

      if(result.is_ok){
        this.shop_evnrionment_setup.fields.vat_rate = result.data.vat_rate
      }
      else{
        this.showAlert(result.error_messages)
      }
    }
  }
}
</script>

<style lang='scss'>
@import './environment-setup.scss';
</style>