import BaseCache           from './base-cache'
import { options }         from '../options'
import StaffApi            from '../../api/staffs/staff-api'
import PayrollSetupApi     from '../../api/staffs/payroll-setup-api'

export default class StaffCache extends BaseCache {
  constructor() {
    super()
  }

  async getCacheStaffs(shop_id) {
    let cache_key = options.sessions.staffs.key
    let staffs = this.getCache(cache_key, shop_id)
    if(staffs == null || staffs == undefined){
      let query = {
        shop_id: shop_id
      }
      let staff_api = new StaffApi() 
      let result = await staff_api.getStaffActiveAsync(query)
      if(result.is_ok) {
        staffs = result.data.items
        this.setCache(
          cache_key,
          staffs,
          options.sessions.staffs.expire_time,
          shop_id
        )
      }
    }
    return staffs
  }

  static clearCacheStaffs() {
    sessionStorage.removeItem(options.sessions.staffs.key)
  }

  async getCacheStaffPayrollSetup(shop_id) {
    let cache_key = options.sessions.staff_payroll_setup.key
    let staff_payroll_setup = this.getCache(cache_key, shop_id)
    if(staff_payroll_setup == null || staff_payroll_setup == undefined){
      let payroll_setup_api = new PayrollSetupApi() 
      let result = await payroll_setup_api.getPayrollSetupAsync(shop_id)
      if(result.is_ok) {
        staff_payroll_setup = result.data
        this.setCache(
          cache_key,
          staff_payroll_setup,
          options.sessions.staff_payroll_setup.expire_time,
          shop_id
        )
      }
    }
    return staff_payroll_setup
  }

  static clearCacheStaffPayrollSetup() {
    sessionStorage.removeItem(options.sessions.staff_payroll_setup.key)
  }
}