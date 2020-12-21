import ViewModel from '../../view-model'

export default class BookingTotalViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      total: 0,
      canceles: 0,
      no_show: 0,
      upcoming_booking: 0
    }
  }

  mapFieldsFromApi(api_data){
    this.fields.total            = api_data.total
    this.fields.canceles         = api_data.canceled
    this.fields.no_show          = api_data.noShow
    this.fields.upcoming_booking = api_data.upcoming
  }
}