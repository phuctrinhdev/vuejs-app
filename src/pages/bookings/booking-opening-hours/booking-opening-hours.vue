<template>
  <main class="app-content"> 
    <section class="content booking-opening-hours-page">
      <div class="inner">
        <article class="row setup-top clearfix">
          <h3 class="col-12">{{ $t('bookings.setup-booking') }}</h3>
        </article>
        <booking-links/>

        <div class="opening-hours-part">
          <div class="booking-table">
            <div class="row">
              <div class="col-lg-8 col-xl-7">
                <div class="part-title clearfix">
                  <div class="title">{{ $t('booking-opening-hours.opening-hours') }}</div>
                  <ul class="btn-group clearfix">
                    <li><a class="btn btn-large" @click="onActionOpeningHours(options.form_actions.add)">{{ $t('general.add') }}</a></li>
                  </ul>
                </div>
                <view-table v-if="table_data.rows" :data="table_data">
                  <template slot="finish_time" slot-scope="{ props, row }">
                    <span v-if="row.cross_date">{{ $t('booking-resources.next-day') }} {{ props.formattedRow.finish_time }} </span>
                    <span v-else>{{ props.formattedRow.finish_time }}</span> 
                  </template>
                  <template slot="edit" slot-scope="{ row }">
                    <a class="btn" @click="onActionOpeningHours(options.form_actions.edit, row)">{{ $t('general.edit') }}</a>
                  </template>
                </view-table>
              </div>
              <div class="col-lg-4 col-xl-5 specific-off-days">
                <div class="part-box">
                  <!-- <div class="part-box-head">{{ $t('booking-opening-hours.specific-off-days') }}</div> -->
                  <div class="part-title clearfix">
                    <div class="title">{{ $t('booking-opening-hours.specific-off-days') }}</div>
                  </div>
                  <specific-off-days-opening-hour/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- #note: hidden feature -->
        <!-- <div class="off-days-part row">
          <div class="col-md-6 repeat">
            <div class="part-box">
              <div class="part-box-head">{{ $t('booking-opening-hours.repeat-off-days') }}</div>
              <repeat-off-days-opening-hour :data="repeat_off_days"/>
            </div>
          </div>
          <div class="col-md-3 specific">
            <div class="part-box">
              <div class="part-box-head">{{ $t('booking-opening-hours.specific-off-days') }}</div>
              <specific-off-days-opening-hour/>
            </div>
          </div>
        </div> -->

      </div>
    </section>

    <!-- modal action -->
    <opening-hours-action @submit-opening-hour="onSubmitOpeningHour"/>
  </main>
</template>

<script>
import { options } from '../../../helpers/options'
import booking_links from '../../../components/bookings/booking-links/booking-links'
import opening_hours_action from '../../../components/bookings/opening-hours-action/opening-hours-action.vue'
import { mapGetters, mapActions } from 'vuex'
import RepeatOffDaysViewModel from '../../../view-model/bookings/repeat-off-days-view-model'
import view_table from '../../../components/common/view-table/view-table'
import repeat_off_days_opening_hour from '../../../components/bookings/repeat-off-days-opening-hour/repeat-off-days-opening-hour'
import specific_off_days_opening_hour from '../../../components/bookings/specific-off-days-opening-hour/specific-off-days-opening-hour'
import { formatTime, loadDayOfWeek, cache_session } from '../../../helpers/common'
import component_base    from '../../../components/common/component-base/component-base'

export default {
  components: {
    'booking-links': booking_links,
    'view-table': view_table,
    'opening-hours-action': opening_hours_action,
    'repeat-off-days-opening-hour': repeat_off_days_opening_hour,
    'specific-off-days-opening-hour': specific_off_days_opening_hour,
  },
  extends: component_base,
  data() {
    return {
      options,

      // table opening hours
      table_data: {
        fields: [
          { field: 'start_time',          label: 'booking-opening-hours.start',        width: '10%', sortable: false,               formatFn: this.formatTimeCol,    tdClass: 'start-time' },
          { field: 'finish_time',         label: 'booking-opening-hours.finish',       width: '20%', sortable: false, expand: true, formatFn: this.formatTimeCol,    tdClass: 'finish-time' },
          { field: 'opened_days_of_week', label: 'booking-opening-hours.day-of-week',  width: '65%', sortable: false,               formatFn: this.loadDayOfWeekCol, tdClass: 'days' },
          { field: 'edit',                label: '',                                   width: '10%', sortable: false, expand: true }
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {}
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
      },

      // off days
      repeat_off_days: {},

      // alert
      alerts:[]
    }
  },
  computed: {
    ...mapGetters('opening_hours', {
      opening_hours_data: 'getOpeningHours'
    }),
  },
  beforeMount(){
    this.repeat_off_days = new RepeatOffDaysViewModel()
    
    this.loadTableData()
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    ...mapActions('opening_hours', [
      'getOpeningHoursDataAsync',
      'setOpeningHoursActionData'
    ]),
    formatTimeCol(value){
      return formatTime(value)
    },
    loadDayOfWeekCol(item){
      return loadDayOfWeek(item)
    },

    // table
    async loadTableData() {
      this.table_filter.shop_id = this.shop_data.shop_id

      this.preLoader()
      await this.getOpeningHoursDataAsync(this.table_filter)
      this.preLoader(false)
      
      if(this.opening_hours_data.is_ok){
        this.table_data.rows = this.opening_hours_data.data.opening_hours
        this.repeat_off_days.fields = this.opening_hours_data.data.repeated_off_days
      }
      else this.showAlert(this.opening_hours_data.error_messages)
    },

    // modal action
    onActionOpeningHours(action, opening_hours = {}){
      this.opening_hours_action = {
        action: action,
        data: { fields: opening_hours },
        options: {
          opening_days: this.table_data.rows
        }
      }
      this.setOpeningHoursActionData(this.opening_hours_action)
      this.showDialogById('action-opening-hours-modal')
    },
    onSubmitOpeningHour(){
      if(this.table_data.rows.length != this.opening_hours_data.data.opening_hours.length){
        this.table_data.rows = this.opening_hours_data.data.opening_hours
      }
      cache_session.clearSessionBookingSetup()
    },
  },
}
</script>

<style lang='scss'>
@import './booking-opening-hours.scss';
</style>