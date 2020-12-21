import vue from 'vue'
import vue_router from 'vue-router'
import store from '../store/store'
import _ from 'lodash'

vue.use(vue_router)

const route = {
  // goods
  products:           { group: 'goods', name: 'products' },
  product_categories: { group: 'goods', name: 'product-categories' },
  prepaid_cards:      { group: 'goods', name: 'prepaid-cards',  },
  services:           { group: 'goods', name: 'services' },
  packages:           { group: 'goods', name: 'packages' },

  // bookings
  calendar:                         { group: 'bookings', name: 'calendar' },
  booking_opening_hours:            { group: 'bookings', name: 'booking-opening-hours' },
  booking_resources:                { group: 'bookings', name: 'booking-resources' },
  booking_items:                    { group: 'bookings', name: 'booking-items' },
  booking_calendar_settings:        { group: 'bookings', name: 'booking-calendar-settings' },
  booking_online_booking_settings:  { group: 'bookings', name: 'booking-online-booking-settings' },

  // sales
  sales                      : { group: 'sales', name: 'sales' },
  client_sales               : { group: 'sales', name: 'client-sales' },
  outstanding                : { group: 'sales', name: 'outstanding' },
  outstanding_edit_history   : { group: 'sales', name: 'outstanding-edit-history' },
  balance_point_edit_history : { group: 'sales', name: 'balance-point-edit-history' },
  sales_edit_delete_history  : { group: 'sales', name: 'sales-edit-delete-history'},
  sales_history              : { group: 'sales', name: 'sales-history'},
  sales_total                : { group: 'sales', name: 'sales-total'},
  sales_by_staff             : { group: 'sales', name: 'sales-by-staff'},
  sales_by_item              : { group: 'sales', name: 'sales-by-item'},

  // inventory
  suppliers:                { group: 'inventory', name: 'suppliers' },
  receivings:               { group: 'inventory', name: 'receivings' },
  add_internal_use:         { group: 'inventory', name: 'add-internal-use' },
  stock_internal_use:       { group: 'inventory', name: 'stock-internal-use' },
  stock_adjustment:         { group: 'inventory', name: 'stock-adjustment' },
  stock_adjustment_history: { group: 'inventory', name: 'stock-adjustment-history' },
  stock_history:            { group: 'inventory', name: 'stock-history' },
  stock_status:             { group: 'inventory', name: 'stock-status' },

  // expenditure
  expenditure_history:  { group: 'expenditure', name: 'expenditure-history' },
  expenditure_summary:  { group: 'expenditure', name: 'expenditure-summary' },
  expenditure_items:    { group: 'expenditure', name: 'expenditure-items' },

  // REPORT
  report_menu:                        { group: 'report', name: 'report-menu' },

  // report sales analysis
  report_sales_by_date:               { group: 'report', name: 'report-sales-by-date' },
  report_sales_by_month:              { group: 'report', name: 'report-sales-by-month' },
  report_service_sales:               { group: 'report', name: 'report-service-sales' },
  report_service_sales_by_item:       { group: 'report', name: 'report-service-sales-by-item' },
  report_service_sales_by_month:      { group: 'report', name: 'report-service-sales-by-month' },
  report_service_sales_by_sales_type: { group: 'report', name: 'report-service-sales-by-sales-type' },
  report_product_sales_by_item:       { group: 'report', name: 'report-product-sales-by-item' },
  report_product_sales_by_month:      { group: 'report', name: 'report-product-sales-by-month' },
  report_sales_by_discount_category:  { group: 'report', name: 'report-sales-by-discount-category' },
  report_sales_by_repeat_clients:     { group: 'report', name: 'report-sales-by-repeat-clients' },
  report_income_statement:            { group: 'report', name: 'report-income-statement' },
  report_booking_deposit_summary:     { group: 'report', name: 'report-booking-deposit-summary' },

  // report client analysis
  report_clients_summary:                { group: 'report', name: 'report-clients-summary' },
  report_new_clients_repeat:             { group: 'report', name: 'report-new-clients-repeat' },
  report_new_clients_by_month:           { group: 'report', name: 'report-new-clients-by-month' },
  report_new_clients_by_referral_source: { group: 'report', name: 'report-new-clients-by-referral-source' },

  // report booking analysis
  report_detailed_analysis_of_bookings:  { group: 'report', name: 'report-detailed-analysis-of-bookings' },
  report_bookings_by_date:               { group: 'report', name: 'report-bookings-by-date' },
  report_bookings_by_month:              { group: 'report', name: 'report-bookings-by-month' },

  // report balance and loyalty points
  report_balances_and_loyalty_points:    { group: 'report', name: 'report-balances-and-loyalty-points' },

  // staffs
  staff_goal_management:{ group: 'staffs', name: 'staff-goal-management' },
  staff_goal_setup:     { group: 'staffs', name: 'staff-goal-setup' },
  payroll_statement:    { group: 'staffs', name: 'payroll-statement' },
  payroll_setup:        { group: 'staffs', name: 'payroll-setup' },
  staffs:               { group: 'staffs', name: 'staffs' },
  

  // clients
  clients:              { group: 'clients', name: 'clients'},
  duplicated_clients:   { group: 'clients', name: 'duplicated-clients'},
  deleted_clients:      { group: 'clients', name: 'deleted-clients'},
  client_management:    { group: 'clients', name: 'client-management'},

  // campaigns
  campaign_management:  { group: 'campaigns', name: 'campaign-management'},
  campaign_report:      { group: 'campaigns', name: 'campaign-report' },

  //setup
  misc_codes:           { group: 'setup', name: 'misc-codes' },
  loyalty_points_setup: { group: 'setup', name: 'loyalty-points-setup' },
  environment_setup:    { group: 'setup', name: 'environment-setup' },
  cid_setup:            { group: 'setup', name: 'cid-setup' },
  cid_history:          { group: 'setup', name: 'cid-history' },
  cid_receive_call_popup:         { group:'setup', name: 'cid-receive-call-popup' },

  // account
  //user_account:              { group: 'account', name: 'user-account'},
  shop_information:          { group: 'account', name: 'shop-information'},
  user_accounts:             { group: 'account', name: 'user-accounts'},
  login_histories:           { group: 'account', name: 'login-histories'},


  //account>payments
  payments:                  { group: 'account', payment_group: 'payments', name: 'payments'},
  depositless_payment:       { group: 'account', payment_group: 'payments', name: 'depositless-payment'},
  automatic_transfer:        { group: 'account', payment_group: 'payments',  name: 'automatic-transfer'},
  kakao_pay:                 { group: 'account', payment_group: 'payments',  name: 'kakao-pay'},
  payment_date_extension:    { group: 'account', payment_group: 'payments',  name: 'payment-date-extension'},

  payment_history:           { group: 'account', name: 'payment-history'},
  payment_iamport:           { group: 'account', name: 'payment-iamport'},
  virtual_account_result: { group: 'account', name: 'virtual-account-result' },
  netmoney_history:          { group: 'account', name: 'netmoney-history'},
  extension_expiry_date:     { group: 'account', name: 'extension-expiry-date'},

  // support
  boards:       { group: 'support', name: 'boards'},
  board_view:   { group: 'support', name: 'board-view'},
  board_action: { group: 'support', name: 'board-action' },
  manuals:      { group: 'support', name: 'manuals'},
  popup_view:   { group: 'support', name: 'popup-view' },

  // messages
  send_message_histories:         { group: 'messages', name: 'send-message-histories' },
  send_messages:                  { group: 'messages', name: 'send-messages' },
  setup_automatic_messaging:      { group: 'messages', name: 'setup-automatic-messaging' },
  setup_automatic_messaging_info: { group: 'messages', name: 'setup-automatic-messaging-info' },
  setup_automatic_messaging_post_visit_info:           { group: 'messages', name: 'setup-automatic-messaging-post-visit-info' },
  setup_automatic_messaging_expiry_date_reminder_info: { group: 'messages', name: 'setup-automatic-messaging-expiry-date-reminder-info' },
  message_sender_numbers:    { group: 'messages', name: 'message-sender-numbers' },
  message_sender_number_add: { group: 'messages', name: 'message-sender-number-add' },  

  // common
  //login
  login:      { group: 'common', name: 'login' },
  logout:     { group: 'common', name: 'logout' },
  home:       { group: 'common', name: 'home' },
  not_found:  { group: 'common', name: 'not-found' },
}

