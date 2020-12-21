export default class CalendarCellViewGroup {
  constructor(){
    this.view_group_id              = ''
    this.index                      = 0
    this.start_time                 = '00:00:00'
    this.end_time                   = '00:00:00'
    this.start_time_minutes         = 0
    this.end_time_minutes           = 0
    this.col_index                  = 0
    this.row_index                  = 0
    this.row                        = 0
    this.row_end                    = 0
    this.height                     = 0
    this.min_height                 = 0
    this.width                      = 0 //it is calculated before rendering based on other duplicated groups
    this.margin_left                = 0 //it is calculated before rendering based on other duplicated groups
    this.booking_setup              = null
    this.booking_calendar_setup     = null
    this.calendar_date_ts           = 0
    this.booking_resource_setup_id  = 0
    this.small                      = false
    this.cross_date                 = false
    this.processed                  = false

    // menu-booking-action position value
    this.menu_left                  = 0
    this.menu_top                   = 0
    this.menu_right_max             = 0
    this.menu_bottom_max            = 0

    //these blocks will be used to check duplication
    this.blocks                     = []
    this.resizable_block            = null
  }
  updateCurrentCellIndexInfo(col_index, row_index){
    this.col_index = col_index
    this.row_index = row_index
  }
  updateCrossDateInfo(cross_date){
    this.cross_date = cross_date
  }
  updateMenuPosition(menu_left, menu_top, menu_right_max, menu_bottom_max){
    this.menu_left        = menu_left
    this.menu_top         = menu_top
    this.menu_right_max   = menu_right_max
    this.menu_bottom_max  = menu_bottom_max
  }
}