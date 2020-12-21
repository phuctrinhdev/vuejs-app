export const USER_ROLES = {
  CHAIN_HEAD: 'chain-head',
  // CHAIN_HEAD: 'MASTER',
  CHAIN_SHOP: 'chain-shop',
  SINGLE_SHOP: 'single-shop',
  ADMIN_MASTER: 'ADMMASTER',
  MASTER: 'MASTER',
  STAFF: 'STAFF',
  MANAGER: 'MANAGER'
}

export const PERMISSION = {
  GOODS: 'goods'
}

export const SERVICE_TYPES = {
  CLIENT_AGGR: 5000,
  STAFF_AGGR: 5001,
  USER_ACCOUNT_AGGR: 5500,
  GOODS_AGGR : 5501,
  AUTH_AGGR: 5502,
  MESSAGE_AGGR: 5503,

  // Goods
  PRODUCT_READ: 1,
  PRODUCT_CMD: 2,
  PRODUCT_CATEGORY_READ: 3,
  PRODUCT_CATEGORY_CMD: 4,
  PREPAID_CARD_READ: 5,
  PREPAID_CARD_CMD: 6,
  SERVICE_READ: 7,
  SERVICE_CMD: 8,
  PACKAGE_READ: 9,
  PACKAGE_CMD: 10,
  SERVICE_CATEGORY_READ:12,
  SERVICE_CATEGORY_CMD:13 ,
  PREPAID_SERVICE_READ:14,
  PREPAID_SERVICE_CMD:15 ,
  PACKAGE_ITEM_READ: 16 ,
  PACKAGE_ITEM_CMD: 17 ,

  //Clients
  CLIENTS : {
    CLIENT_CODESETUP_READ : 3001,
    CLIENT_CODESETUP_CMD  : 3002,
    CLIENT_READ: 3003,
    CLIENT_CMD: 3004,
    CLIENT_FIELD_SETUP_READ: 3005,
    CLIENT_FIELD_SETUP_CMD: 3006,
    CLIENT_ENVIRONMENT_SETUP_READ: 3007,
    CLIENT_ENVIRONMENT_SETUP_CMD: 3008,
    RECOMMENDATION_POINT_SETUP_READ: 3009,
    RECOMMENDATION_POINT_SETUP_CMD: 3010,
    FAMILY_READ: 3011,
    FAMILY_CMD: 3012,
    CID_RECEIVING_HISTORY_READ: 3013,
    CID_RECEIVING_HISTORY_CMD: 3014,
  },

  // Bookings
  BOOKINGS_OPENING_HOURS_SETUP_READ: 21,
  BOOKINGS_OPENING_HOURS_SETUP_CMD: 22,

  BOOKINGS_RESOURCES_SETUP_READ: 23,
  BOOKINGS_RESOURCES_SETUP_CMD: 24,

  BOOKINGS_CALENDAR_SETUP_READ: 25,
  BOOKINGS_CALENDAR_SETUP_CMD: 26,

  BOOKINGS_ITEMS_SETUP_READ: 27,
  BOOKINGS_ITEMS_SETUP_CMD: 28,
  BOOKINGS_ITEM_SETUP_CMD: 29,

  BOOKINGS_ONLINE_BOOKING_SETUP_READ: 30,
  BOOKINGS_ONLINE_BOOKING_SETUP_CMD: 31,

  BOOKING_READ: 32,
  BOOKING_CMD: 33,

  BLOCKED_TIME_READ: 34,
  BLOCKED_TIME_CMD: 35,

  //waiting
  WAITING_READ: 36,
  WAITING_CMD: 37,
  BKG_TASKS_BOOKING_READ: 38,

  // Goods
  SERVICE_CMD_AGG: 39,

  // Booking Report
  BOOKING_REPORT_READ: 40,

  // Staffs
  STAFF_READ: 2001,
  STAFF_CMD : 2002,
  STAFF_STAFF_GOAL_READ: 2003,
  STAFF_STAFF_GOAL_CMD : 2004,
  STAFF_PAYROLL_READ: 2005,
  STAFF_PAYROLL_CMD : 2006,

  // Sales Setup
  SALES_SETUP_READ: 4001,
  SALES_SETUP_CMD: 4002,
  SALES_AGGR: 4003,
  SALES_READ: 4004,
  SALES_CMD : 4005,

  // Sales
  SALES_CLIENT_PREPAID_CARD_READ            : 4006,
  SALES_CLIENT_PREPAID_CARD_CMD             : 4007,
  SALES_CLIENT_PREPAID_CARD_HISTORY_READ    : 4008,
  SALES_BALANCE_MOVE_CMD                    : 4009,
  SALES_CLIENT_PREPAID_SERVICE_READ         : 4010,
  SALES_CLIENT_PREPAID_SERVICE_CMD          : 4011,
  SALES_CLIENT_PREPAID_SERVICE_HISTORY_READ : 4012,
  SALES_OUTSTANDING_PAYMENT_CMD             : 4013,
  SALES_OUTSTANDING_PAYMENT_READ            : 4014,
  SALES_OUTSTANDING_HISTORY_READ            : 4015,
  SALES_CLIENT_ACCOUNT_READ                 : 4016,
  SALES_CLIENT_HISTORY_READ                 : 4017,
  SALES_CLIENT_FAMILY_READ                  : 4018,
  SALES_CLIENT_FAMILY_CMD                   : 4019,
  SALES_CLIENT_CMD                          : 4020,
  SALES_CLIENT_SEARCH_WITH_FAMILY_INFO      : 4021,
  RECOMMENDATION_POINT_SETUP_CMD            : 4022,
  RECOMMENDATION_POINT_SETUP_READ           : 4023,

  // Report
  REPORT_SALES_CLIENT_REPORT_READ        : 4024,
  REPORT_BALANCE_AND_LOYALTY_POINTS_READ : 4025,

  // Refund
  REFUND_READ: 4030,
  REFUND_CMD : 4031,

  // Inventory
  SUPPLIER_READ  : 4040,
  SUPPLIER_CMD   : 4041,
  RECEIVING_READ : 4042,
  RECEIVING_CMD  : 4043,
  STOCK_INTERNAL_USE_READ : 4044,
  STOCK_INTERNAL_USE_CMD  : 4045,
  STOCK_HISTORY_READ      : 4046,
  STOCK_STATUS_CMD        : 4047,
  STOCK_STATUS_READ       : 4048,

  // Expenditure
  EXPENDITURE_READ  : 4101,
  EXPENDITURE_CMD   : 4102,

  // // Account
  // ACCOUNT : {
  //   SHOP_INFO_READ : 5001,
  //   SHOP_INFO_CMD  : 5002,
  //   //SHOP_INFO_AGGR : 5003,
  //   USER_ACCOUNT_READ : 5101,
  //   USER_ACCOUNT_CMD : 5102,
  // },

  // Identities
  IDENTITIES: {
    //USER_ROLE_READ: 1001,
    //USER_ROLE_CMD: 1002,
    USER_ACCOUNT_READ       : 1003,
    USER_ACCOUNT_CMD        : 1004,
    USER_ROLE_READ          : 1005,
    USER_LOGIN_HISTORY_READ : 1007
    //SHOP_USER_ROLE_READ: 1005,
    //SHOP_USER_ROLE_CMD: 1006,
    //DROPDOWN_LIST: 1900,
  },

  // Admins
  ADMINS: {
    SHOP_READ : 1101,
    SHOP_CMD  : 1102,
    TAX_INVOICE_INFO_READ: 1103,
    TAX_INVOICE_INFO_CMD: 1104,
    MENU_READ: 1105, 
    SHOP_ENVIRONMENT_CMD: 1108,

    CID_ACCOUNT_READ: 1109,
    CID_ACCOUNT_CMD: 1110,

  },
  // AdminSales
  ADMIN_SALES: {
    BANK_TRANSFER_NOTICE_CMD: 1201,
    BANK_TRANSFER_NOTICE_READ: 1202,
    SHOP_USAGE_READ: 1204,
    MISC_CODE_READ: 1206,
    NETMONEY_HISTORY_READ: 1207,
    BASE_FEE_READ: 1208,
    ADMIN_SALES_READ: 1209,
    ADMIN_SALES_CMD: 1210
  },
  // Boards
  BOARDS: {
    NOTICE_READ: 1301,
    NOTICE_CMD : 1302,
    BOARD_READ : 1303,
    BOARD_CMD  : 1304,
    BOARD_MANAGEMENT_READ : 1305,
    MANUAL_MANAGEMENT_READ: 1306,
    POPUP_READ: 1307,
    FILE_ATTACHMENT_READ: 1308,
    BOARD_HOMEPAGE_READ: 1309
  },
  // Messages
  MESSAGES: {
    TEXT_MESSAGE_READ    : 1401,
    TEXT_FEE_READ        : 1402,
    TEXT_SAMPLE_READ     : 1403,
    TEXT_MY_MESSAGE_CMD  : 1404,
    TEXT_MY_MESSAGE_READ : 1405,
    TEXT_SENDER_PHONE_CMD  : 1406,
    TEXT_SENDER_PHONE_READ : 1407,
  },
  MESSAGE_AUTOS: {
    MESSAGE_SETUP_LOGIN_CMD   : 1501,
    MESSAGE_SETUP_CLIENT_CMD  : 1502,
    MESSAGE_SETUP_SALES_CMD   : 1503,
    MESSAGE_SETUP_BOOKING_CMD : 1504,
    MESSAGE_SETUP_POST_VISIT_CMD : 1505,
  },
  // Campaigns
  CAMPAIGN_CMD: 6001,
  CAMPAIGN_READ: 6000,
}

