import _                     from 'lodash'
// import moment                from 'moment'
// import { common_options }    from '../options/common-options'
import { options }           from '../options'
import { sales_options }     from '../options/sales-options'
// import i18n                  from '../../translate/translate.js'

// import { formatMoney,
//   convertTimeStampToDate }   from '../../helpers/common'

export default class BookingUtils {
  static getBookingStatus(booking_status){
    let booking_status_text = ''
    let tmp_status = _.find(options.booking.option_booking_status, { 'value': booking_status })

    if(tmp_status != undefined)
      booking_status_text = tmp_status.text
      
    return booking_status_text
  }

  static updateStaffsAmountOfSalesItem(staffs, sales_item_amount){
    let split_sales_type        = this.getSplitSalesTypeOfSalesItem(staffs)
    let tmp_staff_amount        = Math.floor(sales_item_amount / staffs.length)
    let tmp_staff_amount_remain = sales_item_amount % staffs.length

    if(split_sales_type == sales_options.split_sales_type.even){
      staffs.map(s => s.amount = tmp_staff_amount)
      if(tmp_staff_amount_remain > 0){
        _.last(staffs).amount += tmp_staff_amount_remain
      }
    }
    if(split_sales_type == sales_options.split_sales_type.user_input){
      let tmp_sales_item_amount_old = staffs.reduce((total, item) => total + item.amount,0)
      for(let i in staffs){
        let staff = staffs[i]
        let tmp_percent_old = staff.amount / tmp_sales_item_amount_old
        staff.amount = Math.floor(sales_item_amount * tmp_percent_old)
        if(i == staffs.length - 1){
          let tmp_sales_item_amount = staffs.reduce((total, item) => total + item.amount,0)
          tmp_staff_amount_remain = sales_item_amount - tmp_sales_item_amount
          staff.amount += tmp_staff_amount_remain
        }
      }
    }
    return staffs
  }
}
