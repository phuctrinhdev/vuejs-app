import ViewModel from '../../view-model.js'

export default class SalesItemStaffViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      sales_item_staff_id : 0,
      staff_id            : 0,
      staff_name          : '',
      amount              : 0,
      salary_sales        : 0,
      salary_deduction    : 0,

      // viewing
      selected            : false
    }
  }
  mapFieldsFromApi(api_staff){
    this.fields.sales_item_staff_id = api_staff.salesItemStaffId,
    this.fields.staff_id            = api_staff.staffId,
    this.fields.staff_name          = api_staff.staffName,
    this.fields.amount              = api_staff.amount,
    this.fields.salary_sales        = api_staff.salarySales,
    this.fields.salary_deduction    = api_staff.salaryDeduction
  }
  mapFieldsToApi(ui_staff){
    return {
      salesItemStaffId: ui_staff.sales_item_staff_id,
      staffId         : ui_staff.staff_id,
      staffName       : ui_staff.staff_name,
      amount          : ui_staff.amount,
      salarySales     : ui_staff.salary_sales,
      salaryDeduction : ui_staff.salary_deduction
    }
  }
  mapFieldsFromStaffInfo(staff){
    this.fields.staff_id            = staff.id,
    this.fields.staff_name          = staff.aliasname
  }
  getValidations(){
    let validations = {
      amount: {
        label:'sales.amount',
        rules: {
          numeric: '',
          maxLength: {
            max_value: 12
          } 
        } 
      },
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}