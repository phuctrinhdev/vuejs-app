<template>
  <div class="booking-action-list">
    <b-dropdown v-if="booking_status == options.booking.booking_status.requested"
                ref="booking_action_list">
      <action-booking-menu :booking_action="options.form_actions.add" :menu_text="add_menu_text"/>
      <status-booking-menu :menu_booking_status="options.booking.booking_status.completed" :menu_text="completed_menu_text"/>
      <action-booking-menu :booking_action="options.form_actions.edit" :menu_text="edit_menu_text" />
      <move-booking-menu :menu_text="move_booking_menu_text"/>
      <action-booking-menu :booking_action="options.form_actions.delete" :menu_text="cancel_menu_text"/>
      <action-booking-menu v-if="!group.ref_booking.client_id > 0" :booking_action="options.form_actions.part" :menu_text="client_informmation_text"/>
      <close-menu-booking :menu_text="close_booking_menu_text"/>
    </b-dropdown>

    <b-dropdown v-if="booking_status == options.booking.booking_status.completed"
                ref="booking_action_list">
      <action-booking-menu :booking_action="options.form_actions.add" :menu_text="add_menu_text" />
      <status-booking-menu :menu_booking_status="options.booking.booking_status.checked_out" :menu_text="checked_out_menu_text"/>
      <action-booking-menu :booking_action="options.form_actions.edit" :menu_text="edit_menu_text" />
      <move-booking-menu :menu_text="move_booking_menu_text" />
      <action-booking-menu :booking_action="options.form_actions.delete" :menu_text="cancel_menu_text" />
      <action-booking-menu v-if="!group.ref_booking.client_id > 0" :booking_action="options.form_actions.part" :menu_text="client_informmation_text"/>
      <b-dropdown-divider />
      <confirmed-booking-menu/>
      <status-booking-menu :menu_booking_status="options.booking.booking_status.arrived" :menu_text="arrived_menu_text" />
      <status-booking-menu :menu_booking_status="options.booking.booking_status.no_show" :menu_text="no_show_menu_text" />
      <close-menu-booking :menu_text="close_booking_menu_text"/>
    </b-dropdown>

    <b-dropdown v-if="booking_status == options.booking.booking_status.arrived"
                ref="booking_action_list">
      <action-booking-menu :booking_action="options.form_actions.add" :menu_text="add_menu_text" />
      <status-booking-menu :menu_booking_status="options.booking.booking_status.checked_out" :menu_text="checked_out_menu_text" />
      <action-booking-menu :booking_action="options.form_actions.edit" :menu_text="edit_menu_text" />
      <move-booking-menu :menu_text="move_booking_menu_text" />
      <action-booking-menu v-if="!group.ref_booking.client_id > 0" :booking_action="options.form_actions.part" :menu_text="client_informmation_text"/>
      <b-dropdown-divider />
      <confirmed-booking-menu/>
      <status-booking-menu :menu_booking_status="options.booking.booking_status.arrived" :menu_text="arrived_menu_text" />
      <close-menu-booking :menu_text="close_booking_menu_text"/>
    </b-dropdown>

    <b-dropdown v-if="booking_status == options.booking.booking_status.checked_out"
                ref="booking_action_list">
      <action-booking-menu :booking_action="options.form_actions.add" :menu_text="add_menu_text" />
      <checkout-info-booking-menu :menu_text="checkout_information_text" @click="onClickCheckoutInformationMenu" />
      <action-booking-menu v-if="!group.ref_booking.client_id > 0" :booking_action="options.form_actions.part" :menu_text="client_informmation_text"/>
      <close-menu-booking :menu_text="close_booking_menu_text"/>
    </b-dropdown>

    <b-dropdown v-if="booking_status == options.booking.booking_status.no_show"
                ref="booking_action_list">
      <action-booking-menu :booking_action="options.form_actions.add" :menu_text="add_menu_text" />
      <action-booking-menu v-if="!group.ref_booking.client_id > 0" :booking_action="options.form_actions.part" :menu_text="client_informmation_text"/>
      <b-dropdown-divider />
      <confirmed-booking-menu/>
      <status-booking-menu :menu_booking_status="options.booking.booking_status.no_show" :menu_text="no_show_menu_text" />
      <close-menu-booking :menu_text="close_booking_menu_text"/>
    </b-dropdown>
  </div>
</template>

<script>
import { options } from '../../../../helpers/options'

let ConfirmedBookingMenuItem = {
  data(){
    return {
      menu_parent: this.$parent.$parent,
      menu_text: this.$i18n.t('bookings.booking-confirmed')
    }
  },
  methods:{
    onChangeBookingConfirmed(){
      this.menu_parent.onChangeBookingConfirmed(this.menu_parent.group, !this.menu_parent.group.ref_booking.confirmed)
    },
    loadClassIcon(){
      return this.menu_parent.loadClassConfirmedIcon(this.menu_parent.group.ref_booking.confirmed)
    }
  },
  template: '<b-dropdown-item @click="onChangeBookingConfirmed()">' +
              '<i :class="loadClassIcon()" />' +
              '<span>{{ menu_text }}</span>' +
            '</b-dropdown-item>'
}

