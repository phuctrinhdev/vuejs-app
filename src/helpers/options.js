import {
  USER_ROLES, PERMISSION, COUNTRY,

  PAGINATION, FORM_ACTIONS, COOKIE_ACTION, 

  GOODS_STATUS, VALIDITY_TYPE, SALARY_TYPE, USAGE_STATUS, ENUM_NO_LIMIT, GOODS_TABLE_DRAG,

  REPEAT_BY, REPEAT_TYPE, REPEATED_WEEKS, DAYS_OF_WEEK, STANDARD_DATE_FORMAT, STANDARD_DAY_FORMAT, STANDARD_HOUR_FORMAT,
  BOOKING_APPROVAL_TYPE, RESOURCE_TYPE, BOOKING_CLIENT_TYPE, BOOKING_STATUS, BOOKING_CLIENT_COLOR, DEPOSIT_TYPE, SESSION_KEY,
  BOOKING_SOURCE, BOOKING_CALENDAR_GROUP_TYPE, ALERT_TYPE_CONFIRM, BOOKING_REASON, BOOKING_CANCEL_TYPE, CAN_NOT_CANCEL_REASON,
  NOTIFICATON_TYPE, SELECTED_RESOURCES_OPTIONS, MINUTES_OF_24H, ERROR_VALUE_TYPES, BOOKING_ERROR_CODES, CALENDAR_MAX_COLS,
  TYPE_DATE, WAITING_STATUS, CALENDAR_VIEW_MODE, CALENDAR_CELL_MODE, BROWSER_SCROLL, MISC_CODE,
  CLIENTS_ENUMS, BLOCKED_TIME_ERROR_CODES, BOOKING_SETUP_ERROR_CODES, WAITING_ERROR_CODES,

  STAFFS_ENUMS,

  SALES_ENUMS,

  ADMIN_ENUMS,

  BOARDS_ENUMS,

  MESSAGES_ENUMS,

  PAGE_MODAL_CHECK,
  TIME_SLOT_WIDTH, TIME_SLOT_WIDTH_MOBILE, CALENDAR_FIRST_COL_WIDTH, CALENDAR_FIRST_COL_WIDTH_MOBILE, COMMON_STATUS, LANGUAGE_TYPE, COUNTRY_CODE_TYPE,

  ADMIN_SALES_ENUMS, CID_USAGE_STATUS, CID_ENUMS, CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS, CLIENT_MANAGEMENT_SALES_DATE_TYPE, CLIENT_MANAGEMENT_RECENT_VISITED_DATE_TYPE, CAMPAIGN_MANAGEMENT_CAMPAIGN_TYPE

} from '../config/constant'

