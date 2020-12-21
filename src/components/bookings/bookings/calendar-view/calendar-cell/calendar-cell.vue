<template>
  <div class="calendar-cell">
    <div v-if="exceed" class="row-off"/>
    <div v-else class="row-action">
      <div v-if="calendar_specs.calendar_cell_mode === options.booking.calendar_cell_mode.add_booking"
           class="action-booking"
           @click.self="openBookingActionDialog(options.form_actions.add, {}, col, row)">
        {{ row.text }}
      </div>
      <div v-if="calendar_specs.calendar_cell_mode === options.booking.calendar_cell_mode.add_blocked_time"
           class="action-blocked-time"
           @click.self="openBlockedTimeActionDialog(options.form_actions.add, {}, col, row)">
        {{ row.text }}
      </div>
      <div v-if="isCalendarCellMovingBookingMode()"
           class="action-move-booking"
           @click.self="onMovingBookingStop">
        {{ row.text }}
      </div>
    </div>

    <div v-for="group in booking_view_groups" :key="group.getKey()"
         :class="{ 'edge-left': col_index == 0 || col_index == 1 }"
         class="view-group">
      <calendar-cell-booking-group :group="group"
                                   :col="col" :row="row" :can_drag="!isCalendarCellMovingBookingMode() && !is_mobile"
                                   :calendar_head_col_width="calendar_head_col_width"
                                   @on-moving-booking-start="onMovingBookingStart"
                                   @on-drag-start="onDragBookingStart"
                                   @on-drag-stop="onDragBookingStop"
                                   @on-resizing="onResizingBooking"
                                   @on-resize-stop="onResizeBookingStopAsync"
                                   @on-checkout-information="onCheckoutInformation"/>
    </div>

    <div v-for="group in blocked_time_view_groups" :key="group.getKey()"
         :class="{ 'edge-left': col_index == 0 || col_index == 1 }"
         class="view-group">
      <calendar-cell-blocked-time-group :group="group"
                                        :col="col" :row="row"
                                        :calendar_head_col_width="calendar_head_col_width"
                                        @on-resizing="onResizingBlockedTime"
                                        @on-resize-stop="onResizeBlockedTimeStop"/>
    </div>
  </div>
</template>

<script>
import _                                from 'lodash'
import { options }                      from '../../../../../helpers/options'
import { mapGetters, mapActions }       from 'vuex'

import vue_draggable_resizable          from 'vue-draggable-resizable'
import calendar_cell_booking_group      from '../calendar-cell-booking-group/calendar-cell-booking-group'
import calendar_cell_blocked_time_group from '../calendar-cell-blocked-time-group/calendar-cell-blocked-time-group'
import component_base                   from '../../../../common/component-base/component-base'
import booking_mixin                    from '../../../../../helpers/mixins/booking-mixin'
import blocked_time_mixin               from '../../../../../helpers/mixins/blocked-time-mixin'

import CalendarCellData                 from '../calendar-cell-data'
import {
// logTime
}                      from '../../../../../helpers/common'

