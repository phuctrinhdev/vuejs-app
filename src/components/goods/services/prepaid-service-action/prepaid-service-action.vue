<template>
  <div>
    <b-modal id="prepaid-service-action-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             class="prepaid-service-action-modal"
             @show="onLoadForm()">
      <form class="form-wrapper clearfix">
        <div class="row form-group clearfix">
          <div class="col-12 col-sm-5">
            <label>{{ $t('prepaid-services.category') }}</label>
          </div>
          <div class="col-12 col-sm-7">
            <b-form-select v-model="prepaid_service.fields.service_category_id" 
                           :options="category_options" :disabled="!allow_edit"
                           value-field="id" text-field="name" 
                           @input="onChangeServiceCategory"/>
          </div>
        </div>

        <div class="row form-group clearfix">
          <div class="col-12 col-sm-5">
            <label>{{ $t('prepaid-services.service-name') }}</label>
          </div>
          <div v-show="action_data.action == options.form_actions.add" class="col-12 col-sm-7">
            <b-form-select v-model="prepaid_service.fields.related_service_id" 
                           :options="service_options" 
                           :disabled="!allow_edit"
                           value-field="id" text-field="name"/>
          </div>
          <div v-show="action_data.action == options.form_actions.edit" class="col-12 col-sm-7">
            <div class="form-control disabled">{{ prepaid_service.fields.related_service_name }}</div>
          </div>
        </div>

        <div class="row form-group clearfix">
          <div class="col-12 col-sm-5">
            <label class="require">{{ $t('prepaid-services.prepaid-service-name') }}</label>
          </div>
          <div class="col-12 col-sm-7">
            <b-form-input v-model="prepaid_service.fields.name" :disabled="!allow_edit" type="text"/>
          </div>
        </div>

        <div class="row form-group clearfix">
          <div class="col-12 col-sm-5">
            <label class="require">{{ $t('prepaid-services.unit-price') }}</label>
          </div>
          <div class="col-12 col-sm-7">
            <input-money v-model="prepaid_service.fields.unit_price" :disabled="!allow_edit" @input="onCalculateSalesPrice" />
          </div>
        </div>

        <div class="row form-group clearfix">
          <div class="col-12 col-sm-5">
            <label class="require">{{ $t('prepaid-services.quantity') }}</label>
          </div>
          <div class="col-12 col-sm-7">
            <input-money v-model="prepaid_service.fields.quantity" :disabled="prepaid_service.fields.quantity_no_limit ||!allow_edit" 
                         @input="onCalculateSalesPrice"/>
            <b-form-checkbox v-model="prepaid_service.fields.quantity_no_limit" :value="true" :unchecked-value="false" 
                             :disabled="!allow_edit"
                             class="no-limit" @input="onCheckQuantityNoLimit">{{ $t('prepaid-services.no-limit') }}</b-form-checkbox>
          </div>
        </div>

        <div class="row form-group clearfix">
          <div class="col-12 col-sm-5">
            <label class="require">{{ $t('prepaid-services.sales-price') }}</label>
          </div>
          <div class="col-12 col-sm-7">
            <input-money v-model="prepaid_service.fields.price" :disabled="!allow_edit" />
          </div>
        </div>

        <div class="row form-group clearfix salary">
          <div class="col-12 col-sm-5">
            <label>{{ $t('prepaid-services.salary-sales') }}</label>
          </div>
          <div class="col-12 col-sm-3">
            <input-money v-model="prepaid_service.fields.salary_sales_value" :disabled="!allow_edit"/>
          </div>
          <div class="col-12 col-sm-3 row">
            <radio-group v-model="prepaid_service.fields.salary_sales_type" :options="options.option_salary_type" :disabled="!allow_edit" 
                         :buttons="true"/>
          </div>
        </div>

        <div class="row form-group clearfix validity">
          <div class="col-12 col-sm-5">
            <label class="require">{{ $t('prepaid-services.validity') }}</label>
          </div>
          <div class="col-12 col-sm-3">
            <input-money v-model="prepaid_service.fields.validity" :disabled="prepaid_service.fields.validity_no_limit || !allow_edit"/>
          </div>
          <div class="col-12 col-sm-3 row">
            <radio-group v-model="prepaid_service.fields.validity_type" :options="options.option_validity_type" 
                         :disabled="prepaid_service.fields.validity_no_limit || !allow_edit" :buttons="true"
                         @input="onChangeValidityType"/>
          </div>
          <div class="col-12 offset-sm-5 col-sm-7">
            <b-form-checkbox v-model="prepaid_service.fields.validity_no_limit" :value="true" :unchecked-value="false" 
                             :disabled="!allow_edit"
                             class="no-limit" @input="onCheckValitidyNoLimit">{{ $t('prepaid-services.no-limit') }}</b-form-checkbox>
          </div>
        </div>

        <div v-if="action_data.action != options.form_actions.add" class="row form-group clearfix status">
          <div class="col-12 col-sm-5">
            <label>{{ $t('general.status') }}</label>
          </div>
          <div class="col-12 col-sm-7">
            <radio-group v-model="prepaid_service.fields.status" :options="options.option_goods_status" :buttons="true" 
                         :disabled="!allow_edit"/>
          </div>
        </div>
      </form>

      <error-box :errors="prepaid_service_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>

    <alert-confirm :id="alert_id" :title="alert_title" :data_alerts="[$t('prepaid-services.warning-different-price')]"
                   :label_no="alert_label_no"
                   @confirm="onAlertConfirmAsync" @cancel="onAlertRecalculate"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { options }              from '../../../../helpers/options'
