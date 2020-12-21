export default class CalendarViewData {
  constructor(booking_setup = null, 
    canbe_displayed_resource_setup_ids =[],
    calendar_dates = [],
    calendar_dates_ts = [],
    calendar_view_mode = 0,
    canbe_displayed_resource_block_mobile = 1){
    this.canbe_displayed_resource_setup_ids = canbe_displayed_resource_setup_ids
    this.calendar_dates = calendar_dates
    this.calendar_dates_ts = calendar_dates_ts
    this.booking_setup = booking_setup
    this.calendar_view_mode = calendar_view_mode
    this.canbe_displayed_resource_block_mobile = canbe_displayed_resource_block_mobile
  }
  getKey(){
    return 'calendar_view_' + this.calendar_dates_ts[0]
  }
  getMaxDisplayedResourcesByDate(date_index){
    let max_resource = 0
    for(let i in this.calendar_dates_ts){
      let resources_of_date = this.canbe_displayed_resource_setup_ids[this.calendar_dates_ts[i]]
      // check resource_of_date by date
      if(this.calendar_dates_ts[i] == this.calendar_dates_ts[date_index]) {
        max_resource = resources_of_date.length
        break
      }
    }
    
    return max_resource
  }
  isShowedSeveralDatesInDailyViewMode(daily_view_mode){
    return this.calendar_view_mode===daily_view_mode
    && this.calendar_dates_ts.length>1
  }
}