<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div v-if="!hide">
        <p v-if="is_result" class="fw-bold mb5">{{ $t('virtual-account.virtual-account') }}</p>
        <p v-if="!is_result" class="fw-bold mb5">{{ $t('virtual-account.virtual-account-list') }}</p>
        <p class="mb5">
          {{ $t('virtual-account.info4') }}
        </p>
        <view-table :data="table_data"/>
      </div>
    </section>
  </main>
</template>

<script>
import component_base from '../../../../components/common/component-base/component-base'
import { options } from '../../../../helpers/options'
import view_table          from '../../../../components/common/view-table/view-table'
import OnlinePaymentApi         from '../../../../api/account/online-payment-api'
import { formatDateBySetting, convertDateFromUtcToTimezone } from '../../../../helpers/common'
import { mapGetters } from 'vuex'

export default {
  components: {
    'view-table'    : view_table

  },
  extends: component_base,
  props: { 
    is_result: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options,
      table_data: {
        fields: [
          { field: 'virtual_bank_name',     label: 'virtual-account.bank-name',              width: '10%',  sortable: false, formatFn: this.formatTimeStampCol },
          { field: 'virtual_bank_account',            label: 'virtual-account.account-number',        width: '20%',  sortable: false },
          { field: 'virtual_bank_account_holder',      label: 'virtual-account.account-holder',  width: '20%',  sortable: false, expand: false },
          { field: 'amount',      label: 'virtual-account.amount',    width: '10%',  sortable: false, expand: false },
          { field: 'product_name',           label: 'virtual-account.purpose',       width: '15%',  sortable: false, formatFn: this.formatProductName, expand: false },
          { field: 'virtual_bank_expiration_date',           label: 'virtual-account.deposit-time',       width: '25%',  sortable: false, formatFn: this.formatDateCol, expand: false },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: false
        },
        style: 'normal'
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        country_code: null
      },
      hide: false
    }
  },
  computed: {
    ...mapGetters('payment', {
      virtual_account_result_data: 'getVirtualAccountResultData'
    })
  },
  mounted(){
    this.loadTableData()
  },
  methods:{ 
    async loadTableData(){
      if(!this.is_result){
        let online_payment_api = new OnlinePaymentApi()
        this.preLoader(true)
        let result = await online_payment_api.getValidVirtualAccountsAsync(this.shop_data.shop_id)
        this.preLoader(false)
        if(result.is_ok){
          if(result.data.items.length >0)
            this.table_data.rows =  result.data.items
          else this.hide=true
        }
        else this.showAlert(result.error_messages)
      }
      else{
        this.table_data.rows.push(this.virtual_account_result_data)
      }
    },
    formatDateCol(date){
      return formatDateBySetting(convertDateFromUtcToTimezone(date,this.shop_data.timezone), true)  
    },
    formatProductName(product_name){
      let product = product_name.split('/')
      if(product[0] == 'N') return this.$i18n.t('depositless-payments.netmoney-charge')
      else return this.$i18n.t('depositless-payments.usage-fees') + '/' + product[1] + this.$i18n.t('general.month')
    }
  }
}
</script>

<style lang="scss">
@import '../../../../pages/account/payments/payments.scss';
</style>