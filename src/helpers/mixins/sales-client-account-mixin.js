import { mapGetters }           from 'vuex'
import SalesClientAccountViewModel from '../../view-model/sales/outstanding/client-account-view-model'

export default {
  computed: {
    ...mapGetters('sales_client_account', {
      x_sales_client_account: 'getSalesClientAccount'
    }),
    sales_client_account(){
      let tmp_sales_client_account_vm = new SalesClientAccountViewModel()
      tmp_sales_client_account_vm.setFields(this.x_sales_client_account)
      return tmp_sales_client_account_vm
    },
  }
}