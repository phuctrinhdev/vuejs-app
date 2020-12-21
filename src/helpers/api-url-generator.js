/* eslint-disable no-undef */
import { SERVICE_TYPES } from '../config/constant'


// eslint-disable-next-line no-unused-vars
let read = 'read'
// eslint-disable-next-line no-unused-vars
let cmd  = 'cmd'

const api_url_generator =  {
  getUrlDirect(base_url, type, version, service_name){
    return base_url + '/api/' + type + '/v' + version + '/' + service_name
  },
  getUrlRead(version, service_name){
    return process.env.SALONADMIN_GATEWAY_BASEURL + '/api/read/v' + version + '/' + service_name
  },
  getUrlCmd(version, service_name){
    return process.env.SALONADMIN_GATEWAY_BASEURL + '/api/cmd/v' + version + '/' + service_name
  },
  getUrlAgg(version){
    return process.env.SALONADMIN_GATEWAY_BASEURL + '/api/aggr/v' + version
  },

  getUrlBkgRead(version, service_name){
    // "/api/read/{version}/bookings/bkg-tasks/{url}",
    return process.env.SALONADMIN_GATEWAY_BASEURL + '/api/read/v' + version + '/' + service_name
  },

  // Bkg kgTask Read
  getUrlBkgTaskRead(api_name, version = undefined){
    if(version == undefined) version = process.env.SALONADMIN_GATEWAY_VERSION
    return this.getUrlBkgRead(version, process.env.BOOKINGS_READ_BKGTASKS_SERVICE_NAME) + '/' + api_name
  },

  // Aggregator
  getUrlAggregator(api_name, version = undefined){
    if(version == undefined) version = process.env.SALONADMIN_GATEWAY_VERSION
    return this.getUrlAgg(version) + '/' + api_name
  },
  // Goods
  getUrlReadGoods(api_name, version = undefined){
    if(version == undefined) version = process.env.GOODS_READ_API_VERSION
    return this.getUrlRead(version, process.env.GOODS_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdGoods(api_name, version = undefined){
    if(version == undefined) version = process.env.GOODS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.GOODS_SERVICE_NAME) + '/' + api_name
  },

  // Clients
  getUrlReadClients(api_name, version = undefined){
    if(version == undefined) version = process.env.CLIENTS_READ_API_VERSION
    return this.getUrlRead(version, process.env.CLIENTS_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdClients(api_name, version = undefined){
    if(version == undefined) version = process.env.CLIENTS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.CLIENTS_SERVICE_NAME) + '/' + api_name
  },

  // Campaigns
  getUrlReadCampaigns(api_name, version = undefined){
    if(version == undefined) version = process.env.CAMPAIGNS_READ_API_VERSION
    return this.getUrlRead(version, process.env.CAMPAIGNS_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdCampaigns(api_name, version = undefined){
    if(version == undefined) version = process.env.CAMPAIGNS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.CAMPAIGNS_SERVICE_NAME) + '/' + api_name
  },

  // Bookings
  getUrlReadBookings(api_name, version = undefined){
    if(version == undefined) version = process.env.BOOKINGS_READ_API_VERSION
    return this.getUrlRead(version, process.env.BOOKINGS_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdBookings(api_name, version = undefined){
    if(version == undefined) version = process.env.BOOKINGS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.BOOKINGS_SERVICE_NAME) + '/' + api_name
  },

  // Staffs
  getUrlReadStaffs(api_name, version = undefined){
    if(version == undefined) version = process.env.STAFFS_READ_API_VERSION
    return this.getUrlRead(version, process.env.STAFFS_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdStaffs(api_name, version = undefined){
    if(version == undefined) version = process.env.STAFFS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.STAFFS_SERVICE_NAME) + '/' + api_name
  },

  // Sales
  getUrlReadSalesSetup(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_READ_API_VERSION
    return this.getUrlRead(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdSalesSetup(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlReadSales(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_READ_API_VERSION
    return this.getUrlRead(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdSales(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlReadClientPrepaidCard(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_READ_API_VERSION
    return this.getUrlRead(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdClientPrepaidCard(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },

  // Refund
  getUrlReadRefund(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_READ_API_VERSION
    return this.getUrlRead(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdRefund(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },

  // Report
  getUrlReadSalesClientReport(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_READ_API_VERSION
    return this.getUrlRead(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlReadBalancePoints(api_name, version = undefined){
    if(version == undefined) version = process.env.SALES_READ_API_VERSION
    return this.getUrlRead(version, process.env.SALES_SERVICE_NAME) + '/' + api_name
  },
  

  // Supplier
  getUrlReadInventory(api_name, version = undefined){
    if(version == undefined) version = process.env.INVENTORY_READ_API_VERSION
    return this.getUrlRead(version, process.env.INVENTORY_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdInventory(api_name, version = undefined){
    if(version == undefined) version = process.env.INVENTORY_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.INVENTORY_SERVICE_NAME) + '/' + api_name
  },


  // Admin
  getUrlReadAdmin(api_name, version = undefined){
    if(version == undefined) version = process.env.ADMINS_READ_API_VERSION
    return this.getUrlRead(version, process.env.ADMINS_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdAdmin(api_name, version = undefined){
    if(version == undefined) version = process.env.ADMINS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.ADMINS_SERVICE_NAME) + '/' + api_name
  },
  

  // Identities
  getUrlReadIdentitiesSetup(api_name, version = undefined){
    if(version == undefined) version = process.env.IDENTITIES_READ_API_VERSION
    return this.getUrlRead(version, process.env.IDENTITIES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdIdentitiesSetup(api_name, version = undefined){
    if(version == undefined) version = process.env.IDENTITIES_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.IDENTITIES_SERVICE_NAME) + '/' + api_name
  },

  // AdminSales
  getUrlReadAdminSales(api_name, version = undefined){
    if(version == undefined) version = process.env.ADMIN_SALES_READ_API_VERSION
    return this.getUrlRead(version, process.env.ADMIN_SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdAdminSales(api_name, version = undefined){
    if(version == undefined) version = process.env.ADMIN_SALES_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.ADMIN_SALES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdAdmins(api_name, version = undefined){
    if(version == undefined) version = process.env.ADMINS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.ADMINS_SERVICE_NAME) + '/' + api_name
  },

  // Boards
  getUrlReadBoards(api_name, version = undefined){
    if(version == undefined) version = process.env.BOARDS_READ_API_VERSION
    return this.getUrlRead(version, process.env.BOARDS_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdBoards(api_name, version = undefined){
    if(version == undefined) version = process.env.BOARDS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.BOARDS_SERVICE_NAME) + '/' + api_name
  },

  // Messages
  getUrlReadMessages(api_name, version = undefined){
    if(version == undefined) version = process.env.MESSAGES_READ_API_VERSION
    return this.getUrlRead(version, process.env.MESSAGES_SERVICE_NAME) + '/' + api_name
  },
  getUrlCmdMessages(api_name, version = undefined){
    if(version == undefined) version = process.env.MESSAGES_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.MESSAGES_SERVICE_NAME) + '/' + api_name
  },

  // MessageAutos
  getUrlCmdMessageAutos(api_name, version = undefined){
    if(version == undefined) version = process.env.MESSAGE_AUTOS_CMD_API_VERSION
    return this.getUrlCmd(version, process.env.MESSAGE_AUTOS_SERVICE_NAME) + '/' + api_name
  }
}

function getServiceUrl(service_type = 1, version){
  // Goods
  let goods_suffix            = 'Goods'
  let product_category_suffix = 'ProductCategory'
  let product_suffix          = 'Product'
  let service_category_suffix = 'ServiceCategory'
  let service_suffix          = 'Service'
  let prepaid_service_suffix  = 'PrepaidService'
  let prepaid_card_suffix     = 'PrepaidCard'
  let package_suffix          = 'Package'
  let package_item_suffix     = 'PackageItem'

  // Clients
  let client_suffix               = 'Client'
  let client_field_setup          = 'ClientFieldSetup'
  let client_environment_setup    = 'ClientEnvironmentSetup'
  let client_codesetup_suffix     = 'ClientCodeSetup'
  let recommendation_point_setup_suffix = 'RecommendationPointSetup'
  let family_suffix = 'Family'

  // Staffs
  let staff_suffix        = 'Staff'

  // Bookings
  let booking_opening_hours_setup_suffix  = 'BookingOpeningHoursSetup'
  let booking_resources_cmd_suffix        = 'BookingResourceSetup'
  let booking_resources_read_suffix       = 'BookingResourcesSetup'
  let booking_items_read_suffix           = 'BookingItemsSetup'
  let booking_items_cmd_suffix            = 'BookingItemsSetup'
  let booking_item_cmd_suffix             = 'BookingItem'
  let booking_calendar_read_suffix        = 'BookingCalendarSetup'
  let booking_calendar_cmd_suffix         = 'CalendarSetup'
  let online_booking_setup_suffix         = 'OnlineBookingSetup'
  let booking_suffix                      = 'Booking'
  let blocked_time_suffix                 = 'BlockedTime'

  // Bookings Bkg
  let bkg_read_booking_suffix             = 'Bookings'

  // Waiting
  let waiting_suffix                      = 'Waiting'

  // Booking report
  let booking_reports_suffix               = 'Reports'

  // Sales
  let sales_setup_suffix                           = 'SalesSetup'
  let sales_suffix                                 = 'Sales'
  let sales_balance_move_suffix                    = 'BalanceMove'
  let sales_outstanding_payment_suffix             = 'OutstandingPayment'
  let sales_outstanding_histories_suffix           = 'Outstanding/OutstandingHistoriesByFilters/Live'
  let sales_client_account_suffix                  = 'ClientAccount'
  let sales_client_suffix                          = 'Client'
  let client_prepaid_card_suffix                   = 'ClientPrepaidCard'
  let client_prepaid_card_histories_live_suffix    = 'ClientPrepaidCard/ClientPrepaidCardHistories/Live'
  let client_prepaid_service_suffix                = 'ClientPrepaidService'
  let client_prepaid_service_histories_live_suffix = 'ClientPrepaidService/ClientPrepaidServiceHistories/Live'
  let client_history_suffix                        = 'ClientHistory'
  let refund_suffix                                = 'Refund'

  // Report
  let report_sales_client_suffix                   = 'ClientReport'
  let report_balance_and_loyalty_points_suffix     = 'ReportBalanceAndLoyaltyPoints'

  // Inventory
  let supplier_suffix = 'Supplier'
  let receiving_suffix = 'Receiving'
  let stock_internal_use_suffix = 'StockInUse'
  let stock_history_suffix = 'StockHistory'
  let stock_status_suffix = 'StockStatus'

  // Expenditure
  let expenditure_suffix = 'Expenditure'

  // account
  let account_shop_info_suffix            = 'Shop'
  let account_tax_invoice_info_suffix     = 'TaxInvoiceInfo'
  let shop_environment_suffix         = 'ShopEnvironmentSetup'

  // Identities
  let user_account_suffix                 = 'UserAccount'
  let auth_suffix                         = 'auth'
  let user_role_suffix                    = 'UserRole'
  let user_login_history_suffix           = 'UserLoginHistory'

  // admin sales
  let bank_transfer_notice_suffix   = 'BankTransferNotice'
  let misc_code_bank_account_suffix = 'MiscCode/BankAccount'
  let shop_usage_suffix             = 'ShopUsage'
  let netmoney_history_suffix       = 'NetmoneyHistory'
  let base_fee_suffix               = 'BaseFee'
  let admin_sales_suffix            = 'AdminSales'

  // Boards
  let notice_suffix = 'Notice'
  let board_suffix  = 'Board'
  let board_management_suffix  = 'BoardManagement'
  let manual_management_suffix = 'ManualManagement'
  let popup_suffix = 'POPUp'
  let file_attachment_suffix = 'FileAttachment'
  let homepage_suffix = 'Homepage'
  
  // Messages
  let text_fee_suffix          = 'TextFee'
  let text_message_suffix      = 'TextMessage'
  let aggr_text_message_suffix = 'Messages/TextMessage'
  let text_sample_suffix       = 'TextSample'
  let text_my_message_suffix   = 'TextMyMessage'
  let text_sender_phone_suffix = 'TextSenderPhone'
  
  // MessageAutos
  let message_setup_login_suffix   = 'MessageSetupLogin'
  let message_setup_client_suffix  = 'MessageSetupClient'
  let message_setup_sales_suffix   =  'MessageSetupSales'
  let message_setup_booking_suffix = 'MessageSetupBooking'
  let message_setup_post_visit_suffix = 'MessageSetupPostVisit'

  let menu_suffix = 'Menu'

  let cid_account_suffix              = 'CIDAccount'
  let cid_receiving_history_suffix    = 'CIDReceivingHistory'

  // Campaigns
  let campaign_suffix = 'Campaign'

  switch (service_type){
    // Aggregator
    // Client
    case SERVICE_TYPES.CLIENT_AGGR:
      return api_url_generator.getUrlAggregator(client_suffix, version)
    case SERVICE_TYPES.GOODS_AGGR:
      return api_url_generator.getUrlAggregator(goods_suffix,version)
    case SERVICE_TYPES.MESSAGE_AGGR: 
      return api_url_generator.getUrlAggregator(aggr_text_message_suffix, version)

    // GOODS
    // Product
    case SERVICE_TYPES.PRODUCT_READ:
      return api_url_generator.getUrlReadGoods(product_suffix, version)
    case SERVICE_TYPES.PRODUCT_CMD:
      return api_url_generator.getUrlCmdGoods(product_suffix, version)

    // ProductCategory
    case SERVICE_TYPES.PRODUCT_CATEGORY_READ:
      return api_url_generator.getUrlReadGoods(product_category_suffix, version)
    case SERVICE_TYPES.PRODUCT_CATEGORY_CMD:
      return api_url_generator.getUrlCmdGoods(product_category_suffix, version)

    // PrepaidCard
    case SERVICE_TYPES.PREPAID_CARD_READ:
      return api_url_generator.getUrlReadGoods(prepaid_card_suffix, version)
    case SERVICE_TYPES.PREPAID_CARD_CMD:
      return api_url_generator.getUrlCmdGoods(prepaid_card_suffix, version)

    // ServiceCategory
    case SERVICE_TYPES.SERVICE_CATEGORY_READ:
      return api_url_generator.getUrlReadGoods(service_category_suffix, version)
    case SERVICE_TYPES.SERVICE_CATEGORY_CMD:
      return api_url_generator.getUrlCmdGoods(service_category_suffix, version)

    // Service
    case SERVICE_TYPES.SERVICE_READ:
      return api_url_generator.getUrlReadGoods(service_suffix, version)
    case SERVICE_TYPES.SERVICE_CMD:
      return api_url_generator.getUrlCmdGoods(service_suffix, version)
    case SERVICE_TYPES.SERVICE_CMD_AGG:
      return api_url_generator.getUrlAggregator(service_suffix, version)

    // PrepaidService
    case SERVICE_TYPES.PREPAID_SERVICE_READ:
      return api_url_generator.getUrlReadGoods(prepaid_service_suffix, version)
    case SERVICE_TYPES.PREPAID_SERVICE_CMD:
      return api_url_generator.getUrlCmdGoods(prepaid_service_suffix, version)

    // Package
    case SERVICE_TYPES.PACKAGE_READ:
      return api_url_generator.getUrlReadGoods(package_suffix, version)
    case SERVICE_TYPES.PACKAGE_CMD:
      return api_url_generator.getUrlCmdGoods(package_suffix, version)

    // Package Item
    case SERVICE_TYPES.PACKAGE_ITEM_READ:
      return api_url_generator.getUrlReadGoods(package_item_suffix, version)
    case SERVICE_TYPES.PACKAGE_ITEM_CMD:
      return api_url_generator.getUrlCmdGoods(package_item_suffix, version)

    // Client
    case SERVICE_TYPES.CLIENTS.CLIENT_READ:
      return api_url_generator.getUrlReadClients(client_suffix, version)
    case SERVICE_TYPES.CLIENTS.CLIENT_CMD:
      return api_url_generator.getUrlCmdClients(client_suffix, version)

    // Client Field Setup
    case SERVICE_TYPES.CLIENTS.CLIENT_FIELD_SETUP_READ:
      return api_url_generator.getUrlReadClients(client_field_setup, version)
    case SERVICE_TYPES.CLIENTS.CLIENT_FIELD_SETUP_CMD:
      return api_url_generator.getUrlCmdClients(client_field_setup, version)

    // Client Environment Setup
    case SERVICE_TYPES.CLIENTS.CLIENT_ENVIRONMENT_SETUP_READ:
      return api_url_generator.getUrlReadClients(client_environment_setup, version)
    case SERVICE_TYPES.CLIENTS.CLIENT_ENVIRONMENT_SETUP_CMD:
      return api_url_generator.getUrlCmdClients(client_environment_setup, version)

    // ClientClodeSetup : Client Group, Reating, ReferralSource
    case SERVICE_TYPES.CLIENTS.CLIENT_CODESETUP_READ:
      return api_url_generator.getUrlReadClients(client_codesetup_suffix, version)
    case SERVICE_TYPES.CLIENTS.CLIENT_CODESETUP_CMD:
      return api_url_generator.getUrlCmdClients(client_codesetup_suffix, version)

    // Client Recommendation_point_setup
    case SERVICE_TYPES.CLIENTS.RECOMMENDATION_POINT_SETUP_READ:
      return api_url_generator.getUrlReadClients(recommendation_point_setup_suffix, version)
    case SERVICE_TYPES.CLIENTS.RECOMMENDATION_POINT_SETUP_CMD:
      return api_url_generator.getUrlCmdClients(recommendation_point_setup_suffix, version)

    // Family
    case SERVICE_TYPES.CLIENTS.FAMILY_READ:
      return api_url_generator.getUrlReadClients(family_suffix, version)
    case SERVICE_TYPES.CLIENTS.FAMILY_CMD:
      return api_url_generator.getUrlCmdClients(family_suffix, version)

    // Staff
    case SERVICE_TYPES.STAFF_READ:
      return api_url_generator.getUrlReadStaffs(staff_suffix, version)
    case SERVICE_TYPES.STAFF_CMD:
      return api_url_generator.getUrlCmdStaffs(staff_suffix, version)
    case SERVICE_TYPES.STAFF_AGGR:
      return api_url_generator.getUrlAggregator(staff_suffix, version)


    // BOOKINGS
    // Booking Opening Hours Setup
    case SERVICE_TYPES.BOOKINGS_OPENING_HOURS_SETUP_READ:
      return api_url_generator.getUrlReadBookings(booking_opening_hours_setup_suffix, version)
    case SERVICE_TYPES.BOOKINGS_OPENING_HOURS_SETUP_CMD:
      return api_url_generator.getUrlCmdBookings(booking_opening_hours_setup_suffix, version)

    // Booking Resources Setup
    case SERVICE_TYPES.BOOKINGS_RESOURCES_SETUP_READ:
      return api_url_generator.getUrlReadBookings(booking_resources_read_suffix, version)
    case SERVICE_TYPES.BOOKINGS_RESOURCES_SETUP_CMD:
      return api_url_generator.getUrlCmdBookings(booking_resources_cmd_suffix, version)

    // Booking Calendar Setup
    case SERVICE_TYPES.BOOKINGS_CALENDAR_SETUP_READ:
      return api_url_generator.getUrlReadBookings(booking_calendar_read_suffix, version)
    case SERVICE_TYPES.BOOKINGS_CALENDAR_SETUP_CMD:
      return api_url_generator.getUrlCmdBookings(booking_calendar_cmd_suffix, version)

    // Booking Items Setup
    case SERVICE_TYPES.BOOKINGS_ITEMS_SETUP_READ:
      return api_url_generator.getUrlReadBookings(booking_items_read_suffix, version)
    case SERVICE_TYPES.BOOKINGS_ITEMS_SETUP_CMD:
      return api_url_generator.getUrlCmdBookings(booking_items_cmd_suffix, version)
    case SERVICE_TYPES.BOOKINGS_ITEM_SETUP_CMD:
      return api_url_generator.getUrlCmdBookings(booking_item_cmd_suffix, version)

    // Online Booking Setup
    case SERVICE_TYPES.BOOKINGS_ONLINE_BOOKING_SETUP_READ:
      return api_url_generator.getUrlReadBookings(online_booking_setup_suffix, version)
    case SERVICE_TYPES.BOOKINGS_ONLINE_BOOKING_SETUP_CMD:
      return api_url_generator.getUrlCmdBookings(online_booking_setup_suffix, version)

    // Blocked Time
    case SERVICE_TYPES.BLOCKED_TIME_READ:
      return api_url_generator.getUrlReadBookings(blocked_time_suffix, version)
    case SERVICE_TYPES.BLOCKED_TIME_CMD:
      return api_url_generator.getUrlCmdBookings(blocked_time_suffix, version)

    // Booking Calendar
    case SERVICE_TYPES.BOOKING_READ:
      return api_url_generator.getUrlReadBookings(booking_suffix, version)
    case SERVICE_TYPES.BOOKING_CMD:
      return api_url_generator.getUrlCmdBookings(booking_suffix, version)

    // bkg-tasks read Booking
    case SERVICE_TYPES.BKG_TASKS_BOOKING_READ:
      return api_url_generator.getUrlBkgTaskRead(bkg_read_booking_suffix, version)

    // Waiting
    case SERVICE_TYPES.WAITING_READ:
      return api_url_generator.getUrlReadBookings(waiting_suffix, version)
    case SERVICE_TYPES.WAITING_CMD:
      return api_url_generator.getUrlCmdBookings(waiting_suffix, version)

    // Booking report
    case SERVICE_TYPES.BOOKING_REPORT_READ:
      return api_url_generator.getUrlReadBookings(booking_reports_suffix, version)
    

    // SALES
    // Sales Setup
    case SERVICE_TYPES.SALES_SETUP_READ:
      return api_url_generator.getUrlReadSalesSetup(sales_setup_suffix, version)
    case SERVICE_TYPES.SALES_SETUP_CMD:
      return api_url_generator.getUrlCmdSalesSetup(sales_setup_suffix, version)
    case SERVICE_TYPES.RECOMMENDATION_POINT_SETUP_READ:
      return api_url_generator.getUrlReadSales(recommendation_point_setup_suffix, version)
    case SERVICE_TYPES.RECOMMENDATION_POINT_SETUP_CMD:
      return api_url_generator.getUrlCmdSales(recommendation_point_setup_suffix, version)

    // Sales Aggr
    case SERVICE_TYPES.SALES_AGGR:
      return api_url_generator.getUrlAggregator(sales_suffix,version)
    case SERVICE_TYPES.SALES_READ:
      return api_url_generator.getUrlReadSales(sales_suffix, version)
    case SERVICE_TYPES.SALES_CMD:
      return api_url_generator.getUrlCmdSales(sales_suffix, version)

    // Sales Prepaid Card
    case SERVICE_TYPES.SALES_CLIENT_PREPAID_CARD_READ:
      return api_url_generator.getUrlReadClientPrepaidCard(client_prepaid_card_suffix, version)
    case SERVICE_TYPES.SALES_CLIENT_PREPAID_CARD_CMD:
      return api_url_generator.getUrlCmdClientPrepaidCard(client_prepaid_card_suffix, version)
    case SERVICE_TYPES.SALES_CLIENT_PREPAID_CARD_HISTORY_READ:
      return api_url_generator.getUrlReadSales(client_prepaid_card_histories_live_suffix,version)

    // Sales Prepaid Service
    case SERVICE_TYPES.SALES_CLIENT_PREPAID_SERVICE_READ:
      return api_url_generator.getUrlReadSales(client_prepaid_service_suffix,version)
    case SERVICE_TYPES.SALES_CLIENT_PREPAID_SERVICE_CMD:
      return api_url_generator.getUrlCmdSales(client_prepaid_service_suffix,version)
    case SERVICE_TYPES.SALES_CLIENT_PREPAID_SERVICE_HISTORY_READ:
      return api_url_generator.getUrlReadSales(client_prepaid_service_histories_live_suffix,version)

    case SERVICE_TYPES.SALES_BALANCE_MOVE_CMD:
      return api_url_generator.getUrlCmdSales(sales_balance_move_suffix,version)

    case SERVICE_TYPES.SALES_OUTSTANDING_PAYMENT_CMD:
      return api_url_generator.getUrlCmdSales(sales_outstanding_payment_suffix,version)

    case SERVICE_TYPES.SALES_OUTSTANDING_HISTORY_READ:
      return api_url_generator.getUrlReadSales(sales_outstanding_histories_suffix,version)

    // Sales Client Account
    case SERVICE_TYPES.SALES_CLIENT_ACCOUNT_READ:
      return api_url_generator.getUrlReadSales(sales_client_account_suffix,version)
    case SERVICE_TYPES.SALES_CLIENT_HISTORY_READ:
      return api_url_generator.getUrlReadSales(client_history_suffix,version)
    case SERVICE_TYPES.SALES_CLIENT_FAMILY_READ:
      return api_url_generator.getUrlReadSales(family_suffix,version)
    case SERVICE_TYPES.SALES_CLIENT_FAMILY_CMD:
      return api_url_generator.getUrlCmdSales(family_suffix,version)
    case SERVICE_TYPES.SALES_CLIENT_CMD:
      return api_url_generator.getUrlCmdSales(sales_client_suffix,version)

    // Refund
    case SERVICE_TYPES.REFUND_READ:
      return api_url_generator.getUrlReadRefund(refund_suffix,version)
    case SERVICE_TYPES.REFUND_CMD:
      return api_url_generator.getUrlCmdRefund(refund_suffix,version)
    
    // Report
    case SERVICE_TYPES.REPORT_SALES_CLIENT_REPORT_READ:
      return api_url_generator.getUrlReadSalesClientReport(report_sales_client_suffix,version)
    case SERVICE_TYPES.REPORT_BALANCE_AND_LOYALTY_POINTS_READ:
      return api_url_generator.getUrlReadBalancePoints(report_balance_and_loyalty_points_suffix,version)

    // Staff
    case SERVICE_TYPES.STAFF_STAFF_GOAL_READ:
      return api_url_generator.getUrlReadSales(staff_suffix,version)
    case SERVICE_TYPES.STAFF_STAFF_GOAL_CMD:
      return api_url_generator.getUrlCmdSales(staff_suffix,version)
    case SERVICE_TYPES.STAFF_PAYROLL_READ:
      return api_url_generator.getUrlReadSales(staff_suffix, version)
    case SERVICE_TYPES.STAFF_PAYROLL_CMD:
      return api_url_generator.getUrlCmdSales(staff_suffix, version)

    // INVENTORY
    // Supplier
    case SERVICE_TYPES.SUPPLIER_READ:
      return api_url_generator.getUrlReadInventory(supplier_suffix,version)
    case SERVICE_TYPES.SUPPLIER_CMD:
      return api_url_generator.getUrlCmdInventory(supplier_suffix,version)

    // Receiving
    case SERVICE_TYPES.RECEIVING_READ:
      return api_url_generator.getUrlReadInventory(receiving_suffix,version)
    case SERVICE_TYPES.RECEIVING_CMD:
      return api_url_generator.getUrlCmdInventory(receiving_suffix,version)

    // Stock Internal Use
    case SERVICE_TYPES.STOCK_INTERNAL_USE_READ:
      return api_url_generator.getUrlReadInventory(stock_internal_use_suffix,version)
    case SERVICE_TYPES.STOCK_INTERNAL_USE_CMD:
      return api_url_generator.getUrlCmdInventory(stock_internal_use_suffix,version)

    // Stock History
    case SERVICE_TYPES.STOCK_HISTORY_READ:
      return api_url_generator.getUrlReadInventory(stock_history_suffix,version)

    // Stock Status
    case SERVICE_TYPES.STOCK_STATUS_READ:
      return api_url_generator.getUrlReadInventory(stock_status_suffix,version)
    case SERVICE_TYPES.STOCK_STATUS_CMD:
      return api_url_generator.getUrlCmdInventory(stock_status_suffix,version)

    // Expenditure
    case SERVICE_TYPES.EXPENDITURE_READ:
      return api_url_generator.getUrlReadInventory(expenditure_suffix,version)
    case SERVICE_TYPES.EXPENDITURE_CMD:
      return api_url_generator.getUrlCmdInventory(expenditure_suffix,version)
      
    /// ACCOUNT
    // Shop Information
    case SERVICE_TYPES.ADMINS.SHOP_READ:
      return api_url_generator.getUrlReadAdmin(account_shop_info_suffix, version)
    case SERVICE_TYPES.ADMINS.SHOP_CMD:
      return api_url_generator.getUrlCmdAdmin(account_shop_info_suffix, version)

    // Shop Information
    case SERVICE_TYPES.ADMINS.TAX_INVOICE_INFO_READ:
      return api_url_generator.getUrlReadAdmin(account_tax_invoice_info_suffix, version)
    case SERVICE_TYPES.ADMINS.TAX_INVOICE_INFO_CMD:
      return api_url_generator.getUrlCmdAdmin(account_tax_invoice_info_suffix, version)

    // Menu
    case SERVICE_TYPES.ADMINS.MENU_READ: 
      return api_url_generator.getUrlReadAdmin(menu_suffix, version)

    case SERVICE_TYPES.ADMINS.SHOP_ENVIRONMENT_CMD: 
      return api_url_generator.getUrlCmdAdmins(shop_environment_suffix, version)
    /// Identities
    // User Account
    case SERVICE_TYPES.IDENTITIES.USER_ACCOUNT_READ:
      return api_url_generator.getUrlReadIdentitiesSetup(user_account_suffix, version)
    case SERVICE_TYPES.IDENTITIES.USER_ACCOUNT_CMD:
      return api_url_generator.getUrlCmdIdentitiesSetup(user_account_suffix, version)

    // User Role
    case SERVICE_TYPES.IDENTITIES.USER_ROLE_READ:
      return api_url_generator.getUrlReadIdentitiesSetup(user_role_suffix, version)

    // Login History
    case SERVICE_TYPES.IDENTITIES.USER_LOGIN_HISTORY_READ:
      return api_url_generator.getUrlReadIdentitiesSetup(user_login_history_suffix, version)

    case SERVICE_TYPES.USER_ACCOUNT_AGGR:
      return api_url_generator.getUrlAggregator(user_account_suffix, version)

    case SERVICE_TYPES.AUTH_AGGR:
      return api_url_generator.getUrlAggregator(auth_suffix, version)

    //Admin Sales
    // BankTransferNotice
    case SERVICE_TYPES.ADMIN_SALES.BANK_TRANSFER_NOTICE_READ:
      return api_url_generator.getUrlReadAdminSales(bank_transfer_notice_suffix, version)
    case SERVICE_TYPES.ADMIN_SALES.BANK_TRANSFER_NOTICE_CMD:
      return api_url_generator.getUrlCmdAdminSales(bank_transfer_notice_suffix, version)

    //DropDownList
    case SERVICE_TYPES.ADMIN_SALES.MISC_CODE_READ:
      return api_url_generator.getUrlReadAdminSales(misc_code_bank_account_suffix, version)

    // ShopUsage
    case SERVICE_TYPES.ADMIN_SALES.SHOP_USAGE_READ:
      return api_url_generator.getUrlReadAdminSales(shop_usage_suffix, version)

    // NetMoneyHistory
    case SERVICE_TYPES.ADMIN_SALES.NETMONEY_HISTORY_READ:
      return api_url_generator.getUrlReadAdminSales(netmoney_history_suffix, version)

    // AdminSales
    case SERVICE_TYPES.ADMIN_SALES.ADMIN_SALES_READ:
      return api_url_generator.getUrlReadAdminSales(admin_sales_suffix, version)

    case SERVICE_TYPES.ADMIN_SALES.ADMIN_SALES_CMD:
      return api_url_generator.getUrlCmdAdminSales(admin_sales_suffix, version)
      
    // BaseFee
    case SERVICE_TYPES.ADMIN_SALES.BASE_FEE_READ:
      return api_url_generator.getUrlReadAdminSales(base_fee_suffix, version)

    /// Boards
    // Notice
    case SERVICE_TYPES.BOARDS.NOTICE_READ: 
      return api_url_generator.getUrlReadBoards(notice_suffix, version)
    case SERVICE_TYPES.BOARDS.NOTICE_CMD:
      return api_url_generator.getUrlCmdBoards(notice_suffix, version)

    // Board
    case SERVICE_TYPES.BOARDS.BOARD_READ: 
      return api_url_generator.getUrlReadBoards(board_suffix, version)
    case SERVICE_TYPES.BOARDS.BOARD_CMD:
      return api_url_generator.getUrlCmdBoards(board_suffix, version)

    // BoardManagement
    case SERVICE_TYPES.BOARDS.BOARD_MANAGEMENT_READ: 
      return api_url_generator.getUrlReadBoards(board_management_suffix, version)

    //homepage
    case SERVICE_TYPES.BOARDS.BOARD_HOMEPAGE_READ: 
      return api_url_generator.getUrlReadBoards(homepage_suffix, version)

    // ManualManagement
    case SERVICE_TYPES.BOARDS.MANUAL_MANAGEMENT_READ: 
      return api_url_generator.getUrlReadBoards(manual_management_suffix, version)

    // POPUp
    case SERVICE_TYPES.BOARDS.POPUP_READ: 
      return api_url_generator.getUrlReadBoards(popup_suffix, version)

    // FileAttachment
    case SERVICE_TYPES.BOARDS.FILE_ATTACHMENT_READ: 
      return api_url_generator.getUrlReadBoards(file_attachment_suffix, version)

    /// Messages
    // TextMessage
    case SERVICE_TYPES.MESSAGES.TEXT_MESSAGE_READ: 
      return api_url_generator.getUrlReadMessages(text_message_suffix, version)

    // TextFees
    case SERVICE_TYPES.MESSAGES.TEXT_FEE_READ: 
      return api_url_generator.getUrlReadMessages(text_fee_suffix, version)

    // TextSamples
    case SERVICE_TYPES.MESSAGES.TEXT_SAMPLE_READ: 
      return api_url_generator.getUrlReadMessages(text_sample_suffix, version)

    // TextMyMessages
    case SERVICE_TYPES.MESSAGES.TEXT_MY_MESSAGE_CMD:
      return api_url_generator.getUrlCmdMessages(text_my_message_suffix, version)
    case SERVICE_TYPES.MESSAGES.TEXT_MY_MESSAGE_READ: 
      return api_url_generator.getUrlReadMessages(text_my_message_suffix, version)

    // TextSenderPhones
    case SERVICE_TYPES.MESSAGES.TEXT_SENDER_PHONE_CMD:
      return api_url_generator.getUrlCmdMessages(text_sender_phone_suffix, version)
    case SERVICE_TYPES.MESSAGES.TEXT_SENDER_PHONE_READ: 
      return api_url_generator.getUrlReadMessages(text_sender_phone_suffix, version)

    /// MessageAutos
    // MeesageSetupLogin
    case SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_LOGIN_CMD:
      return api_url_generator.getUrlCmdMessageAutos(message_setup_login_suffix, version)

    // MeesageSetupClient
    case SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_CLIENT_CMD:
      return api_url_generator.getUrlCmdMessageAutos(message_setup_client_suffix, version)

    // MeesageSetupSales
    case SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_SALES_CMD:
      return api_url_generator.getUrlCmdMessageAutos(message_setup_sales_suffix, version)
    
    // MeesageSetupBooking
    case SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_BOOKING_CMD:
      return api_url_generator.getUrlCmdMessageAutos(message_setup_booking_suffix, version)

    // MeesageSetupPostVisit
    case SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_POST_VISIT_CMD:
      return api_url_generator.getUrlCmdMessageAutos(message_setup_post_visit_suffix, version)

    case SERVICE_TYPES.ADMINS.CID_ACCOUNT_READ: 
      return api_url_generator.getUrlReadAdmin(cid_account_suffix, version)
      
    case SERVICE_TYPES.ADMINS.CID_ACCOUNT_CMD: 
      return api_url_generator.getUrlCmdAdmin(cid_account_suffix, version)

    case SERVICE_TYPES.CLIENTS.CID_RECEIVING_HISTORY_READ: 
      return api_url_generator.getUrlReadClients(cid_receiving_history_suffix, version)

    case SERVICE_TYPES.CLIENTS.CID_RECEIVING_HISTORY_CMD: 
      return api_url_generator.getUrlCmdClients(cid_receiving_history_suffix, version)

    // Campaign
    case SERVICE_TYPES.CAMPAIGN_READ:
      return api_url_generator.getUrlReadCampaigns(campaign_suffix, version)
    case SERVICE_TYPES.CAMPAIGN_CMD:
      return api_url_generator.getUrlCmdCampaigns(campaign_suffix, version)
  }
}
export { getServiceUrl }
