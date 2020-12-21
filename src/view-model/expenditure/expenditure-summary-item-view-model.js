import ViewModel             from '../view-model'

export default class ExpenditureSummaryItemViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      item_name     : '',
      total_records : 0,
      total_amount  : 0
    }
  }

  mapFieldsFromApi(data){
    this.fields.item_name     = data.itemName
    this.fields.total_records = data.totalRecords
    this.fields.total_amount  = data.totalAmount
  }
  mapFieldsToApi(){
    return {
      itemName    : this.fields.item_name,
      totalRecords: this.fields.total_records,
      totalAmount : this.fields.total_amount
    }
  }
  isValid(){
    let validations = {
      
    }
    return super.isValid(validations)
  }
}
