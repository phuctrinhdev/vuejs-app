<template>
  <div v-if="!isNullObject(group)">
    <vue-draggable-resizable v-if="group.booking_id > 0"
                             :id="group.getKey()"
                             :resizable="false"
                             :draggable="can_be_drag"
                             :grid="[calendar_head_col_width, getCalendarCellSpec().table_cell_height]" 
                             :style="generateInlineStyleForViewGroup(group)"
                             :class="{'show-menu': is_show_menu}"
                             class="group-booked-items"
                             class-name-dragging="dragging-block"
                             @mouseenter.native="onMouseenter"
                             @mouseleave.native="onMouseleave"
                             @click.native="onClickBookingGroup($event)"
                             @dragging="onDragging"
                             @activated="onDragBookingStart(group)"
                             @deactivated="onDeactivated"
                             @dragstop="onDragBookingStop">

      <calendar-cell-view-block v-for="(block, block_index) in group.blocks"
                                :key="block.getKey()" 
                                :id="block.getKey()"
                                :group="group" :block="block" :display_group_title="(block_index === 0)" 
                                :class="{'has-processing-time': block.has_processing_time}"
                                class="calendar-cell-view-block"/>
      <vue-draggable-resizable v-if="group.resizable_block != null" 
                               :key="group.resizable_block.getKey()"
                               :id="group.resizable_block.getKey()"
                               :draggable="false"
                               :resizable="canBookingBeEditted(group.ref_booking)"
                               :y="group.resizable_block.top_position"
                               :h="group.resizable_block.height" 
                               :min-height="2"
                               :grid="[calendar_head_col_width, group.resizable_block.min_height]" 
                               :handles="['bm']"
                               :style="{'background': group.status_color }"
                               :class="{'has-processing-time': group.resizable_block.has_processing_time}"
                               class = "resizable-block calendar-cell-view-block"
                               class-name-resizing="resizing-block"
                               @resizing="onResizingBooking(group, group.resizable_block)"
                               @resizestop="onResizeBookingStopAsync">
        <calendar-cell-view-block :group="group" :block="group.resizable_block" :is_last_block="true"/>
      </vue-draggable-resizable>

      <calendar-cell-booking-description v-if="is_show_desc" :id="'desc-' + group.getKey()" :group="group" 
                                         :style="generateInlineStyleForBookingDescription()"
                                         @click.native="onClickBookingDescription"/>
      <div v-if="is_show_menu" :style="generateInlineStyleForMenuBookingAction(group)" class="booking-action"> 
        <menu-booking-action :id="'menu-' + group.getKey()"
                             :booking_status="group.ref_booking.status" :group="group" :col="col" 
                             :row="row" 
                             class="booking-action-menu"
                             @mouseleave.native="onCloseMenu($event)"
                             @action-booking="onActionBooking"
                             @move-booking="onMoveBooking"
                             @change-booking-status="onChangeBookingStatus"
                             @change-booking-confirmed="onChangeBookingConfirmed"
                             @close-menu="onCloseMenu($event)"
                             @checkout-information="onCheckoutInformation"/>
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapMutations }               from 'vuex'
import { options }                  from '../../../../../helpers/options'
import { 
  calculateMenuViewGroupPosition,
  isAmOrPm
}                                   from '../../../../../helpers/common'

import vue_draggable_resizable      from 'vue-draggable-resizable'
import menu_booking_action          from '../../menu-booking-action/menu-booking-action'
import component_base               from '../../../../common/component-base/component-base'
import booking_mixin                from '../../../../../helpers/mixins/booking-mixin'

import BookingApi                   from '../../../../../api/bookings/booking-api'

import CalendarCellBookingViewBlock from '../../calendar-view/calendar-cell-booking-view-block'
import CalendarCellBookingViewGroup from '../../calendar-view/calendar-cell-booking-view-group'

