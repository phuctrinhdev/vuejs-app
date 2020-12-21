<template>
  <div class="service-action-modal-wrapper">
    <b-modal id="service-action-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             class="service-action-modal" 
             @show="onLoadForm()" >
      <form class="form-wrapper">
        <!-- Nav tabs -->
        <b-tabs content-class="mt-3" class="box-tap">
          <b-tab ref="details" :title="$t('services.details')" active> 
            <div class="row form-group ">
              <div class="col-12 col-sm-5">  
                <label class="require">{{ $t('services.category') }}</label>
              </div> 
              <div class="col-12 col-sm-7"> 
                <b-form-select v-model="service.fields.category" :placeholder="$t('services.category')"
                               :options="category_options" :disabled="!allow_edit" value-field="id" 
                               text-field="name" />  
              </div> 
            </div> 

            <div class="row form-group">
              <div class="col-12 col-sm-5">  
                <label class="require">{{ $t('services.service-name') }}</label>
              </div> 
              <div class="col-12 col-sm-7">
                <b-form-input v-model="service.fields.name" :disabled="!allow_edit" type="text" 
                              @blur="onChangeServiceName" />
              </div> 
            </div> 

            <div class="row form-group  ">
              <div class="col-12 col-sm-5">
                <label class="require">{{ $t('services.price') }}</label>
              </div> 
              <div class="col-12 col-sm-7">
                <input-money v-model="service.fields.price" :disabled="!allow_edit"/>
              </div> 
            </div> 

            <div class="row form-group ">
              <div class="col-12 col-sm-5" >  
                <label class="require">{{ $t('services.estimated-time') }}</label>
              </div> 
              <div class="col-6 col-sm-3" >   
                <b-form-select v-model="service.fields.estimated_time" :placeholder="$t('general.select')"
                               :options="time_options" :disabled="!allow_edit" value-field="id" 
                               text-field="name" />
              </div> 
              <div class="col-4 col-sm-3 row" >
                <span>{{ $t('services.minutes') }}</span>
              </div> 
            </div>

            <div class="row form-group "> 
              <div class="col-12 offset-sm-5">
                <b-form-checkbox v-model="service.fields.is_required_processing_time" :value="true" :disabled="!allow_edit">{{ $t('services.requires-processing-time') }}</b-form-checkbox>
              </div>
            </div>

            <div class="row form-group">
              <div class="col-12 col-sm-5">
                <label>{{ $t('services.processing-time') }}</label>
              </div> 
              <div class="col-6 col-sm-3">
                <b-form-select v-model="service.fields.processing_time" :placeholder="$t('general.select')"
                               :disabled="!service.fields.is_required_processing_time ||!allow_edit"  
                               :options="time_options" value-field="id" text-field="name" />   
              </div> 
              <div class="col-3 col-sm-2 row">
                <span >{{ $t('services.minutes') }}</span>
              </div> 
              <div class="col-2 col-sm-1">
                <a class="failcode-link" @click="onClickShowInfo()"/>
              </div> 
            </div>

            <div class="row form-group ">
              <div class="col-12 col-sm-5">
                <label >{{ $t('services.finishing-time') }}</label>
              </div> 
              <div class="col-6 col-sm-3">
                <b-form-select v-model="service.fields.finishing_time" :placeholder="$t('general.select')"
                               :disabled="!service.fields.is_required_processing_time || !allow_edit"
                               :options="time_options" value-field="id" text-field="name" />  
              </div> 
              <div class="col-3 col-sm-2 row">
                <span >{{ $t('services.minutes') }}</span>
              </div> 
            </div>

            <div class="row form-group salary-sales"> 
              <div class="col-12 col-sm-5">
                <label>{{ $t('services.salary-sales') }}</label>
              </div> 
              <div class="col-6 col-sm-3">
                <input-money v-model="service.fields.salary_sales_value" :disabled="!allow_edit"/>
              </div>
              <div class="col-12 col-sm-3 radio-group row">
                <radio-group v-model="service.fields.salary_sales_type" :options="options.option_salary_type" :buttons="true" 
                             :disabled="!allow_edit"/> 
              </div> 
            </div>

            <div class="row form-group">
              <div class="col-12 col-sm-5">
                <label>{{ $t('services.salary-deduction') }}</label>
              </div> 
              <div class="col-6 col-sm-3">
                <!-- :decimal="1" -->
                <input-money v-model="service.fields.salary_deduction_value" :decimal="0" :disabled="!allow_edit"/>
              </div>
            </div>   
            <div class="row form-group" >
              <div class="col-12 col-sm-5">
                <label>{{ $t('services.status') }}</label>
              </div> 
              <div class="col-12 col-sm-7">
                <radio-group v-model="service.fields.status" :options="options.option_goods_status" :buttons="true"      
                             :disabled="!allow_edit"/> 
              </div> 
            </div> 
          </b-tab>

          <b-tab :title="$t('services.online-booking')">
            <div class="row form-group "> 
              <div class="col-12 col-sm-5">  
                <label>{{ $t('services.enable-online-bookings') }}</label>
              </div> 
              <div class="col-12 col-sm-7" >
                <radio-group v-model="service.fields.enable_online_bookings" :options="options.option_yes_no" :buttons="true" 
                             :disabled="!allow_edit"/>
              </div>
            </div>

            <div class="row form-group">
              <div class="col-12 col-sm-5">
                <label>{{ $t('services.online-description') }}</label>
              </div> 
              <div class="col-12 col-sm-7">
                <b-form-input v-model="service.fields.online_description" :disabled="service.fields.same_as_service_name==true || !allow_edit"/>
                <b-form-checkbox v-model="service.fields.same_as_service_name" :value="true" :disabled="!allow_edit" 
                                 @change="onChangeSameServiceName">
                  {{ $t('services.same-as-service-name') }}</b-form-checkbox>
              </div> 
            </div> 
            
            <div class="row form-group">
              <div class="col-12"> 
                <label>{{ $t('services.service-details') }}</label> 
              </div>
              <div class="col-12"> 
                <b-form-textarea v-model="service.fields.service_details" :disabled="!allow_edit" rows="5" 
                                 max-rows="6"/>
              </div>
            </div>
            <div class="row form-group online-description">  
              <div class="col-12">{{ $t('services.online-description-note') }}</div>
            </div>
          </b-tab>

          <b-tab :title="$t('booking-resources.booking-resource')" @click="onBookingResourceClick">
            <div class="row form-group">
              <div class="col-7 col-md-8">
                <label>{{ $t('services.every-resources-can-perform-this-service') }}</label>
              </div>
              <div class="col-5 col-md-4 check-every-resource">
                <radio-group v-model="performing_resource.fields.is_available_for_all_resources" 
                             :options="options.option_yes_no" :buttons="true"/>
              </div>
            </div>
            <div v-if="performing_resource.fields.is_available_for_all_resources == options.yes_no.no" class="row form-group">   
              <div class="col-12">
                <label>{{ $t('services.choose-resources-can-perform-this-service') }}</label> 
              </div>  
              <div class="col-12">
                <b-form-group class="group-resource">
                  <b-form-checkbox-group v-model="performing_resource.fields.available_booking_resource_setups_ids" @change="onChangePerformingResources"> 
                    <b-form-checkbox v-for="item in booking_resources" :key="item.id" :value="item.id">
                      {{ item.resource_name }}</b-form-checkbox> 
                  </b-form-checkbox-group>
                </b-form-group>
              </div> 
            </div>   
          </b-tab>
        </b-tabs> 
      </form>

      <error-box :errors="service_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal> 
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { cache_session } from '../../../../helpers/common' 
import { options } from '../../../../helpers/options'
import ServiceViewModel from '../../../../view-model/goods/service-view-model.js'
import PerformingResourceViewModel from '../../../../view-model/goods/performing-resource-view-model.js'
import ServiceApi from '../../../../api/goods/service-api.js' 
import input_money from '../../../common/form/input/input-money/input-money.vue' 
//import { checkGoodsShared } from '../../../../config/permission'
import radio_group from '../../../../components/common/form/radio/radio-group/radio-group' 
import error_box from '../../../common/form/error-box/error-box' 
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../../common/component-base/component-base'

