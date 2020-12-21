import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import StaffGoalManagementViewModel from '../../view-model/staffs/staff-goal-management-view-model'

const url_read = getServiceUrl(SERVICE_TYPES.STAFF_STAFF_GOAL_READ, 1)

let url_read_staff_goal_management = url_read + '/StaffGoalManagement'

export default class StaffGoalManagementApi {
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

  async getStaffGoalManagementAsync(query){
    let params = {
      fromDateTs              : query.from_date_ts,
      toDateTs                : query.to_date_ts,
      staffId                 : query.staff_id,
      prepaidSalesCountingType: query.prepaid_sales_counting_type,
      excludePointDeduction   : query.exclude_point_deduction,
      goalCalculationType     : query.goal_calculation_type,
      includeService          : query.include_service,
      includeProduct          : query.include_product,
      includePrepaidCard      : query.include_prepaid_card,
      includePrepaidService   : query.include_prepaid_service,
      shopId                  : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_staff_goal_management, params)
      this.setResult(response,()=>{
        if(response.data.result && response.data.result.staffGoalManagements){
          let tmp_staff_goals = []
          
          for(let item of response.data.result.staffGoalManagements){
            let tmp_item = new StaffGoalManagementViewModel()
            tmp_item.mapFieldsFromApi(item)
            tmp_staff_goals.push(tmp_item.getFields())
          }
          
          this.result.data = tmp_staff_goals
        }
      })
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}