let booking_info_block_class = 'block-info'
let CalendarCellBookingViewBlockComp = {
  props: {
    group: {
      type: CalendarCellBookingViewGroup,
      default: null
    },
    display_group_title: {
      type: Boolean,
      default: false
    },
    block: {
      type: CalendarCellBookingViewBlock,
      default: null
    },
    is_last_block: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    isAmOrPm,
    generateInlineStyleForViewBlock(booking_group, block, is_last_block){
      let inline_style =  { 'height': block.height + 'px' }
      if(!is_last_block){
        inline_style.background = booking_group.status_color
        inline_style.position = 'absolute'
        inline_style.top = block.top_position + 'px'
      }

      return inline_style
    },
    generateInlineStyleForBlockInfo(group){
      return { 'height': group.block_booking_info.height + 'px' }
    },
  },
  template: '<div :style="generateInlineStyleForViewBlock(group, block, is_last_block)" '+
                 ':class="{ \'empty-block\': block.is_empty_block }" class="block">'+
              '<div v-if="!block.is_empty_block"'+
                   ':style="generateInlineStyleForBlockInfo(group)"'+
                   ':class="{ \'block-small\': group.block_booking_info.is_small, \'block-one-line\': group.block_booking_info.is_one_line }" '+
                   'class="'+ booking_info_block_class +'">'+
                '<p class="booking-icons">'+
                  '<span v-if="group.icons.repeated" class="icon repeated">↻</span>'+
                  '<span v-if="group.ref_booking.confirmed" class="icon completed">☎</span>'+
                  '<span v-if="group.icons.star" class="icon star">★</span>'+
                  '<span v-if="group.icons.client_color != \'\'" :style="{ background: group.icons.client_color }" class="icon color"/>'+
                  '<b class="client-name">'+
                    '{{ group.ref_booking.client_name }} '+
                    '<span v-if="group.booking_setup.booking_calendar_setup.member_number_show_up && group.ref_booking.client_member_number">'+
                      '({{ group.ref_booking.client_member_number }})</span>'+
                  '</b>'+ 
                '</p>'+
                '<p v-if="group.booking_setup.booking_calendar_setup.service_show_up" class="services">{{ group.group_services }}</p>'+
                '<p v-if="group.booking_setup.booking_calendar_setup.time_show_up" class="time">'+
                  '{{ isAmOrPm(group.start_time_minutes, false) }} ~ {{ isAmOrPm(group.end_time_minutes, false) }}'+
                '</p>'+
                '<p v-if="group.booking_setup.booking_calendar_setup.notes_show_up" class="notes">{{ group.ref_booking.notes }}</p>'+
              '</div>'+
            '</div>'
}

let CalendarCellBookingDescriptionComp = {
  props: {
    group: {
      type: CalendarCellBookingViewGroup,
      default: new CalendarCellBookingViewGroup(0)
    }
  }, 
  methods: {
    isAmOrPm,
  },
  template: '<div class="booking-description">'+
              '<h4 :style="{ background: group.status_color }" class="booking-type">{{ $t(group.status_name) }}</h4>'+
              '<div class="booking-detail">'+
                '<p class="booking-time">{{ isAmOrPm(group.start_time_minutes, false) }} ~ {{ isAmOrPm(group.end_time_minutes, false) }}</p>'+
                '<p class="booking-icons">'+
                  '<span v-if="group.icons.repeated" class="icon repeated">↻</span>'+
                  '<span v-if="group.ref_booking.confirmed" class="icon completed ">☎</span>'+
                  '<span v-if="group.icons.star" class="icon star">★</span>'+
                  '<span v-if="group.icons.client_color != \'\'" :style="{ background: group.icons.client_color }" class="icon color"/>'+
                '</p>'+
                '<p class="booking-client">'+
                  '{{ group.ref_booking.client_name }} '+
                  '<span v-if="group.booking_setup.booking_calendar_setup.member_number_show_up && group.ref_booking.client_member_number">'+
                    '({{ group.ref_booking.client_member_number }})</span>'+
                '</p>'+
                // '<p class="booking-phone">{{ formatHideInfoCol(group.ref_booking.client_mobile_number, group.ref_booking.client_registration_date) }}</p>'+
                '<p class="booking-services">{{ group.group_services }}</p>'+
                '<p class="booking-note">{{ group.ref_booking.notes }}</p>'+
              '</div>'+
            '</div>'
}

