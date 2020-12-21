<template>
  <main class="app-content">
    <section class="content booking-resources">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('bookings.setup-booking') }}</h3>
        </article>
        <booking-links/> 
        <div class="booking-resources-part">
          <div class="part-title clearfix">
            <div class="title">{{ $t('booking-resources.booking-resources') }}</div>
            
            <ul class="btn-group clearfix">
              <li><show-inactives v-model="table_filter.status"/></li>
              <li><a class="btn btn-large" 
                     @click="onActionBookingResource(options.form_actions.add)">{{ $t('booking-resources.add-resource') }}</a></li>
            </ul>
          </div>
          <div :class="{ 'table-show-inactive': table_filter.status == options.good_status.all }" class="table-data form-wrapper booking-table">
            <goods-table :data="table_data" @drag-end="onDragEnd">
              <template slot="working_hours" slot-scope="{ row }">
                <ul>
                  <li v-for="(opening_hour, index) in row.opening_hours" :key="index">
                    {{ formatTimeOfApi(opening_hour.start_time) }} ~ 
                    <span v-if="opening_hour.start_time > opening_hour.finish_time">{{ $t('booking-resources.next-day') }}</span>
                    {{ formatTimeOfApi(opening_hour.finish_time) }} 
                    
                    <span>{{ formatDayOfWeek(opening_hour.opened_days_of_week) }}</span>
                  </li>
                </ul>
              </template>
              <template slot="edit" slot-scope="{ row }"> 
                <a class="btn btn-edit" 
                   @click="onActionBookingResource(options.form_actions.edit, row)">{{ $t('general.edit') }}</a>
              </template>
              <template slot="specific_off_days" slot-scope="{ row }">
                <a class="btn btn-edit"
                   @click="onActionSpecificOffDays(row)">{{ $t('general.edit') }}</a>
              </template>
            </goods-table>
          </div>
        </div> 
      </div>
      <div class="booking-resources-part-1">
        <p>- {{ $t('booking-resources.note-line-1') }}</p>
        <p>- {{ $t('booking-resources.note-line-2') }}</p>
      </div>

      <!-- modal action -->
      <booking-resources-action @update-resource="onUpdateResource" @delete-resource="onDeleteResource"/>
      <specific-off-day-resource-action :data="off_days" @update-success="onUpdateSpecificDay"/>
    </section>
  </main>
</template> 
<script>
import { options } from '../../../helpers/options'
import booking_links from '../../../components/bookings/booking-links/booking-links'  
import booking_resources_action from '../../../components/bookings/booking-resources-action/booking-resources-action.vue'
import specific_off_day_resource_action from '../../../components/bookings/specific-off-day-resource-action/specific-off-day-resource-action.vue'
import BookingResourcesApi from '../../../api/bookings/booking-resources-api.js'
import OffDaysViewModel from '../../../view-model/bookings/off-days-view-model'
import { mapGetters, mapActions } from 'vuex'
import goods_table from '../../../components/goods/goods-table/goods-table.vue'
import component_base    from '../../../components/common/component-base/component-base.vue'
import show_inactives from '../../../components/common/show-inactives/show-inactives'
import { loadDayOfWeek, cache_session } from '../../../helpers/common'
import moment from 'moment'

export default {
  components: {
    'booking-links': booking_links, 
    'goods-table': goods_table , 
    'booking-resources-action': booking_resources_action,
    'specific-off-day-resource-action': specific_off_day_resource_action,
    'show-inactives': show_inactives,
  },
  extends: component_base,
  data() {
    return {
      options,

      // table opening hours
      table_data: {
        fields: [
          { field: 'resource_type',       label: 'booking-resources.type',              width: '10%', sortable: false, formatFn: this.loadResourceType },
          { field: 'resource_name',       label: 'booking-resources.resource-name',     width: '15%', sortable: false }, 
          { field: 'working_hours',       label: 'booking-resources.working-hours',     width: '50%', sortable: false, expand: true, formatFn: this.loadResourceType, tdClass: 'working-hours'},
          { field: 'edit',                label: 'general.edit',                        width: '10%', sortable: false, expand: true }, 
          { field: 'specific_off_days',   label: 'booking-resources.specific-off-days', width: '15%', sortable: false, expand: true },
        ],
        rows:[], 
        groups: [
          { name: 'booking-resource-draggable', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: options.good_table_drag.all,
          pagination: true
        },
      },
      table_filter: {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },

      off_days: new OffDaysViewModel(),
      booking_resources_action:{},
      alerts: []
    }
  }, 
  computed: {
    ...mapGetters('booking_resources', {
      x_booking_resources_data: 'getBookingResources'
    }),
  },
  beforeMount(){
    this.off_days.fields.specific_off_days = []
  },
  mounted() { 
    this.loadTableData()
  },
  methods: { 
    ...mapActions('booking_resources', [
      'getBookingResourcesDataAsync',
      'setBookingResourcesActionData'
    ]),
    // table
    async loadTableData() { 
      this.preLoader()
      await this.getBookingResourcesDataAsync(this.shop_data)
      this.preLoader(false)

      if(this.x_booking_resources_data.is_ok){
        this.table_data.groups[0].rows  = this.x_booking_resources_data.data.items
      }
      else this.showAlert(this.x_booking_resources_data.error_messages)
    },
    // modal action
    onActionBookingResource(action, booking_resources = {}){ 
      this.booking_resources_action = {
        action: action,
        data: booking_resources,
        options: {
          opening_resources: this.table_data.rows
        }
      }

      this.setBookingResourcesActionData(this.booking_resources_action)
      this.showDialogById('action-booking-resources-modal')
    },
    onActionSpecificOffDays(item){ 
      this.off_days = new OffDaysViewModel()
      this.off_days.fields.id = item.id
      this.off_days.fields.shop_id = item.shop_id
      this.off_days.fields.specific_off_days = item.specific_off_days
      this.showDialogById('action-specific-off-day-modal')
    },

    // event success
    onUpdateResource(){
      this.loadTableData()
      cache_session.clearSessionBookingSetup()
    },
    onDeleteResource(){
      this.loadTableData()
      cache_session.clearSessionBookingSetup()
    },
    onUpdateSpecificDay(){
      this.loadTableData()
      cache_session.clearSessionBookingSetup()
    },
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }
      this.preLoader()
      let booking_resources_api = new BookingResourcesApi() 
      let result = await booking_resources_api.updateBookingResourceOrderNoAsync(drag_change)
      this.preLoader(false)
      
      if(!result.is_ok) this.showAlert(result.error_messages)
      else {
        this.loadTableData()
        cache_session.clearSessionBookingSetup()
      }
    },
    loadResourceType(item){
      let str =''
      if(item == options.resource_type.staff)
        str = this.$i18n.t('booking-resources.staff')
      else
        str = this.$i18n.t('booking-resources.resources')
      return str
    },
    formatDayOfWeek(days){
      return loadDayOfWeek(days)
    },
    formatTimeOfApi(time){
      return moment(time, options.standard_hour_format.h24_seconds).format(options.standard_hour_format.h24)
    }
  }
}
</script>

<style lang='scss'>
@import './booking-resources.scss';
</style>