export const SERVICE_EXTEND_TYPES = {
  // Common
  LIVE            : '/Live',
  LIST            : '/List',
  CHANGE_ORDER_NO : '/ChangeOrderNo',
  SHOP_LIST       : '/ShopList',
  CREATE          : '/Create',
  READ            : '/Read',
  EXPIRY_DATE     : '/ExpiryDate',
  SEARCH_LIST     : '/SearchList',

  // Aggr
  SALON    : '/Salon',
  GET_LIST : '/GetList',
  LOGIN_SUBSCRIBER: '/Login/Subscriber',
  
  // Goods
  UPDATE_STATUS   : '/UpdateStatus',
  SHARE_TO_SHOP   : '/ShareToShop',
  UNSHARE_TO_SHOP : '/UnshareToshop',
  NAME            : '/Name',

  // Bookings
  OPENING_HOURS             : '/OpeningHours',
  OPENING_HOUR              : '/OpeningHour',
  REPEAT_OFF_DAY            : '/RepeatOffDay',
  SPECIFIC_OFF_DAY          : '/SpecificOffDay',
  CALENDAR                  : '/Calendar',
  All_CALENDAR_SETUPS       : '/AllCalendarSetups/Live',
  MOVE_BOOKING              : '/MoveBooking',
  CHANGE_WAITING_TO_BOOKING : '/ChangingWaitingToBooking',
  GET_BOOKABLE_WAITING      : '/GetBookableWaitings',
  CANCEL_BOOKING            : '/CancelRepeatBooking',
  UPDATE_BOOKING_CLIENT     : '/ConnectClient',
  UPDATE_BOOKING_STATUS     : '/UpdateStatus',
  UPDATE_BOOKING_CONFIRMED  : '/UpdateConfirmed',
  GET_TOKEN                 : '/GetToken',
  UPCOMING_REPEATED_BOOKINGS: '/UpcomingRepeatedBookings',
  BOOKINGS_SUMMARY_BY_CLIENT: '/BookingsSummaryByClient',

  // Sales
  ALL_SALES_SETUP_LIVE               : '/AllSalesSetups/Live',
  PAYMENT_METHOD                     : '/PaymentMethod',
  PAYMENT_METHOD_LIVE                : '/PaymentMethod/Live',
  SALES_TYPE                         : '/SalesType',
  SALES_TYPE_LIVE                    : '/SalesType/Live',
  DISCOUNT_CATEGORY                  : '/DiscountCategory',
  DISCOUNT_CATEGORY_LIVE             : '/DiscountCategory/Live',
  LOYALTY_POINTS                     : '/LoyaltyPoints',
  LOYALTY_POINTS_LIVE                : '/LoyaltyPoints/Live',
  RECOMMENDATION_POINT_SETUP         : '/RecommendationPointSetup',
  RECOMMENDATION_POINT_SETUP_LIVE    : '/RecommendationPointSetup/Live',
  SALES_GENERAL_SETUP                : '/SalesGeneralSetup',
  GENERAL                            : '/General',
  DATA_PROTECTION_AND_SECURITY_SETUP : '/DataProtectionAndSecuritySetup',
  DATA_PROTECTION_AND_SECURITY       : '/DataProtectionAndSecurity',
  GET_ENVIRONMENT_SETUP_LIVE         : '/GetEnvironmentSetup/Live',
  SALES_HISTORIES                    : '/SalesHistories',
  SALES_HISTORIES_LIVE               : '/SalesHistories/Live',
  SALES_HISTORIES_BY_CREATE_USER     : '/SalesHistoriesByCreatedUser',
  SALES_HISTORIES_BY_CLIENT          : '/SalesHistoriesByClient/Live',
  SALES_HISTORIES_BY_STAFF_ID        : '/SalesHistoriesByStaffId',
  SALES_NOTES                        : '/UpdateNotes',
  SALES_ADD_BY_CHECKOUT_BOOKING      : '/AddSalesByCheckoutBooking',
  SALES_CLIENT_CHANGE_POINT          : '/ChangePoint',
  SALES_CLIENT_SEARCH_WITH_FAMILY    : '/SearchWithFamilyInfo',
  CLIENT_PREPAID_CARDS_LIVE          : '/ClientPrepaidCards/Live',
  CLIENT_PREPAID_SERVICES_LIVE       : '/ClientPrepaidServices/Live',
  BALANCE_POINT_EDIT_HISTORIES_LIVE  : '/BalancePointEditHistories/Live',
  CLIENT_ACCOUNT_LIVE                : '/ClientAccounts/Live',
  CLIENT_OUTSTANDINGS_LIVE           : '/ClientReceivables/Live',
  SALES_LIVE                         : '/Sales/Live',
  SALES_BY_ID_LIVE                   : '/SalesById/Live',
  SALES_BY_BOOKING_ID_LIVE           : '/SalesByBookingId/Live',

  // Report Sales
  SALES_TOTAL_REPORT__DATE                : '/SalesTotalByDateReport',
  SALES_TOTAL_REPORT__MONTH               : '/SalesTotalByMonthReport',
  SALES_TOTAL_REPORT__DATE_RANGE          : '/SalesTotalByDateRangeReport',

  SALES_TOTAL_BY_STAFF__DATE              : '/SalesTotalByStaffByDateReport',
  SALES_TOTAL_BY_STAFF__MONTH             : '/SalesTotalByStaffByMonthReport',
  SALES_TOTAL_BY_STAFF__DATE_RANGE        : '/SalesTotalByStaffByDateRangeReport',

  SALES_TOTAL_BY_ITEM__SERVICE__DATE               : '/SalesTotalByItemServiceByDateReport',
  SALES_TOTAL_BY_ITEM__SERVICE__MONTH              : '/SalesTotalByItemServiceByMonthReport',
  SALES_TOTAL_BY_ITEM__SERVICE__DATE_RANGE         : '/SalesTotalByItemServiceByDateRangeReport',
  SALES_TOTAL_BY_ITEM__PRODUCT__DATE               : '/SalesTotalByItemProductByDateReport',
  SALES_TOTAL_BY_ITEM__PRODUCT__MONTH              : '/SalesTotalByItemProductByMonthReport',
  SALES_TOTAL_BY_ITEM__PRODUCT__DATE_RANGE         : '/SalesTotalByItemProductByDateRangeReport',
  SALES_TOTAL_BY_ITEM__PREPAID_CARD__DATE          : '/SalesTotalByItemPrepaidCardByDateReport',
  SALES_TOTAL_BY_ITEM__PREPAID_CARD__MONTH         : '/SalesTotalByItemPrepaidCardByMonthReport',
  SALES_TOTAL_BY_ITEM__PREPAID_CARD__DATE_RANGE    : '/SalesTotalByItemPrepaidCardByDateRangeReport',
  SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__DATE       : '/SalesTotalByItemPrepaidServiceByDateReport',
  SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__MONTH      : '/SalesTotalByItemPrepaidServiceByMonthReport',
  SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__DATE_RANGE : '/SalesTotalByItemPrepaidServiceByDateRangeReport',

  SERVICE_SALES__DATE                     : '/ServiceSalesByDateFilterReport',
  SERVICE_SALES__DATE_RANGE               : '/ServiceSalesByDateRangeFilterReport',
  SERVICE_SALES__MONTH_RANGE              : '/ServiceSalesByMonthRangeFilterReport',
  SERVICE_SALES_BY_ITEM__DATE             : '/ServiceSalesByItemByDateFilterReport',
  SERVICE_SALES_BY_ITEM__DATE_RANGE       : '/ServiceSalesByItemByDateRangeFilterReport',
  SERVICE_SALES_BY_ITEM__MONTH            : '/ServiceSalesByItemByMonthFilterReport',
  SERVICE_SALES_BY_MONTHS                 : '/ServiceSalesByMonthsReport',
  SERVICE_SALES_BY_SALES_TYPES__DATE      : '/ServiceSalesBySalesTypesByDateReport',
  SERVICE_SALES_BY_SALES_TYPES__DATE_RANGE: '/ServiceSalesBySalesTypesByDateRangeReport',
  SERVICE_SALES_BY_SALES_TYPES__MONTH     : '/ServiceSalesBySalesTypesByMonthReport',

  PRODUCT_SALES_BY_MONTHS                 : '/ProductSalesByMonthsReport',
  PRODUCT_SALES_BY_ITEM__DATE             : '/ProductSalesByItemByDateFilterReport',
  PRODUCT_SALES_BY_ITEM__DATE_RANGE       : '/ProductSalesByItemByDateRangeFilterReport',
  PRODUCT_SALES_BY_ITEM__MONTH_RANGE      : '/ProductSalesByItemByMonthRangeFilterReport',

  SALES_BY_DISCOUNT_CATEGORY__DATE        : '/SalesByDiscountCategoryByDateReport',
  SALES_BY_DISCOUNT_CATEGORY__DATE_RANGE  : '/SalesByDiscountCategoryByDateRangeReport',
  SALES_BY_DISCOUNT_CATEGORY__MONTH       : '/SalesByDiscountCategoryByMonthReport',

  SALES_BY_REPEAT_CLIENTS__DATE           : '/SalesByRepeatClientsByDate',
  SALES_BY_REPEAT_CLIENTS__DATE_RANGE     : '/SalesByRepeatClientsByDateRange',
  SALES_BY_REPEAT_CLIENTS__MONTH          : '/SalesByRepeatClientsByMonth',

  INCOME_STATEMENT__DATE                  : '/IncomeStatementByDateFilterReport',
  INCOME_STATEMENT__DATE_RANGE            : '/IncomeStatementByDateRangeFilterReport',
  INCOME_STATEMENT__MONTH                 : '/IncomeStatementByMonthFilterReport',

  BOOKING_DEPOSIT_SUMMARY__DATE           : '/BookingDepositSummaryByDate',
  BOOKING_DEPOSIT_SUMMARY__DATE_RANGE     : '/BookingDepositSummaryByDateRange',
  BOOKING_DEPOSIT_SUMMARY__MONTH          : '/BookingDepositSummaryByMonth',

  // Report Client
  CLIENTS_SUMMARY__DATE                     : '/ClientSummaryByDate',
  CLIENTS_SUMMARY__DATE_RANGE               : '/ClientSummaryByDateRange',
  CLIENTS_SUMMARY__MONTH                    : '/ClientSummaryByMonth',
  NEW_CLIENT_REPORT                         : '/NewClientRepeat',
  NEW_CLIENT_BY_REFERRAL_SOURCE__DATE_RANGE : '/ClientReferralSourceByDateRangeFilterReport',
  NEW_CLIENT_BY_REFERRAL_SOURCE__MONTH_RANGE: '/ClientReferralSourceByMonthRangeFilterReport',
  NEW_CLIENT_BY_MONTHS_REPORT               : '/NewClientByMonthsReport',

  // Report Booking
  BOOKING_BY_DATE                                   : '/BookingsByDate',
  BOOKING_BY_MONTH                                  : '/BookingsByMonth',
  DETAILED_ANALYSIS_OF_BOOKING__MONTH__RESOURCE     : '/ResourcesDetailedAnalysisByMonth',
  DETAILED_ANALYSIS_OF_BOOKING__MONTH__DAY          : '/DayOfWeekDetailedAnalysisByMonth',
  DETAILED_ANALYSIS_OF_BOOKING__MONTH__HOUR         : '/HourOfDayDetailedAnalysisByMonth',
  DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__RESOURCE: '/ResourcesDetailedAnalysisByDate',
  DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__DAY     : '/DayOfWeekDetailedAnalysisByDate',
  DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__HOUR    : '/HourOfDayDetailedAnalysisByDate',

  // Report Balance & Point
  SALES_BY_DATE_REPORT                : '/SalesByDateReport',
  SALES_BY_MONTH_REPORT               : '/SalesByMonthReport',
  PREPAID_CARDS_REPORT                : '/PrepaidCards',
  PREPAID_CARD_SUMMARY_REPORT         : '/PrepaidCardSummary',
  PREPAID_SERVICES_REPORT             : '/PrepaidServices',
  LOYALTY_POINTS_REPORT               : '/LoyaltyPoints',

  // ADMINS - shop
  CONTACT                             : '/Contact',
  BASIC                               : '/Basic',
  MONTHLY_FEE                         : '/MonthlyFee',
  SHOP_ENVIRONMENT                    : '/ShopEnvironmentSetup',

  SHOP_NAME_LIST                      :'/ShopNameList',
  NETMONEY_ALARM                      : '/NetmoneyAlarm',
  VAT_RATE                            : '/VATRate',
  // Identities
  CHANGE_PASSWORD: '/Password',

  // Admin sales
  MISC_CODE                          : '/MiscCode',
  LIST_BY_SHOP                       : '/ListByShop',
  ONLINE_PAYMENT_PREPARED  : '/OnlinePayment/Prepared',
  ONLINE_PAYMENT           : '/OnlinePayment',
  VALID_VIRTUAL_ACCOUNT    : '/ValidVirtualAccountByShopId',

  // Boards
  READ_COUNT: '/ReadCount',
  
  USER_ROLE: '/UserRole',

  // Messages
  MASTER : '/Master',
  DETAIL : '/Detail',
  LIST_BY_RECEIVER : '/ListByReceiver',
  VIEW_IMAGE  : '/ViewImage',
  DELETE_LIST : '/DeleteList',
  BY_SHOP     : '/ByShop',
  TEXT_SAMPLE : '/Sample',
  TEXT_SAMPLE_BUSINESS_TYPE : '/SampleBusinessType',
  TEXT_SAMPLE_GROUP         : '/SampleGroup',
  LIST_BY_MASTER : '/ListByMaster',
  AS_AUTO_SENDER            : '/AsAutoSender',
  AUTO                      : '/Auto',

  //CID
  SUBSCRIBER_NAME: '/SubscriberName',

  // Campaigns
  CAMPAIGN_REPORT: '/CampaignReport',
  CAMPAIGN_REPORT_CREATE: '/CampaignReportCreate',
  CAMPAIGN_REPORT_DELETE: '/CampaignReportDelete',
}