export default {
  components: { 
    'input-money':input_money,
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options, 

      form_options: {
        delete: false
      },

      service: new ServiceViewModel(),
      booking_setup: {},
      performing_resource: new PerformingResourceViewModel(),
      service_errors: [], 
      time_options:[],
      category_options:[], 
      booking_resources:[],
      alert: {
        title: this.$i18n.t('services.guide-title'),
        alerts: [
          this.$i18n.t('services.guide-content')
        ], 
      },
      allow_edit: true
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser',
    }),
    ...mapGetters('service', {
      action_data: 'getServiceAction'
    }),
    ...mapGetters('service_category', {
      categorys: 'getServiceCategory'
    }),
    form_title(){
      let tmp_title = ''
      if(this.action_data.action == options.form_actions.add)  tmp_title = this.$i18n.t('services.service-add')
      if(this.action_data.action == options.form_actions.edit) tmp_title = this.$i18n.t('services.service-edit')
      return tmp_title
    },
    performing_resource_alert_message(){
      return this.$i18n.t('services.canot-add-performing-resource')
    }
  },
  methods: {
    hideModal(){
      this.hideDialogById('service-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.preLoader()
      this.$refs.details.activate()
      this.loadTime()
     
      // set category options base user role
      this.category_options = this.categorys.data.items
      if(this.action_data.action == options.form_actions.add) {
        this.service = new ServiceViewModel() 
        this.performing_resource = new PerformingResourceViewModel()
        
        if(this.action_data.category.id > 0){
          this.service.fields.category=this.action_data.category.id
        }
      }
      if(this.action_data.action == options.form_actions.edit){
        if(this.action_data.data.shared_service) this.allow_edit = false  
        let query = {
          shop_id: this.shop_data.shop_id,
          status : this.action_data.data.status
        }
        
        let service_api = new ServiceApi()
        let result = await service_api.getServiceAsync(this.action_data.data.id, query)
     
        if(result.is_ok) {  
          this.performing_resource = result.data.performing_resource
          this.service =  result.data.service

          if(this.performing_resource.fields.is_available_for_all_resources == true){  
            this.$set(this.performing_resource.fields,'not_available_booking_resource_setups_ids', []) 
          } 
          if(this.service.fields.online_description == this.service.fields.name){
            this.$set(this.service.fields,'same_as_service_name', true)
          }
          else{ 
            this.$set(this.service.fields,'same_as_service_name', false)
          }
        }
        else {
          this.service_errors = result.error_messages
        }
      }
      if(this.service.fields.validity == options.enum_no_limit)
        this.no_limit = true
      else
        this.no_limit = false
      this.service_errors = []
      this.booking_resources = []
      this.preLoader(false)
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add ){
        this.submitActionAsync('addOrUpdateServiceAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('addOrUpdateServiceAsync', 'update-page')
      }
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.service.updateShopData(this.shop_data)
      this.performing_resource.updateShopData(this.shop_data) 
      
      // validate
      this.service_errors = this.service.isValid()
      if(this.service_errors.length == 0) {
        let service_data = {
          service: this.service,
          performing_resource: this.performing_resource
        }

        this.preLoader()
        let service_api = new ServiceApi()
        let result = await service_api[api_action](service_data)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result, success_action)
        else{
          if(!this.isNullObject(result.data.service) && this.isNullObject(result.data.performing_resource)){
            this.$emit(success_action, result.data.service)
            this.hideModal()
            let messages = [this.performing_resource_alert_message]
            this.showAlert([...messages, ...result.error_messages] )
          }
          else
            this.service_errors = result.error_messages
        }
      }
    },
    actionSuccess(result, action){
      if(result.is_ok){  
        this.$emit(action, result.data.service)
        this.hideModal()
      } 
      else {
        this.service_errors = result.error_messages
      } 
    },
    onChangeServiceName(){ 
      if(this.service.fields.same_as_service_name == true){
        this.service.fields.online_description = this.service.fields.name
      }
    },
    onChangeSameServiceName(value){ 
      this.performing_resource.fields.is_available_for_all_resources = value
      if(value){
        this.service.fields.online_description = this.service.fields.name
      } 
    },
    loadTime(){ 
      this.time_options=[]
      this.time_options.push({ id:0, name: this.$i18n.t('general.select') })
      for (var i = 5; i <= 300; i++) { 
        this.time_options.push({ id:i, name:i }) 
        i = i + 4
      }
    },
    onClickShowInfo(){
      this.showAlert(this.alert.alerts, {title: this.alert.title})
    },
    async onBookingResourceClick(){
      this.preLoader()
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      else{
        this.booking_resources = this.booking_setup.booking_resources_setup.items
        this.mapResourcesDataFromNotAvailToAvail()
      }
      this.preLoader(false)
    },
    onChangePerformingResources(available_booking_resources){
      this.mapResourcesDataFromAvailToNotAvail(available_booking_resources)
    },
    mapResourcesDataFromNotAvailToAvail(){
      let tmp_available_booking_resources = this.booking_setup.booking_resources_setup.items.map(r => r.id)
      tmp_available_booking_resources = _.difference(tmp_available_booking_resources, this.performing_resource.fields.not_available_booking_resource_setups_ids)
      this.performing_resource.fields.available_booking_resource_setups_ids = tmp_available_booking_resources
    },
    mapResourcesDataFromAvailToNotAvail(available_booking_resources){
      let tmp_not_available_booking_resources = this.booking_setup.booking_resources_setup.items.map(r => r.id)
      tmp_not_available_booking_resources = _.difference(tmp_not_available_booking_resources, available_booking_resources)
      this.performing_resource.fields.not_available_booking_resource_setups_ids = tmp_not_available_booking_resources
    }
  }
}
</script>

<style lang="scss">
@import './service-action.scss';
</style>