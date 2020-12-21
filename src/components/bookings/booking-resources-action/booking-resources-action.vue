<template>
  <div class="action-booking-resources-wrapper"> 
    <b-modal id="action-booking-resources-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer  
             class="action-booking-resources-modal"
             @show="onLoadForm()">
      <form class="form-wrapper">
        <div class="row form-group" >
          <div class="col-12 col-sm-4" >  
            <label>{{ $t('booking-resources.resource-type') }}</label>
          </div> 
          <div class="col-12 col-sm-8">
            <radio-group v-model="booking_resources.fields.resource_type" :options="options.option_resource_type" :buttons="true"
                         @input="onInputResourceType"/>
          </div> 
        </div> 
        <div class="row form-group resource-name">
          <div class="col-12 col-sm-4" >  
            <label class="require">{{ $t('booking-resources.resource-name') }}</label>
          </div> 
          <div class="col-12 col-sm-5" >  
            <b-form-input v-model="booking_resources.fields.resource_name" type="text"/>
          </div> 
          <div v-if="booking_resources.fields.resource_type == options.resource_type.staff" class="col-12 offset-sm-4 col-sm-5" > 
            <b-form-select v-model="booking_resources.fields.resource_id" :placeholder="$t('booking-resources.resource')"
                           :options="staff_options" value-field="id" text-field="aliasname"
                           @change="onSelectStaff"/></div> 
        </div> 
        <div class="row form-group" >
          <div class="col-12 col-sm-4" >  
            <label>{{ $t('booking-resources.allow-online-booking') }}</label>
          </div> 
          <div class="col-12 col-sm-8" >   
            <radio-group v-model="booking_resources.fields.allow_online_booking" :options="options.option_yes_no" :buttons="true"/>
          </div> 
        </div> 
        <div class="row form-group">
          <div class="col-12 col-sm-4">
            <label>{{ $t('general.status') }}</label>
          </div> 
          <div class="col-12 col-sm-8">
            <radio-group v-model="booking_resources.fields.status" :options="options.option_goods_status" :buttons="true"/> 
          </div> 
        </div>
        <div class="row form-group">
          <div class="col-12 opening-hours-part">
            <div class="part-title clearfix">
              <div class="title">{{ $t('booking-opening-hours.opening-hours') }}</div>
              <ul class="btn-group clearfix">
                <li><button :disabled="booking_resources.fields.working_hours_are_same_as_salon" type="button" class="btn" 
                            @click="onActionOpeningHours(options.form_actions.add)">{{ $t('general.add') }}</button></li>
              </ul>
            </div> 
            <div class="form-group "> 
              <div class="col-md-12" >   
                <b-form-checkbox v-model="booking_resources.fields.working_hours_are_same_as_salon" :value="true">{{ $t('booking-resources.same-as-salon-opening-hours') }}</b-form-checkbox>
              </div> 
            </div> 
            <!-- table data -->
            <view-table :data="table_data_opening_hour">
              <!-- table rows -->
              <template slot="finish_time" slot-scope="{ props, row }">
                <span v-if="row.start_time > row.finish_time">{{ $t('booking-resources.next-day') }}</span> {{ props.formattedRow.finish_time }} 
              </template>
              <template slot="day_of_week" slot-scope="{ row, props }"> 
                {{ props.formattedRow.retail_price }}
              </template>
              <!-- table rows -->
              <template slot="edit" slot-scope="{ row }">
                <button :disabled="booking_resources.fields.working_hours_are_same_as_salon" type="button" class="btn" 
                        @click="onActionOpeningHours(options.form_actions.edit, row)">{{ $t('general.edit') }}</button>
              </template>
            </view-table>
          </div>
        </div>
      </form> 

      <error-box :errors="booking_resources_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" 
                          @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
      </div>
    </b-modal>

    <opening-hours-resource @update-success="onUpdateOpeningHoursSuccess"/> 
  </div>
</template>