export const PAGINATION = {
  HOME: 3,
  ZERO: 0,
  SMALL: 5,
  DEFAULT: 10,
  BIG: 50,
  MAX: 100,
  NOTIFICATION: 10
}

export const FORM_ACTIONS = {
  ADD: 1,
  EDIT: 2,
  DELETE: 3,
  VIEW: 4,
  CREATE: 5,
  PART: 6,
  RE_ADD: 7
}

export const COOKIE_ACTION = {
  GET: 1,
  SET: 2,
  REMOVE: 3,
  EXIST: 4
}

export const GOODS_TYPE = {
  PRODUCT: 1,
  SERVICE: 2,
  PREPAID_SERVICE: 3,
  PREPAID_CARD: 4
}

export const GOODS_STATUS = {
  LIST_DEFAULT: 1,
  ALL: 0,
  ACTIVE: 1,
  INACTIVE: 2
}

export const USAGE_STATUS = {
  ALL: '',
  SALES: 1,
  INTERNAL_USE: 2,
  SALES_AND_INTERNAL_USE: 3,
  SALES_ALL: '1,3',
  INTERNAL_USE_ALL: '2,3'
}

export const VALIDITY_TYPE = {
  MONTHS: 1,
  DAYS: 2
}

export const SALARY_TYPE = {
  PERCENT: 1,
  AMOUNT: 2
}

