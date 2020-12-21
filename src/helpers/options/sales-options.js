/*
    This file just contains enum , options , contains for Sales Part.
    Please follow naming convention :
    - Enum type :  <name>_<enum>.
    - Constants :  <uppercase_name>.
    - Session : <name>_<session>
 */

export const sales_options = {
  sales_status: {
    completed : 1,
    deleted   : 2,
    edited    : 3
  },
  sales_status_type : [
    { value: 1,  text: 'sales.completed'},
    { value: 2,  text: 'sales.deleted'},
    { value: 3,  text: 'sales.edited'}
  ],
  sales_ref_type: {
    sales: 1,
    refund: 2,
    outstanding_payment: 3
  },
  sales_goods_type: {
    product         : 1,
    service         : 2,
    prepaid_service : 3,
    prepaid_card    : 4,
    package         : 5,
    deduct_prepaid_service    : 6,
    sale_prepaid_service      : 7,
    customize_prepaid_service : 8
  },
  sales_item_action_type: {
    discount_action: 1,
    staff_action: 2,
    sales_type_action: 3,
    deduction_point_action: 4,
    balance_deduction_action: 5,
    amount: 6
  },
  refund_item_action_type: {
    staff_action: 1
  },
  split_sales_type: {
    even: 1,
    user_input: 2
  },
  discount_type: {
    percentage: 1,
    amount: 2
  },
  gift_card_type: {
    none   : 0,
    sales  : 1,
    redeem : 2
  },
  deduction_type: {
    none            : 0,
    prepaid_card    : 1,
    prepaid_service : 2
  },
  calculator_type: {
    sales_payment: 1,
    sales_deduction_points: 2,
    sales_deduction_balance: 3,
    sales_item_deduction_points: 4,
    sales_item_deduction_balance: 5,
    sales_item_amount: 6
  },
  omit_staff_type_enum: {
    allow: 1,
    not_allow: 2
  },
  discount_input_default_window_type_enum: {
    number_keypad: 1,
    discount_category: 2
  },
  client_sales_information_default_type_enum: {
    sales_history: 1,
    bookings: 2,
    prepaid_cards: 3,
    prepaid_services: 4,
    messages: 5,
    photos: 6
  },
  security_level_enum: {
    staff_or_higher: 1,
    manager_or_higher: 2,
    master: 3
  },
  prepaid_card_type: {
    all          : -1,
    none         : 0,
    deposit_card : 1,
    discount_card: 2
  },
  prepaid_card_history_type_enum: {
    sales: 1,
    sales_edited: 2,
    sales_deleted: 3,
    deduction: 4,
    deduction_deleted: 5,
    refund: 6,
    refund_deleted: 7,
    refund_by_balance: 8,
    refund_by_balance_deleted: 9,
    balance_move_in: 10,
    balance_move_out: 11,
    balance_edited: 12,
    expiry_date_edited: 13
  },
  prepaid_service_history_type_enum : {
    sales : 1,
    sales_edited : 2,
    sales_deleted : 3,
    deduction : 4,
    deduction_deleted : 5,
    refund : 6,
    refund_deleted : 7,
    quantity_edit : 8,
    expiry_date_edit : 9
  },
  client_tabs_type_enum : {
    sales_history : 1,
    bookings : 2,
    prepaid_cards : 3,
    prepaid_cards_history : 4,
    prepaid_services : 5,
    prepaid_services_history : 6,
    messages : 7,
    photos : 8
  },
  outstanding_history_type_enum : {
    sales : 1,
    sales_edited : 2,
    sales_deleted : 3,
    outstanding_payment : 4,
    outstanding_payment_deleted : 5,
    edited : 6
  },
  balance_point_edit_history_type_enum : {
    card_balance        : 1,
    card_expire_date    : 2,
    service_quantity    : 3,
    service_expire_date : 4,
    client_point        : 5,
    family_point        : 6
  },
  client_points_history_type_enum : {
    sales                       : 1,
    sales_edited                : 2,
    sales_deleted               : 3,
    deduction                   : 4,
    deduction_deleted           : 5,
    refund                      : 6,
    refund_deleted              : 7,
    outstanding_payment         : 8,
    outstanding_payment_deleted : 9,
    added_to_family             : 10,
    manual_edited               : 11,
    recommendation              : 12,
    departed_from_family        : 13
  },
  family_points_history_type_enum : {
    sales                       : 1,
    sales_edited                : 2,
    sales_deleted               : 3,
    deduction                   : 4,
    deduction_deleted           : 5,
    refund                      : 6,
    refund_deleted              : 7,
    outstanding_payment         : 8,
    outstanding_payment_deleted : 9,
    added_from_client           : 10,
    manual_edited               : 11,
    recommendation              : 12
  },
  report_goods_type_enum : {
    product : 1,
    service : 2,
    prepaidService : 3,
    prepaidCard : 4,
    total : 5
  },
  report_payment_type_enum : {
    payment_method : 1,
    outstanding : 2,
    total : 3
  },
  report_real_revenue_type_enum : {
    sales : 1,
    balance_deduction : 2,
    service_deduction : 3,
    total : 4,
    number_of_sales : 5,
    price_per_sales : 6
  },

  report_goods_type : [
    {value: 1, text: 'report.product'},
    {value: 2, text: 'report.service'},
    {value: 3, text: 'report.prepaid-service'},
    {value: 4, text: 'report.prepaid-cards'},
    {value: 5, text: 'general.total'}
  ],
  report_real_revenue_type : [
    {value: 1, text: 'sales.sales'},
    {value: 2, text: 'report.balance-deduction'},
    {value: 3, text: 'report.service-deduction'},
    {value: 4, text: 'general.total'},
    {value: 5, text: 'report.number-of-sales'},
    {value: 6, text: 'report.price-per-sales'}
  ],

  prepaid_service_history_type:[
    {value: 1, text: 'prepaid_service_history_type.sales'},
    {value: 2, text: 'prepaid_service_history_type.sales-edited'},
    {value: 3, text: 'prepaid_service_history_type.sales-deleted'},
    {value: 4, text: 'prepaid_service_history_type.deduction'},
    {value: 5, text: 'prepaid_service_history_type.deduction-deleted'},
    {value: 6, text: 'prepaid_service_history_type.refund'},
    {value: 7, text: 'prepaid_service_history_type.refund-deleted'},
    {value: 8, text: 'prepaid_service_history_type.quantity-edit'},
    {value: 9, text: 'prepaid_service_history_type.expiry-date-edit'}
  ],
  prepaid_card_history_type: [
    { value: 1,  text: 'prepaid-card-history-type.sales' },
    { value: 2,  text: 'prepaid-card-history-type.sales-edited' },
    { value: 3,  text: 'prepaid-card-history-type.sales-deleted' },
    { value: 4,  text: 'prepaid-card-history-type.deduction' },
    { value: 5,  text: 'prepaid-card-history-type.deduction-deleted' },
    { value: 6,  text: 'prepaid-card-history-type.refund' },
    { value: 7,  text: 'prepaid-card-history-type.refund-deleted' },
    { value: 8,  text: 'prepaid-card-history-type.refund-by-balance' },
    { value: 9,  text: 'prepaid-card-history-type.refund-by-balance-deleted' },
    { value: 10, text: 'prepaid-card-history-type.balance-move-in' },
    { value: 11, text: 'prepaid-card-history-type.balance-move-out' },
    { value: 12, text: 'prepaid-card-history-type.balance-edited' },
    { value: 13, text: 'prepaid-card-history-type.expiry-date-edited' }
  ],
  outstanding_history_type : [
    { value: 1, text: 'outstanding-history-type.sales' },
    { value: 2, text: 'outstanding-history-type.sales-edited' },
    { value: 3, text: 'outstanding-history-type.sales-deleted' },
    { value: 4, text: 'outstanding-history-type.outstanding-payment' },
    { value: 5, text: 'outstanding-history-type.outstanding-payment-deleted' },
    { value: 6, text: 'outstanding-history-type.edited' }
  ],

  prepaid_card_update_type: {
    balance: 1,
    expiry_date: 2
  },
  prepaid_service_update_type:{
    remaining : 1,
    expiry_date : 2
  },
  balance_point_edit_history_search_type : {
    all : 0,
    prepaid_card_balance : 1,
    prepaid_card_expire_date : 2,
    prepaid_service_quantity : 3,
    prepaid_service_expire_date : 4,
    loyalty_point : 5  
  },

  NUMBER_OF_DATE: 30,
  NUMBER_OF_HOURS: 24,
  NOT_LIMIT : -1,

  sale_report_invoices_date_range_a_manager_can_search: {
    forty_five_days: 45,
    sixty_days: 60,
    ninety_days: 90,
  },
  edited_item_search_type : {
    all : 0,
    prepaid_card_balance : 1,
    prepaid_card_expire_date : 2,
    prepaid_service_quantity : 3,
    prepaid_service_expire_date : 4,
    loyalty_point : 5  
  },
  max_value_goods_id: 2147483647,
  prepaid_sales_counting_type: {
    sold: 0,
    used: 1
  },
  display_item_type: {
    all           : 0,
    service       : 1,
    product       : 2,
    prepaid_card   : 3,
    prepaid_service: 4
  },
  report_by_type: {
    product         : 0,
    product_category: 1,
    staff           : 2 
  },
  report_by_type_of_service_sales: {
    staff         : 1,
    category      : 2,
    service       : 3,
    day_of_week   : 4,
    hour_of_day   : 5,
    client_rating : 6,
    sex           : 7,
    sales_type    : 8
  }
}