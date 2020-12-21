<template>
  <div class="common-style">
    <b-modal id="modal-working-hour-setup"
             ref="formModal"
             :title="$t('working-hour.workinghour-setup')"
             :no-close-on-backdrop="true"
             hide-footer
             size="md"
             class="modal-add-staffs"
             @show="loadTableData()">   

      <div class="slide-x small">
        <staffs-table :data="table_data">
          <template slot="edit_delete" slot-scope="{ row }">
            <li><a :data="{item: row}" class="btn secondary" @click="onWorkingHourAction(options.form_actions.edit, row, shop_id, staff_id)">{{ $t('general.edit') }}</a></li>
          </template>
        </staffs-table> 
      </div>

      <div class="modal-footer">
        <button class="btn btn-default" @click="onWorkingHourAction(options.form_actions.add)">{{ $t('general.add') }}</button>
        <button class="btn btn-default" @click="onCancel">{{ $t('general.close') }}</button>
      </div>
    </b-modal>

    <!-- modal action -->
    <working-hour-action @submit-working-hour="onUpdatePage"/>
  </div>
</template>


<script>
import working_hour_action from './working-hour-action.vue'
import staffs_table from '../../../components/staffs/staffs-table/staffs-table.vue'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'
import { options } from '../../../helpers/options'
import { mapGetters, mapActions } from 'vuex'
import { formatTime, loadDayOfWeek } from '../../../helpers/common'
import WorkingHoursViewModel from '../../../view-model/staffs/working-hours-view-model.js'

export default {
  components: {
    'working-hour-action': working_hour_action,
    'staffs-table': staffs_table,
    'btn-action-group': btn_action_group,
  },
  extends: component_base,
  data() {
    return {
      options: options,
      table_data: {
        fields: [
          { field: 'start_time',       label: 'working-hour.start',       width: '15%', sortable: false, formatFn: this.loadFormatTime },
          { field: 'finish_time',      label: 'working-hour.finish',      width: '15%', sortable: false, formatFn: this.loadFormatTime },
          { field: 'worked_days_of_week', label: 'working-hour.day-of-week', width: '55%', sortable: false, formatFn: this.loadDayOfWeekCol },
          { field: 'edit_delete', label: 'working-hour.edit-delete', width: '15%', sortable: false, expand: true },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {}
      },
      form_options: {
        delete: false
      },
      workinghour_action: {},
      shop_id: 0,
      staff_id: 0
    }
  },
  computed: {
    ...mapGetters('staff', {
      action_data: 'getStaffWorkingHourSetupAction'
    })
  },
  beforeMount(){
    this.workinghour = new WorkingHoursViewModel()
    this.staff_id = this.action_data.data.id
  },
  mounted(){
    this.shop_id = this.shop_data.shop_id
    this.staff_id = this.action_data.data.id
  },
  methods: {
    ...mapActions('staff', [
      'setStaffWorkingHourActionDataAsync',
      'updateWorkingHourData'
    ]),
    loadTableData(){
      this.workinghour.fields = Object.assign(this.workinghour.fields, this.action_data.data)
      this.staff_id = this.action_data.data.id
      this.table_data.rows= this.workinghour.fields.working_hours
    }, 
    onCancel(){
      this.hideModal()
    }, 
    hideModal(){
      this.hideDialogById('modal-working-hour-setup')
    },
    onWorkingHourAction(action, working_hours = {}, shopId = this.shop_id, staff_id = this.staff_id){
      this.modal_visible = true
      this.workinghour_action = {
        action: action,
        data: working_hours,
        shopId: shopId,
        staff_id: staff_id,
        options: {
          working_days: this.table_data.rows
        }
      }
      this.setStaffWorkingHourActionDataAsync(this.workinghour_action).then(() => {
        this.showDialogById('working-hour-action')
      })
    },
    loadFormatTime(item){ 
      return formatTime(item)
    },
    loadDayOfWeekCol(item){
      return loadDayOfWeek(item)
    },
    onUpdatePage(){
      if(this.table_data.rows.length != this.action_data.data.working_hours.length){
        this.table_data.rows = this.action_data.data.working_hours
      }
    }
  }
}
</script>

<style lang="scss">
@import '../staff-common.scss';
</style>