export const ENUM_NO_LIMIT = -1

export const GOODS_TABLE_DRAG = {
  ALL: true,
  UNSHARED: 'unshared',
  OFF: false, 
  SHARED: 'shared'
}

export const REPEAT_TYPE = {
  NONE: 1,
  EVERY_WEEK: 2,
  BIWEEKLY: 3,
  MONTHLY: 4
}

export const REPEATED_WEEKS = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4
}

export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
}

export const STANDARD_DATE_FORMAT = {
  DMY: 'DD-MM-YYYY',
  DMYH: 'DD-MM-YYYY HH:mm',
  YMD: 'YYYY-MM-DD',
  YMDH: 'YYYY-MM-DD HH:mm',
  MDY: 'MM-DD-YYYY',
  UTC: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  HM: 'HH:mm'
}

export const STANDARD_DAY_FORMAT = {
  SHORT: 'ddd',
  LONG: 'dddd'
}

export const STANDARD_HOUR_FORMAT = {
  H12: 'hh:mm A',
  H24: 'HH:mm',
  H24_SECONDS: 'HH:mm:ss'
}

export const BOOKING_APPROVAL_TYPE = {
  MANUAL: 1,
  AUTO: 2
}

export const TIME_ZONE = {
  VN: 'Asia/Ho_Chi_Minh',
  KR: 'Asia/Seoul'
}