const router = new vue_router({
  routes: [
    // ===========================
    // goods
    // ===========================
    {
      path: '/' + route.products.name,
      name: route.products.name,
      component: loadPage(route.products),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.product_categories.name,
      name: route.product_categories.name,
      component: loadPage(route.product_categories),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.prepaid_cards.name,
      name: route.prepaid_cards.name,
      component: loadPage(route.prepaid_cards),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.services.name,
      name: route.services.name,
      component: loadPage(route.services),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.packages.name,
      name: route.packages.name,
      component: loadPage(route.packages),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // bookings
    // ===========================
    {
      path: '/' + route.calendar.name,
      name: route.calendar.name,
      component: loadPage(route.calendar),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.booking_opening_hours.name,
      name: route.booking_opening_hours.name,
      component: loadPage(route.booking_opening_hours),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.booking_resources.name,
      name: route.booking_resources.name,
      component: loadPage(route.booking_resources),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.booking_items.name,
      name: route.booking_items.name,
      component: loadPage(route.booking_items),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.booking_calendar_settings.name,
      name: route.booking_calendar_settings.name,
      component: loadPage(route.booking_calendar_settings),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.booking_online_booking_settings.name,
      name: route.booking_online_booking_settings.name,
      component: loadPage(route.booking_online_booking_settings),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // sales
    // ===========================
    {
      path: '/' + route.sales.name,
      name: route.sales.name,
      component: loadPage(route.sales),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.client_sales.name,
      name: route.client_sales.name,
      component: loadPage(route.client_sales),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.outstanding.name,
      name: route.outstanding.name,
      component: loadPage(route.outstanding),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.outstanding_edit_history.name,
      name: route.outstanding_edit_history.name,
      component: loadPage(route.outstanding_edit_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.balance_point_edit_history.name,
      name: route.balance_point_edit_history.name,
      component: loadPage(route.balance_point_edit_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.sales_edit_delete_history.name,
      name: route.sales_edit_delete_history.name,
      component: loadPage(route.sales_edit_delete_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.sales_history.name,
      name: route.sales_history.name,
      component: loadPage(route.sales_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.sales_total.name,
      name: route.sales_total.name,
      component: loadPage(route.sales_total),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.sales_by_staff.name,
      name: route.sales_by_staff.name,
      component: loadPage(route.sales_by_staff),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.sales_by_item.name,
      name: route.sales_by_item.name,
      component: loadPage(route.sales_by_item),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // inventory
    // ===========================
    {
      path: '/' + route.suppliers.name,
      name: route.suppliers.name,
      component: loadPage(route.suppliers),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.receivings.name,
      name: route.receivings.name,
      component: loadPage(route.receivings),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.add_internal_use.name,
      name: route.add_internal_use.name,
      component: loadPage(route.add_internal_use),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.stock_internal_use.name,
      name: route.stock_internal_use.name,
      component: loadPage(route.stock_internal_use),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.stock_adjustment.name,
      name: route.stock_adjustment.name,
      component: loadPage(route.stock_adjustment),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.stock_adjustment_history.name,
      name: route.stock_adjustment_history.name,
      component: loadPage(route.stock_adjustment_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.stock_history.name,
      name: route.stock_history.name,
      component: loadPage(route.stock_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.stock_status.name,
      name: route.stock_status.name,
      component: loadPage(route.stock_status),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // expenditure
    // ===========================
    {
      path: '/' + route.expenditure_history.name,
      name: route.expenditure_history.name,
      component: loadPage(route.expenditure_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.expenditure_summary.name,
      name: route.expenditure_summary.name,
      component: loadPage(route.expenditure_summary),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.expenditure_items.name,
      name: route.expenditure_items.name,
      component: loadPage(route.expenditure_items),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // report
    // ===========================
    {
      path: '/' + route.report_menu.name,
      name: route.report_menu.name,
      component: loadPage(route.report_menu),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_sales_by_date.name,
      name: route.report_sales_by_date.name,
      component: loadPage(route.report_sales_by_date),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_sales_by_month.name,
      name: route.report_sales_by_month.name,
      component: loadPage(route.report_sales_by_month),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_service_sales.name,
      name: route.report_service_sales.name,
      component: loadPage(route.report_service_sales),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_service_sales_by_item.name,
      name: route.report_service_sales_by_item.name,
      component: loadPage(route.report_service_sales_by_item),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_service_sales_by_month.name,
      name: route.report_service_sales_by_month.name,
      component: loadPage(route.report_service_sales_by_month),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_service_sales_by_sales_type.name,
      name: route.report_service_sales_by_sales_type.name,
      component: loadPage(route.report_service_sales_by_sales_type),
      meta: {
        preload: true,
      }
    },

    {
      path: '/' + route.report_product_sales_by_item.name,
      name: route.report_product_sales_by_item.name,
      component: loadPage(route.report_product_sales_by_item),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_product_sales_by_month.name,
      name: route.report_product_sales_by_month.name,
      component: loadPage(route.report_product_sales_by_month),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_sales_by_discount_category.name,
      name: route.report_sales_by_discount_category.name,
      component: loadPage(route.report_sales_by_discount_category),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_sales_by_repeat_clients.name,
      name: route.report_sales_by_repeat_clients.name,
      component: loadPage(route.report_sales_by_repeat_clients),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_income_statement.name,
      name: route.report_income_statement.name,
      component: loadPage(route.report_income_statement),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_booking_deposit_summary.name,
      name: route.report_booking_deposit_summary.name,
      component: loadPage(route.report_booking_deposit_summary),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_clients_summary.name,
      name: route.report_clients_summary.name,
      component: loadPage(route.report_clients_summary),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_new_clients_repeat.name,
      name: route.report_new_clients_repeat.name,
      component: loadPage(route.report_new_clients_repeat),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_new_clients_by_month.name,
      name: route.report_new_clients_by_month.name,
      component: loadPage(route.report_new_clients_by_month),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_new_clients_by_referral_source.name,
      name: route.report_new_clients_by_referral_source.name,
      component: loadPage(route.report_new_clients_by_referral_source),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_detailed_analysis_of_bookings.name,
      name: route.report_detailed_analysis_of_bookings.name,
      component: loadPage(route.report_detailed_analysis_of_bookings),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_bookings_by_date.name,
      name: route.report_bookings_by_date.name,
      component: loadPage(route.report_bookings_by_date),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_bookings_by_month.name,
      name: route.report_bookings_by_month.name,
      component: loadPage(route.report_bookings_by_month),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.report_balances_and_loyalty_points.name,
      name: route.report_balances_and_loyalty_points.name,
      component: loadPage(route.report_balances_and_loyalty_points),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // staffs
    // ===========================
    {
      path: '/' + route.staff_goal_management.name,
      name: route.staff_goal_management.name,
      component:  loadPage(route.staff_goal_management) ,
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.staff_goal_setup.name,
      name: route.staff_goal_setup.name,
      component:  loadPage(route.staff_goal_setup) ,
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.payroll_statement.name,
      name: route.payroll_statement.name,
      component:  loadPage(route.payroll_statement) ,
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.payroll_setup.name,
      name: route.payroll_setup.name,
      component:  loadPage(route.payroll_setup) ,
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.staffs.name,
      name: route.staffs.name,
      component:  loadPage(route.staffs) ,
      meta: {
        preload: true,
      }
    },

    // ===========================
    // setup
    // ===========================
    {
      path: '/' + route.misc_codes.name,
      name: route.misc_codes.name,
      component: loadPage(route.misc_codes),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.loyalty_points_setup.name,
      name: route.loyalty_points_setup.name,
      component: loadPage(route.loyalty_points_setup),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.environment_setup.name,
      name: route.environment_setup.name,
      component: loadPage(route.environment_setup),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.cid_setup.name,
      name: route.cid_setup.name,
      component: loadPage(route.cid_setup),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.cid_history.name,
      name: route.cid_history.name,
      component: loadPage(route.cid_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.cid_receive_call_popup.name,
      name: route.cid_receive_call_popup.name,
      component: loadPage(route.cid_receive_call_popup),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // clients
    // ===========================
    {
      path: '/' + route.clients.name,
      name: route.clients.name,
      component: loadPage(route.clients),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.duplicated_clients.name,
      name: route.duplicated_clients.name,
      component: loadPage(route.duplicated_clients),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.deleted_clients.name,
      name: route.deleted_clients.name,
      component: loadPage(route.deleted_clients),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.client_management.name,
      name: route.client_management.name,
      component: loadPage(route.client_management),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // campaigns
    // ===========================
    {
      path: '/' + route.campaign_management.name,
      name: route.campaign_management.name,
      component: loadPage(route.campaign_management),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.campaign_report.name,
      name: route.campaign_report.name,
      component: loadPage(route.campaign_report),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // account
    // ===========================
    // {
    //   path: '/' + route.user_account.name,
    //   name: route.user_account.name,
    //   component: loadPage(route.user_account),
    //   meta: {
    //     preload: true,
    //   }
    // },
    {
      path: '/' + route.shop_information.name,
      name: route.shop_information.name,
      component: loadPage(route.shop_information),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.user_accounts.name,
      name: route.user_accounts.name,
      component: loadPage(route.user_accounts),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.login_histories.name,
      name: route.login_histories.name,
      component: loadPage(route.login_histories),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.payments.name,
      name: route.payments.name,
      component: loadPagePayment(route.payments),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.depositless_payment.name,
      name: route.depositless_payment.name,
      component: loadPagePayment(route.depositless_payment),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.automatic_transfer.name,
      name: route.automatic_transfer.name,
      component: loadPagePayment(route.automatic_transfer),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.kakao_pay.name,
      name: route.kakao_pay.name,
      component: loadPagePayment(route.kakao_pay),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.payment_date_extension.name,
      name: route.payment_date_extension.name,
      component: loadPagePayment(route.payment_date_extension),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.payment_history.name,
      name: route.payment_history.name,
      component: loadPage(route.payment_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.netmoney_history.name,
      name: route.netmoney_history.name,
      component: loadPage(route.netmoney_history),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.extension_expiry_date.name,
      name: route.extension_expiry_date.name,
      component: loadPage(route.extension_expiry_date),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.payment_iamport.name,
      name: route.payment_iamport.name,
      component: loadPage(route.payment_iamport),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.virtual_account_result.name,
      name: route.virtual_account_result.name,
      component: loadPage(route.virtual_account_result),
      meta: {
        preload: true,
      }
    },
    // ===========================
    // support
    // ===========================
    {
      path: '/' + route.boards.name + '/:type',
      name: route.boards.name,
      component: loadPage(route.boards),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.board_view.name + '/:board_code',
      name: route.board_view.name,
      component: loadPage(route.board_view),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.board_action.name + '/:board_code',
      name: route.board_action.name,
      component: loadPage(route.board_action),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.manuals.name,
      name: route.manuals.name,
      component: loadPage(route.manuals),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.popup_view.name,
      name: route.popup_view.name,
      component: loadPage(route.popup_view),
      meta: {
        preload: true,
      }
    },

    // ===========================
    // messages
    // ===========================
    {
      path: '/' + route.send_message_histories.name,
      name: route.send_message_histories.name,
      component: loadPage(route.send_message_histories),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.send_messages.name,
      name: route.send_messages.name,
      component: loadPage(route.send_messages),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.setup_automatic_messaging.name,
      name: route.setup_automatic_messaging.name,
      component: loadPage(route.setup_automatic_messaging),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.setup_automatic_messaging_info.name,
      name: route.setup_automatic_messaging_info.name,
      component: loadPage(route.setup_automatic_messaging_info),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.setup_automatic_messaging_expiry_date_reminder_info.name,
      name: route.setup_automatic_messaging_expiry_date_reminder_info.name,
      component: loadPage(route.setup_automatic_messaging_expiry_date_reminder_info),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.setup_automatic_messaging_post_visit_info.name,
      name: route.setup_automatic_messaging_post_visit_info.name,
      component: loadPage(route.setup_automatic_messaging_post_visit_info),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.message_sender_numbers.name,
      name: route.message_sender_numbers.name,
      component: loadPage(route.message_sender_numbers),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.message_sender_number_add.name,
      name: route.message_sender_number_add.name,
      component: loadPage(route.message_sender_number_add),
      meta: {
        preload: true,
      }
    },
    // ===========================
    // common
    // ===========================
    {
      path: '/' + route.login.name,
      name: route.login.name,
      component: loadPage(route.login),
      meta: {
        preload: true,
      }
    },
    {
      path: '/' + route.logout.name,
      name: route.logout.name,
      component: loadPage(route.logout),
      meta: {
        preload: true,
      }
    },
    {
      path: '/',
      name: route.home.name,
      component: loadPage(route.home),
      meta: {
        preload: true,
      }
    },
    {
      path: '*',
      name: route.not_found.name,
      component: loadPage(route.not_found),
      meta: {
        preload: true,
      }
    }
  ]
})


// utils function
function loadPage (route) {
  return () => import(/* webpackChunkName: "view-[request]" */ `../pages/${route.group}/${route.name}/${route.name}`)
}
function loadPagePayment (route) {
  if(route.group) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../pages/${route.group}/${route.payment_group}/${route.name}/${route.name}`)
  }
}

function setIsLoadingInStore(is_loading){
  store.dispatch('alert/setIsLoadingData', is_loading)
}

// navigation guards', menu_permissions)
const spinner = document.getElementsByClassName('v-spinner')
router.beforeEach((to, from, next) => {
  // preLoader on
  if(spinner.length > 0 && to.meta.preload) {
    to.meta.preload = false
    setIsLoadingInStore(true)
  }
  
  // check login
  if(to.name == route.login.name || to.name == route.logout.name) {
    next()
  }
  else {
    let logged_in = store.getters['user/getLoggedIn']
    if(logged_in) {
      if(isRoutePermited(to))
        next()
      else {
        next('not-found')
        setIsLoadingInStore(false)
      }
    }
    else {
      next({ name: route.login.name })
      setIsLoadingInStore(false)
    }
  }
})

// Routes > Menus >= MenuPermission
function isRoutePermited(to){
  let is_permited = false
  if(to.name && to.name.length > 0){
    if(to.name == 'not-found')
      is_permited = true
    else {
      let menu_permissions = store.getters['menu/getMenuPermission']
      let menus            = store.getters['menu/getMenuDataFlat']
      let route       = `/${to.name}`
      let route_match = _.find(menus, { 'link': route })
      if(route_match != undefined)
        is_permited = menu_permissions.includes(route_match.code)
      if(route_match == undefined)
        is_permited = true // because some routes not in menu or menu-permission. ex: /home, /sales, /booking-opening-hours...
    }
  }
  return is_permited
}

router.afterEach(() => {
  setIsLoadingInStore(false)
})

export default router
