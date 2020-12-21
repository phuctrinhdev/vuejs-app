<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('shop-info.shop-info') }}</h3>
        </article>
        <div class="section-part w1100"> 
          <div class="top clearfix mb5">
            <h2 class="fll mt5 fw-bold fz16">{{ $t('shop-info.basic-info') }}</h2>
            <a class="btn secondary flr" @click="onActionShop(options.form_actions.edit)">EDIT</a>
          </div>
          <form class="form-wrapper clearfix">
            <div class="form-group bd">
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.shop-name') }}</dt>
                <dd>{{ shop_info.fields.shop_name }}</dd>
              </dl>
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.business-type') }}</dt>
                <dd>{{ shop_info.fields.business_type_name }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.owner-name') }}</dt>
                <dd>{{ shop_info.fields.owner_name }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.owner-mobile-number') }}</dt>
                <dd>{{ shop_info.fields.owner_mobile_number }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.manager-name') }}</dt>
                <dd>{{ shop_info.fields.manager_name }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.manager-title') }}</dt>
                <dd>{{ shop_info.fields.manager_title }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.phone-number') }}</dt>
                <dd>{{ shop_info.fields.phone_number }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.mobile-number') }}</dt>
                <dd>{{ shop_info.fields.mobile_number }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.email') }}</dt>
                <dd>{{ shop_info.fields.email }}</dd>
              </dl> 
              <dl class="clearfix list mb10">
                <dt>{{ $t('shop-info.postcode') }}</dt>
                <dd>{{ shop_info.fields.post_code }}</dd>
              </dl> 
              <dl class="clearfix list">
                <dt>{{ $t('shop-info.address') }}</dt>
                <dd>{{ shop_info.fields.address1 }}<br>{{ shop_info.fields.address2 }}</dd>
              </dl> 
            </div>
          </form>

          <div class="tax-invoice mt20">
            <div class="top clearfix mb5">
              <h2 class="fll mt5 fw-bold fz16">{{ $t('tax-invoice-info.tab-title') }}</h2>
              <a class="btn secondary flr" @click="onActionTaxInfo">Edit</a>
            </div>  
            <table class="normal mt5">
              <tbody>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.issue-status') }}</td>
                  <td class="tal">{{ tax_invoice_request_text(tax_invoice.fields.tax_invoice_request) }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.business-number') }}</td>
                  <td class="tal">{{ tax_invoice.fields.business_number }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.sub-business-number') }}</td>
                  <td class="tal">{{ tax_invoice.fields.sub_business_number }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.shop-name') }}</td>
                  <td class="tal">{{ tax_invoice.fields.business_name }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.owner') }}</td>
                  <td class="tal">{{ tax_invoice.fields.owner_name }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.address') }}</td>
                  <td class="tal">{{ tax_invoice.fields.postcode }}<br>{{ tax_invoice.fields.address1 }} {{ tax_invoice.fields.address2 }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.business-type') }}</td>
                  <td class="tal">{{ tax_invoice.fields.business_type }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.business-item') }}</td>
                  <td class="tal">{{ tax_invoice.fields.business_item }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.email-to-be-issued') }}</td>
                  <td class="tal">{{ tax_invoice.fields.email }}</td>
                </tr>
                <tr>
                  <td class="bg-th">{{ $t('tax-invoice-info.manager') }}</td>
                  <td class="tal">
                    {{ $t('tax-invoice-info.name') }} {{ tax_invoice.fields.manager_name }}
                    / {{ $t('tax-invoice-info.phone') }} {{ tax_invoice.fields.phone_number }}
                    / {{ $t('tax-invoice-info.mobile') }} {{ tax_invoice.fields.mobile_number }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>        
      </div>
    </section> 
    <!-- modal action -->
    <shop-info-action @reload-page="onReloadPage" />
    <tax-invoice-info-action @reload-page="onReloadPage"/>
  </main>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { options }          from '../../../helpers/options'
import component_base       from '../../../components/common/component-base/component-base'
import ShopInfoAction       from '../../../components/account/shop-information/shop-info-action.vue'
import TaxInvoiceInfoAction from '../../../components/account/shop-information/tax-invoice-info-action.vue'

export default {
  components: {
    ShopInfoAction,
    TaxInvoiceInfoAction,
  },
  extends: component_base,
  data() {
    return {
      options : options,
      shop_info: {fields:{}},
      tax_invoice: {fields:{}},
    }
  },
  computed: {
    ...mapGetters('shop', {
      shop_info_data: 'getShopInfoAction',
      tax_invoice_info_data: 'getTaxInvoiceInfo'
    })
  },
  beforeMount() {
    this.loadTableData()
  },
  methods: {
    ...mapActions('shop', [      
      'setShopInfoActionDataAsync',
      'setTaxInvoiceInfoDataAsync',
      'updateShopInfoData',
    ]),
    ...mapMutations('shop',[
      'setTaxInvoiceInfo'
    ]), 
    // table
    async loadTableData() {
      this.preLoader()      
      let tf= await this.loadShopInfo()
      if (tf) {
        await this.loadTaxInvoiceinfo()
      }
      this.preLoader(false)
    },
    async loadShopInfo() {
      let query = {
        shop_id: this.shop_data.shop_id,          
        action: options.form_actions.edit
      }
      await this.setShopInfoActionDataAsync(query)       
      if(this.shop_info_data.is_ok){
        this.shop_info.fields = Object.assign({}, this.shop_info_data.data)         
        return true
      }
      else this.showAlert(this.shop_info_data.error_messages)
      return false
    },
    async loadTaxInvoiceinfo() {      
      let query_tax = {
        shop_id: this.shop_data.shop_id,
        tax_invoice_request: this.shop_info.fields.tax_invoice_request,
        action: (this.shop_info.fields.tax_invoice_info_id > 0 ) ? options.form_actions.edit : options.form_actions.add
      }
      if( this.shop_info.fields.tax_invoice_info_id> 0) {
        await this.setTaxInvoiceInfoDataAsync(query_tax)
        if(this.tax_invoice_info_data.is_ok){        
          this.tax_invoice.fields = Object.assign({}, this.tax_invoice_info_data.data)
          return true
        }
        else this.showAlert(this.tax_invoice_info_data.error_messages)
        return false
      }else {
        this.setTaxInvoiceInfo(query_tax)
        return true
      }
    },
    async onActionShop(){      
      this.preLoader()      
      let tf= await this.loadShopInfo()
      this.preLoader(false)
      if (tf) {
        this.shop_action_visible = true
        this.$nextTick( () => {
          this.showDialogById('shop-info-action-modal')
        })
      } 
    },    
    async onActionTaxInfo(){
      this.preLoader()      
      let tf= await this.loadTaxInvoiceinfo()
      this.preLoader(false)
      if (tf) {
        this.tax_action_visible = true
        this.$nextTick( () => {
          this.showDialogById('tax-invoice-info-action-modal')
        })
      } 
    },
    onReloadPage(){
      this.loadTableData()
    },
    tax_invoice_request_text(x) {
      let option = options.admin_enums.tax_invoice_request.find( a => a.value== x )
      return (option)? this.$t(option.text) : ''
    }    
  }
}
</script>
<style lang="scss">
@import './shop-information.scss';
</style>
