import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import StaffGoalSetupViewModel from '../../view-model/staffs/staff-goal-setup-view-model'

const url_read= getServiceUrl(SERVICE_TYPES.STAFF_STAFF_GOAL_READ, 1)
const url_cmd = getServiceUrl(SERVICE_TYPES.STAFF_STAFF_GOAL_CMD, 1)

let url_read_staff_goal_setup    = url_read + '/StaffGoalSetups'
let url_cmd_staff_goal_setup     = url_cmd  + '/StaffGoalSetup'

export default class StaffGoalSetupApi {
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

  async getStaffGoalSetupAsync(query){
    let params = {
      applyYearMonth: query.apply_year_month,
      shopId        : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_staff_goal_setup, params)
      this.setResult(response,()=>{
        let tmp_vm = new StaffGoalSetupViewModel()
        tmp_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_vm.getFields()
      })
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async addOrUpdateStaffGoalSetupAsync(staff_goal_setup_vm){
    try{
      let tmp_data = staff_goal_setup_vm.mapFieldsToApi()
      let response = await this.http.post(url_cmd_staff_goal_setup, tmp_data)
      this.setResult(response,()=>{
        let tmp_vm = new StaffGoalSetupViewModel()
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