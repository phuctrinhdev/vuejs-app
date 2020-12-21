import { isNullObject }  from '../../../../helpers/common'
import CalendarCellViewBlock from './calendar-cell-view-block'
export default class CalendarCellBookingViewBlock extends CalendarCellViewBlock{
  constructor(index, booking_id, group_item = null, is_empty_block = true){
    super()
    this.booking_id = booking_id
    this.service = ''
    this.index = index
    this.is_small = false,
    this.is_one_line = false
    this.is_empty_block = is_empty_block
    this.top_position = 0
    this.is_finishing_time = false
    this.has_processing_time = false
    if(!isNullObject(group_item)){
      if(!is_empty_block) this.service = group_item.service_name
      this.ref_booked_item = group_item
    }
  }
  getKey(){
    return 'calendar-cell-view-block-' + this.index + '-' + this.ref_booked_item.booked_item_id
  }
}