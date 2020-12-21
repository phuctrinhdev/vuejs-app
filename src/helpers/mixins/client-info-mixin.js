import moment                   from 'moment'
import { options }              from '../../helpers/options'
import BookingApi               from '../../api/bookings/booking-api'
import BookingSummaryViewModel  from '../../view-model/bookings/booking-summary-view-model'
import { 
  convertDateToTimezone }       from '../../helpers/common'

export default {
  data(){
    return {
      booking_summary: new BookingSummaryViewModel(),
      bookings_by_client: {},
    }
  },
  methods: {
    async loadBookingsSummaryByClient(client_id){
      let query = {
        client_id: client_id,
        shop_id: this.shop_data.shop_id
      }
      let booking_api = new BookingApi()
      let result = await booking_api.getBookingsSummaryByClient(query)
      if(result.is_ok) 
        this.booking_summary.setFields(result.data)
      else 
        this.showAlert(result.error_messages)
    },
    async loadBookingsByClient(client_id, page = 1){
      let query = {
        type_date: options.type_date.date_range,
        from_booking_date: moment(convertDateToTimezone(new Date(1))).toDate(),
        to_booking_date: moment(convertDateToTimezone(new Date())).add(100, 'years').toDate(),
        name_or_mobile:'' ,
        booking_resource_id: null,
        status: null,
        client_id: client_id,
        booking_source: null,
        asc_ordering: false,
        page_size: options.pagination.small,
        page_number: page,
        shop_id: this.shop_data.shop_id,
        chain_id: this.shop_data.chain_id
      }
      let booking_api = new BookingApi()
      let result = await booking_api.getBookingListAsync(query)
      
      if(result.is_ok)
        this.bookings_by_client = result.data
      else 
        this.showAlert(result.error_messages)
    },
    async onChangePageBookingsByClient(page){
      await this.loadBookingsByClient(this.client.fields.id, page)
    }
  }
}