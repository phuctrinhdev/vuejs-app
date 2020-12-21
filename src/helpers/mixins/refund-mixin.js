import _                          from 'lodash'
import { mapMutations }           from 'vuex'
import { options }                from '../options'
import { sales_options }          from '../../helpers/options/sales-options'
import RefundApi                  from '../../api/sales/refund-api'
import RefundViewModel            from '../../view-model/sales/refund/refund-view-model'

export default {
  data(){
    return {
      refund_api: new RefundApi()
    }
  },
  methods: {
    ...mapMutations('refund', [
      'setRefundAction'
    ]),
    async onActionRefund(action, refund = new RefundViewModel().fields){
      let refund_action = {
        action: action,
        data: refund,
        options: {
          sales_goods_type: sales_options.sales_goods_type.service
        }
      }
      
      // prepair data
      if(action == options.form_actions.view) {
        refund_action.data = _.cloneDeep(refund)
      }
      else if(action == options.form_actions.part){
        this.notes_data = _.cloneDeep(refund)
      }
      this.setRefundAction(refund_action)
      
      // call modal
      if(action == options.form_actions.add) {
        this.showDialogById('refund-action-modal')
      }
      else if(action == options.form_actions.part){
        this.showDialogById('notes-action-modal')
      }
      else if(action == options.form_actions.view){
        this.showDialogById('refund-detail-modal')
      }

      // delete
      if(action == options.form_actions.delete){
        await this.deleteRefundAsync(refund)
      }
    },
    async deleteRefundAsync(refund){
      let result = await this.refund_api.deleteRefundAsync(refund)

      if(result.is_ok){
        // this.deleteRefundData(result.data)
      }
      else this.showAlert(result.error_messages)
    },
  }
}