export const RESOURCE_TYPE = {
  STAFF: 1,
  NO_STAFF: 2
}

export const BOOKING_CLIENT_TYPE = {
  BOOKED_CLIENT: 1,
  WALKING_CLIENT: 2
}

export const BOOKING_SOURCE = {
  ALL: null,
  STAFF: 1,
  ONLINE: 2,
  NAVER: 3,
  KAKAO: 4
}

export const BOOKING_STATUS = {
  ALL: null,
  ALL_NO_CANCELD: 0,
  REQUESTED: 1,
  COMPLETED: 2,
  ARRIVED: 3,
  CANCELED: 4,
  NO_SHOW: 5,
  CHECKED_OUT: 6,
  NO_BOOKING: 7,
  BLOCKED_BOOKING: 8,
  BOOKING_AVAILABLE: 9
}

export const BOOKING_CLIENT_COLOR = {
  NONE: 0,
  RED: 1,
  ORANGE: 2,
  YELLOW: 3,
  GREEN: 4,
  BLUE: 5,
  INDIGO: 6,
  PURPLE: 7
}


export const REPEAT_BY = {
  WEEK_OF_DAY: 1,
  DATE: 2
}

export const DEPOSIT_TYPE = {
  NOT_PAID_YET: 1,
  PAID: 2,
  PAY_BY_BALANCE: 3
}

export const BOOKING_CANCEL_TYPE = {
  BOOKING_ONLY: 1,
  ALL_UPCOMMING_BOOKINGS: 2
}

export const BOOKING_REASON = {
  NO_CANCEL: 1,
  NOT_SELECTED: 2,
  CLIENT_REQUEST: 3,
  BOOKING_MADE_BY_MISTAKE: 4,
  DUPLICATE_BOOKING: 5,
  CANCEL_ETC: 6,
}

export const BOOKING_CALENDAR_GROUP_TYPE = {
  BOOKING: 1,
  BLOCKED_TIME: 2
}

export const ALERT_TYPE_CONFIRM = {
  BOOKING: 1,
  BLOCKED_TIME: 2
}

export const SESSION_KEY = {
  All_CALENDAR_SETUPS         : 'all_calendar_setups',
  PAYMENT_METHOD_SETUP        : 'payment_method_setup',
  STAFFS                      : 'staffs',
  STAFF_GOAL_SETUP            : 'staff_goal_setup',
  STAFF_PAYROLL_SETUP         : 'staff_payroll_setup',
  ALL_SALES_SETUP             : 'all_sales_setup',
}

export const MINUTES_OF_24H = 1440

export const NOTIFICATON_TYPE = {
  NO_DEFINED: 'NO_DEFINED',
  BOOKINGS_CREATED: 'BOOKINGS_CREATED',
  BOOKINGS_UPDATED: 'BOOKINGS_UPDATED',
  BOOKINGS_CANCELLED: 'BOOKINGS_CANCELLED',
  WAITINGS_CREATED: 'WAITINGS_CREATED',
  WAITINGS_UPDATED: 'WAITINGS_UPDATED',
  WAITINGS_CHANGED_TO_BOOKINGS: 'WAITINGS_CHANGED_TO_BOOKINGS'
}

export const SELECTED_RESOURCES_OPTIONS = {
  ALL: -1,
  WORKING_STAFFS: -2
}


//--- clients ---
export const CLIENT_TYPE = {
  ACTIVE: '/Active',
  DUPLICATED: '/Duplicated',
  DUPLICATED_BY_VALUE: '/DuplicatedByValue',
  SEARCH: '/Search',
  UPDATE_STATUS: '/UpdateStatuses',
  UPDATE_TO_DELETE: '/UpdateToDeleted',
  DELETED: '/Deleted',
  DELETE_COMPLETELY: '/DeleteCompletely',
  NEXT_MEMBER_NUMBER: '/NextMemberNumber',
}

