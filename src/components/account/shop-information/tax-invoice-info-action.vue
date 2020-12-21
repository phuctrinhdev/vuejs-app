<template>
  <div class="common-style add-item-modal">
    <b-modal :id="page_id"
             :title="form_title"
             :no-close-on-backdrop="true"           
             hide-footer
             @show="onLoadForm()">
      <div class="tax-invoice">
        <table class="normal">
          <tbody>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.issue-status') }}</td>
              <td class="tal">
                <radio-group
                  v-model="tax_invoice_info.fields.tax_invoice_request" 
                  :options="options.admin_enums.tax_invoice_request"
                  class="radio-common"
                  @change="onTaxRequstChange"/>
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.business-number') }} <strong class="color-red">*</strong></td>
              <td class="tal">
                <input v-model="tax_invoice_info.fields.business_number" type="text">
                <span class="fz13">(ex: 123-45-67890)</span>
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.sub-business-number') }}</td>
              <td class="tal">
                <input v-model="tax_invoice_info.fields.sub_business_number" type="text">
                <span class="fz13">(ex : 0001 / {{ $t('tax-invoice-info.sub-business-number-info') }})</span>
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.shop-name') }} <strong class="color-red">*</strong></td>
              <td class="tal">
                <div class="clearfix">
                  <div class="fll">
                    <input v-model="tax_invoice_info.fields.business_name" type="text"
                           @keydown="onClearCheck(origin_data_type.shop_name)">
                  </div> 
                  <div class="cutom-checkbox fll">
                    <b-form-checkbox 
                      v-model="same_checks[origin_data_type.shop_name]" 
                      :value="true" 
                      :unchecked-value="false"
                      class="mt5 ml5"
                      @change="onSetOriginData($event, origin_data_type.shop_name)"
                    >{{ $t('tax-invoice-info.same-info') }}</b-form-checkbox>                    
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.owner') }} <strong class="color-red">*</strong></td>
              <td class="tal">
                <input v-model="tax_invoice_info.fields.owner_name" type="text">
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.address') }} <strong class="color-red">*</strong></td>
              <td class="tal">
                <div class="clearfix mb5">
                  <input v-model="tax_invoice_info.fields.postcode" :disabled="isKorea" type="text"
                         class="block w100px fll"
                         @keydown="onClearCheck(origin_data_type.address)">
                  <a v-if="isKorea" class="btn secondary small text-long fll post-code-search" @click="onFindPostCodeKR">{{ $t('tax-invoice-info.postcode') }} {{ $t('general.search') }}</a>
                  <div class="cutom-checkbox fll ml5">
                    <b-form-checkbox 
                      v-model="same_checks[origin_data_type.address]" :value="true" :unchecked-value="false"
                      class="mt5 ml5"
                      @change="onSetOriginData($event, origin_data_type.address)"
                    >{{ $t('tax-invoice-info.same-address') }}</b-form-checkbox>                   
                  </div>
                </div>
                <input v-model="tax_invoice_info.fields.address1" :disabled="isKorea" type="text"
                       class="w100 mb5"
                       @keydown="onClearCheck(origin_data_type.address)">

                <input v-model="tax_invoice_info.fields.address2" type="text" 
                       class="w100"
                       @keydown="onClearCheck(origin_data_type.address)">
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.business-type') }} <strong class="color-red">*</strong></td>
              <td class="tal">
                <input v-model="tax_invoice_info.fields.business_type" type="text">
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.business-item') }} <strong class="color-red">*</strong></td>
              <td class="tal">
                <input v-model="tax_invoice_info.fields.business_item" type="text"> 
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.email-to-be-issued') }} <strong class="color-red">*</strong></td>
              <td class="tal">
                <div class="clearfix">
                  <div class="fll">
                    <input v-model="tax_invoice_info.fields.email" type="text"
                           @keydown="onClearCheck(origin_data_type.email)">
                  </div> 
                  <div class="cutom-checkbox fll">
                    <b-form-checkbox 
                      v-model="same_checks[origin_data_type.email]" :value="true" :unchecked-value="false"
                      class="mt5 ml5"
                      @change="onSetOriginData($event,origin_data_type.email)"
                    >{{ $t('tax-invoice-info.same-info') }}</b-form-checkbox>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="bg-th">{{ $t('tax-invoice-info.manager') }}</td>
              <td class="tal">
                <ul class="clearfix table-inner-fll">
                  <li class="fll">
                    <span class="fll text">{{ $t('tax-invoice-info.name') }}</span>
                    <span class="input-w fll"><input v-model="tax_invoice_info.fields.manager_name" type="text" class="w100"></span>
                  </li>
                  <li class="fll">
                    <span class="fll text">{{ $t('tax-invoice-info.phone') }}</span>
                    <span class="input-w fll"><input v-model="tax_invoice_info.fields.phone_number" type="text" class="w100"></span>
                  </li>
                  <li class="fll">
                    <span class="fll text">{{ $t('tax-invoice-info.mobile') }}</span>
                    <span class="input-w fll"><input v-model="tax_invoice_info.fields.mobile_number" type="text" class="w100"></span>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <error-box :errors="tax_invoice_info_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="hideModal"/>        
      </div>
      <find-postcode-kr v-if="isKorea" ref="find_postcode" @update-address = "setPostCodeKR"/>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { options } from '../../../helpers/options'