<script>
// import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { options } from '../../../helpers/options'  
import BookingResourcesViewModel from '../../../view-model/bookings/booking-resources-view-model.js'
import BookingResourcesApi from '../../../api/bookings/booking-resources-api.js'
import staff_mixin from '../../../helpers/mixins/staff-mixin'

import { formatTime, loadDayOfWeek } from '../../../helpers/common'
import view_table from '../../common/view-table/view-table'
import opening_hours_resource from '../opening-hours-resource/opening-hours-resource.vue' 
import radio_group from '../../common/form/radio/radio-group/radio-group' 
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'
import OpeningHoursViewModel from '../../../view-model/bookings/opening-hours-view-model.js' 

export default {
  components: {  
    'opening-hours-resource': opening_hours_resource, 
    'view-table': view_table,
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  mixins: [staff_mixin],
  data(){
    return {
      options, 
      
      staff_options:[],
      booking_resources: {},
      
      table_data_opening_hour: {
        fields: [
          { field: 'start_time',          label: 'booking-opening-hours.start',         width: '15%', sortable: false, formatFn: this.loadFormatTime  },
          { field: 'finish_time',         label: 'booking-opening-hours.finish',        width: '15%', sortable: false, expand: true, formatFn: this.loadFormatTime  },
          { field: 'opened_days_of_week', label: 'booking-opening-hours.day-of-week',   width: '60%', sortable: false, formatFn: this.loadDayOfWeekCol },
          { field: 'edit',                label: '',                                    width: '10%', sortable: false, expand: true }
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        },
      },
      data_opening_hour:{
        data :{ 
          fields:{}
        }
      },
      
      form_options: {
        delete: false
      },
      booking_resources_errors: [],
    } 
  },
  computed: {
    ...mapGetters('opening_hours', {
      x_opening_hours_action: 'getOpeningHoursAction'
    }),
    ...mapGetters('booking_resources', {
      x_action_data: 'getBookingResourcesAction', 
      x_resources: 'getBookingResources'
    }),
    form_title(){
      let tmp_title = ''
      if(this.x_action_data.action == options.form_actions.add)  tmp_title = this.$i18n.t('booking-resources.add-resource')
      if(this.x_action_data.action == options.form_actions.edit) tmp_title = this.$i18n.t('booking-resources.edit-resource')
      return tmp_title
    },
    warning_resource_name_exists(){return this.$i18n.t('booking-resources.resource-name-exists')}
  },
  beforeMount(){
    this.booking_resources = new BookingResourcesViewModel()
  },
  methods: {
    ...mapActions('opening_hours', [
      'getOpeningHoursDataAsync',
      'setOpeningHoursActionData'
    ]),
    hideModal(){
      this.hideDialogById('action-booking-resources-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async loadStaff(){
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok){ 
        this.staff_options = result.data.items
      }
      else this.showAlert(result.error_messages)
    },
    onInputResourceType(type){
      if(type == this.options.resource_type.no_staff){
        this.booking_resources.fields.resource_id = 0
      }
    },
    onSelectStaff(id_staff){ 
      let staff = this.staff_options.filter(t=>t.id ==id_staff )
      if(staff.length > 0){
        this.booking_resources.fields.resource_name = staff[0].aliasname
      }
    },
    onLoadForm(){
      this.booking_resources_errors = []
      this.loadStaff()
      
      if(this.x_action_data.action == options.form_actions.add) {
        this.booking_resources = new BookingResourcesViewModel()
        this.table_data_opening_hour.rows=[] 
      }
      if(this.x_action_data.action == options.form_actions.edit){
        this.booking_resources.fields = Object.assign(this.booking_resources.fields, this.x_action_data.data)
        this.table_data_opening_hour.rows = this.booking_resources.fields.opening_hours
      }
      // console.log('==> onLoadForm resource-action', this.booking_resources.fields)
    },
    onConfirm(){
      if(this.x_action_data.action == options.form_actions.add){
        this.submitActionAsync('addBookingResourceAsync', 'update-resource')
      }
      else if(this.x_action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateBookingResourceAsync', 'update-resource')
      }
    },
    onDelete(){
      this.submitActionAsync('deleteBookingResourceAsync', 'delete-resource') 
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.booking_resources_errors = []
      this.booking_resources.fields = Object.assign(this.booking_resources.fields, this.shop_data)

      // prevent duplicate resource name
      // if(!this.isValidResourceName(this.booking_resources.fields)){
      //   let tmp_warning = this.warning_resource_name_exists.replace('#name', this.booking_resources.fields.resource_name)
      //   this.booking_resources_errors = [tmp_warning]
      //   return
      // }

      if(api_action != 'deleteBookingResourceAsync')
        this.booking_resources_errors = this.booking_resources.isValid()
      if(this.booking_resources_errors.length == 0) {
        this.preLoader()
        let booking_resources_api = new BookingResourcesApi()
        let result = await booking_resources_api[api_action](this.booking_resources.fields)
        this.preLoader(false)

        if(result.is_ok) {
          if(result.data.id == undefined) result.data.id = this.booking_resources.fields.id
          this.actionSuccess(result, success_action)
        }
        else {
          let tmp_messages = []
          for(let i in result.error_messages){
            let message = result.error_messages[i]
            let tmp_error_codes = message.match(/RS[0-9]+C/g)
            if(tmp_error_codes != null && tmp_error_codes.length > 0){
              for(let j in tmp_error_codes){
                if(tmp_error_codes[j] == options.booking.booking_setup_error_codes.rs05c){
                  let tmp_staffs = this.staff_options.filter(s => s.id == this.booking_resources.fields.resource_id) // in this case, resource_id mean staff_id
                  if(tmp_staffs.length > 0){
                    message = message.replace('#name', tmp_staffs[0].aliasname)
                  }
                }
              }
            }
            tmp_messages.push(message)
          }
          this.booking_resources_errors = tmp_messages
        }
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.booking_resources_errors = result.error_messages
      } 
    },
    isValidResourceName(resource){
      let is_valid = true
      let tmp_resources = [...this.x_resources.data.items]
      let tmp_resource_name = resource.resource_name.toLowerCase()
      
      if(this.x_action_data.action == options.form_actions.edit)
        tmp_resources = tmp_resources.filter(r => r.id != resource.id)

      let tmp_resource_names = tmp_resources.map(r => r.resource_name.toLowerCase())
      if(tmp_resource_names.includes(tmp_resource_name))
        is_valid = false

      return is_valid
    },

    // modal OpeningHour
    onActionOpeningHours(action, opening_hours = new OpeningHoursViewModel().getFields()){
      this.data_opening_hour = {
        action: action,
        data: {fields: opening_hours} ,
        options: {
          opening_days: this.table_data_opening_hour.rows
        }
      }
      this.setOpeningHoursActionData(this.data_opening_hour)
      this.showDialogById('action-opening-hours-modal')
    },

    // event success 
    onUpdateOpeningHoursSuccess(data, action){ 
      if(action == options.form_actions.add){
        this.table_data_opening_hour.rows.push(Object.assign({}, data))
      }
      else { 
        for(let i in this.table_data_opening_hour.rows){
          let tmp_row = this.table_data_opening_hour.rows[i]
          if(tmp_row.id == data.id){
            if(action == options.form_actions.edit){
              tmp_row = Object.assign(tmp_row, data)
            }
            else if(action == options.form_actions.delete){
              // let index = _.findIndex(this.table_data_opening_hour.rows, ['id', data.id])
              // this.table_data_opening_hour.rows.splice(index, 1)
              this.table_data_opening_hour.rows = this.table_data_opening_hour.rows.filter(row => row.id != data.id) 
            }
          }
        }
      }
      this.booking_resources.fields.opening_hours = this.table_data_opening_hour.rows
    },
    loadFormatTime(item){ 
      return formatTime(item)
    },
    loadDayOfWeekCol(item){
      return loadDayOfWeek(item)
    }
  }
}
</script>

<style lang="scss">
@import './booking-resources-action.scss';
</style>