let StatusBookingMenuItem = {
  props: {
    menu_booking_status: {
      type: Number,
      default: 0
    },
    menu_text: {
      type: String,
      default: ''
    },
  },
  data(){
    return {
      menu_parent: this.$parent.$parent
    }
  },
  methods:{
    onChangeBookingStatus(){
      this.menu_parent.onChangeBookingStatus(this.menu_parent.group, this.menu_booking_status)
    },
    canHasIcon(){
      return (this.menu_booking_status !== this.menu_parent.options.booking.booking_status.checked_out &&
      this.menu_booking_status !== this.menu_parent.options.booking.booking_status.completed)
    },
    loadClassIcon(){
      return this.menu_parent.loadClassIcon(this.menu_booking_status, this.menu_parent.group.ref_booking)
    }
  },
  template:'<b-dropdown-item v-if="canHasIcon()" ' +
              '@click="onChangeBookingStatus()">' +
              '<i :class="loadClassIcon()"/>' +
              '<span>{{ menu_text }}</span>' +
            '</b-dropdown-item> ' +
            '<b-dropdown-item v-else @click="onChangeBookingStatus()">{{ menu_text }}</b-dropdown-item>'
}

let ActionBookingMenuItem = {
  props: {
    booking_action: {
      type: Number,
      default: 0
    },
    menu_text: {
      type: String,
      default: ''
    }
  },
  methods:{
    onActionBooking(){
      let menu_booking_action = this.$parent.$parent
      menu_booking_action.onActionBooking(this.booking_action, menu_booking_action.group,
        menu_booking_action.col, menu_booking_action.row)
    },
  },
  template: '<b-dropdown-item @click="onActionBooking()">{{ menu_text }}</b-dropdown-item>'
}

let MoveBookingMenuItem = {
  props: {
    menu_text: {
      type: String,
      default: ''
    }
  },
  methods:{
    onClick(){
      this.$parent.$parent.onMoveBooking()
    }
  },
  template: '<b-dropdown-item @click="onClick()">{{ menu_text }}</b-dropdown-item>'
}

let CloseBookingMenuItem = {
  props: {
    menu_text: {
      type: String,
      default: ''
    }
  },
  methods:{
    onCloseMenu(e){
      this.$parent.$parent.onCloseMenu(e)
    }
  },
  template: '<b-dropdown-item @click="onCloseMenu($event)" class="close-menu"><i>x</i> <span>{{ menu_text }}</span></b-dropdown-item>'

}

let CheckoutInformationBookingMenuItem = {
  props: {
    menu_text: {
      type: String,
      default: ''
    }
  },
  template: '<b-dropdown-item v-on="$listeners">{{ menu_text }}</b-dropdown-item>'

}

export default {
  components: {
    'action-booking-menu': ActionBookingMenuItem,
    'status-booking-menu': StatusBookingMenuItem,
    'confirmed-booking-menu':ConfirmedBookingMenuItem,
    'move-booking-menu': MoveBookingMenuItem,
    'close-menu-booking':CloseBookingMenuItem,
    'checkout-info-booking-menu': CheckoutInformationBookingMenuItem
  },
  props: {
    booking_status: {
      type: Number,
      default: 0
    },
    group: {
      type: Object,
      default: () => []
    },
    col: {
      type: Object,
      default: () => []
    },
    row: {
      type: Object,
      default: () => []
    },
    z_index: {
      type:[String, Number],
      default: () => 'auto'
    }
  },
  data(){
    return {
      options,
      add_menu_text: this.$i18n.t('bookings.add-booking'),
      edit_menu_text: this.$i18n.t('general.edit'),
      cancel_menu_text: this.$i18n.t('booking-list.cancel-booking'),
      completed_menu_text: this.$i18n.t('bookings.approve-booking'),
      checked_out_menu_text: this.$i18n.t('bookings.check-out'),
      no_show_menu_text: this.$i18n.t('bookings.no-show'),
      arrived_menu_text: this.$i18n.t('booking-status.arrived'),
      client_informmation_text: this.$i18n.t('bookings.client-information'),
      move_booking_menu_text: this.$i18n.t('bookings.move-booking-menu'),
      close_booking_menu_text: this.$i18n.t('general.close'),
      checkout_information_text: this.$t('bookings.checkout-information'),
    }
  },
  methods: {
    onMoveBooking(){
      this.$emit('move-booking')
    },
    onChangeBookingStatus(group, booking_status ){
      if(booking_status===options.booking.booking_status.no_show &&
         group.ref_booking.status===options.booking.booking_status.no_show){
        this.$emit('change-booking-status', group, options.booking.booking_status.completed)
      }
      else if(booking_status===options.booking.booking_status.arrived &&
         group.ref_booking.status===options.booking.booking_status.arrived){
        this.$emit('change-booking-status', group, options.booking.booking_status.completed)
      }
      else
        this.$emit('change-booking-status', group, booking_status)
    },
    onChangeBookingConfirmed(group, confirmed ){
      this.$emit('change-booking-confirmed', group, confirmed)
    },
    onActionBooking(action , group, col, row ){
      this.$emit('action-booking', action, group, col, row)
    },
    loadClassConfirmedIcon(confirmed){
      if(confirmed)
        return 'confirmed'
      else
        return 'uncheck-confirmed'
    },
    loadClassIcon(status, booking){
      let icon = ''
      if(status!=options.booking.booking_status.checked_out){
        if(options.booking.booking_status.completed == status){
          icon = 'uncheck-confirmed'
          if(status == booking.status) icon = 'confirmed'
        }
        else if(options.booking.booking_status.arrived == status){
          icon = 'uncheck-arrived'
          if(status== booking.status) icon = 'arrived'
        }
        else if(options.booking.booking_status.no_show == status){
          icon = 'uncheck-cancelled'
          if(status== booking.status) icon = 'cancelled'
        }
      }
      return icon
    },
    onCloseMenu(e){
      this.$emit('close-menu', e)
    },
    onClickCheckoutInformationMenu() {
      this.$emit('checkout-information', this.group.ref_booking)
    }
  }
}
</script>

<style lang="scss">
@import './menu-booking-action.scss';
</style>
