<template>   
  <div class="booking-links-wrapper">
    <!-- desktop -->
    <ul class="booking-links btn-group clearfix">
      <li v-for="link in booking_link_options" :key="link.index" 
          :class="{ active: link.selected }" @click="onClickBookingLink(link.name)">{{ $t(link.text) }}</li>
    </ul>

    <!-- mobile -->
    <b-form-select v-model="booking_link_selected" class="booking-links mobile" @input="onSelectBookingLink">
      <option v-for="link in booking_link_options" :key="link.index" :value="link.name">{{ $t(link.text) }}</option>
    </b-form-select>
  </div> 
</template>

<script>

export default {
  data() {
    return {
      booking_link_selected: '',
      booking_link_options: [
        { name: 'booking-opening-hours'             , text: 'booking-opening-hours.opening-hours',     selected: false },
        { name: 'booking-resources'                 , text: 'booking-opening-hours.resources',         selected: false },
        { name: 'booking-items'                     , text: 'booking-opening-hours.booking-items',     selected: false },
        { name: 'booking-calendar-settings'         , text: 'booking-opening-hours.calendar-settings', selected: false },
        { name: 'booking-online-booking-settings'   , text: 'booking-opening-hours.online-booking',    selected: false },
      ]
    }
  },
  mounted(){
    this.booking_link_selected = this.$route.name
    this.booking_link_options.filter(link => link.name == this.$route.name)[0].selected = true
  },
  methods: {
    onClickBookingLink(link){
      this.$router.push(link)
    },
    onSelectBookingLink(){
      this.$router.push(this.booking_link_selected)
    },
  }
}
</script>

<style lang='scss'>
@import './booking-links.scss';
</style>