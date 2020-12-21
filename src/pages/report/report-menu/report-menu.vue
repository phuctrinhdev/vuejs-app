<template>
  <main class="app-content">
    <section class="content report-menu-page">
      <div class="page-title">
        <h3>{{ $t('report.report') }}</h3>
      </div>
      
      <div class="report-menu-wrapper">
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="report-type">
              <div class="report-type-title">{{ $t('report.sales-analysis') }}</div>
              <div class="report-type-items">
                <ul>
                  <li><router-link :to="{ name: 'report-sales-by-date' }">- {{ $t('report.sales-by-date') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-sales-by-month' }">- {{ $t('report.sales-by-month') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-service-sales' }">- {{ $t('report.service-sales') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-service-sales-by-item' }">- {{ $t('report.service-sales-by-item') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-service-sales-by-month' }">- {{ $t('report.service-sales-by-month') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-service-sales-by-sales-type' }">- {{ $t('report.service-sales-by-sales-type') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-product-sales-by-item' }">- {{ $t('report.product-sales-by-item') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-product-sales-by-month' }">- {{ $t('report.product-sales-by-month') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-sales-by-discount-category' }">- {{ $t('report.sales-by-discount-category') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-sales-by-repeat-clients' }">- {{ $t('report.sales-by-repeat-clients') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-income-statement' }">- {{ $t('report.income-statement') }}</router-link></li>
                  <!-- <li><router-link :to="{ name: 'report-booking-deposit-summary' }">- {{ $t('report.booking-deposit-summary') }}</router-link></li> -->
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="report-type">
              <div class="report-type-title">{{ $t('report.client-analysis') }}</div>
              <div class="report-type-items">
                <ul>
                  <li><router-link :to="{ name: 'report-clients-summary' }">- {{ $t('report.clients-summary') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-new-clients-repeat' }">- {{ $t('report.new-clients-repeat') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-new-clients-by-month' }">- {{ $t('report.new-clients-by-month') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-new-clients-by-referral-source' }">- {{ $t('report.new-clients-by-referral-source') }}</router-link></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="report-type">
              <div class="report-type-title">{{ $t('report.booking-analysis') }}</div>
              <div class="report-type-items">
                <ul>
                  <li><router-link :to="{ name: 'report-detailed-analysis-of-bookings' }">- {{ $t('report.detailed-analysis-of-bookings') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-bookings-by-date' }">- {{ $t('report.bookings-by-date') }}</router-link></li>
                  <li><router-link :to="{ name: 'report-bookings-by-month' }">- {{ $t('report.bookings-by-month') }}</router-link></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="report-type">
              <div class="report-type-title">{{ $t('report.balances-and-loyalty-points') }}</div>
              <div class="report-type-items">
                <ul>
                  <li><router-link :to="{ name: 'report-balances-and-loyalty-points' }">- {{ $t('report.balances-and-loyalty-points') }}</router-link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'

export default {
  data(){
    return {
      options,
      common_options,
    }
  },
}
</script>

<style lang="scss">
@import './report-menu.scss';
</style>
