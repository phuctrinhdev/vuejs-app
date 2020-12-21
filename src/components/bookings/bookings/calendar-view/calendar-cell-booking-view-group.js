
import _ from 'lodash'
import CalendarCellBookingViewBlock from './calendar-cell-booking-view-block'
import { isNullObject, convertHoursToMinutes, convertMinutesToHours, convertHoursToRow, isOver24Hours, getTimeSubtract24, convertTimeStampToDate, getTimeInclude24 }  from '../../../../helpers/common'
import { options }        from '../../../../helpers/options'
import CalendarCellViewGroup from './calendar-cell-view-group'


let _resized_roll_back_info = null
function _setResizedRollBackInfo(booked_item_id, minutes_changed){
  _resized_roll_back_info = {
    booked_item_id: booked_item_id,
    minutes_changed: minutes_changed,
  }
}
function _clearResizedRollBackInfo(){
  _resized_roll_back_info = null
}

let _moved_roll_back_info = null
function _setMovedRollBackInfo(cross_date, col_index, row_index, booking_resource_setup_id,
  booking_date, booking_date_ts, minutes_changed){
  _moved_roll_back_info = {
    cross_date: cross_date,
    col_index: col_index,
    row_index: row_index,
    booking_resource_setup_id: booking_resource_setup_id,
    booking_date: booking_date,
    booking_date_ts: booking_date_ts,
    minutes_changed: minutes_changed
  }
}
function _clearMovedRollBackInfo(){
  _moved_roll_back_info = null
}

export default class CalendarCellBookingViewGroup extends CalendarCellViewGroup{
  constructor(index, 
    booking_setup = null, 
    booking_calendar_setup = null,
    booking = null, 
    booked_item = null){
    super()
    
    let default_color = ''
    this.index = index
    this.booking_setup = booking_setup
    this.booking_calendar_setup = booking_calendar_setup
    this.booking_id = 0
    this.group_services = ''
    this.group_items = []
    this.ref_booking = _.cloneDeep(booking)
    this.status_name = ''
    this.status_color = default_color
    this.total_duration = 0
    this.icons ={
      repeated: false,
      completed: false,
      confirmed: false,
      star: false,
      client_color: default_color
    }
    this.block_booking_info = {
      height: 0,
      is_small: false,
      is_one_line: false
    }
    if(!isNullObject(booked_item)){
      let tmp_booked_item = _.cloneDeep(booked_item)
      this.group_items.push(tmp_booked_item)
      this.booking_resource_setup_id = tmp_booked_item.booking_resource_setup_id
      this.group_services = tmp_booked_item.service_name
    }
    if(!isNullObject(this.ref_booking)){
      this.booking_id = this.ref_booking.id
      this.view_group_id = 'booking-' + this.booking_id + '-' + this.booking_resource_setup_id
      this.calendar_date_ts = this.ref_booking.booking_date_ts
      this.updateStatusDisplayInfo()
      this.updateIconDisplayInfo()
    }
  }
  updateStatusDisplayInfo(){
    for(let status in options.booking.option_booking_status){
      let opt = options.booking.option_booking_status[status]
      if(this.ref_booking.status === opt.value){
        this.status_name = opt.text
        this.status_color = opt.color
        break
      }
    }
  }
  updateIconDisplayInfo(){
    this.icons.repeated = this.ref_booking.original_booking_id != null ? true : false
    this.icons.completed = this.ref_booking.status == options.booking.booking_status.completed ? true : false
    this.icons.confirmed = this.ref_booking.confirmed
    this.icons.star = this.ref_booking.is_vip
    if(this.ref_booking.display_color !== options.booking.booking_client_color.none){
      for(let color in options.booking.booking_client_color_options){
        let opt = options.booking.booking_client_color_options[color]
        if(this.ref_booking.display_color === opt.id) {
          this.icons.client_color = opt.color
          break
        }
      }
    }
  }
  
