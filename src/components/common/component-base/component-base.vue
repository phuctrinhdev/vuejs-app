<script>
import { mapGetters, mapActions } from 'vuex'
import { MOBILE_MAX_WIDTH } from '../../../config/constant'
import { isNullObject } from '../../../helpers/common'
export default {
  data() {
    return {
      errors: []
    }
  },
  computed: {
    ...mapGetters('user', {
      x_user   : 'getUser',
      shop_data: 'getShop',
    }),
  },
  methods:{
    ...mapActions('alert', [
      'setIsLoadingData'
    ]),
    isNullObject, 

    preLoader(loading = true){
      this.setIsLoadingData(loading)
    }, 
    isMobile(){
      return window.innerWidth <= MOBILE_MAX_WIDTH ? true : false
    },
    onMouseLeaveSelect(e){
      e.target.blur()
    },

    showDialogById(dialog_id){
      this.$root.$emit('bv::show::modal', dialog_id) 
    },
    hideDialogById(dialog_id){
      this.$root.$emit('bv::hide::modal',dialog_id)
    },
    showAlert(messages, option = undefined){
      this.showAlertDialog(messages, option)
    },
    showAlertDialog(alerts, option = undefined){
      this.$store.dispatch('alert/setAlertsData', alerts)  
      if(option != undefined)
        this.$store.dispatch('alert/setOptionsData', option)
      this.showDialogById('alert-modal')
    },

    // booking
    isMissingCalendarSetup(booking_setup){
      return booking_setup.error_messages && booking_setup.error_messages.length > 0
    },

    // sales
    isMissingSalesSetup(sales_setup){
      return sales_setup.error_messages && sales_setup.error_messages.length > 0
    },

    showMissingClientsSetupAlert(){
      this.showAlert([this.$i18n.t('clients.missing-clients-setup')])
    },
    showMissingStaffSetupAlert(){
      this.showAlert([this.$i18n.t('staff.missing-staff-setup')])
    },
  }
}
</script>