export const AGGREGATE_TYPE = {
  CLIENT: '/Client'
}
//client enum
export const CLIENTS_ENUMS = {
  PAGE: {
    RECOMMEND_CLIENTS: 'RecommendClients',
    SALES_CLIENTS: 'SalesClients',
    FAMILY_MEMBER_SEARCH: 'FamilyMemberSearch',
    FAMILY_MEMBER_LIST:'FamilyMemberList',
    ADD_BOOKING: 'AddBooking'
  },
  APPLY_RECOMMENDATION_POINT_TYPE : {
    ON : 1,
    OFF : 2
  },
  CLIENT_SEARCH_CONDITION_TYPE : {
    NAME_OR_PHONE : 1,
    NAME_OR_NUMBER: 2,
    NOTES : 3
  },
  CONTACT_INFO_HIDING_TYPE : {
    SHOWALL : 1,
    HIDE_EXCEPT_REGISTERED_TODAY : 2,
    HIDEALL : 3
  },
  CLIENT_EDIT_PERMISSION_TYPE : {
    MANAGER_OR_HIGHER : 1,
    STAFF_OR_HIGHER : 2
  },
  MEMBER_NUMBER_TYPE : {
    AUTO: 1,
    MANUAL : 2
  },
  CLIENT_TYPE : {
    GETCLIENT: '/GetClient',
    ACTIVE: '/Active',
    DUPLICATED: '/Duplicated',
    DUPLICATED_BY_VALUE: '/DuplicatedByValue',
    SEARCH: '/Search',
    UPDATE_STATUS: '/UpdateStatuses',
    DELETED: '/Deleted',
    DELETE_COMPLETELY: '/DeleteCompletely',
    NEXT_MEMBER_NUMBER: '/NextMemberNumber',
    SHOP_INFO: '/GetShopInfo',
    UPDATE_NOTE: '/UpdateNote',
    FAMILY_MEMBER: '/FamilyMember',
    FAMILY: '/Family',
    CHANGE_POINT: '/ChangePoint',
    CHANGE_FAMILY_POINT: '/ChangeFamilyPoint',
    UPDATE_CLIENT: '/UpdateClient',
    CLIENT_REFERRAL_SOURCE: '/ClientReferralSource',
    CLIENT_RATING: '/ClientRating',
    CLIENT_GROUP: '/ClientGroup',
    UPDATE_CLIENT_TO_DELETED: '/UpdateClientToDeleted',
    CLIENT_SHOP_INFO:'/ShopInfo',
    CONNECTABLE:'/Connectable'
  },
  SEX : {
    NONE_INPUT: 0,
    MALE: 1,
    FEMALE: 2,
    NONE: 3
  },
  BIRTHDAY_TYPE : {
    SOLAR: 1,
    LUNAR: 2
  },
  ALLOWED_MESSAGE_TYPE : {
    ALLOW_MESSAGE: 1,
    NOT_MARKETING: 2,
    NOT_MESSAGE: 3
  },
  CLIENT_MEMBER_TYPE : {
    MEMBER: 1,
    NON_MEMBER: 2
  },
  DUPLICATED_CLIENT_SEARCH_TYPE : {
    NAME_MOBILE: 1,
    NAME: 2,
    MOBILE: 3
  },
  DUPLICATED_CLIENT_SEARCH_TYPE_VALUES : {
    NAME: 1,
    MOBILE: 2
  },
  CLIENT_SEARCH_TYPE : {
    NAME_MOBILE_PHONE: 1,
    NAME_MEMBER_NUMBER: 2,
    NOTES: 3
  },
  CLIENT_STATUS : {
    ACTIVE: 1,
    DELETED: 2
  },
  MEMBER_NUMBER_SETUP_TYPE : {
    AUTO: 1,
    MANUAL: 2
  },
  ENVIRONMENT_SETUP_TYPE : {
    ALLOW_DELETE_CLIENT: 1,
    ALLOW_EDIT_CLIENT: 2,
    CLIENT_SEARCH_CONDITION: 3,
    CONTACT_INFO_TO_MANAGER: 4,
    CONTACT_INFO_TO_STAFF: 5,
    MEMBER_NUMBER_SETUP: 6
  }
}

export const STAFFS_ENUMS = {
  STAFF_TYPE:{
    WORKING_HOUR: '/WorkingHour',
    ACTIVE: '/Active'
  },
  SEARCH_CONDITION: {
    ALIAS: 1,
    FULL_NAME: 2
  },
  STATUS : {
    LIST_DEFAULT: 0,
    ALL: 0,
    ACTIVE: 1,
    INACTIVE: 2
  },
  FULLNAME:{
    SAME_AS_ALIAS: 1,
    NO_SAME_AS_ALIAS: 2
  }
}

export const SALES_ENUMS = {
  CLIENT_SEARCH_CONDITION: {
    NAME_OR_MOBILE: 1,
    NAME_OR_MEMER_NO: 2,
    NOTES: 3
  },
  POINTS_TYPE: {
    NONE: 0,
    CLIENT_POINTS: 1,
    FAMILY_POINTS: 2
  },
  DISCOUNT_TYPE: {
    PERCENT: 1,
    AMOUNT: 2
  },
  GOODS_TYPE: {
    PRODUCT: 1,
    SERVICE: 2,
    PREPAID_SERVICE: 3,
    PREPAID_CARD: 4
  },

}

export const PAGE_MODAL_CHECK = {
  PAGE: 1,
  MODAL: 2
}

export const COUNTRY = {
  KR: 'KR',
  CN: 'CN',
  VI: 'VI'
}
export const COUNTRY_CODE_TYPE = {
  KOREA:  { NAME: 'KOREA', CODE: 'KR' },
  VIETNAM: { NAME: 'VIETNAM',  CODE: 'VN' },
  CHINA:   { NAME: 'CHINA',  CODE: 'CN' }
}
export const TYPE_DATE = {
  DATE: 1,
  DATE_RANGE: 2,
}
export const WAITING_STATUS = {
  NEW_WAITING: 1,
  ADD_TO_BOOKING: 2,
  CANCELED: 3,
}
export const NUMBER_ITEM_WAITING = {
  IN_CALENDAR: 5,
}
export const CALENDAR_VIEW_MODE = {
  DAILY: 1,
  WEEKLY: 2,
}
export const CALENDAR_CELL_MODE = {
  ADD_BOOKING: 1,
  MOVE_BOOKING: 2,
  ADD_BLOCKED_TIME: 3
}
export const CALENDAR_MAX_COLS = 20
export const CALENDAR_FIRST_COL_WIDTH = 80
export const CALENDAR_FIRST_COL_WIDTH_MOBILE = 70
export const TIME_SLOT_WIDTH = 150
export const TIME_SLOT_WIDTH_MOBILE = 70
export const BROWSER_SCROLL = 17
export const IPAD_MAX_WIDTH = 991.98
export const MOBILE_MAX_WIDTH = 575.98 // 767.98

