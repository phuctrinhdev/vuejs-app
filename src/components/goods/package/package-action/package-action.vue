<template>
  <div class="package-action-modal-wrapper">
    <b-modal id="package-action-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             class="package-action-modal" 
             @show="onLoadForm()" >
      <div class="form-wrapper"> 
        <div class="row">
          <div class="col-md-12 box-tap">
            <ul class="nav nav-tabs">
              <li v-for="tap in taps" :key="tap.id" class="nav-item">
                <a :class="{ 'nav-link':true , 'active': tap.active }" @click="onClickTab(tap)">{{ $t(tap.name) }}</a>
              </li> 
            </ul>
          </div>
        </div>
        <div class="row"> 
          <div class="col-md-10 ">
            <div class="row box-tap-content"> 
              <div class="col-md-6 no-padding"> 
                <service-item :class="{'hide': !taps[0].active}" @choose-item="onChooseItem" />
                <product-item ref="package_tab_product" :class="{'hide': !taps[1].active}" @choose-item="onChooseItem" />
                <prepaid-card-item :class="{'hide': !taps[2].active}" @choose-item="onChooseItem" />
                <prepaid-service-item :class="{'hide': !taps[3].active}" @choose-item="onChooseItem" />
              </div>
              <div class="col-md-6 no-padding"> 
                <div class="box-item-full"> 
                  <div class="row">
                    <div class="form-group packages-name"> 
                      <div class="col-md-12" >   
                        <label class="require">{{ $t('packages.packages-name') }}</label> 
                        <b-form-input v-model="packages.fields.name" type="text"/> 
                      </div>  
                    </div>
                    <div class="form-group "> 
                      <div class="col-md-12">{{ $t('packages.total-price') }}: {{ $n(packages.fields.total_amount) }} </div>
                    </div>
                    <div class="form-group "> 
                      <div class="col-md-12" >
                        <package-items-update :data="packages.fields" :show_delete="true" :class="{ 'hide': false }" 
                                              @delete-succeed="onDeletePackageItem" @load-succeed="onLoadSucceedPackageItem"/> 
                      </div>
                    </div> 
                    <div class="form-group" >
                      <div class="col-12 col-sm-5">  
                        <label>{{ $t('services.status') }}</label>
                      </div> 
                      <div class="col-12 col-sm-7">
                        <radio-group v-model="packages.fields.status" :options="options.option_goods_status" :buttons="true"/> 
                      </div> 
                    </div> 
                  </div> 
                </div>
              </div>
            </div> 

            <error-box :errors="packages_errors"/>
          </div> 
          <div class="col-md-2">  
            <div class="modal-footer">
              <btn-action-group :data="form_options" 
                                @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
            </div>
          </div>
        </div>
      </div>
      
    </b-modal> 
  </div>
</template>
<script> 
import { mapGetters } from 'vuex'
import { options } from '../../../../helpers/options'
import { GOODS_TYPE } from '../../../../config/constant'
import PackageViewModel from '../../../../view-model/goods/package-view-model.js'
import PackageApi from '../../../../api/goods/package-api.js'   
import package_items from '../package-item/package-items.vue' 
import service_item from '../service-item/service-items.vue' 
import product_item from '../product-item/product-items.vue' 
import prepaid_card_item from '../prepaid-card-item/prepaid-card-items.vue' 
import prepaid_service_item from '../prepaid-service-item/prepaid-service-items.vue' 
import error_box from '../../../common/form/error-box/error-box' 
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../../common/component-base/component-base'
import radio_group from '../../../common/form/radio/radio-group/radio-group' 

