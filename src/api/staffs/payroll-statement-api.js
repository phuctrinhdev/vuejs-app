import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import PayrollStatmentViewModel from '../../view-model/staffs/payroll-statement-view-model'
import { common_options } from '../../helpers/options/common-options'

const url_aggr = getServiceUrl(SERVICE_TYPES.SALES_AGGR, 1)

let url_read_payroll_statement__month      = url_aggr + '/ReportSalaryByMonthFilterReport'
let url_read_payroll_statement__date_range = url_aggr + '/ReportSalaryByDateRangeFilterReport'

export default class PayrollStatementApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  setResult(response, handleMapFieldsFromAPI) {
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    if (response.data.isOK) {
      handleMapFieldsFromAPI()
    }
  }

  async getPayrollStatementAsync(query){
    let params = {
      fromDateTs: query.from_date_ts,
      toDateTs  : query.to_date_ts,
      staffId   : query.staff_id,
      shopId    : query.shop_id
    }
    let url_read_payroll_statement = ''
    if(query.date_type == common_options.date_type.month)
      url_read_payroll_statement = url_read_payroll_statement__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_payroll_statement = url_read_payroll_statement__date_range

    try{
      let response = await this.http.post(url_read_payroll_statement, params)
      this.setResult(response,()=>{
        let tmp_vm = new PayrollStatmentViewModel()
        tmp_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_vm.getFields()
      })
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
