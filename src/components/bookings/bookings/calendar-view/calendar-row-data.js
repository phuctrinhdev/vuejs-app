
export default class CalendarRowData {
  constructor(row_index = 0, 
    time = '00:00',
    text = '00:00',
    cross_date = false,
    exceed = false){
    this.row_index        = row_index
    this.time             = time
    this.time_with_second = time + ':00'
    this.text             = text
    this.cross_date       = cross_date
    this.exceed           = exceed
  }
}