import ViewModel from '../../view-model.js'
export default class HistoryBaseViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      id                   : '',
      created_by_name      : '',
      created_by_id        : 0,
      created_date_time_ts : 0,
      invoice_date_time_ts : 0,
      shop_id              : 0     
    }
  }
}