export const MISC_CODE = {
  PAYMENT_METHOD: 1,
  SALES_TYPE: 2,
  DISCOUNT_CATEGORY: 3,
  CLIENT_GROUP: 4,
  CLIENT_RATING: 5,
  CLIENT_REFERRAL_SOURCE: 6
}
export const CAN_NOT_CANCEL_REASON = {
  CHECKED_OUT_BOOKING: 0,
  PAID_DEPOSIT_BOOKING: 1,
  PAID_AND_CHECKED_OUT_BOOKING: 2
}
export const ERROR_VALUE_TYPES = {
  DATE: 1,
  START_TIME: 2,
  END_TIME: 3,
  RESOURCES: 4,
  PERFORMANCES: 5
}

export const BOOKING_ERROR_CODES = {
  BK15C: 'BK15C',
  BK45C: 'BK45C',
  BK44C: 'BK44C',
  BK36C: 'BK36C',
  BK35C: 'BK35C',
  BK46C: 'BK46C',
  BK48C: 'BK48C',
  BK47C: 'BK47C',
  BK49C: 'BK49C',
  BK30C: 'BK30C',
  BK31C: 'BK31C',
  BK52C: 'BK52C',
  BK43C: 'BK43C',
}

export const BLOCKED_TIME_ERROR_CODES = {
  BT11C: 'BT11C',
  BT12C: 'BT12C',
  BT13C: 'BT13C',
  BT14C: 'BT14C',
  BT17C: 'BT17C',
  BT18C: 'BT18C',
  BT19C: 'BT19C',
}
export const WAITING_ERROR_CODES = {
  WT15C: 'WT15C',
  WT16C: 'WT16C',
  WT17C: 'WT17C',
  WT18C: 'WT18C',
  WT19C: 'WT19C',
  WT20C: 'WT20C',
  WT21C: 'WT21C'
}
export const BOOKING_SETUP_ERROR_CODES = {
  RS05C: 'RS05C',
}

export const ADMIN_ENUMS = {
  TAX_INVOICE_REQUEST: {
    REQUIRED: 1,
    NOT_REQUIRED: 2,
    NOT_SELETED: 3
  },
  ISSUE_BASE_ON_TYPE: {
    INPUT_BASE: 1,
    SALES_BASE: 2
  },
  SALES_TYPE:{
    NONE: 1,
    INBOUND_CHAIN: 2,
    INBOUND_SHOP: 3,
    OUTBOUNT_CHAIN: 4,
    OUTBOUNT_SHOP: 5,
    NOT_SELECTED: 6

  }
}

export const ADMIN_SALES_ENUMS = {
  PAYMENT_PURPOSE: {
    NETMONEY_CHARGE: 1,
    BASE_FEE: 2
  },
  PAYMENT_METHOD: {
    DEPOSITLESS_VIRTUAL: 1,
    DEPOSITLESS: 2,
    CARD: 3,
    REAL_TIME_BANK_TRANSFER: 4,
    KAKAO_PAY: 5,
    AUTOMATIC_TRANSFER: 6,
    NETMONEY: 7
  },
  PG:{
    LGUPLUS: 'uplus'
  },
  ONLINE_PAYMETHOD:{
    CARD: 'AC',
    REAL_TIME_ACCOUNT_TRANSFER: 'AA',
    VIRTUAL_ACCOUNT: 'AS'
  },
  ONLINE_PAYMENT_STATUS:{
    PREPARED: 1,
    IN_PROGRESS: 2,
    AWAITING: 3,
    PAID: 4,
    FAILED: 5,
    CANCELLED: 6
  },
  IAMPORT_PAY_METHOD:{
    CARD: 'card',
    REAL_TIME_ACCOUNT_TRANSFER: 'tran',
    VIRTUAL_ACCOUNT: 'vbank'
  },
  BANK_TRANSFER_NOTICE_LINK_TYPE: {
    NETMONEY: 1,
    BASEFEE: 2,
    BASEFEEANDNETMONEY: 3
  },
  DROPDOWN_LIST_TYPE: {
    // AdminSales
    PAYMENT_METHOD: 1,
    BANK_ACCOUNT: 2,
    SALES_ITEM_TYPE: 3
  },
  NETMONEY_VARIATION: {
    CHARGE: 1,
    USED  : 2
  },
  NETMONEY_SOURCE_TYPE: {
    MANUAL      : 1,
    ADMIN_SALES : 2,
    BASE_FEE    : 3,
    TEXT_SEND   : 4,
    TEXT_REFUND : 5
  },
  BASE_FEE_EXTEND_VALUE_TYPE: {
    MONTHS    : 1,
    DAYS      : 2
  },
}

export const BOARDS_ENUMS = {
  POPUP_VIEW: 'popup-view',
  BOARD_TYPE: {
    SYS_NOTICE: 'SYSNOTICE',
    SYS_BOARD : 'SYSBOARD',
    CHN_NOTICE: 'CHNNOTICE',
    CHN_BOARD: 'CHNBOARD'
  },
  LINK_TYPE: {
    SYS_NOTICE: '/boards/SYSNOTICE',
    SYS_BOARD : '/boards/SYSBOARD',
    CHN_NOTICE: '/boards/CHNNOTICE',
    CHN_BOARD: '/boards/CHNBOARD'
  },
  BOARD_GROUP_TYPE: {
    NOTICE : 1,
    BOARD  : 2,
    CHN_NOTICE: 3,
    CHN_BOARD: 4
  },
  SEARCH_BOARD_TYPE: {
    TITLE  : 1,
    WRITER : 2
  },
  MANUAL_TYPE: {
    ALL         : 0,
    BASIC       : 1,
    APPLICATION : 2,
    VIDEO       : 3
  },
  NEVER_SEE_PERIOD: {
    DAY  : 1,
    WEEK : 2,
    NO   : 3
  },
  LINK_TARGET: {
    PARENT : 1,
    NEW    : 2
  },
  BRANCH_BOARD_TYPE: {
    NONE  : 0,
    HEAD_TO_ONE_BRANCH: 1,
    SHARE_ALL: 2
  },
  BOARD_CODE:{
    SYSBOARD: 'SYSBOARD',
    SYSNOTICE: 'SYSNOTICE',
    POPUP:'POPUp'
  }
}

