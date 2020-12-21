
export default class CalendarCellData {
  constructor(col_index = 0, 
    row_index = 0,
    exceed_work_hour = false,
    booking_view_groups = [], //array of CalendarCellBookingViewGroup
    blocked_time_view_groups = [] //array of CalendarCellBlockedTimeViewGroup
  ){
    this.col_index = col_index
    this.row_index = row_index
    this.exceed_work_hour = exceed_work_hour
    this.booking_view_groups = booking_view_groups
    this.blocked_time_view_groups = blocked_time_view_groups
  }
  getKey(force_update_cells_key=''){
    //this key is used to re-render the cell on the calendar if it has bookings/blocked-times
    let key =  this.col_index+'-'+this.row_index + '-' + force_update_cells_key
    return key
  }
}