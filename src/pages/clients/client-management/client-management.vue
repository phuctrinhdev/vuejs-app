<template>
  <main class="app-content">
    <section v-if="is_show_search_condition" class="contents-style common-style clients-management-form-search">
      <div class="inner">
        <article v-if="has_not_campaign_type" class="setup-top clearfix">
          <h3>{{ $t('menu.client-management') }}</h3>
        </article>
        <div class="section-part">
          <!-- Common -->
          <b-row>
            <b-col cols="12">
              <div class="form-group action-type float-left mr-xl-3 mr-lg-3">
                <label class="label-title label-action">{{ $t('clients.action') }}</label>
                <b-form-select :options="campaign_action_options" v-model="action_type_enum" class="float-left"/>
              </div>
              <div class="form-group target-type float-left">
                <label class="float-left pl-xl-3 pl-lg-3">{{ $t('messages.target') }}</label>
                <b-form-select v-model="table_search_condition.fields.search_condition_type" :options="target_type_options" class="float-left" 
                               @change="onChangeTargetType"/>
              </div>
            </b-col>
          </b-row>

          <!-- Search -->
          <div v-if="!is_all_clients" class="search-conditions">
            <b-row>
              <h3>{{ show_campaign_target_type }}</h3>
              <div class="form-search-conditions">
                <b-row v-if="is_dormant_clients">
                  <b-col cols="12" class="form-group">
                    <div class="form-inline">
                      <label class="mr-3 col-form-label">{{ $t('clients.not-visited-more-than') }}</label>
                      <b-form-input v-model="table_search_condition.fields.number_of_no_visit_days" class="mr-3 number-of-not-visit-days"/> {{ $t('general.days') }}
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else-if="is_clients_by_sales_service" class="clients-by-sales-service">
                  <b-col cols="12">
                    <div class="form-group float-left mr-3">
                      <label class="label-title">{{ $t('input-date-range.date-range') }}</label>
                      <input-date-range
                        ref="input_date_range" 
                        :label="false"
                        class="float-left mr-3"/>
                    </div>
                    <div class="form-group float-left">
                      <label class="label-title label-right">{{ $t('report.service') }}</label>
                      <b-form-select v-model="table_search_condition.fields.service_category_id" class="select-1" @change="onChangeCategoryService">
                        <option v-for="service_category in service_category_options" :key="service_category.index" :value="service_category.id">
                          {{ service_category.name }}
                        </option>
                      </b-form-select>
                      <b-form-select v-model="table_search_condition.fields.service_id" :disabled="table_search_condition.fields.service_category_id == -1" class="select-2">
                        <option v-for="service in service_options" :key="service.index" :value="service.id">{{ service.name }}</option>
                      </b-form-select>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else-if="is_clients_by_sales_product" class="clients-by-sales-product">
                  <b-col cols="12">
                    <div class="form-group float-left mr-3">
                      <label class="label-title">{{ $t('input-date-range.date-range') }}</label>
                      <input-date-range
                        ref="input_date_range"
                        :label="false"
                        class="float-left"/>
                    </div>
                    <div class="form-group float-left">
                      <label class="label-title label-right">{{ $t('report.product') }}</label>
                      <b-form-select v-model="table_search_condition.fields.product_category_id" class="select-1" @change="onChangeProductCategory">
                        <option v-for="product_category in product_category_options" :key="product_category.index" :value="product_category.id">
                          {{ product_category.name }}
                        </option>
                      </b-form-select>
                      <b-form-select v-model="table_search_condition.fields.product_id" :disabled="table_search_condition.fields.product_category_id == -1" class="select-2">
                        <option v-for="product in product_options" :key="product.index" :value="product.id">
                          {{ product.name }}
                        </option>
                      </b-form-select>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else-if="is_clients_by_sales_amount" class="clients-by-sales-amount">
                  <b-col cols="12">
                    <div class="form-group mr-3 float-left">
                      <label class="label-title">{{ $t('input-date-range.date-range') }}</label>
                      <input-date-range
                        ref="input_date_range"
                        :label="false"
                        class="float-left"/>
                    </div>
                    <div class="form-group float-left">
                      <label class="label-title label-right">{{ $t('sales.sales-amount') }}</label>
                      <div class="d-flex sales-amount">
                        <input-money v-model="table_search_condition.fields.sales_amount_from"/>
                        <div class="between pl-1 pr-1">~</div>
                        <input-money v-model="table_search_condition.fields.sales_amount_to"/>
                        <b-form-checkbox v-model="table_search_condition.fields.include_product" class="form-check-input ml-3">
                          {{ $t('clients.include-products') }}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else-if="is_clients_by_prepaid_card" class="clients-by-prepaid-card">
                  <b-col cols="12">
                    <div class="form-group float-left mr3">
                      <label class="label-title">{{ $t('sales.sales-date') }}</label>
                      <div class="form-inline float-left">
                        <b-form-radio-group
                          v-model="table_search_condition.fields.sales_date_type"
                          :options="sales_date_type_options"
                        />
                      </div>
                      <input-date-range
                        v-if="table_search_condition.fields.sales_date_type == options.client_management.sales_date_type.date_range"
                        ref="input_date_range"
                        :label="false"
                        class="float-left"/>
                    </div>
                  </b-col>
                  <b-col cols="12">
                    <div class="form-group float-left mr3">
                      <label class="label-title">{{ $t('refund.expiry-date') }}</label>
                      <input-date-range
                        ref="input_expiry_date_range"
                        :label="false"
                        class="float-left"/>
                      <b-form-checkbox v-model="table_search_condition.fields.is_unlimited" class="form-check-input ml-3 float-left">
                        {{ $t('clients.unlimited') }}
                      </b-form-checkbox>
                    </div>
                    <div class="form-group float-left">
                      <label class="label-title label-right">{{ $t('sales.balance') }}</label>
                      <div class="d-flex form-inline balance">
                        <input-money v-model="table_search_condition.fields.balance_from"/>
                        <div class="between pl-1 pr-1">~</div>
                        <input-money v-model="table_search_condition.fields.balance_to"/>
                      </div>
                    </div>
                  </b-col>
                  <b-col cols="12">
                    <div class="form-group float-left">
                      <label class="label-title">{{ $t('report.prepaid-card') }}</label>
                      <b-form-select v-model="table_search_condition.fields.prepaid_card_id" class="select-1">
                        <option v-for="prepaid_card in prepaid_card_options" :key="prepaid_card.index" :value="prepaid_card.id">
                          {{ prepaid_card.name }}
                        </option>
                      </b-form-select>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else-if="is_clients_by_prepaid_service" class="clients-by-prepaid-service">
                  <b-col cols="12">
                    <div class="form-group float-left mr3">
                      <label class="label-title">{{ $t('sales.sales-date') }}</label>
                      <div class="form-inline float-left">
                        <b-form-radio-group
                          v-model="table_search_condition.fields.sales_date_type"
                          :options="sales_date_type_options"
                        />
                      </div>
                      <input-date-range
                        v-if="table_search_condition.fields.sales_date_type == options.client_management.sales_date_type.date_range"
                        ref="input_date_range"
                        :label="false"
                        class="float-left"/>
                    </div>
                  </b-col>
                  <b-col cols="12">
                    <div class="form-group float-left mr3">
                      <label class="label-title">{{ $t('refund.expiry-date') }}</label>
                      <input-date-range
                        ref="input_expiry_date_range"
                        :label="false"
                        class="float-left"/>
                      <b-form-checkbox v-model="table_search_condition.fields.is_unlimited" class="form-check-input ml-3 float-left">
                        {{ $t('clients.unlimited') }}
                      </b-form-checkbox>
                    </div>
                    <div class="form-group float-left">
                      <label class="label-title label-right">{{ $t('sales-prepaid-service-tab.remaining') }}</label>
                      <div class="d-flex form-inline balance">
                        <input-money v-model="table_search_condition.fields.quantity_from"/>
                        <div class="between pl-1 pr-1">~</div>
                        <input-money v-model="table_search_condition.fields.quantity_to"/>
                      </div>
                    </div>
                  </b-col>
                  <b-col cols="12">
                    <div class="form-group float-left">
                      <label class="label-title">{{ $t('report.prepaid-service') }}</label>
                      <b-form-select v-model="table_search_condition.fields.service_category_id" class="select-1" @change="onChangeCategoryServicePS">
                        <option v-for="service_category in service_category_options" :key="service_category.index" :value="service_category.id">
                          {{ service_category.name }}
                        </option>
                      </b-form-select>
                      <b-form-select v-model="table_search_condition.fields.service_id" :disabled="table_search_condition.fields.service_category_id == -1" class="select-2">
                        <option v-for="prepaid_service in prepaid_service_options" :key="prepaid_service.index" :value="prepaid_service.id">
                          {{ prepaid_service.name }}
                        </option>
                      </b-form-select>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else-if="is_birthday_clients" class="birth-clients">
                  <b-col cols="12">
                    <div class="form-group float-left mr-3">
                      <label class="label-title">{{ $t('input-date-range.date-range') }}</label>
                      <input-date-range
                        ref="input_date_range"
                        :label="false"
                        class="float-left"/>
                      <b-form-select :options="member_type_options" v-model="table_search_condition.fields.member_type" class="select-member-types float-left"/>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else class="recommended-clients">
                  <b-col cols="12">
                    <div class="form-group float-left">
                      <div class="form-inline d-flex">
                        <b-form-radio-group v-model="table_search_condition.fields.is_first_visit_date" :options="first_visite_date_options"/>
                        <template v-if="table_search_condition.fields.is_first_visit_date == 0">
                          <b-form-select :options="recommender_type_options" v-model="table_search_condition.fields.recommender_type" class="recommender-type"/>
                          <b-form-input v-model="table_search_condition.fields.client_name_or_mobile_number" 
                                        :placeholder="$t('clients.client-name-mobile')"/>
                        </template>
                        <template v-else>
                          <input-date-range ref="input_date_range"
                                            :label="false" />
                        </template>
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </b-row>
          </div>

          <!-- Filter -->
          <b-button class="mb-3 btn-show-filter" @click="show_filters_section = !show_filters_section">{{ $t('clients.filters') }}</b-button>
          <template v-if="show_filters_section">
            <div class="filters-section">
              <b-row>
                <h3>{{ $t('shop-info.basic-info') }}</h3>
                <div class="form-filters">
                  <b-row>
                    <b-col cols="12" xl="5" md="6" 
                           sm="6">
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_preferred_staff" class="form-check-input">
                              {{ $t('clients.preferred-staff') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-select v-model="table_filter.fields.preferred_staff_id" :disabled="!table_filter.fields.is_checked_preferred_staff">
                            <option v-for="staff in staff_options" :key="staff.index" :value="staff.id">
                              {{ staff.aliasname }}
                            </option>
                          </b-form-select>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_member_type" class="form-check-input">
                              {{ $t('clients.member') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-select :options="member_type_options" v-model="table_filter.fields.member_type" :disabled="!table_filter.fields.is_checked_member_type"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_member_number" class="form-check-input">
                              {{ $t('clients.member-number') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group field-range">
                          <input-money v-model="table_filter.fields.member_number_from" :disabled="!table_filter.fields.is_checked_member_number || table_filter.fields.member_type == 2"/>
                          <div class="between">~</div>
                          <input-money v-model="table_filter.fields.member_number_to" :disabled="!table_filter.fields.is_checked_member_number || table_filter.fields.member_type == 2"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_sex" class="form-check-input">
                              {{ $t('general.gender') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-select v-model="table_filter.fields.sex" :disabled="!table_filter.fields.is_checked_sex">
                            <option v-for="(sex, index) in sex_options" :value="sex.value" :key="index">
                              {{ sex.text }}
                            </option>
                          </b-form-select>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_birthday" class="form-check-input">
                              {{ $t('clients.birthday') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <div class="d-flex birthday-range">
                            <div class="d-flex form-group">
                              <b-form-input v-model="table_filter.fields.birth_date_from" :disabled="!table_filter.fields.is_checked_birthday"/>
                              <div class="between ml-1 mr-1">{{ $t('general.day') }}</div>
                              <b-form-input v-model="table_filter.fields.birth_month_from" :disabled="!table_filter.fields.is_checked_birthday"/>
                              <div class="between ml-1 mr-1">{{ $t('general.month') }} ~</div>
                            </div>
                            <div class="d-flex form-group">
                              <b-form-input v-model="table_filter.fields.birth_date_to" :disabled="!table_filter.fields.is_checked_birthday"/>
                              <div class="between ml-1 mr-1">{{ $t('general.day') }}</div>
                              <b-form-input v-model="table_filter.fields.birth_month_to" :disabled="!table_filter.fields.is_checked_birthday"/>
                              <div class="between ml-1">{{ $t('general.month') }}</div>
                            </div>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col cols="12" xl="5" md="6" 
                           sm="6">
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_referral_source" class="form-check-input">
                              {{ $t('report.referal-source') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-select v-model="table_filter.fields.referral_source_id" :disabled="!table_filter.fields.is_checked_referral_source">
                            <option v-for="referal_soruce in referral_source_options" :key="referal_soruce.index" :value="referal_soruce.id">
                              {{ referal_soruce.name }}
                            </option>
                          </b-form-select>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_client_rating" class="form-check-input">
                              {{ $t('clients.client-rating') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-select v-model="table_filter.fields.client_rating_id" :disabled="!table_filter.fields.is_checked_client_rating">
                            <option v-for="client_rating in client_rating_options" :key="client_rating.index" :value="client_rating.id">
                              {{ client_rating.name }}
                            </option>
                          </b-form-select>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_client_group" class="form-check-input">
                              {{ $t('clients.client-group') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-select v-model="table_filter.fields.client_group_id" :disabled="!table_filter.fields.is_checked_client_group">
                            <option v-for="client_group in client_group_options" :key="client_group.index" :value="client_group.id">
                              {{ client_group.name }}
                            </option>
                          </b-form-select>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_address" class="form-check-input">
                              {{ $t('general.address') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-input v-model="table_filter.fields.address" :placeholder="$t('general.address')" :disabled="!table_filter.fields.is_checked_address"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_notes" class="form-check-input">
                              {{ $t('general.notes') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group">
                          <b-form-input v-model="table_filter.fields.notes" :placeholder="$t('general.notes')" :disabled="!table_filter.fields.is_checked_notes"/>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </div>
              </b-row>
              <b-row>
                <h3>{{ $t('clients.transaction-information') }}</h3>
                <div class="form-filters">
                  <b-row>
                    <b-col cols="12" xl="5" md="6" 
                           sm="6">
                      <b-row>
                        <b-col cols="12" xl="4" class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_first_visit_date" class="form-check-input">
                              {{ $t('clients.first-visit-date') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="8" class="form-group">
                          <input-date-range
                            ref="input_first_visit_date"
                            :label="false"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12">
                          <div class="form-check form-check-inline mr-1 mb-2">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_recent_visit_date" class="form-check-input">
                              {{ $t('bookings.recent-visit-date') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col class="form-inline ml-lg-4 mb-2 recent-visit-date">
                          <div class="form-check">
                            <b-form-radio v-model="table_filter.fields.recent_visit_date_type" :disabled="!table_filter.fields.is_checked_recent_visit_date"
                                          :value="options.client_management.recent_visit_date_type.not_visited_more_than">
                              {{ $t('clients.not-visited-more-than') }}
                            </b-form-radio>
                            <b-form-input v-model="table_filter.fields.days_not_visited_more_than" 
                                          :disabled="table_filter.fields.recent_visit_date_type != options.client_management.recent_visit_date_type.not_visited_more_than" 
                                          class="ml-3 mr-2"/> {{ $t('general.days') }}
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col class="form-inline ml-lg-4 mb-2 recent-visit-date">
                          <div class="form-check">
                            <b-form-radio v-model="table_filter.fields.recent_visit_date_type" :disabled="!table_filter.fields.is_checked_recent_visit_date" 
                                          :value="options.client_management.recent_visit_date_type.visited_for_last">
                              {{ $t('clients.visited-for-last') }}
                            </b-form-radio>
                            <b-form-input v-model="table_filter.fields.days_visisted_for_last" 
                                          :disabled="table_filter.fields.recent_visit_date_type != options.client_management.recent_visit_date_type.visited_for_last"
                                          class="ml-3 mr-2"/> {{ $t('general.days') }}
                          </div>
                        </b-col>
                      </b-row>
                      <b-row class="form-group">
                        <b-col class="form-inline ml-lg-4 mb-2 recent-visit-date">
                          <div class="form-check">
                            <b-form-radio v-model="table_filter.fields.recent_visit_date_type" 
                                          :disabled="!table_filter.fields.is_checked_recent_visit_date"
                                          :value="options.client_management.recent_visit_date_type.date_range">{{ $t('input-date-range.date-range') }}</b-form-radio>
                            <input-date-range
                              ref="input_recent_visit_date"
                              :label="false"
                              class="ml-3"/>
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_total_sales" class="form-check-input">
                              {{ $t('clients.total-sales') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group field-range">
                          <input-money v-model="table_filter.fields.total_sales_amount_from" :disabled="!table_filter.fields.is_checked_total_sales"/>
                          <div class="between">~</div>
                          <input-money v-model="table_filter.fields.total_sales_amount_to" :disabled="!table_filter.fields.is_checked_total_sales"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_total_number_of_visit" class="form-check-input">
                              {{ $t('clients.total-number-of-visit') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group field-range">
                          <input-money v-model="table_filter.fields.number_of_visit_from" :disabled="!table_filter.fields.is_checked_total_number_of_visit"/>
                          <div class="between">~</div>
                          <input-money v-model="table_filter.fields.number_of_visit_to" :disabled="!table_filter.fields.is_checked_total_number_of_visit"/>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col cols="12" xl="5" md="6" 
                           sm="6">
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_loyalty_points" class="form-check-input">
                              {{ $t('clients.loyalty-points') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group field-range">
                          <input-money v-model="table_filter.fields.loyalty_points_from" :disabled="!table_filter.fields.is_checked_loyalty_points"/>
                          <div class="between">~</div>
                          <input-money v-model="table_filter.fields.loyalty_points_to" :disabled="!table_filter.fields.is_checked_loyalty_points"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_balance" class="form-check-input">
                              {{ $t('sales.balance') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group field-range">
                          <input-money v-model="table_filter.fields.balance_from" :disabled="!table_filter.fields.is_checked_balance"/>
                          <div class="between">~</div>
                          <input-money v-model="table_filter.fields.balance_to" :disabled="!table_filter.fields.is_checked_balance"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_average_revenue_per_sales" class="form-check-input">
                              {{ $t('clients.average-revenue-per-sales') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group field-range">
                          <input-money v-model="table_filter.fields.average_sales_amount_from" :disabled="!table_filter.fields.is_checked_average_revenue_per_sales"/>
                          <div class="between">~</div>
                          <input-money v-model="table_filter.fields.average_sales_amount_to" :disabled="!table_filter.fields.is_checked_average_revenue_per_sales"/>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12" xl="3" lg="4" 
                               class="form-group">
                          <div class="form-check form-check-inline mr-1">
                            <b-form-checkbox v-model="table_filter.fields.is_checked_number_of_recommendations" class="form-check-input">
                              {{ $t('clients.number-of-recommendations') }}
                            </b-form-checkbox>
                          </div>
                        </b-col>
                        <b-col cols="12" xl="9" lg="8" 
                               class="form-group field-range">
                          <input-money v-model="table_filter.fields.number_of_recommendations_from" :disabled="!table_filter.fields.is_checked_number_of_recommendations"/>
                          <div class="between">~</div>
                          <input-money v-model="table_filter.fields.number_of_recommendations_to" :disabled="!table_filter.fields.is_checked_number_of_recommendations"/>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </div>
              </b-row>
            </div>
          </template>
        </div>
      </div>
      <b-col cols="12">
        <div class="btn-search-clients mt-3 text-center">
          <b-button @click.prevent="onSearchClients"><i class="btn-search-white mr-1"/><span>{{ $t('general.search') }}</span></b-button>
        </div>
      </b-col>
    </section>
    <section v-if="is_show_table_result" class="contents-style common-style clients-management-table-result">
      <div class="inner">
        <article v-if="has_not_campaign_type" class="setup-top clearfix">
          <h3>{{ $t('menu.client-management') }}</h3>
        </article>
        <div class="section-part">
          <b-row class="mb-2">
            <b-col cols="9">
              <span class="mr-5">
                {{ $t('clients.all').replace('{0}', table_data.pagination.total_items) }}
              </span>
              <b-button :disabled="!can_using_next_action" class="btn-next" @click="onNextAction">{{ $t('clients.next') }}</b-button>
              <b-button class="btn-back" @click="onShowFormSearch">{{ $t('messages.back') }}</b-button>
            </b-col>
            <b-col v-if="has_not_campaign_type" cols="3">
              <b-button v-b-modal.check-owner-login-modal :disabled="!can_using_next_action" class="float-right">{{ $t('products.excel') }}</b-button>
            </b-col>
          </b-row>
          <div class="row table-custom">
            <div class="col-12"> 
              <!-- table data -->
              <div class="table-data form-wrapper">
                <b-table v-if="table_search_condition.fields.search_condition_type == options.client_management.target_type_options.recommended_clients" class="mb-0">
                  <template v-slot:thead-top="">
                    <tr>
                      <!-- <th width="35px"/> -->
                      <th width="60%">{{ $t('clients.recommended-clients') }}</th>
                      <th width="40%">{{ $t('clients.recommender') }}</th>
                    </tr>
                  </template>
                </b-table>
                <view-table :data="table_data" @change-page="onChangePage" @select-rows="onSelectRows">
                  <template slot="total_sales" slot-scope="{ row }">
                    {{ $n(row.total_sales) }}
                  </template>
                  <template slot="balance" slot-scope="{ row }">
                    {{ $n(row.balance) }}
                  </template>
                  <template slot="loyalty_points" slot-scope="{ row }">
                    {{ $n(row.loyalty_points) }}
                  </template>
                  <template slot="prepaid_cards_name" slot-scope="{ row }">
                    <p v-for="(item, index) in row.prepaid_cards" :key="index">
                      {{ item.name }}
                    </p>
                  </template>
                  <template slot="prepaid_cards_balance" slot-scope="{ row }">
                    <p v-for="(item, index) in row.prepaid_cards" :key="index">
                      {{ $n(item.balance) }}
                    </p>
                  </template>
                  <template slot="prepaid_cards_expiry_date" slot-scope="{ row }">
                    <p v-for="(item, index) in row.prepaid_cards" :key="index">
                      {{ item.expiry_date }}
                    </p>
                  </template>
                  <template slot="prepaid_services_name" slot-scope="{ row }">
                    <p v-for="(item, index) in row.prepaid_services" :key="index">
                      {{ item.name }}
                    </p>
                  </template>
                  <template slot="prepaid_services_quantity" slot-scope="{ row }">
                    <p v-for="(item, index) in row.prepaid_services" :key="index">
                      {{ item.quantity }}
                    </p>
                  </template>
                  <template slot="prepaid_services_expiry_date" slot-scope="{ row }">
                    <p v-for="(item, index) in row.prepaid_services" :key="index">
                      {{ item.expiry_date }}
                    </p>
                  </template>
                </view-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Modal -->
    <change-clients-rating-action :client_ids="clients_for_change_rating"/>
    <check-owner-login-modal @confirm="onConfirmedOwner"/>

    <!-- Send message modal -->
    <b-modal id="send-messages-modal" 
             :no-close-on-backdrop="true"
             :no-enforce-focus="true"
             :title="send_messages"
             hide-footer
             class="send-messages-modal">
      <send-messages />
    </b-modal>
  </main>
</template>

<script>
//Component
import moment from 'moment'
import component_base from '../../../components/common/component-base/component-base'
import input_date_range from '../../../components/common/form/input/input-date-range/input-date-range.vue'
import view_table from '../../../components/common/view-table/view-table.vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { mapActions, mapGetters } from 'vuex'
import ClientManagementFilterViewModel from '../../../view-model/clients/client-management/client-management-filter-view-model'
import ClientManagementSearchConditionViewModel from '../../../view-model/clients/client-management/client-management-search-condition-view-model'
import { options } from '../../../helpers/options'
import check_owner_login_modal from '../../../components/clients/client-management/check-owner-login-modal.vue'
import change_clients_rating_action from '../../../components/clients/client-management/change-clients-rating-action.vue'
import product_category_mixin from '../../../helpers/mixins/product-category-mixin'
import service_category_mixin from '../../../helpers/mixins/service-mixin'
import product_mixin from '../../../helpers/mixins/product-mixin'
import staff_mixin from '../../../helpers/mixins/staff-mixin'
import prepaid_card_mixin from '../../../helpers/mixins/prepaid-card-mixin'
import ClientsCache from '../../../helpers/cache/clients-cache'
import input_money from '../../../components/common/form/input/input-money/input-money-type.vue'
import { convertDateToTimeStamp } from '../../../helpers/common'
import send_messages from '../../messages/send-messages/send-messages'
import { campaign_action_options, sales_date_type_options, member_type_options, first_visite_date_options, recommender_type_options, sex_options } from '../../../helpers/options/clients-options'

export default {
  components: {
    'input-date-range': input_date_range,
    'view-table': view_table,
    'check-owner-login-modal': check_owner_login_modal,
    'change-clients-rating-action': change_clients_rating_action,
    'input-money': input_money,
    'send-messages': send_messages
  },
  extends: component_base,
  mixins: [service_category_mixin, product_category_mixin, product_mixin, prepaid_card_mixin, staff_mixin],
  props: {
    campaign_type: {
      type: Number,
      default: options.campaign_management.campaign_type.default
    }
  },
  data() {
    return {
      options,
      show_filters_section: false,
      show_clients_result_table: false,
      action_type_enum: 0,
      table_search_condition: new ClientManagementSearchConditionViewModel(),
      table_filter: new ClientManagementFilterViewModel(),
      clients_setup: {},
      clients_cache: new ClientsCache(),
      service_category_options: [],
      service_options: [],
      product_category_options: [],
      product_options: [],
      prepaid_card_options: [],
      prepaid_service_options: [],
      referral_source_options: [],
      client_rating_options: [],
      client_group_options: [],
      page_number: 1,
      form_errors: [],
      exclude_client_ids: [],
      excel_cells: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      all_searched_clients: [],
      all_searched_client_ids: []
    }
  },
  computed: {
    ...mapGetters('client_management', {
      x_clients: 'getClients'
    }),
    clients_for_change_rating(){
      return this.all_searched_client_ids
    },
    can_using_next_action(){
      return this.x_clients.data.pagination && this.x_clients.data.pagination.total_items
    },
    campaign_action_options(){
      return [
        { text: this.$i18n.t('clients.send-text-messages'),    value: campaign_action_options.send_text_messages },
        { text: this.$i18n.t('clients.change-clients-rating'), value: campaign_action_options.change_clients_rating },
      ]
    } ,
    target_type_options(){
      return [
        { text: this.$i18n.t('clients.all-clients'),                 value: options.client_management.target_type_options.all_clients },
        { text: this.$i18n.t('clients.dormant-clients'),             value: options.client_management.target_type_options.dormant_clients },
        { text: this.$i18n.t('clients.clients-by-sales-service'),    value: options.client_management.target_type_options.clients_by_sales_service },
        { text: this.$i18n.t('clients.clients-by-sales-product'),    value: options.client_management.target_type_options.clients_by_sales_product },
        { text: this.$i18n.t('clients.clients-by-sales-amount'),     value: options.client_management.target_type_options.clients_by_sales_amount },
        { text: this.$i18n.t('clients.clients-by-prepaid-cards'),    value: options.client_management.target_type_options.clients_by_prepaid_cards },
        { text: this.$i18n.t('clients.clients-by-prepaid-services'), value: options.client_management.target_type_options.clients_by_prepaid_services },
        { text: this.$i18n.t('clients.birthday-clients'),            value: options.client_management.target_type_options.birthday_clients },
        { text: this.$i18n.t('clients.recommended-clients'),         value: options.client_management.target_type_options.recommended_clients },
      ]
    },
    sales_date_type_options(){
      return [
        { text: this.$i18n.t('general.all'),                 value: sales_date_type_options.all },
        { text: this.$i18n.t('input-date-range.date-range'), value: sales_date_type_options.input_date_range },
      ]
    },
    member_type_options(){
      return [
        { text: this.$i18n.t('general.all'),        value: member_type_options.all },
        { text: this.$i18n.t('clients.member'),     value: member_type_options.member },
        { text: this.$i18n.t('clients.not-member'), value: member_type_options.not_member },
      ]
    },
    first_visite_date_options(){
      return [
        { text: this.$i18n.t('clients.first-visit-date'), value: first_visite_date_options.first_visit_date },
        { text: this.$i18n.t('clients.client'), value: first_visite_date_options.client }
      ]
    },
    recommender_type_options(){
      return [
        { text: this.$i18n.t('clients.recommender'),         value: recommender_type_options.recommender },
        { text: this.$i18n.t('clients.recommended-clients'), value: recommender_type_options.recommended_clients }
      ]
    },
    sex_options(){
      return [
        { text: this.$i18n.t('general.all'),    value: sex_options.all },
        { text: this.$i18n.t('clients.male'),   value: sex_options.male },
        { text: this.$i18n.t('clients.female'), value: sex_options.female }
      ]
    },
    table_data(){
      let tmp_data = {
        fields: this.getTableDataFields(),
        rows: this.x_clients.data.items,
        pagination: this.x_clients.data.pagination,
        options: {
          pagination: true,
          select_options: {
            enabled: true
          }
        }
      }
      return tmp_data
    },
    show_campaign_target_type(){
      let campaign_target_type = this.$t('clients.search-conditions')
      campaign_target_type = this.target_type_options.filter(e => e.value == this.table_search_condition.fields.search_condition_type)[0].text
      return campaign_target_type
    },
    // Method check condition
    is_all_clients(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.all_clients},
    is_dormant_clients(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.dormant_clients},
    is_clients_by_sales_service(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.clients_by_sales_service},
    is_clients_by_sales_product(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.clients_by_sales_product},
    is_clients_by_sales_amount(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.clients_by_sales_amount},
    is_clients_by_prepaid_card(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.clients_by_prepaid_cards},
    is_clients_by_prepaid_service(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.clients_by_prepaid_services},
    is_birthday_clients(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.birthday_clients},
    is_recommended_clients(){return this.table_search_condition.fields.search_condition_type == options.client_management.target_type_options.recommended_clients},
    text_all(){ return this.$i18n.t('general.all') },
    date_range_can_not_exceed_3_months(){return this.$i18n.t('sales.date_range_can_not_exceed_3_months')},
    send_messages(){return this.$i18n.t('clients.send-messages')},
    is_show_search_condition(){
      if(!this.show_clients_result_table && this.campaign_type == options.campaign_management.campaign_type.default) return true
      if(this.campaign_type == options.campaign_management.campaign_type.add) return true
      return false
    },
    is_show_table_result(){
      if(this.show_clients_result_table && this.campaign_type == options.campaign_management.campaign_type.default) return true
      if(this.campaign_type == options.campaign_management.campaign_type.view_target_clients) return true
      return false
    },
    has_not_campaign_type(){
      if(this.campaign_type == options.campaign_management.campaign_type.default) return true
      return false
    }
  },
  async mounted(){
    this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
    if(this.isNullObject(this.clients_setup)){
      this.showMissingClientsSetupAlert()
    } else {
      let tmp_all_option = { id: -1, name: this.text_all }
      this.referral_source_options = [tmp_all_option, ...this.clients_setup.referral_sources]
      this.client_rating_options = [tmp_all_option, ...this.clients_setup.client_ratings]
      this.client_group_options = [tmp_all_option, ...this.clients_setup.client_groups]
    }
    await this.loadServiceCategoriesAsync()
    await this.loadStaffsAsync()
  },
  methods: {
    // Store
    ...mapActions('client_management',[
      'getClientsByFilterAsync'
    ]),
    // SEARCH & FILTER
    async onChangeTargetType(target_type){
      // reset search conditions & filter conditions
      this.form_errors = []
      this.table_search_condition = new ClientManagementSearchConditionViewModel()
      this.table_filter = new ClientManagementFilterViewModel()

      // set target_type
      this.table_search_condition.fields.search_condition_type = target_type
      if(target_type == options.client_management.target_type_options.clients_by_sales_product){
        await this.loadProductCategorysAsyncMixin()
      }
      if(target_type == options.client_management.target_type_options.clients_by_prepaid_cards){
        await this.loadPrepaidCardsAsync()
      }
    },
    // Service
    async loadServiceCategoriesAsync(){
      this.preLoader()
      let tmp_all_option = { id: -1, name: this.text_all }
      this.service_options = this.prepaid_service_options = [{ id: -1, name: this.text_all }]
      let result_categorys = await this.loadServiceCategorysAsync()
      if(result_categorys.is_ok) {
        this.service_category_options = [tmp_all_option, ...result_categorys.data.items]
      }
      else
        this.showAlert(result_categorys.error_messages)
      this.preLoader(false)
    },
    async onChangeCategoryService(category_id){
      await this.loadServicesByCategoryAsync(category_id)
    },
    async loadServicesByCategoryAsync(category_id, page_number){
      let tmp_all_option = { id: -1, name: this.text_all }
      let tmp_category_id = category_id == -1 ? 0 : category_id
      let result_services = await this.loadServicesAsync(tmp_category_id, page_number)
      if(result_services.is_ok){
        this.service_options = [tmp_all_option, ...result_services.data.items] 
        this.table_search_condition.fields.service_id = -1
      }
      else
        this.showAlert(result_services.error_messages)
    },
    //Product
    async loadProductCategorysAsyncMixin(){
      this.preLoader()
      let tmp_all_option = { id: -1, name: this.text_all }
      this.product_options = [{ id: -1, name: this.text_all }]
      let response = await this.getProductCategorysAsyncMixin()

      if(response.is_ok){
        this.product_category_options = [tmp_all_option, ...response.data.items]
      }
      else
        this.showAlert(response.error_messages)
      this.preLoader(false)
    },
    async onChangeProductCategory(category_id){
      await this.loadProductsByCategoryAsync(category_id)
    },
    async loadProductsByCategoryAsync(category_id){
      this.preLoader()
      let tmp_all_option = { id: -1, name: this.text_all }
      let filter = {
        product_category_id : category_id == -1 ? 0 : category_id,
        key_word            : '',
        usage_status        : options.usage_status.all,
        status              : options.good_status.active,
        page_size           : options.pagination.max,
        page_number         : 1,
        shop_id             : this.shop_data.shop_id,
      }
      let response = await this.getProductsAsyncMixin(filter)

      if(response.is_ok){
        this.product_options = [tmp_all_option, ...response.data.items]
        this.table_search_condition.fields.product_id = -1
      }
      else
        this.showAlert(response.error_messages)
      this.preLoader(false)
    },
    // Prepaid Card
    async loadPrepaidCardsAsync(){
      this.preLoader()
      let tmp_all_option = { id: -1, name: this.text_all }
      let result = await this.getPrepaidCardsAsyncMixin()

      if(result.is_ok){
        this.prepaid_card_options = [tmp_all_option, ...result.data.items]
      } else
        this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    // Prepaid Service
    async onChangeCategoryServicePS(category_id){
      this.preLoader()
      let tmp_all_option = { id: -1, name: this.text_all }
      let result = await this.loadPrepaidServicesAsync(category_id)
      if(result.is_ok){
        this.prepaid_service_options = [tmp_all_option, ...result.data.items]
        this.table_search_condition.fields.service_id = -1
      }
      else
        this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    // Staff
    async loadStaffsAsync(){
      let tmp_all_option = { id: -1, aliasname: this.text_all }
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok){
        this.staff_options = [tmp_all_option, ...result.data.items]
      }
      else 
        this.showAlert(result.error_messages)
    },
    // Main method
    async loadTableData() {
      // reset table
      this.table_data.rows = []
      this.form_errors = []

      // date-range validation
      let date_range_errors = []
      if(this.$refs.input_date_range) {
        date_range_errors = [...this.$refs.input_date_range.errors]

        // restrict 3 month to date-range
        let tmp_from_date        = this.$refs.input_date_range.result.value.from_date.text
        let tmp_to_date_ts       = this.$refs.input_date_range.result.value.to_date.value
        let tmp_to_date_limit    = moment(tmp_from_date).add(3, 'months').subtract(1,'day').toDate()
        let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) + options.seconds_of_24h - 1
        if(tmp_to_date_ts > tmp_to_date_limit_ts){
          date_range_errors.push(this.date_range_can_not_exceed_3_months)
        }
        this.table_search_condition.fields.from_date_ts = this.$refs.input_date_range.result.value.from_date.value
        this.table_search_condition.fields.to_date_ts   = this.$refs.input_date_range.result.value.to_date.value
      }
      if(this.$refs.input_expiry_date_range){
        date_range_errors = [...this.$refs.input_expiry_date_range.errors]
        this.table_search_condition.fields.expiry_from_date_ts = this.$refs.input_expiry_date_range.result.value.from_date.value
        this.table_search_condition.fields.expiry_to_date_ts   = this.$refs.input_expiry_date_range.result.value.to_date.value
      }
      if(this.$refs.input_first_visit_date){
        date_range_errors = [...this.$refs.input_first_visit_date.errors]
        this.table_filter.fields.first_visit_from_date_time_ts = this.$refs.input_first_visit_date.result.value.from_date.value
        this.table_filter.fields.first_visit_to_date_time_ts   = this.$refs.input_first_visit_date.result.value.to_date.value
      }
      if(this.$refs.input_recent_visit_date){
        date_range_errors = [...this.$refs.input_recent_visit_date.errors]
        this.table_filter.fields.recent_visit_from_date_time_ts = this.$refs.input_recent_visit_date.result.value.from_date.value
        this.table_filter.fields.recent_visit_to_date_time_ts   = this.$refs.input_recent_visit_date.result.value.to_date.value
      }
      this.form_errors = [...this.table_filter.isValid(), ...this.table_search_condition.isValid(), ...date_range_errors]
      if(this.form_errors.length == 0) {
        const filter_data = {
          search_condition: this.table_search_condition,
          filter: this.table_filter,
          shop_id: this.shop_data.shop_id,
          page_size: options.pagination.default,
          page_number: this.page_number
        }
        
        this.preLoader()
        await this.getClientsByFilterAsync(filter_data)
        this.preLoader(false)
        
        if(this.x_clients.is_ok) {
          this.show_clients_result_table = true
          this.all_searched_clients = [...this.x_clients.data.items]
          this.all_searched_client_ids = [...this.x_clients.data.total_client_ids]
        }
        else {
          this.showAlert(this.x_clients.error_messages)
        }
      } else {
        this.showAlert(this.form_errors)
      }
    },
    getTableDataFields(){
      let tmp_field_total_sales =                  { field: 'total_sales', label: 'clients.total-sales', sortable: false, expand: true }
      let tmp_field_client_rating =                { field: 'client_rating_name', label: 'clients.client-rating', sortable: false }
      let tmp_field_referal_source =               { field: 'client_referral_source_name', label: 'report.referal-source', sortable: false }
      let tmp_field_preferred_staff =              { field: 'preferred_staff_name', label: 'clients.preferred-staff', sortable: false }
      let tmp_field_balance =                      { field: 'balance', label: 'sales.balance', sortable: false, expand: true }
      let tmp_field_points =                       { field: 'loyalty_points', label: 'sales.points', sortable: false, expand: true }
      let tmp_field_prepaid_cards_name =           { field: 'prepaid_cards_name', label: 'menu.prepaid-cards', sortable: false, expand: true }
      let tmp_field_prepaid_cards_balance =        { field: 'prepaid_cards_balance', label: 'sales.balance', sortable: false, expand: true }
      let tmp_field_prepaid_cards_expiry_date =    { field: 'prepaid_cards_expiry_date', label: 'refund.expiry-date', sortable: false, expand: true }
      let tmp_field_prepaid_services_name =        { field: 'prepaid_services_name', label: 'services.prepaid-services', sortable: false, expand: true }
      let tmp_field_prepaid_services_quantity =    { field: 'prepaid_services_quantity', label: 'sales-prepaid-service-tab.quantity', sortable: false, expand: true }
      let tmp_field_prepaid_services_expiry_date = { field: 'prepaid_services_expiry_date', label: 'refund.expiry-date', sortable: false, expand: true }
      let tmp_field_birthday =                     { field: 'birthday', label: 'clients.birthday', sortable: false }
      let tmp_field_first_visit_date =             { field: 'first_visit_date', label: 'clients.first-visit-date', sortable: false, width: '20%' }

      let tmp_fields = [
        { field: 'client_name', label: 'clients.client-name', sortable: false },
        { field: 'mobile_number', label: 'clients.mobile-number', sortable: false },
        { field: 'recent_visit_date', label: 'bookings.recent-visit-date', sortable: false }
      ]
      
      switch (this.table_search_condition.fields.search_condition_type) {
        case options.client_management.target_type_options.all_clients:
          tmp_fields.push(tmp_field_client_rating, tmp_field_preferred_staff, tmp_field_total_sales)
          break
        case options.client_management.target_type_options.dormant_clients:
          tmp_fields.push(tmp_field_total_sales, tmp_field_balance, tmp_field_points)
          break
        case options.client_management.target_type_options.clients_by_sales_amount:
          tmp_fields.push(tmp_field_client_rating, tmp_field_total_sales)
          break
        case options.client_management.target_type_options.clients_by_prepaid_cards:
          tmp_fields.push(tmp_field_prepaid_cards_name, tmp_field_prepaid_cards_balance, tmp_field_prepaid_cards_expiry_date)
          break
        case options.client_management.target_type_options.clients_by_prepaid_services:
          tmp_fields.push(tmp_field_prepaid_services_name, tmp_field_prepaid_services_quantity, tmp_field_prepaid_services_expiry_date)
          break
        case options.client_management.target_type_options.birthday_clients:
          tmp_fields.push(tmp_field_birthday, tmp_field_client_rating, tmp_field_total_sales)
          break
        case options.client_management.target_type_options.recommended_clients:
          tmp_fields = [
            tmp_field_first_visit_date, 
            { field: 'client_name', label: 'clients.client-name', sortable: false, width: '20%' }, 
            { field: 'mobile_number', label: 'clients.mobile-number', sortable: false, width: '20%' },
            { field: 'recommender_name', label: 'clients.client-name', sortable: false, width: '20%' }, 
            { field: 'recommender_mobile_number', label: 'clients.mobile-number', sortable: false, width: '20%' }
          ]
          break
        default:
          tmp_fields.push(tmp_field_total_sales, tmp_field_preferred_staff, tmp_field_referal_source)
          break
      }
      return [...tmp_fields]
    },
    onSelectRows(rows){
      let tmp_exclude_client_ids = []
      let tmp_remain_client_ids = rows.map(r => r.id)
      for(let i = 0; i < this.table_data.rows.length; i++){
        let client = this.table_data.rows[i]
        if(!tmp_remain_client_ids.includes(client.id)){
          tmp_exclude_client_ids.push(client.id)
        }
        if(this.exclude_client_ids.includes(client.id)){
          client.vgtSelected = false
        }
        const exclude_client_id_index = this.exclude_client_ids.indexOf(this.table_data.rows[i].id)
        if (exclude_client_id_index > -1) {
          this.exclude_client_ids.splice(exclude_client_id_index, 1)
        }
      }
      tmp_exclude_client_ids = [...this.exclude_client_ids, ...tmp_exclude_client_ids]
      this.exclude_client_ids = [...new Set(tmp_exclude_client_ids)]
    },
    onChangePage(page_num){
      this.page_number = page_num
      this.loadTableData()
    },
    async onSearchClients(){
      await this.loadTableData()
    },
    onShowFormSearch(){
      this.show_clients_result_table = false
      this.page_number = 1
    },
    onNextAction(){
      if(this.action_type_enum == campaign_action_options.send_text_messages){
        this.showDialogById('send-messages-modal')
      } else {
        for(let exclude_id of this.exclude_client_ids){
          const index = this.all_searched_client_ids.indexOf(exclude_id.toString())
          if (index > -1) {
            this.all_searched_client_ids.splice(index, 1)
          }
        }
        this.showDialogById('change-clients-rating-action-modal')
      }
    },
    // Export Excel
    onConfirmedOwner(is_owner){
      if(is_owner){
        this.onDownloadExcel()
      } else {
        this.showAlert([this.$i18n.t('clients.user-is-not-owner')])
      }
    },
    async onDownloadExcel(){
      // workbook
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet()
      ws.properties.defaultColWidth  = 25

      // Clients
      let row_title_client = ws.addRow(['Clients Management'])
      row_title_client.font = { bold: true, size: 16 }

      // Get table field
      let row_header = this.getTableDataFields().map(e => this.$i18n.t(e.label))
      let fields = this.getTableDataFields().map(e => e.field)
      ws.addRow()
      ws.addRow()
      let cell_header = ws.addRow(row_header)
      for (let i = 0; i < row_header.length; i++) {
        this.setCellBorders(`${this.excel_cells[i]}${cell_header.number}`, ws)
        this.setCellAlignment(`${this.excel_cells[i]}${cell_header.number}`, ws)
        cell_header.font = { bold: true, size: 13 }
      }
      for(let item of this.table_data.rows){
        let item_map = []
        for(let field in fields){
          if (fields.hasOwnProperty(field)){
            if(item[fields[field]] == null){
              item[fields[field]] = ''
            }
            item_map.push(item[fields[field]])
          }
        }
        let tmp_row = ws.addRow(item_map)
        for (let y = 0; y < row_header.length; y++) {
          this.setCellBorders(`${this.excel_cells[y]}${tmp_row.number}`, ws)
          this.setCellAlignment(`${this.excel_cells[y]}${tmp_row.number}`, ws)
        }
      }
      const buf = await wb.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `Clients Management ${moment(new Date()).format('DD/MM/YYYY')}.xlsx`)
    },
    setCellBorders(cell_address, ws){
      ws.getCell(cell_address).border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      }
    },
    setCellAlignment(cell_address, ws){
      ws.getCell(cell_address).alignment = {
        vertical: 'middle',
        horizontal: 'center'
      }
    }
  }
}
</script>

<style lang="scss">
@import './client-management.scss';
</style>