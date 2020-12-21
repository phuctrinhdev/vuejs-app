<template>
  <b-modal id="iamport-result"
           :no-close-on-backdrop="true" title="iamport result"
           hide-footer
           @show="onLoadForm()">
    <div class="imp-container imp-result">
      <label
        v-if="success"
        style="fontSize: '200px'; color: '#52c41a';"
      />
      <label
        v-else
        style="fontSize: '200px'; color: '#f5222d';"
      />
      <h1>{{ type === 'payment' ? '결제' : '본인인증' }}에 {{ success ? '성공' : '실패' }}하였습니다</h1>
      <ul>
        <li>
          <span>아임포트 번호</span>
          <span>{{ impUid }}</span>
        </li>
        <li>
          <span>주문번호</span>
          <span>{{ merchantUid }}</span>
        </li>
        <li v-if="!success">
          <span>에러 메시지</span>
          <span>{{ errorMessage }}</span>
        </li>
      </ul>
      <button size="large" @click="handleGoBack">
        뒤로가기
      </button>
    </div>
    <div class="modal-footer">
      <btn-action-group :data="form_options" 
                        @confirm="onConfirm" @cancel="onConfirm" />
    </div>
  </b-modal>
</template>

<script>
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base from '../../../common/component-base/component-base'

export default {
  components: {
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  props: {
    send_result: {
      type: Object,
      default: ()=>({})
    }
  },  
  data() {
    // const { query } = this.$router.history.current
    //const { type } = this.data
    return {
      form_options: {
        delete: false
      },
      type: {},
      success: false, //this.getSuccess(this.data),
      impUid: '', //this.data.imp_uid,
      merchantUid: '', //this.data.merchant_uid,
      errorMessage: '', //`[${this.data.error_code}] ${this.data.error_msg}`,
    }
  },
  methods: {
    onLoadForm(){
      this.type = this.send_result
      this.success = this.getSuccess(this.send_result)
      this.impUid = this.send_result.imp_uid
      this.merchantUid  = this.send_result.merchant_uid
      this.errorMessage = `[${this.send_result.error_code}] ${this.send_result.error_msg}`
    },
    getSuccess(query) {
      const { success } = query
      const impSuccess = query.imp_success
      if (impSuccess === undefined) {
        if (typeof success === 'string') {
          return success === 'true'
        }
        return success
      }
      if (typeof impSuccess === 'string') {
        return impSuccess === 'true'
      }
      return impSuccess
    },
    handleGoBack() {
      this.$router.push(`/${this.type}s`)
    },
    onConfirm(){
      this.hideModal()
    },
    hideModal(){
      this.hideDiaglogById('iamport-result')
    },    
  },
}
</script>