export default {
  components: {
    'vue-draggable-resizable': vue_draggable_resizable,
    'menu-booking-action': menu_booking_action,
    'calendar-cell-view-block': CalendarCellBookingViewBlockComp,
    'calendar-cell-booking-description': CalendarCellBookingDescriptionComp
  },
  extends: component_base,
  mixins: [booking_mixin],
  props: {
    group: {
      type: CalendarCellBookingViewGroup,
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
    },
    can_drag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options,
      is_show_menu: false,
      is_dragging: false,
      is_resizing: false,

      resizeable_block_id: '',
      resizeable_block_object: null,
      booking_info_block_object: '',

      is_show_desc: false,
      desc_over_calendar: 0
    }
  },
  computed: {
    ...mapActions('client', [
      'getClientInformationDataAsync'
    ]),
    can_be_drag(){
      if(this.can_drag){
        return this.canBookingBeEditted(this.group.ref_booking)
      }
      return false
    },
  },
  // beforeMount(){
  //   console.log(3, 'calendar-cell-beforeMount: ')
  // },
  // mounted(){
  //   console.log(3, 'calendar-cell-mounted: ')
  // },
  // beforeUpdate(){
  //   console.log(3, 'calendar-cell-beforeUpdate: ')
  // },
  // updated(){
  //   console.log(3, 'calendar-cell-updated: ')
  // },
  methods: {
    ...mapActions('booking', [
      'updateBookingStatusData',
      'updateBookingConfirmedData'
    ]),
    ...mapMutations('sales',[
      'setClientIdUsingSales',
      'setClientShopIdUsingSales'
    ]),
    onMoveBooking(){
      this.$emit('on-moving-booking-start', this.group)
    },
    isAmOrPm,
    generateInlineStyleForViewGroup(group){
      return { 
        'margin-left': group.margin_left + '%',
        'width': group.width + '%', 'height': 'auto'
      }
    },
    generateInlineStyleForBookingDescription(){ 
      return {
        'top': this.desc_over_calendar + 'px'
      }
    },
    generateInlineStyleForMenuBookingAction(group){
      return { 
        top: group.menu_top + 'px', 
        left: group.menu_left + 'px'
      }
    },
    async updateBookingStatusAsync(booking_id, new_status){
      let booking = {}
      this.errors = []

      let send_data = {
        booking_id: booking_id,
        status: new_status,
        shop_id: this.shop_data.shop_id
      }
      let booking_api = new BookingApi()
      let result = await booking_api.updateBookingStatusAsync(send_data)
      if(result.is_ok) booking = result.data
      else this.errors = result.error_messages

      return booking
    },
    async updateBookingConfirmedAsync(booking_id, confirmed){
      let booking = {}
      this.errors = []

      let send_data = {
        booking_id: booking_id,
        confirmed: confirmed,
        shop_id: this.shop_data.shop_id
      }
      let booking_api = new BookingApi()
      let result = await booking_api.updateBookingConfirmedAsync(send_data)
      if(result.is_ok) booking = result.data
      else this.errors = result.error_messages

      return booking
    },
    async onChangeBookingStatus(booking_group, status){
      if(status == options.booking.booking_status.checked_out){
        let tmp_booking = _.cloneDeep(booking_group.ref_booking)
        tmp_booking.status = options.booking.booking_status.checked_out

        let tmp_booking_action = {
          action: options.form_actions.edit,
          data: tmp_booking
        }
        this.setBookingActionData(tmp_booking_action)

        if(tmp_booking.client_id > 0){
          this.setClientIdUsingSales(tmp_booking.client_id)
          this.setClientShopIdUsingSales(tmp_booking.client_shop_id)
          this.$router.push('/client-sales')
        }
        else
          this.$router.push('/sales')
      }
      else {
        this.preLoader()
        let result = await this.updateBookingStatusAsync(booking_group.booking_id, status)

        if(this.errors.length == 0) {
          this.updateBookingStatusData(result)
        }
        else {
          this.showAlert(this.errors)
        }
        this.preLoader(false)
      }
    },
    async onChangeBookingConfirmed(booking_group, confirmed){
      this.preLoader()
      let result = await this.updateBookingConfirmedAsync(booking_group.booking_id, confirmed)
      if(this.errors.length == 0) {
        this.updateBookingConfirmedData(result)
      }
      else {
        this.showAlert(this.errors)
      }
      this.preLoader(false)
    },
    onMouseenter(){
      this.is_show_desc = true

      this.$nextTick(() => {
        // calculate description position / calendar-table position 
        let table_object        = document.getElementById('calendar-table')
        let table_rect          = table_object.getBoundingClientRect()
        let calendar_bottom_max = window.scrollY + table_rect.bottom - options.browser_scroll - 2 // border-bottom of calendar

        let desc_object      = document.getElementById('desc-' + this.group.getKey())
        if(desc_object){
          let desc_rect        = desc_object.getBoundingClientRect()
          let desc_bottom_max  = window.scrollY + desc_rect.bottom
          
          if(desc_bottom_max > calendar_bottom_max) this.desc_over_calendar = -(desc_bottom_max - calendar_bottom_max)
          else this.desc_over_calendar = 0
        }
      })
    },
    onMouseleave(){
      this.desc_over_calendar = 0
    },
    onClickBookingDescription(e){
      e.stopPropagation()
    },
    onClickBookingGroup(e){
      //when stop resizing and dragging, the control still fire 'onClick' event
      //so we have to avoid this event
      if(!this.is_dragging && !this.is_resizing) 
        this.is_show_menu = !this.is_show_menu
      if(this.is_dragging) this.is_dragging = false
      if(this.is_resizing) this.is_resizing = false
      
      if(this.is_show_menu){
        this.$nextTick(() => {
          calculateMenuViewGroupPosition(this.group, e)
        })
      }
    },
    onCloseMenu(e){
      e.stopPropagation()
      this.is_show_menu = false
    },
    onDeactivated(){
      this.is_show_menu = false
    },
    onDragBookingStart(group){
      if(!this.isNullObject(group))
        this.$emit('on-drag-start', group)
    }, 
    onDragging(){
      this.is_show_menu = false
      this.is_dragging = true
    },
    async onDragBookingStop(x, y){
      this.$emit('on-drag-stop', x, y)
    },
    onResizingBooking(group, block){
      this.is_show_menu = false
      this.is_resizing = true
      if(!(this.isNullObject(group) || this.isNullObject(block))){
        this.$emit('on-resizing', group, block)
        this.realResizeBookingUI()
      }
    },
    realResizeBookingUI(){
      // re-calculate BookingInfoHeight when resizing
      let block_id = this.group.resizable_block.getKey()
      if(block_id != this.resizeable_block_id) {
        this.resizeable_block_id = block_id
        this.resizeable_block_object = document.getElementById(block_id)
        this.booking_info_block_object = document.querySelector('#' + block_id + ' .' + booking_info_block_class)
      }
      let tmp_booking_info_height = this.group.calculateBookingInfoHeight(
        this.group.blocks, 
        this.group.resizable_block, 
        this.resizeable_block_object.offsetHeight)

      if(this.booking_info_block_object != null)
        this.booking_info_block_object.style.height = tmp_booking_info_height + 'px'
    },
    async onResizeBookingStopAsync(x, y, width, height){
      if(!(x===0 && y===0 && width===0 && height===0))
        this.$emit('on-resize-stop', x, y, width, height)
    },
    onCheckoutInformation(booking_data) {
      this.$emit('on-checkout-information', booking_data)
    },
  }
}
</script>

<style lang='scss'>
@import './calendar-cell-booking-group.scss';
</style>