import CalendarCellViewBlock from './calendar-cell-view-block'
export default class CalendarCellBlockedTimeViewBlock extends CalendarCellViewBlock{
  constructor(index, blocked_time_id){
    super()
    this.index = index
    this.blocked_time_id = blocked_time_id
  }
 
  getKey(){
    return 'calendar-cell-block-time-view-block-' + this.index + '-' + this.blocked_time_id
  }
}