import _                          from 'lodash'
import { mapMutations }           from 'vuex'
import { options }                from '../../helpers/options'
import { sales_options }          from '../../helpers/options/sales-options'
import SalesApi                   from '../../api/sales/sales-api'
import SalesBriefViewModel        from '../../view-model/sales/sales/sales-brief-view-model'
import SalesDeleteViewModel       from '../../view-model/sales/sales/sales-delete-view-model'

let _sales_delete = null

export default {
  data(){
    return {
      sales_api: new SalesApi(),
      notes_data: {
        notes: ''
      },
    }
  },
  methods: {
    ...mapMutations('sales',[
      'setSalesAction',
      'deleteSales',
    ]),
    async onActionSalesMixin(action, sales = new SalesBriefViewModel().fields, status){
      let sales_action = {
        action : action,
        data   : sales,
        options: {
          sales_goods_type: sales_options.sales_goods_type.service,
          status : status
        }
      }
      
      // prepair data
      if(action == options.form_actions.edit || action == options.form_actions.view) {
        sales_action.data = _.cloneDeep(sales)
      }
      else if(action == options.form_actions.part){
        this.notes_data = _.cloneDeep(sales)
      }

      this.setSalesAction(sales_action)

      // call modal
      if(action == options.form_actions.add  || action == options.form_actions.edit) {
        this.showDialogById('sales-action-modal')
      }
      else if(action == options.form_actions.view){
        this.showDialogById('sales-detail-modal')
      }
      else if(action == options.form_actions.part){
        this.showDialogById('notes-action-modal')
      }

      // delete
      if(action == options.form_actions.delete){
        _sales_delete = sales
      }
    },

    async deleteSalesMixin(){
      let sales_delete_vm = new SalesDeleteViewModel()
      sales_delete_vm.setSalesDeleteFromSales(_sales_delete)
      
      let result = await this.sales_api.deleteSalesAsync(sales_delete_vm)
      return result
    }
  }
}