import radio_group from '../../common/form/radio/radio-group/radio-group'
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import find_postcode_kr    from '../../../components/common/find-postcode/find-postcode-kr'
import component_base          from '../../common/component-base/component-base'

import TaxInvoiceInfoViewModel from '../../../view-model/account/tax-invoice-info-view-model'
import TaxInvoiceInfoApi       from '../../../api/account/tax-invoice-info-api'
import ShopApi                 from '../../../api/account/shop-info-api'
import { ADMIN_ENUMS }         from '../../../config/constant'


export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'find-postcode-kr': find_postcode_kr
  },
  extends: component_base,  
  data(){
    return {
      isKorea: false,
      page_id: 'tax-invoice-info-action-modal',
      options : options,     

      form_title: this.$t('tax-invoice-info.tab-title'),
      form_options: {
        delete: false
      },

      tax_invoice_info: new TaxInvoiceInfoViewModel(),
      tax_invoice_info_errors: [],
      shop_info : null,      
      disabled_check: ADMIN_ENUMS.TAX_INVOICE_REQUEST.REQUIRED,    

      origin_data_type: {
        shop_name:0,
        address:1,
        email:2
      },
      same_checks: [false, false, false ]     
    }
  },
  computed: {
    ...mapGetters('shop', {
      action_data: 'getTaxInvoiceInfo'
    }),
  },  
  mounted(){
    this.isKorea = false
    if(this.shop_data.country == options.country_code.kr) this.isKorea= true
  },
  methods: {  
    onFindPostCodeKR() {
      this.$refs.find_postcode.onFindPostCodeKR()
    },	
    setPostCodeKR(postcode, address){
      this.tax_invoice_info.fields.postcode = postcode
      this.tax_invoice_info.fields.address1 =  address
      this.tax_invoice_info.fields.address2 = ''
    },
    async onLoadForm(){
      this.same_checks=[false,false,false]
      this.tax_invoice_info_errors = []

      if(this.action_data.action == options.form_actions.add) {
        this.tax_invoice_info = new TaxInvoiceInfoViewModel()
        this.tax_invoice_info.fields.shop_id = this.action_data.shop_id
        this.tax_invoice_info.fields.tax_invoice_request 
          = this.tax_invoice_info.setTaxInvoiceReqsutRemoveNotSelected(this.action_data.tax_invoice_request)
      }
      if(this.action_data.action == options.form_actions.edit){
        this.tax_invoice_info.fields = Object.assign({}, this.action_data.data)
      }      
    },    
    onConfirm(){
      this.tax_invoice_info_errors=[]
      if(this.action_data.action == options.form_actions.add){        
        this.submitActionAsync('createTaxInvoiceInfoAsync')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateTaxInvoiceInfoAsync')
      }
    },
    async submitActionAsync(api_action){
      if(this.tax_invoice_info.fields.tax_invoice_request == this.disabled_check){
        this.tax_invoice_info_errors = this.tax_invoice_info.isValid()
      }
      if(this.tax_invoice_info_errors.length == 0) {
        this.preLoader(true)
        let tax_invoice_info_api = new TaxInvoiceInfoApi()        
        let result = await tax_invoice_info_api[api_action](this.tax_invoice_info)
        this.preLoader(false)
        if(result.is_ok) {
          this.$emit('reload-page')
          this.hideModal()
        }
        else this.tax_invoice_info_errors = result.error_messages
      }
    },    
    async loadShopInfo(){
      let data_send = {
        shop_id: this.tax_invoice_info.fields.shop_id
      }
      this.preLoader(true)
      let shop_api = new ShopApi()
      let result = await shop_api.getShopInfoAsync(data_send)
      this.preLoader(false)
      this.shop_info=result
      if(result.is_ok){
        //        
      }
      else this.tax_invoice_info_errors = result.error_message
    },
    async onSetOriginData(e, type){         
      if (e !=true) return

      if (this.shop_info==null) {
        await this.loadShopInfo()
      }      
      if(this.shop_info.is_ok){
        if(type == this.origin_data_type.shop_name)
          this.tax_invoice_info.fields.business_name = this.shop_info.data.shop_name
        else if(type == this.origin_data_type.email)
          this.tax_invoice_info.fields.email = this.shop_info.data.email
        else if(type == this.origin_data_type.address){
          this.tax_invoice_info.fields.postcode = this.shop_info.data.post_code
          this.tax_invoice_info.fields.address1 = this.shop_info.data.address1
          this.tax_invoice_info.fields.address2 = this.shop_info.data.address2
        }
      }
    },
    onClearCheck(type) {
      this.same_checks[type] =false 
    },
    hideModal() {    
      this.hideDialogById( this.page_id)
    },
    onTaxRequstChange() {
      this.tax_invoice_info_errors=[]
    }
  }
}
</script>
<style lang="scss">
@import './shop-information.scss';
</style>