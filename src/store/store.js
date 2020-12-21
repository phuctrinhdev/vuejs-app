import vue  from 'vue'
import vuex from 'vuex'

// goods
import product_category from './goods/product-category'
import product          from './goods/product'
import service_category from './goods/service-category'
import service          from './goods/service'
import prepaid_service  from './goods/prepaid-service'
import prepaid_card     from './goods/prepaid-card'
import packages         from './goods/packages'

// bookings
import booking                from './bookings/booking'
import booking_cancel         from './bookings/booking-cancel'
import opening_hours          from './bookings/opening-hours'
import booking_resources      from './bookings/booking-resources'
import booking_item           from './bookings/booking-item'
import booking_calendar_setup from './bookings/booking-calendar-setup'
import booking_online_setup   from './bookings/booking-online-setup'
import booking_deposit        from './bookings/booking-desposit'
import blocked_time           from './bookings/blocked-time'
import waiting                from './bookings/waiting'

// clients
import client_group           from './clients/client-group'
import client_rating          from './clients/client-rating'
import client_referralsource  from './clients/client-referralsource'
import client                 from './clients/client'
import client_photo           from './clients/client-photo'
import client_family          from './clients/client-family'
import client_management      from './clients/client-management'

// campaigns
import campaign                 from './campaigns/campaign'

// staffs
import staff                  from './staffs/staff'

// sales
import sales                  from './sales/sales'
import refund                 from './sales/refund'
import payment_method         from './sales/payment-method'
import sales_type             from './sales/sales-type'
import discount_category      from './sales/discount-category'
import sales_prepaid_card     from './sales/sales-prepaid-card'
import sales_prepaid_services from './sales/sales-prepaid-services'
import sales_client_account   from './sales/sales-client-account'
import sales_prepaid_card_history    from './sales/sales-prepaid-card-history'
import sales_prepaid_service_history from './sales/sales-prepaid-service-histories'

// inventory
import supplier               from './inventory/supplier'
import receiving              from './inventory/receiving'
import stock_internal_use     from './inventory/stock-internal-use'
import stock_safety           from './inventory/stock-safety'
import stock_adjustment       from './inventory/stock-adjustment'

// expenditure
import expenditure_item       from './expenditure/expenditure-item'
import expenditure_history    from './expenditure/expenditure-history'

// account
import shop                   from './account/shop'
import user_account           from './account/user-account'
import cid                    from './account/cid'
import mac_address            from './account/mac-address'
import cid_receving_history from './account/cid-receiving-history'
import payment                from './account/payment'

// boards
import board  from './boards/board'
import notice from './boards/notice'
import manual from './boards/manual'

// messages
import client_message_history from './messages/client-message-history'
import text_message           from './messages/text-message'

// message-autos
import setup_automatic_messaging        from './message-autos/setup-automatic-messaging'
import message_setup_post_visit_general from './message-autos/message-setup-post-visit-general'

// home
import home                   from './home'

// common
import alert                  from './common/alert'
import footer_block           from './common/footer-block'
import header_block           from './common/header-block'
import menu                   from './common/menu'
import notification           from './common/notification'
import translate              from './common/translate'
import user                   from './common/user'

vue.use(vuex)

export default new vuex.Store({
  modules: {
    // goods
    packages,
    prepaid_card,
    prepaid_service,
    product_category,
    product,
    service_category,
    service,

    // bookings
    booking,
    booking_cancel,
    opening_hours,
    booking_resources,
    booking_item,
    booking_calendar_setup,
    booking_online_setup,
    booking_deposit,
    blocked_time,
    waiting,

    // clients
    client_group,
    client_rating,
    client_referralsource,
    client,
    client_photo,
    client_family,
    client_management,

    // campaigns
    campaign,

    // sales
    sales,
    refund,
    payment_method,
    sales_type,
    discount_category,
    sales_prepaid_card,
    sales_prepaid_card_history,
    sales_prepaid_service_history,
    sales_prepaid_services,
    sales_client_account,

    // inventory
    supplier,
    receiving,
    stock_internal_use,
    stock_safety,
    stock_adjustment,

    // expenditure
    expenditure_item,
    expenditure_history,

    // staffs
    staff,

    // account
    shop,
    user_account,
    cid,
    cid_receving_history,
    payment,

    // board
    board,
    notice,
    manual,

    // messages
    client_message_history,
    text_message,

    // message autos
    setup_automatic_messaging,
    message_setup_post_visit_general,

    // home
    home,

    // common
    alert,
    footer_block,
    header_block,
    menu,
    notification,
    translate,
    user,
    mac_address
  }
})