import PrepaidServiceViewModel  from '../../../../view-model/goods/prepaid-service-view-model.js'
import PrepaidServiceApi        from '../../../../api/goods/prepaid-service-api.js'
import ServiceApi               from '../../../../api/goods/service-api.js'

import component_base           from '../../../common/component-base/component-base'
import input_money              from '../../../common/form/input/input-money/input-money.vue' 
import radio_group              from '../../../common/form/radio/radio-group/radio-group' 
import error_box                from '../../../common/form/error-box/error-box' 
import btn_action_group         from '../../../common/button/btn-action-group/btn-action-group'
import alert_confirm            from '../../../common/alert/alert-confirm' 

export default {
  components: {
    'input-money': input_money,
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'alert-confirm': alert_confirm,
  },
  extends: component_base,
  data(){
    return {
      options,

      form_options: {
        delete: false,
        confirm: true
      },
      alert_id :'service_confirm_id',
      alert_title: '',
      
      category_options:[],
      service_options:[],

      prepaid_service: new PrepaidServiceViewModel(),
      prepaid_service_errors: [],

      submit_api_action: '',
      submit_success_action: '',
      allow_edit: true
    }
  },
  computed: {
    ...mapGetters('prepaid_service', {
      action_data: 'getPrepaidServiceAction',
    }),
    ...mapGetters('service_category', {
      categorys: 'getServiceCategory'
    }),
    ...mapGetters('service', {
      services: 'getService'
    }),
    form_title(){
      let tmp_title = ''
      if(this.action_data.action == options.form_actions.add)  tmp_title = this.$i18n.t('prepaid-services.prepaid-service-add')
      if(this.action_data.action == options.form_actions.edit) tmp_title = this.$i18n.t('prepaid-services.prepaid-service-edit')
      return tmp_title
    },
    alert_label_no(){return this.$i18n.t('prepaid-services.recalculate')}
  },
  methods: {
    hideModal(){
      this.hideDialogById('prepaid-service-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.category_options = this.categorys.data.items
      this.allow_edit = true
      if(this.action_data.action == options.form_actions.add) {
        this.form_options.confirm = true
        this.prepaid_service = new PrepaidServiceViewModel()
        this.prepaid_service.fields.service_category_id = this.action_data.data.category
        this.prepaid_service.fields.related_service_id = this.action_data.data.id
      }
      if(this.action_data.action == options.form_actions.edit){
        if(this.action_data.data.shared_service)
        {
          this.allow_edit = false
          this.form_options.confirm = false
        }    
        else this.form_options.confirm = true
        this.prepaid_service.fields = Object.assign(this.prepaid_service.fields, this.action_data.data)
        if(this.prepaid_service.fields.quantity == options.enum_no_limit) this.prepaid_service.fields.quantity_no_limit = true
        if(this.prepaid_service.fields.validity == options.enum_no_limit) this.prepaid_service.fields.validity_no_limit = true
      }
      this.prepaid_service_errors = []
    },
    async onChangeServiceCategory(){
      let param = {
        category: this.prepaid_service.fields.service_category_id,
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }

      let service_api = new ServiceApi()
      let result = await service_api.getServicesAsync(param)

      if(result.is_ok){
        this.service_options = result.data.items.filter(item=>item.related_service_id == undefined)
      } 
      else this.prepaid_service_errors = result.error_messages
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add) this.updateSubmitInfo('addPrepaidServiceAsync', 'reload-page')
      if(this.action_data.action == options.form_actions.edit) this.updateSubmitInfo('updatePrepaidServiceAsync', 'update-page-prepaid')
      this.submitActionAsync()
    },
    updateSubmitInfo(api_action, success_action){
      this.submit_api_action     = api_action
      this.submit_success_action = success_action
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(){
      this.prepaid_service.fields = Object.assign(this.prepaid_service.fields, this.shop_data)
      
      // validate
      this.prepaid_service_errors = this.prepaid_service.isValid()
      if(this.prepaid_service_errors.length == 0) {
        if(this.isDifferentSalesPrice() && !this.prepaid_service.fields.quantity_no_limit) 
          this.showDialogById(this.alert_id)
        else await this.savePrepaidServiceAsync()
      }
    },
    async savePrepaidServiceAsync(){
      this.preLoader()
      let prepaid_service_api = new PrepaidServiceApi() 
      let result = await prepaid_service_api[this.submit_api_action](this.prepaid_service)
      this.preLoader(false)
      
      if(result.is_ok) {
        this.actionSuccess(result, this.submit_success_action)
      }
      else this.prepaid_service_errors = result.error_messages
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else this.prepaid_service_errors = result.error_messages
    },
    isDifferentSalesPrice(){
      let different = false
      let tmp_price = this.calculateSalesPrice()
      if(tmp_price != Number(this.prepaid_service.fields.price)) different = true
      return different
    },
    async onAlertConfirmAsync(){
      await this.savePrepaidServiceAsync()
    },
    onAlertRecalculate(){
      this.onCalculateSalesPrice()
    },
    onCalculateSalesPrice(){
      if(!isNaN(this.prepaid_service.fields.unit_price) 
      && !isNaN(this.prepaid_service.fields.quantity) && !this.prepaid_service.fields.quantity_no_limit){
        this.prepaid_service.fields.price = this.calculateSalesPrice()
      }
    },
    calculateSalesPrice(){
      return Number(this.prepaid_service.fields.unit_price) * Number(this.prepaid_service.fields.quantity)
    },
    onCheckQuantityNoLimit(){
      if(this.prepaid_service.fields.quantity_no_limit) {
        this.prepaid_service.fields.quantity = options.enum_no_limit
        this.$set(this.prepaid_service.fields, 'validity_no_limit', false)
      }
      else {
        if(this.prepaid_service.fields.quantity == options.enum_no_limit)
          this.prepaid_service.fields.quantity = 0
      }
    },
    onCheckValitidyNoLimit(){
      if(this.prepaid_service.fields.validity_no_limit) {
        this.prepaid_service.fields.validity = options.enum_no_limit
        this.$set(this.prepaid_service.fields, 'quantity_no_limit', false)
      }
      else {
        if(this.prepaid_service.fields.validity == options.enum_no_limit)
          this.prepaid_service.fields.validity = 0
      }
    },
    onChangeValidityType (){
      if(this.prepaid_service.fields.validity_type == options.validity_type.months) this.prepaid_service.fields.validity = 12
    },
  }
}
</script>

<style lang="scss">
@import './prepaid-service-action.scss';
</style>