export default {
  components: {   
    'package-items-update': package_items, 
    'service-item': service_item, 
    'product-item': product_item, 
    'prepaid-card-item': prepaid_card_item, 
    'prepaid-service-item': prepaid_service_item, 
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'radio-group': radio_group,
  },
  extends: component_base,
  data(){
    return {
      options,
      packages: {},
      packages_errors: [],
      form_title: '', 
      form_options: {
        delete: false
      },
      taps:[
        { id:1, class:'nav-link', active:true,  is_emit:false,  name: 'packages.services'},
        { id:2, class:'nav-link', active:false, is_emit:false, name: 'packages.products'},
        { id:3, class:'nav-link', active:false, is_emit:false, name: 'packages.prepaid-cards'},
        { id:4, class:'nav-link', active:false, is_emit:false, name: 'packages.prepaid-services'}
      ] ,
      errors:[
        '',
        'validate_messages.package_product',
        'validate_messages.package_service',
        'validate_messages.package_prepaid_service',
        'validate_messages.package_prepaid_card', 
      ]
    }
  },
  computed: {
    ...mapGetters('packages', {
      action_data: 'getPackageAction'
    }) 
  },
  beforeMount(){
    this.packages = new PackageViewModel()
  }, 
  methods: { 
    onCancel(){
      this.hideModal()
    },  
    hideModal(){
      this.hideDialogById('package-action-modal')
    },
    onLoadForm(){
      this.loadTabDefault()
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('packages.packages-add')
        this.form_options.delete = false
        this.packages = new PackageViewModel()  
        this.packages.fields.items=[]
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('packages.packages-edit')
        this.form_options.delete = true
        this.packages.fields = Object.assign({}, this.action_data.data)  
      }
      if(this.packages.fields.validity == options.enum_no_limit){
        this.no_limit =true
      }else{
        this.no_limit =false
      }  
      this.packages_errors = []
    },
    loadTabDefault(){
      this.taps=[
        { id:1, class:'nav-link', active:true,  is_emit:true,  name: 'packages.services'},
        { id:2, class:'nav-link', active:false, is_emit:false, name: 'packages.products'},
        { id:3, class:'nav-link', active:false, is_emit:false, name: 'packages.prepaid-cards'},
        { id:4, class:'nav-link', active:false, is_emit:false, name: 'packages.prepaid-services'}
      ]
      this.$root.$emit('loadServiceItem')
    },
    async onClickTab(tap){
      for(let item in this.taps){
        if(tap.id == this.taps[item].id) {
          this.$set(this.taps[item], 'active', true)   
          if(this.taps[item].is_emit == false){
            if(tap.id==1 ){
              this.$root.$emit('loadServiceItem')
            } 
            else if(tap.id==2){ 
              this.$root.$emit('loadProductItem')
              await this.$refs['package_tab_product'].onClickSearch()
            }
            else if(tap.id==3){ 
              this.$root.$emit('loadPrepaidCardItem')
            } 
            else if(tap.id==4){ 
              this.$root.$emit('loadPrepaidServiceItem')
            }
            this.taps[item].is_emit = true
          }
        }
        else this.$set(this.taps[item], 'active', false)   
      }
    },
    onChooseItem(data){ 
      this.packages_errors=[]
      let package_item={}
      let validate = true 
      let count_type = 0
      package_item.item_type = data.type 
      package_item.goods_id = data.item.id
      package_item.name = data.item.name
      package_item.price = data.item.price  
      count_type =  this.packages.fields.items.filter(t=>t.item_type == data.type).length
      if(data.type == GOODS_TYPE.PRODUCT){ 
        package_item.price = data.item.retail_price 
        if(count_type >= 6){ 
          if(validate) validate =false 
        }
      } 
      else if(data.type == GOODS_TYPE.SERVICE){   
        if(count_type >= 6){ 
          if(validate) validate =false 
        }
      }  
      else if(data.type == GOODS_TYPE.PREPAID_CARD){     
        package_item.charge_amount = data.item.charge_amount  
        if(count_type >= 1){ 
          if(validate) validate =false 
        }
      }  
      else if(data.type == GOODS_TYPE.PREPAID_SERVICE){   
        if(count_type >= 8){ 
          if(validate) validate =false 
        }
      }  
      if(validate){
        this.packages.fields.items.push(package_item)
      }else{ 
        this.packages_errors.push(this.$i18n.t(this.errors[data.type]))
      }
      this.calculateTotalAmount() 
    },
    calculateTotalAmount(){
      this.packages.fields.total_amount = this.packages.fields.items.reduce((prev, cur) => {
        return prev + cur.price
      }, 0) 
    },
    onLoadSucceedPackageItem(package_items){  
      this.packages.fields.items=package_items
      this.calculateTotalAmount()
    },
    onDeletePackageItem(package_items){ 
      this.packages.fields.items=package_items
      this.calculateTotalAmount() 
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addPackageAsync', 'reload-page')
      } 
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updatePackageAsync', 'update-page')
      }
    },
    onDelete(){ 
      this.packages.fields.is_delete = true
      this.submitActionAsync('deletePackageAsync', 'reload-page')
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){    
      this.packages.fields = Object.assign(this.packages.fields, this.shop_data)
      // validate
      this.packages_errors = this.packages.isValid() 
      if(this.packages_errors.length == 0) {
        this.preLoader()
        let packages_api = new PackageApi()  
        let result = await packages_api[api_action](this.packages.fields)
        this.preLoader(false) 
        if(result.is_ok)
        {
          this.actionSuccess(result, success_action)  
        }
        else this.packages_errors = result.error_messages
      }
    },
    actionSuccess(result, action){
      if(result.is_ok){
        this.$emit(action, result.data)
        this.hideModal()
      } 
      else {
        this.packages_errors = result.error_messages
      } 
    }
  }
}
</script>

<style lang="scss">
@import './package-action.scss';
</style>