<template>
  <b-modal id="cid-send-call-modal" 
           :title="$t('cid-send-call.send-call')"
           size="sm" 
           hide-footer no-close-on-backdrop @show="onLoadForm()" >
    <p class="mb0">
      {{ $t('cid-send-call.phone-number') }} &nbsp;&nbsp;
      <input v-model="send_to_phone_number" type="text" class="w70p">
    </p>
    <footer class="modal-footer">
      <slot name="footer">
        <b-button class="btn2"
                  @click="onConfirm">{{ $t('cid-send-call.send-call') }}</b-button>
        <b-button class="btn2 green"
                  @click="onCancel">{{ $t('general.cancel') }}</b-button>
      </slot>
    </footer>
  </b-modal>
</template>

<script>
import component_base from '../../common/component-base/component-base'


export default {
  extends: component_base,
  props: {
    call_number: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      send_to_phone_number: '',
      sendCallNumber:''
    }
  },
  created(){
    this.$root.$off('ktCid:closeCall')

    this.$root.$on('ktCid:closeCall', x=> this.hideModal(x))
  },
  methods: {
    async onLoadForm(){
      this.send_to_phone_number = this.call_number
    },
    onCancel(){
      this.hideModal()
    },
    hideModal() {
      this.hideDialogById('cid-send-call-modal')
    },
    async onConfirm(){
      this.$root.$emit('ktCid:sendCall', this.send_to_phone_number )
    },
  }
}
</script>