export const MESSAGES_ENUMS = {
  MESSAGE_TYPE: {
    SMS: 1,
    LMS: 2,
    MMS: 3
  },
  MESSAGE_STATUS: {
    NOT_SENT       : 0,
    SEND_FAIL      : 1,
    WAITING_RESULT : 2,
    RESULT_FAIL    : 3,
    RESULT_SUCCESS : 4
  },
  MESSAGE_RESULT_COL: {
    WAITING_SENDING : 0,
    SUCCESS         : 1,
    FAIL            : 2,
    WAITING_RESULT  : 3
  },
  MMS_TYPE: {
    TEXT  : 1,
    IMAGE : 2
  },
  MESSAGE_SOURCE_TYPE: {
    NONE    :   0,
    BOOKING : 1,
    SALES   : 2,
    CLIENT  : 3,
    G_ORDER_BY_BRANCH : 4
  },
  SEND_TYPE: {
    MANUAL : 1,
    AUTO   : 2,
    BATCH  : 3
  },
  SEND_PAGE: {
    CLIENT : 1,
    UNREGISTER_CLIENTS : 2,
    CID_UNREGISTER_CLIENT : 3,
  },
  TEXT_SAMPLE_GROUP_TYPE: {
    AREA: 1,
    BUSINESS_TYPE: 2
  },
  HELP_SEND_TEXT: {
    CHARACTER  : 1,
    EMOTICON   : 2,
    MY_MESSAGE : 3,
    SAMPLE     : 4,
    VARIABLE   : 5,
    SETTING    : 6,
    PREVIEW    : 7
  },
  LIST_TYPE: {
    SAMPLE     : 1,
    MY_MESSAGE : 2
  },
  SETUP_AUTOMATIC_MESSAGING_TAB: {
    BOOKING    : 0,
    SALES      : 1,
    POST_VISIT : 2,
    CLIENT     : 3
  },
  SETUP_AUTOMATIC_MESSAGING_TYPE: {
    BIRTHDAY_GREETINGS : 51,
    POINTS_ADD         : 1,
    POINTS_DEDUCTION   : 2,
    BALANCE_ADD        : 3,
    BALANCE_DEDUCTION  : 4,
    PREPAID_CARD_EXPIRY_DATE_REMINDER_FIRST  : 5,
    PREPAID_CARD_EXPIRY_DATE_REMINDER_SECOND : 6,
    PREPAID_CARD_EXPIRY_DATE_REMINDER_THIRD  : 7,
    PREPAID_SERVICE_QUANTITY_ADD         : 8,
    PREPAID_SERVICE_QUANTITY_DEDUCTION   : 9,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER_FIRST  : 10,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER_SECOND : 11,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER_THIRD  : 12,
    PREPAID_CARD_EXPIRY_DATE_REMINDER    : 20,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER : 21,
    BOOKING: {
      THE_DAY_BEFORE : 1,
      ON_THE_DAY     : 2,
      HOURS_BEFORE   : 3,
      REGISTERED     : 4,
      ONLINE_CONFIRM : 5,
      CANCELED       : 6,
      ONLINE_CANCEL  : 7,
    }
  },
  SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE: {
    POST_VISIT : 'A_SL_V',
    
    BIRTHDAY_GREETINGS : 'A_CL_B',

    POINTS_ADD         : 'A_SL_PA',
    POINTS_DEDUCTION   : 'A_SL_PD',
    BALANCE_ADD        : 'A_SL_PCA',
    BALANCE_DEDUCTION  : 'A_SL_PCD',
    PREPAID_SERVICE_QUANTITY_ADD         : 'A_SL_PSA',
    PREPAID_SERVICE_QUANTITY_DEDUCTION   : 'A_SL_PSD',
    PREPAID_CARD_EXPIRY_DATE_REMINDER    : 'A_SL_PCE',
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER : 'A_SL_PSE',
    BOOKING: {
      THE_DAY_BEFORE : 'A_BK_RB',
      ON_THE_DAY     : 'A_BK_RD',
      HOURS_BEFORE   : 'A_BK_RT',
      REGISTERED     : 'A_BK_I',
      ONLINE_CONFIRM : 'A_BK_OI',
      CANCELED       : 'A_BK_C',
      ONLINE_CANCEL  : 'A_BK_OC',
    },
  },
  LINK_TYPE: '/setup-automatic-messaging',
  SENDER_PHONE_CERTIFICATION_TYPE: {
    NONE : 1,
    MOBILE_PHONE : 2,
    ARS : 3,
    DOCUMENT: 4,
  },
  VISIT_TYPE: {
    BY_SALES_CATEGORY : 1,
    BY_SALES          : 2
  },
  VISIT_COUNT_TYPE: {
    NONE           : 0,
    FIRST_VISIT    : 1,
    RE_VISIT       : 2,
    FIRST_RE_VISIT : 3
  }
}

export const COMMON_STATUS = {
  ALL: 0,
  ACTIVE: 1,
  INACTIVE: 2
}

export const LANGUAGE_TYPE = {
  ENGLISH:  { NAME: 'English', LANGUAGE: 'EN' },
  KOREAN:   { NAME: 'Korean',  LANGUAGE: 'KO' }
}

export const CID_USAGE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2
}

export const CID_ENUMS={
  CID_POPUP_VIEW: 'cid-receive-call-popup',
  CID_CLIENT_ACTION: 'add-client-from-cid',
}

export const CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS = {
  SELECT: 0,
  ALL_CLIENTS: 1,
  DORMANT_CLIENTS: 2,
  CLIENTS_BY_SALES_SERVICE: 3,
  CLIENTS_BY_SALES_PRODUCT: 4,
  CLIENTS_BY_SALES_AMOUNT: 5,
  CLIENTS_BY_PREPAID_CARDS: 6,
  CLIENTS_BY_PREPAID_SERVICES: 7,
  BIRTHDAY_CLIENTS: 8,
  RECOMMENDED_CLIENTS: 9
}

export const CLIENT_MANAGEMENT_SALES_DATE_TYPE = {
  ALL: 1,
  DATE_RANGE: 2
}

export const CLIENT_MANAGEMENT_RECENT_VISITED_DATE_TYPE = {
  NOT_VISITED_MORE_THAN: 0,
  VISITED_FOR_LAST: 1,
  DATE_RANGE: 2
}

export const CAMPAIGN_MANAGEMENT_CAMPAIGN_TYPE = {
  DEFAULT: 0,
  ADD: 1,
  VIEW_TARGET_CLIENTS: 2
}