  generateViewBlocks(){
    let blocks = []
    let tmp_duration = 0
    let block_index = 0
    for(let ii in this.group_items){
      let item = this.group_items[ii]
      block_index++
      // view processing-time: spit group to many blocks when it has processing-time
      let block_estimated_time = new CalendarCellBookingViewBlock(block_index, this.booking_id, item, true)
      let tmp_start_time = item.start_time
      if(item.is_next_day) tmp_start_time = getTimeInclude24(tmp_start_time)
      let tmp_start_time_minutes_estimate = convertHoursToMinutes(tmp_start_time) 
      
      let tmp_end_time_minutes_estimate = tmp_start_time_minutes_estimate + item.estimated_time
      block_estimated_time.top_position = (tmp_duration / this.booking_calendar_setup.booking_time_slot) * options.booking.table_cell_height
      
      //change start_time to correct format of hour
      block_estimated_time.start_time = convertMinutesToHours(tmp_start_time_minutes_estimate)
      block_estimated_time.end_time = convertMinutesToHours(tmp_end_time_minutes_estimate)
      this.calculateViewBlockRow(block_estimated_time)
      block_estimated_time.height = (item.estimated_time / this.booking_calendar_setup.booking_time_slot) * options.booking.table_cell_height
      this.updateViewBlockSize(block_estimated_time)
      block_estimated_time.is_next_day = item.is_next_day
      blocks.push(block_estimated_time)
      
      if(item.finishing_time > 0) {
        block_index++
        let block_finishing_time =  new CalendarCellBookingViewBlock(block_index, this.booking_id, item)
        block_finishing_time.top_position = ((tmp_duration + item.estimated_time + item.processing_time) / this.booking_calendar_setup.booking_time_slot) * options.booking.table_cell_height
        block_finishing_time.height = (item.finishing_time / this.booking_calendar_setup.booking_time_slot) * options.booking.table_cell_height
        let tmp_start_time_hour_finishing = convertMinutesToHours(tmp_end_time_minutes_estimate + item.processing_time)
        let tmp_end_time_hour_finishing = convertMinutesToHours(tmp_end_time_minutes_estimate + item.processing_time + item.finishing_time)
        block_finishing_time.start_time = tmp_start_time_hour_finishing
        block_finishing_time.end_time = tmp_end_time_hour_finishing
        this.calculateViewBlockRow(block_finishing_time)
        block_finishing_time.is_next_day = item.is_next_day
        block_finishing_time.is_finishing_time = true
        if(item.processing_time > 0) {
          block_finishing_time.has_processing_time = true
          let prev_block = _.last(blocks)
          prev_block.height -= 2 
        }
        blocks.push(block_finishing_time)
      }
      tmp_duration += item.estimated_time + item.processing_time + item.finishing_time
    }
    
    this.total_duration = tmp_duration
    return blocks
  }
  calculateViewBlockRow(block){
    block.row     = Math.floor(convertHoursToRow(block.start_time, this.booking_setup))
    block.row_end = convertHoursToRow(block.end_time, this.booking_setup)
  }
  updateViewBlockSize(block){
    let view_height = block.height
    if(block.index == -1) view_height += 5 // trigger ui can view content

    if(view_height <= options.booking.table_cell_height * 0.5) block.is_small = true
    else block.is_small = false
    
    if(view_height > options.booking.table_cell_height * 0.5 && view_height <= options.booking.table_cell_height)
      block.is_one_line = true
    else block.is_one_line = false
  }

  updateChangedTimeToBookedItem(booked_items, changed_booked_item_id, changed_time){
    for(let i in booked_items){
      let item = booked_items[i]
      if(item.booked_item_id === changed_booked_item_id){
        //only update finishing_time if this booking requires processing time
        if(item.finishing_time > 0 || item.processing_time > 0) {
          item.finishing_time += changed_time
          if(item.finishing_time < 0) item.finishing_time = 0
        }
        else //update estimated_time
          item.estimated_time += changed_time
        break
      }
    }
  }
  updateStartTimeToBookedItem(booked_items, new_booking_resource_setup_id, minutes_changed){
    for(let j in booked_items){
      let booked_item = booked_items[j]
      booked_item.booking_resource_setup_id = new_booking_resource_setup_id
      let start_time_minutes = convertHoursToMinutes(booked_item.start_time)
      let new_start_time_minutes = start_time_minutes + minutes_changed
      //from next day to to day
      if((_moved_roll_back_info.cross_date &&  !this.cross_date) ||
         (booked_item.is_next_day))
        new_start_time_minutes += options.minutes_of_24h

      if(new_start_time_minutes >= options.minutes_of_24h){
        booked_item.is_next_day = true
        new_start_time_minutes -= options.minutes_of_24h
      }
      else
        booked_item.is_next_day = false
      booked_item.start_time = convertMinutesToHours(new_start_time_minutes)
    }
  }
  
