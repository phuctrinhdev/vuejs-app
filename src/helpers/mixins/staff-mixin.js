import StaffApi                 from '../../api/staffs/staff-api'
import SalesItemStaffViewModel  from '../../view-model/sales/sales-item/sales-item-staff-view-model.js'
import StaffCache               from '../../helpers/cache/staff-cache'

export default {
  data(){
    return {
      staff_cache : new StaffCache(),
      staff_api   : new StaffApi(),
      staff_filter: {
        shop_id: 0
      }
    }
  },
  created(){
    this.staff_filter.shop_id = this.shop_data.shop_id
  },

  methods: {
    async getStaffsAsyncMixin(){
      return await this.staff_api.getStaffActiveAsync(this.staff_filter)
    },

    async getSalesItemStaffsMixinAsync(){
      let staffs = [] 
      let response = await this.staff_api.getStaffActiveAsync(this.staff_filter)
      if (response.is_ok){
        for(let staff of response.data.items){
          let tmp_staff = new SalesItemStaffViewModel()
          tmp_staff.mapFieldsFromStaffInfo(staff)
          staffs.push(tmp_staff.getFields())
        }
      }else{
        this.showAlert(response.error_messages)
      }
      return staffs
    }
  }
}