export const options = {
  country: {
    kr: COUNTRY.KR,
    vi: COUNTRY.VI,
    cn: COUNTRY.CN
  },
  country_code: {
    kr: COUNTRY_CODE_TYPE.KOREA.CODE,
    vi: COUNTRY_CODE_TYPE.VIETNAM.CODE,
    cn: COUNTRY_CODE_TYPE.CHINA.CODE
  },
  country_name:{
    kr: COUNTRY_CODE_TYPE.KOREA.NAME,
    vi: COUNTRY_CODE_TYPE.VIETNAM.NAME,
    cn: COUNTRY_CODE_TYPE.CHINA.NAME
  },
  time_zone_options: {
    seoul: 9,
    ho_chi_minh: 7
  },
  common_status: {
    all: COMMON_STATUS.ALL,
    active: COMMON_STATUS.ACTIVE,
    inactive: COMMON_STATUS.INACTIVE
  },
  language_type: [
    { name: LANGUAGE_TYPE.ENGLISH.NAME, language: LANGUAGE_TYPE.ENGLISH.LANGUAGE },
    { name: LANGUAGE_TYPE.KOREAN.NAME,  language: LANGUAGE_TYPE.KOREAN.LANGUAGE  }
  ],
  user_roles: {
    chain_head: USER_ROLES.CHAIN_HEAD,
    chain_shop: USER_ROLES.CHAIN_SHOP,
    single_shop: USER_ROLES.SINGLE_SHOP,
    admin_master: USER_ROLES.ADMIN_MASTER,
    master: USER_ROLES.MASTER,
    staff: USER_ROLES.STAFF,
    manager: USER_ROLES.MANAGER
  },
  permission: {
    goods: PERMISSION.GOODS
  },
  pagination: {
    home: PAGINATION.HOME,
    zero: PAGINATION.ZERO,
    small: PAGINATION.SMALL,
    default: PAGINATION.DEFAULT,
    big: PAGINATION.BIG,
    max: PAGINATION.MAX,
    notification: PAGINATION.NOTIFICATION,
  },
  form_actions: {
    add: FORM_ACTIONS.ADD,
    edit: FORM_ACTIONS.EDIT,
    delete: FORM_ACTIONS.DELETE,
    view: FORM_ACTIONS.VIEW,
    create: FORM_ACTIONS.CREATE,
    part: FORM_ACTIONS.PART,
    re_add: FORM_ACTIONS.RE_ADD
  },
  cookie_action: {
    get    : COOKIE_ACTION.GET,
    set    : COOKIE_ACTION.SET,
    remove : COOKIE_ACTION.REMOVE,
    exist  : COOKIE_ACTION.EXIST
  },
  good_status: {
    list_default: GOODS_STATUS.LIST_DEFAULT,
    all: GOODS_STATUS.ALL,
    active: GOODS_STATUS.ACTIVE,
    inactive: GOODS_STATUS.INACTIVE,
  },
  option_goods_status: [
    { value: GOODS_STATUS.ACTIVE, text: 'general.active' },
    { value: GOODS_STATUS.INACTIVE, text: 'general.inactive' }
  ],
  usage_status: {
    all: USAGE_STATUS.ALL,
    sales: USAGE_STATUS.SALES,
    internal_use: USAGE_STATUS.INTERNAL_USE,
    sales_and_internal_use: USAGE_STATUS.SALES_AND_INTERNAL_USE,
    sales_all: USAGE_STATUS.SALES_ALL,
    internal_use_all: USAGE_STATUS.INTERNAL_USE_ALL,
  },
  validity_type: {
    months: VALIDITY_TYPE.MONTHS,
    days: VALIDITY_TYPE.DAYS
  },
  option_validity_type: [
    { value: VALIDITY_TYPE.MONTHS, text: 'general.month' },
    { value: VALIDITY_TYPE.DAYS, text: 'general.days' }
  ],
  salary_type: {
    percent: SALARY_TYPE.PERCENT,
    amount: SALARY_TYPE.AMOUNT
  },
  option_salary_type: [
    { value: SALARY_TYPE.PERCENT, text: 'general.percent' },
    { value: SALARY_TYPE.AMOUNT, text: 'general.amount' }
  ],
  yes_no: {
    yes: true,
    no: false
  },
  option_yes_no: [
    { value: true, text: 'general.yes' },
    { value: false, text: 'general.no' }
  ],
  enum_no_limit: ENUM_NO_LIMIT,
  prepaid_card_type: {
    deposit_card : 1,
    discount_card: 2
  },
  good_table_drag: {
    all: GOODS_TABLE_DRAG.ALL,
    unshared: GOODS_TABLE_DRAG.UNSHARED,
    shared: GOODS_TABLE_DRAG.SHARED,
    off: GOODS_TABLE_DRAG.OFF
  },
  repeat_by: {
    week_of_day: REPEAT_BY.WEEK_OF_DAY,
    date: REPEAT_BY.DATE
  },
  repeat_type: {
    none: REPEAT_TYPE.NONE,
    every_week: REPEAT_TYPE.EVERY_WEEK,
    biweekly: REPEAT_TYPE.BIWEEKLY,
    monthly: REPEAT_TYPE.MONTHLY
  },
  repeated_weeks_options: {
    first: REPEATED_WEEKS.FIRST,
    second: REPEATED_WEEKS.SECOND,
    third: REPEATED_WEEKS.THIRD,
    fourth: REPEATED_WEEKS.FOURTH
  },
  days_of_week: {
    sunday: DAYS_OF_WEEK.SUNDAY,
    monday: DAYS_OF_WEEK.MONDAY,
    tuesday: DAYS_OF_WEEK.TUESDAY,
    wednesday: DAYS_OF_WEEK.WEDNESDAY,
    thursday: DAYS_OF_WEEK.THURSDAY,
    friday: DAYS_OF_WEEK.FRIDAY,
    saturday: DAYS_OF_WEEK.SATURDAY
  },
  resource_type: {
    staff: RESOURCE_TYPE.STAFF,
    no_staff: RESOURCE_TYPE.NO_STAFF
  },
  option_resource_type: [
    { value: RESOURCE_TYPE.STAFF, text: 'booking-resources.staff' },
    { value: RESOURCE_TYPE.NO_STAFF, text: 'booking-resources.non-staff' }
  ],
  booking_client_type: {
    booked_client: BOOKING_CLIENT_TYPE.BOOKED_CLIENT,
    walking_client: BOOKING_CLIENT_TYPE.WALKING_CLIENT
  },
  booking_approval_type: {
    manual: 1,
    auto: 2
  },
  option_approval_type: [
    { value: BOOKING_APPROVAL_TYPE.MANUAL, text: 'booking-online-booking-settings.manual', },
    { value: BOOKING_APPROVAL_TYPE.AUTO, text: 'booking-online-booking-settings.auto', }
  ],
  standard_date_format: {
    default: STANDARD_DATE_FORMAT.DMY,
    dmy: STANDARD_DATE_FORMAT.DMY,
    dmyh: STANDARD_DATE_FORMAT.DMYH,
    ymd: STANDARD_DATE_FORMAT.YMD,
    ymdh: STANDARD_DATE_FORMAT.YMDH,
    mdy: STANDARD_DATE_FORMAT.MDY,
    utc: STANDARD_DATE_FORMAT.UTC,
    hm: STANDARD_DATE_FORMAT.HM
  },
  standard_day_format: {
    default: STANDARD_DAY_FORMAT.long,
    short: STANDARD_DAY_FORMAT.SHORT,
    long: STANDARD_DAY_FORMAT.LONG
  },
  standard_hour_format: {
    default: STANDARD_HOUR_FORMAT.H24,
    h12: STANDARD_HOUR_FORMAT.H12,
    h24: STANDARD_HOUR_FORMAT.H24,
    h24_seconds: STANDARD_HOUR_FORMAT.H24_SECONDS
  },
  error_value_types: {
    date: ERROR_VALUE_TYPES.DATE,
    start_time: ERROR_VALUE_TYPES.START_TIME,
    end_time: ERROR_VALUE_TYPES.END_TIME,
    resources: ERROR_VALUE_TYPES.RESOURCES,
    performances: ERROR_VALUE_TYPES.PERFORMANCES
  },
  booking: {
    booking_status: {
      all: BOOKING_STATUS.ALL,
      all_no_canceled: BOOKING_STATUS.ALL_NO_CANCELD,
      requested: BOOKING_STATUS.REQUESTED,
      completed: BOOKING_STATUS.COMPLETED,
      arrived: BOOKING_STATUS.ARRIVED,
      canceled: BOOKING_STATUS.CANCELED,
      no_show: BOOKING_STATUS.NO_SHOW,
      checked_out: BOOKING_STATUS.CHECKED_OUT,
      no_booking: BOOKING_STATUS.NO_BOOKING,
      blocked_booking: BOOKING_STATUS.BLOCKED_BOOKING,
      booking_available: BOOKING_STATUS.BOOKING_AVAILABLE
    },
    option_booking_status: [
      { value: BOOKING_STATUS.REQUESTED, text: 'booking-status.requested', color: '#fcb735' },
      { value: BOOKING_STATUS.COMPLETED, text: 'booking-status.completed', color: '#2eb398' },
      { value: BOOKING_STATUS.ARRIVED, text: 'booking-status.arrived', color: '#7c79b6' },
      { value: BOOKING_STATUS.CANCELED, text: 'booking-status.canceled', color: 'white' },
      { value: BOOKING_STATUS.NO_SHOW, text: 'booking-status.no-show', color: '#db3c44' },
      { value: BOOKING_STATUS.CHECKED_OUT, text: 'booking-status.checked-out', color: '#3499db' },
      { value: BOOKING_STATUS.NO_BOOKING, text: 'booking-status.no-booking', color: '#dee2e6' },
      { value: BOOKING_STATUS.BLOCKED_BOOKING, text: 'booking-status.blocked-booking', color: '#adb5bd' },
      { value: BOOKING_STATUS.BOOKING_AVAILABLE, text: 'booking-status.booking-available', color: '#ffffff' }
    ],
    booking_client_color: {
      none: BOOKING_CLIENT_COLOR.NONE,
      red: BOOKING_CLIENT_COLOR.RED,
      orange: BOOKING_CLIENT_COLOR.ORANGE,
      yellow: BOOKING_CLIENT_COLOR.YELLOW,
      green: BOOKING_CLIENT_COLOR.GREEN,
      blue: BOOKING_CLIENT_COLOR.BLUE,
      indigo: BOOKING_CLIENT_COLOR.INDIGO,
      violet: BOOKING_CLIENT_COLOR.VIOLET,
      pink: BOOKING_CLIENT_COLOR.PINK
    }, 
    booking_client_color_options: [
      { id: BOOKING_CLIENT_COLOR.NONE,    color: '#ffffff',     name: 'none' },
      { id: BOOKING_CLIENT_COLOR.RED,     color: '#db0a44',     name: 'red' },
      { id: BOOKING_CLIENT_COLOR.ORANGE,  color: '#fc8536',     name: 'orange' },
      { id: BOOKING_CLIENT_COLOR.YELLOW,  color: '#f6de78',     name: 'yellow' },
      { id: BOOKING_CLIENT_COLOR.GREEN,   color: '#57c386',     name: 'green' },
      { id: BOOKING_CLIENT_COLOR.BLUE,    color: '#3499db',     name: 'blue' },
      { id: BOOKING_CLIENT_COLOR.INDIGO,  color: '#4a148c',     name: 'indigo' },
      { id: BOOKING_CLIENT_COLOR.PURPLE,  color: '#7c47b6',     name: 'purple' },
    ],
    booking_source: {
      all: BOOKING_SOURCE.ALL,
      staff: BOOKING_SOURCE.STAFF,
      online: BOOKING_SOURCE.ONLINE,
    },
    option_booking_source: [
      { value: BOOKING_SOURCE.STAFF, text: 'booking-source.staff', acronym: 'S' },
      { value: BOOKING_SOURCE.ONLINE, text: 'booking-source.online', acronym: 'O' },
      { value: BOOKING_SOURCE.KAKAO, text: 'booking-source.kakao', acronym: 'N' },
      { value: BOOKING_SOURCE.NAVER, text: 'booking-source.naver', acronym: 'K' },
    ],
    booking_min_duration: 5,
    table_cell_height: 30,
    calendar_view_mode: {
      daily: CALENDAR_VIEW_MODE.DAILY,
      weekly: CALENDAR_VIEW_MODE.WEEKLY
    },
    calendar_cell_mode: {
      add_booking: CALENDAR_CELL_MODE.ADD_BOOKING,
      move_booking: CALENDAR_CELL_MODE.MOVE_BOOKING,
      add_blocked_time: CALENDAR_CELL_MODE.ADD_BLOCKED_TIME
    },
    view_direction: {
      next: 1,
      pre: -1
    },
    booking_error_codes: {
      bk15c: BOOKING_ERROR_CODES.BK15C,
      bk45c: BOOKING_ERROR_CODES.BK45C,
      bk44c: BOOKING_ERROR_CODES.BK44C,
      bk36c: BOOKING_ERROR_CODES.BK36C,
      bk35c: BOOKING_ERROR_CODES.BK35C,
      bk46c: BOOKING_ERROR_CODES.BK46C,
      bk48c: BOOKING_ERROR_CODES.BK48C,
      bk47c: BOOKING_ERROR_CODES.BK47C,
      bk49c: BOOKING_ERROR_CODES.BK49C,
      bk30c: BOOKING_ERROR_CODES.BK30C,
      bk31c: BOOKING_ERROR_CODES.BK31C,
      bk52c: BOOKING_ERROR_CODES.BK52C,
      bk43c: BOOKING_ERROR_CODES.BK43C
    },
    waiting_error_codes: {
      wt15c: WAITING_ERROR_CODES.WT15C,
      wt16c: WAITING_ERROR_CODES.WT16C,
      wt17c: WAITING_ERROR_CODES.WT17C,
      wt18c: WAITING_ERROR_CODES.WT18C,
      wt19c: WAITING_ERROR_CODES.WT19C,
      wt20c: WAITING_ERROR_CODES.WT20C,
      wt21c: WAITING_ERROR_CODES.WT21C
    },
    blocked_time_error_codes: {
      bt11c: BLOCKED_TIME_ERROR_CODES.BT11C,
      bt12c: BLOCKED_TIME_ERROR_CODES.BT12C,
      bt13c: BLOCKED_TIME_ERROR_CODES.BT13C,
      bt14c: BLOCKED_TIME_ERROR_CODES.BT14C,
      bt17c: BLOCKED_TIME_ERROR_CODES.BT17C,
      bt18c: BLOCKED_TIME_ERROR_CODES.BT18C,
      bt19c: BLOCKED_TIME_ERROR_CODES.BT19C
    },
    booking_setup_error_codes: {
      rs05c: BOOKING_SETUP_ERROR_CODES.RS05C
    }
  },
  deposit_from: {
    booking_calendar: 1,
    booking_list: 2
  },
  deposit_type: {
    not_paid_yet: DEPOSIT_TYPE.NOT_PAID_YET,
    paid: DEPOSIT_TYPE.PAID,
    pay_by_balance: DEPOSIT_TYPE.PAY_BY_BALANCE
  },
  booking_cancel_type: {
    booking_only: BOOKING_CANCEL_TYPE.BOOKING_ONLY,
    all_upcomming_bookings: BOOKING_CANCEL_TYPE.ALL_UPCOMMING_BOOKINGS,
  },
  booking_reason: {
    no_cancel: BOOKING_REASON.NO_CANCEL,
    not_selected: BOOKING_REASON.NOT_SELECTED,
    client_request: BOOKING_REASON.CLIENT_REQUEST,
    booking_made_by_mistake: BOOKING_REASON.BOOKING_MADE_BY_MISTAKE,
    duplicate_booking: BOOKING_REASON.DUPLICATE_BOOKING,
    cancel_etc: BOOKING_REASON.CANCEL_ETC
  },
  can_not_cancel_reason: {
    checked_out_booking: CAN_NOT_CANCEL_REASON.CHECKED_OUT_BOOKING,
    paid_deposit_booking: CAN_NOT_CANCEL_REASON.PAID_DEPOSIT_BOOKING,
    paid_and_checked_out_booking: CAN_NOT_CANCEL_REASON.PAID_AND_CHECKED_OUT_BOOKING
  },
  booking_calendar_group_type: {
    booking: BOOKING_CALENDAR_GROUP_TYPE.BOOKING,
    blocked_time: BOOKING_CALENDAR_GROUP_TYPE.BLOCKED_TIME
  },
  alert_type_confirm: {
    booking: ALERT_TYPE_CONFIRM.BOOKING,
    blocked_time: ALERT_TYPE_CONFIRM.BLOCKED_TIME
  },
  sessions: {
    shop_id: {
      key: 'shop_id',
      expire_time: 720
    },
    all_calendar_setups: {
      key: SESSION_KEY.All_CALENDAR_SETUPS,
      expire_time: 30
    },
    all_sales_setups: {
      key: SESSION_KEY.ALL_SALES_SETUP,
      expire_time: 30
    },
    payment_method_setup: {
      key: SESSION_KEY.PAYMENT_METHOD_SETUP,
      expire_time: 30
    },
    staffs: {
      key: SESSION_KEY.STAFFS,
      expire_time: 30
    },
    staff_goal_setup: {
      key: SESSION_KEY.STAFF_GOAL_SETUP,
      expire_time: 30
    },
    staff_payroll_setup: {
      key: SESSION_KEY.STAFF_PAYROLL_SETUP,
      expire_time: 30
    }
  },
  minutes_of_24h: MINUTES_OF_24H,
  miliseconds_of_24h: 86400000,
  seconds_of_24h: 86400,
  notification_type: {
    no_defined: NOTIFICATON_TYPE.NO_DEFINED,
    bookings_created: NOTIFICATON_TYPE.BOOKINGS_CREATED,
    bookings_updated: NOTIFICATON_TYPE.BOOKINGS_UPDATED,
    bookings_cancelled: NOTIFICATON_TYPE.BOOKINGS_CANCELLED,
    waitings_created: NOTIFICATON_TYPE.WAITINGS_CREATED,
    waitings_updated: NOTIFICATON_TYPE.WAITINGS_UPDATED,
    waitings_changed_to_bookings: NOTIFICATON_TYPE.WAITINGS_CHANGED_TO_BOOKINGS
  },
  selected_resources_options: {
    all: SELECTED_RESOURCES_OPTIONS.ALL,
    working_staffs: SELECTED_RESOURCES_OPTIONS.WORKING_STAFFS
  },
  sex: [
    { value: CLIENTS_ENUMS.SEX.MALE, text: 'clients.male' },
    { value: CLIENTS_ENUMS.SEX.FEMALE, text: 'clients.female' }
  ],
  client_sex: {
    no_input: CLIENTS_ENUMS.SEX.NONE_INPUT,
    male    : CLIENTS_ENUMS.SEX.MALE,
    female  : CLIENTS_ENUMS.SEX.FEMALE,
    none    : CLIENTS_ENUMS.SEX.NONE
  },
  client_member_type: {
    member: CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.MEMBER,
    non_member: CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.NON_MEMBER
  },
  duplicated_client_search_type: {
    name_mobile: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE.NAME_MOBILE,
    name: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE.NAME,
    mobile: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE.MOBILE,
  },
  duplicated_client_search_type_values: {
    name: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.NAME,
    mobile: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.MOBILE
  },
  allowed_message_type: {
    allow_message: CLIENTS_ENUMS.ALLOWED_MESSAGE_TYPE.ALLOW_MESSAGE,
    not_marketing: CLIENTS_ENUMS.ALLOWED_MESSAGE_TYPE.NOT_MARKETING,
    not_message: CLIENTS_ENUMS.ALLOWED_MESSAGE_TYPE.NOT_MESSAGE
  },
  member_number_setup_type: [
    { value: CLIENTS_ENUMS.MEMBER_NUMBER_SETUP_TYPE.AUTO, text: 'client-environment.auto' },
    { value: CLIENTS_ENUMS.MEMBER_NUMBER_SETUP_TYPE.MANUAL, text: 'client-environment.manual' }
  ],
  clients_enums: {
    apply_recommendation_point_type: {
      on: CLIENTS_ENUMS.APPLY_RECOMMENDATION_POINT_TYPE.ON,
      off: CLIENTS_ENUMS.APPLY_RECOMMENDATION_POINT_TYPE.OFF
    },
    client_search_condition_type: {
      name_or_phone: CLIENTS_ENUMS.CLIENT_SEARCH_CONDITION_TYPE.NAME_OR_PHONE,
      name_or_number: CLIENTS_ENUMS.CLIENT_SEARCH_CONDITION_TYPE.NAME_OR_NUMBER,
      notes: CLIENTS_ENUMS.CLIENT_SEARCH_CONDITION_TYPE.NOTES
    },
    contact_info_hiding_type: {
      showall: CLIENTS_ENUMS.CONTACT_INFO_HIDING_TYPE.SHOWALL,
      hide_except_registered_today: CLIENTS_ENUMS.CONTACT_INFO_HIDING_TYPE.HIDE_EXCEPT_REGISTERED_TODAY,
      hideall: CLIENTS_ENUMS.CONTACT_INFO_HIDING_TYPE.HIDEALL,
    },
    client_edit_permission_type: {
      manager_or_higher: CLIENTS_ENUMS.CLIENT_EDIT_PERMISSION_TYPE.MANAGER_OR_HIGHER,
      staff_or_higher: CLIENTS_ENUMS.CLIENT_EDIT_PERMISSION_TYPE.STAFF_OR_HIGHER
    },
    sex: [
      { value: CLIENTS_ENUMS.SEX.MALE, text: 'clients.male' },
      { value: CLIENTS_ENUMS.SEX.FEMALE, text: 'clients.female' }
    ],
    birthday_type: [
      { value: CLIENTS_ENUMS.BIRTHDAY_TYPE.SOLAR, text: 'clients.solar' },
      { value: CLIENTS_ENUMS.BIRTHDAY_TYPE.LUNAR, text: 'clients.lunar' }
    ],
    client_member_type: {
      member: CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.MEMBER,
      non_member: CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.NON_MEMBER
    },
    duplicated_client_search_type: {
      name_mobile: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE.NAME_MOBILE,
      name: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE.NAME,
      mobile: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE.MOBILE,
    },
    duplicated_client_search_type_values: {
      name: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.NAME,
      mobile: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.MOBILE
    },
    allowed_message_type: {
      allow_message: CLIENTS_ENUMS.ALLOWED_MESSAGE_TYPE.ALLOW_MESSAGE,
      not_marketing: CLIENTS_ENUMS.ALLOWED_MESSAGE_TYPE.NOT_MARKETING,
      not_message: CLIENTS_ENUMS.ALLOWED_MESSAGE_TYPE.NOT_MESSAGE
    },
    member_number_setup_type: [
      { value: CLIENTS_ENUMS.MEMBER_NUMBER_SETUP_TYPE.AUTO, text: 'client-environment.auto' },
      { value: CLIENTS_ENUMS.MEMBER_NUMBER_SETUP_TYPE.MANUAL, text: 'client-environment.manual' }
    ],
  },
  staffs_enums: {
    search_condition: [
      { value: STAFFS_ENUMS.SEARCH_CONDITION.ALIAS, text: 'staffs.alias' },
      { value: STAFFS_ENUMS.SEARCH_CONDITION.FULL_NAME, text: 'staffs.full-name' }
    ],
    status: {
      list_default: STAFFS_ENUMS.STATUS.LIST_DEFAULT,
      all: STAFFS_ENUMS.STATUS.ALL,
      active: STAFFS_ENUMS.STATUS.ACTIVE,
      inactive: STAFFS_ENUMS.STATUS.INACTIVE,
    },
    fullname: {
      same_as_alias: STAFFS_ENUMS.FULLNAME.SAME_AS_ALIAS,
      no_same_as_alias: STAFFS_ENUMS.FULLNAME.NO_SAME_AS_ALIAS
    },
  },
  sales_enum: {
    client_search_condition: [
      { value: SALES_ENUMS.CLIENT_SEARCH_CONDITION.NAME_OR_MOBILE, text: 'sales.name-or-mobile' },
      { value: SALES_ENUMS.CLIENT_SEARCH_CONDITION.NAME_OR_MEMER_NO, text: 'sales.name-or-member-no' },
      { value: SALES_ENUMS.CLIENT_SEARCH_CONDITION.NOTES, text: 'general.notes' },
    ],
    points_type: {
      none: SALES_ENUMS.POINTS_TYPE.NONE,
      client_points: SALES_ENUMS.POINTS_TYPE.CLIENT_POINTS,
      family_points: SALES_ENUMS.POINTS_TYPE.FAMILY_POINTS
    },
    discount_type: {
      percent: SALES_ENUMS.DISCOUNT_TYPE.PERCENT,
      amount: SALES_ENUMS.DISCOUNT_TYPE.AMOUNT
    },
    discount_type_options: [
      { value: SALES_ENUMS.DISCOUNT_TYPE.PERCENT, text: 'general.percent' },
      { value: SALES_ENUMS.DISCOUNT_TYPE.AMOUNT, text: 'general.amount' }
    ],
    goods_type: {
      product: SALES_ENUMS.GOODS_TYPE.PRODUCT,
      service: SALES_ENUMS.GOODS_TYPE.SERVICE,
      prepaid_service: SALES_ENUMS.GOODS_TYPE.PREPAID_SERVICE,
      prepaid_card: SALES_ENUMS.GOODS_TYPE.PREPAID_CARD,
    },
    omit_staff_type: {
      allow: 1,
      not_allow: 2
    },
    discount_input_default_window_type: {
      number_keypad: 1,
      discount_category: 2
    },
    client_sales_information_default_type: {
      sales_history: 1,
      bookings: 2,
      prepaid_cards: 3,
      prepaid_services: 4,
      messages: 5,
      photos: 6
    }
  },
  page_modal_check: {
    page: PAGE_MODAL_CHECK.PAGE,
    modal: PAGE_MODAL_CHECK.MODAL
  },
  type_date: {
    date: TYPE_DATE.DATE,
    date_range: TYPE_DATE.DATE_RANGE
  },
  waiting_status: {
    new_waiting: WAITING_STATUS.NEW_WAITING,
    add_to_booking: WAITING_STATUS.ADD_TO_BOOKING,
    canceled: WAITING_STATUS.CANCELED
  },
  calendar_max_cols: CALENDAR_MAX_COLS,
  calendar_first_col_width: CALENDAR_FIRST_COL_WIDTH,
  calendar_first_col_width_mobile: CALENDAR_FIRST_COL_WIDTH_MOBILE,
  time_slot_width: TIME_SLOT_WIDTH,
  time_slot_width_mobile: TIME_SLOT_WIDTH_MOBILE,
  browser_scroll: BROWSER_SCROLL,
  misc_code: {
    payment_method: MISC_CODE.PAYMENT_METHOD,
    sales_type: MISC_CODE.SALES_TYPE,
    discount_category: MISC_CODE.DISCOUNT_CATEGORY,
    client_group: MISC_CODE.CLIENT_GROUP,
    client_rating: MISC_CODE.CLIENT_RATING,
    client_referral_source: MISC_CODE.CLIENT_REFERRAL_SOURCE
  },
  admin_enums : {
    tax_invoice_request: [
      { value: ADMIN_ENUMS.TAX_INVOICE_REQUEST.REQUIRED, text: 'tax-invoice-info.required' },
      { value: ADMIN_ENUMS.TAX_INVOICE_REQUEST.NOT_REQUIRED, text: 'tax-invoice-info.not-required' },
      //{ value: ADMIN_ENUMS.TAX_INVOICE_REQUEST.NOT_SELETED, text: 'tax-invoice-info.not-selected' },
    ],
  },

  admin_sales_enums: {
    payment_purpose_options: [
      { value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE, text: 'payments.netmoney-charge-texting' },
      { value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE,        text: 'payments.expiry-date-extension' }
    ],
    payment_purpose_options_for_auto_transfer: [
      { value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE, text: 'payments.netmoney-charge-texting' }
    ],
    base_payment_method_options_kr: [
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS,             text: 'payments.depositless-payment' },
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.CARD,                    text: 'payments.card' },
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.REAL_TIME_BANK_TRANSFER, text: 'payments.real-time-bank-transfer' },
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL,     text: 'payments.depositless-payment-virtual-account' },
      // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.KAKAO_PAY,               text: 'payments.kakao-pay' },
    ],
    base_payment_method_options: [
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS,             text: 'payments.depositless-payment' },
      // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.CARD,                    text: 'payments.card' },
      // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.REAL_TIME_BANK_TRANSFER, text: 'payments.real-time-bank-transfer' },
      // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL,     text: 'payments.depositless-payment-virtual-account' },
      // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.KAKAO_PAY,               text: 'payments.kakao-pay' },
    ],
    get netmoney_charge_payment_method_options() {
      return [
        ...this.base_payment_method_options,
        // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.AUTOMATIC_TRANSFER, text: 'payments.automatic-transfer' }
      ]
    },
    get base_fee_payment_method_options() {
      return [
        ...this.base_payment_method_options,
        // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.NETMONEY, text: 'payments.using-netmoney' }
      ]
    },
    get netmoney_charge_payment_method_options_kr() {
      return [
        ...this.base_payment_method_options_kr,
        // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.AUTOMATIC_TRANSFER, text: 'payments.automatic-transfer' }
      ]
    },
    get base_fee_payment_method_options_kr() {
      return [
        ...this.base_payment_method_options_kr,
        // { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.NETMONEY, text: 'payments.using-netmoney' }
      ]
    },
    payment_method: {
      depositless_virtual: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL,
      depositless: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS,
      card: ADMIN_SALES_ENUMS.PAYMENT_METHOD.CARD,
      real_time_bank_tansfer: ADMIN_SALES_ENUMS.PAYMENT_METHOD.REAL_TIME_BANK_TRANSFER,
      kakao_pay: ADMIN_SALES_ENUMS.PAYMENT_METHOD.KAKAO_PAY,
      automatic_transfer: ADMIN_SALES_ENUMS.PAYMENT_METHOD.AUTOMATIC_TRANSFER,
      netmoney:
      ADMIN_SALES_ENUMS.PAYMENT_METHOD.NETMONEY,
    },
    payment_purpose: {
      netmoney_charge: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE,
      base_fee: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE
    },
    payment_purpose_type:[
      { value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE, text: 'N'},
      { value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE, text: 'BF'}
    ],
    pg:{
      lguplus: ADMIN_SALES_ENUMS.PG.LGUPLUS
    },
    online_paymethod:{
      card: ADMIN_SALES_ENUMS.ONLINE_PAYMETHOD.CARD,
      real_time_account_transfer: ADMIN_SALES_ENUMS.ONLINE_PAYMETHOD.REAL_TIME_ACCOUNT_TRANSFER,
      virtual_account: ADMIN_SALES_ENUMS.ONLINE_PAYMETHOD.VIRTUAL_ACCOUNT
    },
    online_paymethod_types:[
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.CARD, text: ADMIN_SALES_ENUMS.ONLINE_PAYMETHOD.CARD },
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.REAL_TIME_BANK_TRANSFER, text: ADMIN_SALES_ENUMS.ONLINE_PAYMETHOD.REAL_TIME_ACCOUNT_TRANSFER },
      { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL, text: ADMIN_SALES_ENUMS.ONLINE_PAYMETHOD.VIRTUAL_ACCOUNT }
    ],
    online_payment_status:{
      prepared: ADMIN_SALES_ENUMS.ONLINE_PAYMENT_STATUS.PREPARED,
      in_progress: ADMIN_SALES_ENUMS.ONLINE_PAYMENT_STATUS.IN_PROGRESS,
      awaiting: ADMIN_SALES_ENUMS.ONLINE_PAYMENT_STATUS.AWAITING,
      paid: ADMIN_SALES_ENUMS.ONLINE_PAYMENT_STATUS.PAID,
      failed: ADMIN_SALES_ENUMS.ONLINE_PAYMENT_STATUS.FAILED,
      cancelled: ADMIN_SALES_ENUMS.ONLINE_PAYMENT_STATUS.CANCELLED,
    },
    iamport_pay_method:{
      card: ADMIN_SALES_ENUMS.IAMPORT_PAY_METHOD.CARD,
      real_time_account_transfer: ADMIN_SALES_ENUMS.IAMPORT_PAY_METHOD.REAL_TIME_ACCOUNT_TRANSFER,
      virtual_account: ADMIN_SALES_ENUMS.IAMPORT_PAY_METHOD.VIRTUAL_ACCOUNT
    },
    depositless_purpose_options: [
      { value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE, text: 'depositless-payments.netmoney-charge' },
      { value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE,        text: 'depositless-payments.usage-fees' }
    ],
    bank_transfer_notice_link_type: 
    {
      netmoney_charge: ADMIN_SALES_ENUMS.BANK_TRANSFER_NOTICE_LINK_TYPE.NETMONEY,
      base_fee:ADMIN_SALES_ENUMS.BANK_TRANSFER_NOTICE_LINK_TYPE.BASEFEE,
      base_fee_netmoney: ADMIN_SALES_ENUMS.BANK_TRANSFER_NOTICE_LINK_TYPE.BASEFEEANDNETMONEY

    },
    misc_codes_type:
    {
      // adminSales
      bank_account: ADMIN_SALES_ENUMS.DROPDOWN_LIST_TYPE.BANK_ACCOUNT,
      sales_item_type: ADMIN_SALES_ENUMS.DROPDOWN_LIST_TYPE.SALES_ITEM_TYPE,
      payment_method: ADMIN_SALES_ENUMS.DROPDOWN_LIST_TYPE.PAYMENT_METHOD
    },
    netmoney_variation: {
      charge: ADMIN_SALES_ENUMS.NETMONEY_VARIATION.CHARGE,
      used  : ADMIN_SALES_ENUMS.NETMONEY_VARIATION.USED
    },
    netmoney_source_type_select: [
      { value: ADMIN_SALES_ENUMS.NETMONEY_SOURCE_TYPE.MANUAL,      text: 'netmoney-histories.manual' },
      { value: ADMIN_SALES_ENUMS.NETMONEY_SOURCE_TYPE.ADMIN_SALES, text: 'netmoney-histories.admin-sales' },
      { value: ADMIN_SALES_ENUMS.NETMONEY_SOURCE_TYPE.BASE_FEE,    text: 'netmoney-histories.base-fee' },
      { value: ADMIN_SALES_ENUMS.NETMONEY_SOURCE_TYPE.TEXT_SEND,   text: 'netmoney-histories.text-send' },
      { value: ADMIN_SALES_ENUMS.NETMONEY_SOURCE_TYPE.TEXT_REFUND, text: 'netmoney-histories.text-refund' },
    ],
    base_fee_extend_value_type: {
      months     : ADMIN_SALES_ENUMS.BASE_FEE_EXTEND_VALUE_TYPE.MONTHS,
      days       : ADMIN_SALES_ENUMS.BASE_FEE_EXTEND_VALUE_TYPE.DAYS
    },
    netmoney_charge_amount: [
      { value: 10000,      text: '10,000' },
      { value: 20000,      text: '20,000' },
      { value: 30000,      text: '30,000' },
      { value: 50000,      text: '50,000' },
      { value: 100000,      text: '100,000' },
      { value: 150000,      text: '150,000' },
      { value: 200000,      text: '200,000' },
    ]
  },
  boards_enum: {
    popup_view: BOARDS_ENUMS.POPUP_VIEW, 
    board_type: {
      sys_notice : BOARDS_ENUMS.BOARD_TYPE.SYS_NOTICE,
      sys_board  : BOARDS_ENUMS.BOARD_TYPE.SYS_BOARD,
      chn_notice: BOARDS_ENUMS.BOARD_TYPE.CHN_NOTICE,
      chn_board: BOARDS_ENUMS.BOARD_TYPE.CHN_BOARD
    },
    link_type: {
      sys_notice : BOARDS_ENUMS.LINK_TYPE.SYS_NOTICE,
      sys_board  : BOARDS_ENUMS.LINK_TYPE.SYS_BOARD,
      chn_notice: BOARDS_ENUMS.LINK_TYPE.CHN_NOTICE,
      chn_board: BOARDS_ENUMS.LINK_TYPE.CHN_BOARD,
    },
    board_group_type: {
      notice : BOARDS_ENUMS.BOARD_GROUP_TYPE.NOTICE,
      board  : BOARDS_ENUMS.BOARD_GROUP_TYPE.BOARD,
      chn_notice: BOARDS_ENUMS.BOARD_GROUP_TYPE.CHN_NOTICE,
      chn_board:BOARDS_ENUMS.BOARD_GROUP_TYPE.CHN_BOARD, 
    },
    board_group_type_select: [
      { value: BOARDS_ENUMS.BOARD_GROUP_TYPE.NOTICE, text: 'boards.notice' },
      { value: BOARDS_ENUMS.BOARD_GROUP_TYPE.BOARD,  text: 'boards.board' },
    ],
    search_board_type: {
      title  : BOARDS_ENUMS.SEARCH_BOARD_TYPE.TITLE,
      writer : BOARDS_ENUMS.SEARCH_BOARD_TYPE.WRITER
    },
    search_board_type_select: [
      { value: BOARDS_ENUMS.SEARCH_BOARD_TYPE.TITLE,  text: 'boards.title' },
      { value: BOARDS_ENUMS.SEARCH_BOARD_TYPE.WRITER, text: 'boards.writer' },
    ],
    manual_type: {
      all         : BOARDS_ENUMS.MANUAL_TYPE.ALL,
      basic       : BOARDS_ENUMS.MANUAL_TYPE.BASIC,
      application : BOARDS_ENUMS.MANUAL_TYPE.APPLICATION,
      video       : BOARDS_ENUMS.MANUAL_TYPE.VIDEO,
    },
    manual_type_select: [
      { value: BOARDS_ENUMS.MANUAL_TYPE.ALL,         text: 'general.all-select' },
      { value: BOARDS_ENUMS.MANUAL_TYPE.BASIC,       text: 'manual-managements.basic' },
      { value: BOARDS_ENUMS.MANUAL_TYPE.APPLICATION, text: 'manual-managements.application' },
      { value: BOARDS_ENUMS.MANUAL_TYPE.VIDEO,       text: 'manual-managements.video' }
    ],
    never_see_period: {
      day  : BOARDS_ENUMS.NEVER_SEE_PERIOD.DAY,
      week : BOARDS_ENUMS.NEVER_SEE_PERIOD.WEEK,
      no   : BOARDS_ENUMS.NEVER_SEE_PERIOD.NO
    },
    link_target: {
      parent : BOARDS_ENUMS.LINK_TARGET.PARENT,
      new    : BOARDS_ENUMS.LINK_TARGET.NEW
    },
    branch_board_type: {
      none       : BOARDS_ENUMS.BRANCH_BOARD_TYPE.NONE,
      head_to_one_branch : BOARDS_ENUMS.BRANCH_BOARD_TYPE.HEAD_TO_ONE_BRANCH,
      share_all       : BOARDS_ENUMS.BRANCH_BOARD_TYPE.SHARE_ALL,
    },
    board_code:{
      sysboard: BOARDS_ENUMS.BOARD_CODE.SYSBOARD,
      sysnotice: BOARDS_ENUMS.BOARD_CODE.SYSNOTICE,
      popup: BOARDS_ENUMS.BOARD_CODE.POPUP,
    }
  },
  messages_enums: {
    message_type: {
      sms : MESSAGES_ENUMS.MESSAGE_TYPE.SMS,
      lms : MESSAGES_ENUMS.MESSAGE_TYPE.LMS,
      mms : MESSAGES_ENUMS.MESSAGE_TYPE.MMS
    },
    message_type_format: [
      { value: MESSAGES_ENUMS.MESSAGE_TYPE.SMS, text: 'S' },
      { value: MESSAGES_ENUMS.MESSAGE_TYPE.LMS, text: 'L' },
      { value: MESSAGES_ENUMS.MESSAGE_TYPE.MMS, text: 'M' }
    ],
    message_status: {
      not_sent       : MESSAGES_ENUMS.MESSAGE_STATUS.NOT_SENT,
      send_fail      : MESSAGES_ENUMS.MESSAGE_STATUS.SEND_FAIL,
      waiting_result : MESSAGES_ENUMS.MESSAGE_STATUS.WAITING_RESULT,
      result_fail    : MESSAGES_ENUMS.MESSAGE_STATUS.RESULT_FAIL,
      result_success : MESSAGES_ENUMS.MESSAGE_STATUS.RESULT_SUCCESS,
    },
    message_result_col: {
      waiting_sending : MESSAGES_ENUMS.MESSAGE_RESULT_COL.WAITING_SENDING,
      success         : MESSAGES_ENUMS.MESSAGE_RESULT_COL.SUCCESS,
      fail            : MESSAGES_ENUMS.MESSAGE_RESULT_COL.FAIL,
      waiting_result  : MESSAGES_ENUMS.MESSAGE_RESULT_COL.WAITING_RESULT,
    },
    mms_type: {
      image : MESSAGES_ENUMS.MMS_TYPE.IMAGE,
      text  : MESSAGES_ENUMS.MMS_TYPE.TEXT,
    },
    send_page: {
      client                : MESSAGES_ENUMS.SEND_PAGE.CLIENT,
      unregister_clients    : MESSAGES_ENUMS.SEND_PAGE.UNREGISTER_CLIENTS,
      cid_unregister_client : MESSAGES_ENUMS.SEND_PAGE.CID_UNREGISTER_CLIENT
    },
    message_source_type: {
      none    : MESSAGES_ENUMS.MESSAGE_SOURCE_TYPE.NONE,
      booking : MESSAGES_ENUMS.MESSAGE_SOURCE_TYPE.BOOKING,
      sales   : MESSAGES_ENUMS.MESSAGE_SOURCE_TYPE.SALES,
      client  : MESSAGES_ENUMS.MESSAGE_SOURCE_TYPE.CLIENT,
      g_order_by_branch : MESSAGES_ENUMS.MESSAGE_SOURCE_TYPE.G_ORDER_BY_BRANCH,
    },
    text_sample_group_type: {
      area           : MESSAGES_ENUMS.TEXT_SAMPLE_GROUP_TYPE.AREA,
      business_type  : MESSAGES_ENUMS.TEXT_SAMPLE_GROUP_TYPE.BUSINESS_TYPE
    },
    help_send_text: {
      character  : MESSAGES_ENUMS.HELP_SEND_TEXT.CHARACTER,
      emoticon   : MESSAGES_ENUMS.HELP_SEND_TEXT.EMOTICON,
      my_message : MESSAGES_ENUMS.HELP_SEND_TEXT.MY_MESSAGE,
      sample     : MESSAGES_ENUMS.HELP_SEND_TEXT.SAMPLE,
      variable   : MESSAGES_ENUMS.HELP_SEND_TEXT.VARIABLE,
      setting    : MESSAGES_ENUMS.HELP_SEND_TEXT.SETTING,
      preview    : MESSAGES_ENUMS.HELP_SEND_TEXT.PREVIEW
    },
    mms_type_select: [
      { value: MESSAGES_ENUMS.MMS_TYPE.IMAGE, text: 'messages.show-image' },
      { value: MESSAGES_ENUMS.MMS_TYPE.TEXT,  text: 'messages.show-text' },
    ],
    message_type_options: [
      { value: MESSAGES_ENUMS.MESSAGE_TYPE.SMS, text: 'messages.short-text-message-sms', page_size: 8 },
      { value: MESSAGES_ENUMS.MESSAGE_TYPE.LMS, text: 'messages.long-text-message-lms' , page_size: 6 },
      { value: MESSAGES_ENUMS.MESSAGE_TYPE.MMS, text: 'messages.image-message-mms'     , page_size: 6 },
    ],
    list_type: {
      sample     : MESSAGES_ENUMS.LIST_TYPE.SAMPLE,
      my_message : MESSAGES_ENUMS.LIST_TYPE.MY_MESSAGE,
    },
    list_type_select: [
      { value: MESSAGES_ENUMS.LIST_TYPE.SAMPLE,     text: 'messages.samples' },
      { value: MESSAGES_ENUMS.LIST_TYPE.MY_MESSAGE, text: 'messages.my-messages' },
    ],
    setup_automatic_messaging_tab: {
      booking    : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TAB.BOOKING,
      sales      : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TAB.SALES,
      post_visit : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TAB.POST_VISIT,
      client     : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TAB.CLIENT
    },
    setup_automatic_messaging_type: {
      birthday_greetings : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BIRTHDAY_GREETINGS,
      points_add         : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.POINTS_ADD,
      points_deduction   : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.POINTS_DEDUCTION,
      balance_add        : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BALANCE_ADD,
      balance_deduction  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BALANCE_DEDUCTION,
      prepaid_card_expiry_date_reminder_first  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_CARD_EXPIRY_DATE_REMINDER_FIRST,
      prepaid_card_expiry_date_reminder_second : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_CARD_EXPIRY_DATE_REMINDER_SECOND,
      prepaid_card_expiry_date_reminder_third  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_CARD_EXPIRY_DATE_REMINDER_THIRD,
      prepaid_service_quantity_add         : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_SERVICE_QUANTITY_ADD,
      prepaid_service_quantity_deduction   : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_SERVICE_QUANTITY_DEDUCTION,
      prepaid_service_expiry_date_reminder_first  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_SERVICE_EXPIRY_DATE_REMINDER_FIRST,
      prepaid_service_expiry_date_reminder_second : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_SERVICE_EXPIRY_DATE_REMINDER_SECOND,
      prepaid_service_expiry_date_reminder_third  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_SERVICE_EXPIRY_DATE_REMINDER_THIRD,
      prepaid_card_expiry_date_reminder    : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_CARD_EXPIRY_DATE_REMINDER,
      prepaid_service_expiry_date_reminder : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.PREPAID_SERVICE_EXPIRY_DATE_REMINDER,
      booking: {
        the_day_before : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BOOKING.THE_DAY_BEFORE,
        on_the_day     : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BOOKING.ON_THE_DAY,
        hours_before   : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BOOKING.HOURS_BEFORE,
        registered     : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BOOKING.REGISTERED,
        online_confirm : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BOOKING.ONLINE_CONFIRM,
        canceled       : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BOOKING.CANCELED,
        online_cancel  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_TYPE.BOOKING.ONLINE_CANCEL,
      }
    },
    link_type: MESSAGES_ENUMS.LINK_TYPE,
    sender_phone_certification_type: {
      none: MESSAGES_ENUMS.SENDER_PHONE_CERTIFICATION_TYPE.NONE,
      mobile_phone: MESSAGES_ENUMS.SENDER_PHONE_CERTIFICATION_TYPE.MOBILE_PHONE,
      ars: MESSAGES_ENUMS.SENDER_PHONE_CERTIFICATION_TYPE.ARS,
      document: MESSAGES_ENUMS.SENDER_PHONE_CERTIFICATION_TYPE.DOCUMENT,
    },
    setup_automatic_messaging_samples_code: {
      post_visit : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.POST_VISIT,
      birthday_greetings : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BIRTHDAY_GREETINGS,
      points_add         : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.POINTS_ADD,
      points_deduction   : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.POINTS_DEDUCTION,
      balance_add        : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BALANCE_ADD,
      balance_deduction  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BALANCE_DEDUCTION,
      prepaid_service_quantity_add         : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.PREPAID_SERVICE_QUANTITY_ADD,
      prepaid_service_quantity_deduction   : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.PREPAID_SERVICE_QUANTITY_DEDUCTION,
      prepaid_card_expiry_date_reminder    : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.PREPAID_CARD_EXPIRY_DATE_REMINDER,
      prepaid_service_expiry_date_reminder : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.PREPAID_SERVICE_EXPIRY_DATE_REMINDER,
      booking: {  
        the_day_before : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BOOKING.THE_DAY_BEFORE,
        on_the_day     : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BOOKING.ON_THE_DAY,
        hours_before   : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BOOKING.HOURS_BEFORE,
        registered     : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BOOKING.REGISTERED,
        online_confirm : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BOOKING.ONLINE_CONFIRM,
        canceled       : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BOOKING.CANCELED,
        online_cancel  : MESSAGES_ENUMS.SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE.BOOKING.ONLINE_CANCEL,
      }
    },
    visit_type: {
      by_sales_category : MESSAGES_ENUMS.VISIT_TYPE.BY_SALES_CATEGORY,
      by_sales          : MESSAGES_ENUMS.VISIT_TYPE.BY_SALES
    },
    visit_type_select: [
      { value: MESSAGES_ENUMS.VISIT_TYPE.BY_SALES_CATEGORY, text: 'message-autos.by-sales-category' },
      { value: MESSAGES_ENUMS.VISIT_TYPE.BY_SALES,          text: 'message-autos.by-sales' },
    ],
    visit_count_type: {
      none           : MESSAGES_ENUMS.VISIT_COUNT_TYPE.NONE,
      first_visit    : MESSAGES_ENUMS.VISIT_COUNT_TYPE.FIRST_VISIT,
      re_visit       : MESSAGES_ENUMS.VISIT_COUNT_TYPE.RE_VISIT,
      first_re_visit : MESSAGES_ENUMS.VISIT_COUNT_TYPE.FIRST_RE_VISIT,
    }
  },
  chart_type: {
    line: 1,
    bar: 2,
    bar_line: 3,
    pie: 4
  },
  chart_value: {
    qty   : 1,
    amount: 2
  },
  sharing_goods_type: {
    service: 1,
    product: 2,
    service_or_product: 3
  },
  value_type: {
    percent: 1,
    amount : 2
  },
  goal_calculation_type: {
    daily_basis   : 0,
    monthly_basis : 1
  },
  cid_usage_status:{
    active: CID_USAGE_STATUS.ACTIVE,
    inactive: CID_USAGE_STATUS.INACTIVE
  },
  options_cid_usage_status: [
    { value: CID_USAGE_STATUS.ACTIVE, text: 'general.active' },
    { value: CID_USAGE_STATUS.INACTIVE, text: 'general.inactive' }
  ],

  cid_enum: {
    cid_popup_view: CID_ENUMS.CID_POPUP_VIEW, 
    cid_client_action: CID_ENUMS.CID_CLIENT_ACTION
  },

  client_management: {
    target_type_options: {
      all_clients:                CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.ALL_CLIENTS,
      dormant_clients:            CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.DORMANT_CLIENTS ,
      clients_by_sales_service:   CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_SALES_SERVICE ,
      clients_by_sales_product:   CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_SALES_PRODUCT ,
      clients_by_sales_amount:    CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_SALES_AMOUNT ,
      clients_by_prepaid_cards:   CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_PREPAID_CARDS ,
      clients_by_prepaid_services:CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_PREPAID_SERVICES ,
      birthday_clients:           CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.BIRTHDAY_CLIENTS ,
      recommended_clients:        CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.RECOMMENDED_CLIENTS 
    },
    sales_date_type: {
      all: CLIENT_MANAGEMENT_SALES_DATE_TYPE.ALL,
      date_range: CLIENT_MANAGEMENT_SALES_DATE_TYPE.DATE_RANGE
    },
    recent_visit_date_type: {
      not_visited_more_than: CLIENT_MANAGEMENT_RECENT_VISITED_DATE_TYPE.NOT_VISITED_MORE_THAN,
      visited_for_last: CLIENT_MANAGEMENT_RECENT_VISITED_DATE_TYPE.VISITED_FOR_LAST,
      date_range: CLIENT_MANAGEMENT_RECENT_VISITED_DATE_TYPE.DATE_RANGE
    }
  },

  campaign_management: {
    campaign_type: {
      default: CAMPAIGN_MANAGEMENT_CAMPAIGN_TYPE.DEFAULT,
      add: CAMPAIGN_MANAGEMENT_CAMPAIGN_TYPE.ADD,
      view_target_clients: CAMPAIGN_MANAGEMENT_CAMPAIGN_TYPE.VIEW_TARGET_CLIENTS
    }
  }
}