export default {
  components: {
    'vue-draggable-resizable': vue_draggable_resizable,
    'calendar-cell-booking-group': calendar_cell_booking_group,
    'calendar-cell-blocked-time-group':calendar_cell_blocked_time_group,
  },
  extends: component_base,
  mixins: [booking_mixin, blocked_time_mixin],
  props: {
    is_mobile: {
      type: Boolean,
      default: false
    },
    calendar_specs: {
      type: Object,
      default: () => []
    },
    cell_data: {
      type: CalendarCellData,
      default: null
    },

    col: {
      type: Object,
      default: () => []
    },
    row: {
      type: Object,
      default: () => []
    },
    calendar_head_col_width: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      options,
      cell_specs: {},
      col_index: this.cell_data.col_index,
      exceed: this.cell_data.exceed_work_hour,
      booking_view_groups: this.cell_data.booking_view_groups,
      blocked_time_view_groups:this.cell_data.blocked_time_view_groups,

      resized_booking_block: null, //CalendarCellBookingViewBlock
      resized_booking_group: null, //CalendarCellBookingViewGroup

      resize_blocked_time_group: null//CalendarCellBlockedTimeViewGroup
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts'
    }),
  },
  created(){
    this.cell_specs = this.getCalendarCellSpec()
    // console.log(3, 'calendar-cell-created', logTime())
  },
  mounted() {
    // console.log(3, 'calendar-cell-mounted', logTime())
  },
  updated(){
    // console.log(3, 'calendar-cell-updated', logTime())
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    ...mapActions('booking', [
      'updateBookingStatusData',
      'updateBookingConfirmedData'
    ]),
    isCalendarCellMovingBookingMode(){
      return this.calendar_specs.calendar_cell_mode === options.booking.calendar_cell_mode.move_booking
    },
    calculateChangedTime(current_height, resized_height){
      // old_height = current_height
      // new_height = resized_height
      let change_height = resized_height - current_height
      let change_time = (change_height / this.cell_specs.table_cell_height) * this.cell_specs.booking_time_slot
      return change_time
    },

    /////////////////////////////////////////////////////////////////////////
    // Booking actions
    /////////////////////////////////////////////////////////////////////////
    openBookingActionDialog(form_actions, booking, col, row){
      this.preLoader()
      this.onActionBooking(form_actions, booking, col, row)
      this.preLoader(false)
    },
    onMovingBookingStart(booking_view_group){
      this.setMovingBooking(booking_view_group)
      this.$emit('on-moving-booking-start', booking_view_group)
    },
    onMovingBookingStop(){
      let moving_booking_view_group = this.getMovingBooking()
      if(!this.isNullObject(moving_booking_view_group))
        this.$emit('on-moving-booking-stop', moving_booking_view_group, this.cell_data.col_index, this.cell_data.row_index)
    },
    onDragBookingStart(group){
      this.drag_group = group
    },
    async onDragBookingStop(x, y){
      this.$emit('validate-and-save-drop-booking', this.drag_group, x, y)
    },
    onResizingBooking(group, block){
      this.resized_booking_block = block
      this.resized_booking_group = _.cloneDeep(group)
    },
    async onResizeBookingStopAsync(x, y, width, height){
      if(!(this.isNullObject(this.resized_booking_group) ||
        this.isNullObject(this.resized_booking_block) ||
        this.isNullObject(this.resized_booking_block.ref_booked_item))){
        let changed_time = this.calculateChangedTime(this.resized_booking_block.height, height)
        if(!(changed_time === 0)){
          this.$emit('validate-and-save-resized-booking', this.resized_booking_group, this.resized_booking_block, height, changed_time)
        }
      }
    },

    ////////////////////////////////////////////////////////////////////////
    // blocked-time actions
    ////////////////////////////////////////////////////////////////////////
    openBlockedTimeActionDialog(form_action, blocked_time, col, row){
      this.preLoader()
      this.onActionBlockedTime(form_action, blocked_time, col.resource_setup_id, col.booking_date,
        col.booking_date_ts_miliseconds, row.cross_date, row.time)
      this.preLoader(false)
    },
    onResizingBlockedTime(blocked_time_group){
      this.resize_blocked_time_group = blocked_time_group
    },
    async onResizeBlockedTimeStop(x, y, width, height){
      if(!this.isNullObject(this.resize_blocked_time_group)){
        let changed_time = this.calculateChangedTime(this.resize_blocked_time_group.height, height)
        this.resize_blocked_time_group.updateChangedTime(changed_time)
        this.$emit('validate-and-save-blocked-time', this.resize_blocked_time_group)
      }
    },
    onCheckoutInformation(booking_data) {
      this.$emit('on-click-checkout-information', booking_data)
    }
  }
}
</script>
