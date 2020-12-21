import _ from 'lodash'
import { convertHoursToMinutes, convertHoursToRow, convertMinutesToHours, isNullObject, getTimeInclude24 }  
  from '../../../../helpers/common'
import { options }        from '../../../../helpers/options'
import CalendarCellBlockedTimeViewBlock from './calendar-cell-blocked-time-view-block'
import CalendarCellViewGroup from './calendar-cell-view-group'

let _resized_roll_back_info = null
function _setResizedRollBackInfo(minutes_changed){
  _resized_roll_back_info = {
    minutes_changed: minutes_changed,
  }
}
function _clearResizedRollBackInfo(){
  _resized_roll_back_info = null
}


export default class CalendarCellBlockedTimeViewGroup extends CalendarCellViewGroup{
  constructor(index, 
    booking_setup = null, 
    booking_calendar_setup = null,
    blocked_time = null){
    super()
    this.index                      = index
    this.booking_setup              = booking_setup
    this.booking_calendar_setup     = booking_calendar_setup  
    this.ref_blocked_time           = _.cloneDeep(blocked_time)
    this.blocked_time_id            = 0
    this.changed_blocked_time       = null
    this.to_time_miniutes           = 0
    this.from_time_minutes          = 0
    this.updateInfo()
  }
  canUpdateInfo(){
    return (!(isNullObject(this.booking_setup) ||
    isNullObject(this.booking_calendar_setup) ||
    isNullObject(this.ref_blocked_time)))
  }
  updateInfo(){
    if(this.canUpdateInfo())
    {
      this.blocked_time_id  = this.ref_blocked_time.blocked_time_id
      this.booking_resource_setup_id = this.ref_blocked_time.booking_resource_setup_id
    
      this.view_group_id    = 'blocked-time-' + this.ref_blocked_time.blocked_time_id +
                              '-' + this.booking_resource_setup_id
      this.calendar_date_ts = this.ref_blocked_time.blocked_date_ts
     
      if(this.height <= options.booking.table_cell_height * 0.5 || this.width < 50) this.small = true
      else this.small = false
      //these fields are using to arrange the view group
      this.updateTimeAndRow()
      //adding blocks which are used to render on layout
      this.calculateHeight()
      this.generateViewBlock()
    }
  }
  updateTimeAndRow(){
    this.to_time_miniutes = convertHoursToMinutes(this.ref_blocked_time.to_time)
    this.from_time_minutes = convertHoursToMinutes(this.ref_blocked_time.from_time)
    if(this.to_time_miniutes < this.from_time_minutes)
      this.to_time_miniutes += options.minutes_of_24h
    if(this.ref_blocked_time.is_next_day){
      this.start_time       = getTimeInclude24(this.ref_blocked_time.from_time) 
      this.end_time         = getTimeInclude24(this.ref_blocked_time.to_time)
    }
    else{
      this.start_time       = this.ref_blocked_time.from_time
      if(this.to_time_miniutes >= options.minutes_of_24h)
        this.end_time       = getTimeInclude24(this.ref_blocked_time.to_time)
      else
        this.end_time       = this.ref_blocked_time.to_time
    }
    this.row              = convertHoursToRow(this.start_time, this.booking_setup)
    this.row_end          = convertHoursToRow(this.end_time, this.booking_setup)
  }
  calculateHeight(){
    let duration          =  this.to_time_miniutes - this.from_time_minutes 
    let time_slots        = duration / this.booking_calendar_setup.booking_time_slot
    this.min_height       = (options.booking.booking_min_duration / this.booking_calendar_setup.booking_time_slot) * options.booking.table_cell_height
    this.height           = time_slots * options.booking.table_cell_height - 2

    if(this.height <= 0) this.height = this.min_height
  }
  generateViewBlock(){
    this.blocks           = []
    let block = new CalendarCellBlockedTimeViewBlock(1, this.ref_blocked_time.blocked_time_id)
    block.start_time      = this.start_time
    block.end_time        = this.end_time
    block.row             = this.row
    block.row_end         = this.row_end
    block.height          = this.height
    block.is_next_day     = this.ref_blocked_time.is_next_day
    this.resizable_block  = block
    this.blocks.push(block)
  }
  rollBack(){
    if(!(isNullObject(_resized_roll_back_info))){
      this.updateChangedTime(_resized_roll_back_info.minutes_changed)
      _clearResizedRollBackInfo()
    }
  }
  updateChangedTime(changed_time){
    if(this.canUpdateInfo()){
      _setResizedRollBackInfo(-changed_time)
      this.to_time_miniutes +=  changed_time
      let tmp_to_time_minutes = this.to_time_miniutes
      if(this.to_time_miniutes >= options.minutes_of_24h)
        tmp_to_time_minutes -= options.minutes_of_24h
      this.ref_blocked_time.to_time = convertMinutesToHours(tmp_to_time_minutes)
      this.updateTimeAndRow()
      this.generateViewBlock()
    }
  }
  getChangeBlockedTime(){
    return this.ref_blocked_time
  }
  getKey(){
    return 'calendar-cell-blocked-time-view-block-' + this.index + '-' + this.blocked_time_id
  }
}