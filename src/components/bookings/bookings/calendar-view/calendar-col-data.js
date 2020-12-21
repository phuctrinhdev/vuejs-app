
export default class CalendarColData {
  constructor(col_index = 0, 
    resource_setup_id = 0,
    booking_date = new Date,
    booking_date_ts = 0,
    booking_date_ts_miliseconds = 0,
    name = '',
    workhour_shop =[],
    workhour_resource =[]){
    this.col_index =  col_index
    this.resource_setup_id =  resource_setup_id
    this.booking_date =  booking_date
    this.booking_date_ts =  booking_date_ts
    this.booking_date_ts_miliseconds =  booking_date_ts_miliseconds
    this.name =  name
    this.workhour_shop =  workhour_shop
    this.workhour_resource =  workhour_resource  
  }
}