<template>
  <main class="app-content">
    <section id="payroll-setup" class="content payroll-setup-page">
      <div class="page-title">
        <h3>{{ $t('payroll.payroll-setup') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link :to="{ name: 'payroll-statement' }">{{ $t('payroll.payroll-statement') }}</router-link></li>
        </ul>
      </div>
      
      <div class="table-wrapper">
        <div class="table-intro">
          <div class="intro-title">{{ $t('payroll.salary-to-sales-ratio') }}</div>
          <b-form-checkbox v-model="payroll_setup.fields.include_point_deduction" :value="true" class="include-point-deduction">
            {{ $t('payroll.include-point-deduction') }}
          </b-form-checkbox>
        </div>

        <table class="table">
          <thead>
            <th>{{ $t('sales.sales-items') }}</th>
            <th>{{ $t('report.service') }}(%)</th>
            <th>{{ $t('report.product') }}(%)</th>
            <th>{{ $t('report.prepaid-card') }}(%)</th>
            <th>{{ $t('report.prepaid-service') }}(%)</th>
          </thead>
          <tbody>
            <tr>
              <td>{{ $t('sales.sales') }}</td>
              <td><input-money-by-blur v-model="payroll_setup.fields.sales_service_percent" :decimal="1"/></td>
              <td><input-money-by-blur v-model="payroll_setup.fields.sales_product_percent" :decimal="1"/></td>
              <td><input-money-by-blur v-model="payroll_setup.fields.sales_prepaid_card_percent" :decimal="1"/></td>
              <td><input-money-by-blur v-model="payroll_setup.fields.sales_prepaid_service_percent" :decimal="1"/></td>
            </tr>
            <tr>
              <td>{{ $t('sales.deduction') }}</td>
              <td><input-money-by-blur v-model="payroll_setup.fields.deduction_service_percent" :decimal="1"/></td>
              <td><input-money-by-blur v-model="payroll_setup.fields.deduction_product_percent" :decimal="1"/></td>
              <td class="disable"/>
              <td class="disable"/>
            </tr>
          </tbody>
        </table>

        <div class="group-btn">
          <button class="btn" @click="onConfirm">{{ $t('general.save') }}</button>
        </div>

        <div class="guides">
          <ul>
            <li>{{ $t('payroll.payroll-setup-guide-1') }}</li>
            <li>{{ $t('payroll.payroll-setup-guide-2') }}</li>
            <li>{{ $t('payroll.payroll-setup-guide-3') }}</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import PayrollSetupApi            from '../../../api/staffs/payroll-setup-api'
import component_base             from '../../../components/common/component-base/component-base'
import PayrollSetupViewModel      from '../../../view-model/staffs/payroll-setup-view-model'
import input_money_by_blur        from '../../../components/common/form/input/input-money/input-money-by-blur'
import staff_cache                from '../../../helpers/cache/staff-cache'

export default {
  components: {
    'input-money-by-blur': input_money_by_blur
  },
  extends : component_base,
  data(){
    return {
      payroll_setup_api : new PayrollSetupApi(),
      payroll_setup     : new PayrollSetupViewModel(),

      errors       : [],
    }
  },
  async created(){
    await this.loadPayrollSetupAsync()
  },
  methods:{
    async loadPayrollSetupAsync(){
      this.preLoader()
      let response = await this.payroll_setup_api.getPayrollSetupAsync(this.shop_data.shop_id)
      this.preLoader(false)

      if(response && response.is_ok){
        this.payroll_setup.fields.include_point_deduction      = response.data.include_point_deduction
        this.payroll_setup.fields.sales_service_percent        = response.data.sales_service_percent
        this.payroll_setup.fields.sales_product_percent        = response.data.sales_product_percent
        this.payroll_setup.fields.sales_prepaid_card_percent   = response.data.sales_prepaid_card_percent
        this.payroll_setup.fields.sales_prepaid_service_percent= response.data.sales_prepaid_service_percent
        this.payroll_setup.fields.deduction_service_percent    = response.data.deduction_service_percent
        this.payroll_setup.fields.deduction_product_percent    = response.data.deduction_product_percent
        this.payroll_setup.fields.shop_id                      = response.data.shop_id
      }
      else this.showAlert(response.error_messages)
    },
    async onConfirm(){
      let errors = this.payroll_setup.isValid()
      if(errors.length==0){
        this.preLoader()
        let response = await this.payroll_setup_api.updatePayrollSetupAsync(this.payroll_setup)
        this.preLoader(false)

        if(response && response.is_ok){
          this.payroll_setup.setFields(response.data)

          // clear cache
          staff_cache.clearCacheStaffPayrollSetup()
        }
        else this.showAlert(response.error_messages)
      }
      else this.showAlert(errors)
    }
  }
}
</script>

<style lang="scss">
@import './payroll-setup.scss';
</style>