  updateWithMovedInformation(cross_date, new_col_index, new_row_index, new_booking_resource_setup_id, 
    new_booking_date, new_booking_date_ts, minutes_changed){
    _setMovedRollBackInfo(this.cross_date, this.col_index, this.row_index, this.booking_resource_setup_id,
      this.ref_booking.booking_date, this.calendar_date_ts, -minutes_changed)
    this.booking_resource_setup_id = new_booking_resource_setup_id
    this.booking
    this.calendar_date_ts = new_booking_date_ts
    this.col_index = new_col_index
    this.row_index = new_row_index
    this.cross_date = cross_date
    this.updateStartTimeToBookedItem(this.group_items, new_booking_resource_setup_id, minutes_changed)
    this.updateViewBlocks()
  }
  updateChangedTime(changed_booked_item_id, changed_time){
    _setResizedRollBackInfo(changed_booked_item_id, -changed_time)
    
    //update changed information to validate
    this.updateChangedTimeToBookedItem(this.group_items, changed_booked_item_id, changed_time)
    this.updateViewBlocks()
  }
  rollBack(){
    if(!isNullObject(_moved_roll_back_info)){
      this.updateWithMovedInformation(_moved_roll_back_info.cross_date, _moved_roll_back_info.col_index, _moved_roll_back_info.row_index, 
        _moved_roll_back_info.booking_resource_setup_id, _moved_roll_back_info.booking_date, _moved_roll_back_info.booking_date_ts, _moved_roll_back_info.minutes_changed)
      _clearMovedRollBackInfo()
    }
    if(!(isNullObject(_resized_roll_back_info))){
      this.updateChangedTime(_resized_roll_back_info.booked_item_id, _resized_roll_back_info.minutes_changed)
      _clearResizedRollBackInfo()
    }
  }
  clearRollBackInfo(){
    _clearMovedRollBackInfo()
    _clearResizedRollBackInfo()
  }
  //only use this method when we added all necessary booked_items (group_items)
  updateViewBlocks(){
    let blocks = this.generateViewBlocks()
    this.blocks = []
    if(blocks.length>0){
      let blocks_length = blocks.length
      let last_block = blocks[blocks_length-1]
      this.start_time =  blocks[0].start_time
      this.start_time_minutes = convertHoursToMinutes(blocks[0].start_time)
      this.row = blocks[0].row
      
      this.time_slots = this.total_duration / this.booking_calendar_setup.booking_time_slot
      this.end_time = last_block.end_time
      this.end_time_minutes = convertHoursToMinutes(last_block.end_time)
      this.row_end = last_block.row_end
      //only last block can be resizable
      this.resizable_block = last_block
      this.resizable_block.height -= 2
      this.resizable_block.min_height = (options.booking.booking_min_duration / this.booking_calendar_setup.booking_time_slot) * options.booking.table_cell_height
      if(blocks_length>1){
        blocks[0].is_empty_block = false
        for(let j=0; j<blocks_length-1; j++)
          this.blocks.push(blocks[j])
      }
      else
        this.resizable_block.is_empty_block = false
     
      // style
      this.height = this.time_slots * options.booking.table_cell_height - 1
      if(this.height <= options.booking.table_cell_height * 0.5 || this.width < 50) this.small = true
      else this.small = false

      this.z_index = 1
      
      // view booking info on view-group
      this.block_booking_info.height = this.calculateBookingInfoHeight(this.blocks, this.resizable_block, 0)
      this.updateViewBlockSize(this.block_booking_info)
    }
  }
  calculateBookingInfoHeight(blocks, resizable_block, resizing_height = 0){
    let all_blocks = blocks.concat(resizable_block)
    let index_last_block_view_booking_info = 0
    let tmp_booking_info_height = 0
    for(let i in all_blocks){
      let block = all_blocks[i]
      index_last_block_view_booking_info = block.index
      if(i == 0) {
        tmp_booking_info_height = block.height
      }
      else {
        if(block.is_empty_block && block.start_time == blocks[i - 1].end_time){
          tmp_booking_info_height += block.height
        }
        else break
      }
    }
    
    // change height when resizing
    if(resizing_height > 0 && index_last_block_view_booking_info == resizable_block.index){
      tmp_booking_info_height = tmp_booking_info_height - resizable_block.height + resizing_height
    }
    return tmp_booking_info_height - 5 // 5px for resize trigger ui
  }
  getChangedBooking(){
    let changed_booking = _.cloneDeep(this.ref_booking)
    for(let i in changed_booking.booked_items){
      let existed = _.find(this.group_items, {booked_item_id: changed_booking.booked_items[i].booked_item_id})
      if(existed)
        changed_booking.booked_items[i] = Object.assign(changed_booking.booked_items[i], existed)
      
      if(isOver24Hours(changed_booking.booked_items[i].start_time)){
        changed_booking.booked_items[i].start_time = getTimeSubtract24(changed_booking.booked_items[i].start_time)
      }
    }
    changed_booking.booking_date_ts = this.calendar_date_ts
    changed_booking.booking_date = convertTimeStampToDate(this.calendar_date_ts, true)
    return changed_booking
  }
  addItem(booked_item){
    let tmp_booked_item = _.cloneDeep(booked_item)
    this.group_items.push(tmp_booked_item)
    this.group_services += ' / ' + tmp_booked_item.service_name
  }
  getKey(){
    return 'calendar-cell-booking-view-group-' + this.index + '-' + this.booking_id
  }
}