<template>
  <b-modal id="text-special-emoticon-modal" 
           :title="$t('messages.special-emoticon-add-title')"
           :no-close-on-backdrop="true"
           hide-footer
           size="sm">
    <div class="mespop">
      <div class="bd slide-y sm">    
        <ul class="cf">
          <li @click="addChar('^^')">^^</li>
          <li @click="addChar('^_^')">^_^</li>
          <li @click="addChar('^o^')">^o^</li>
          <li @click="addChar('*^^*')">*^^*</li>
          <li @click="addChar('^L^)')">^L^)</li>
          <li @click="addChar('-_-;')">-_-;</li>

          <li @click="addChar('-.-')">-.-</li>
          <li @click="addChar('^.~')">^.~</li>
          <li @click="addChar('@.@')">@.@</li>
          <li @click="addChar('ㅎ.ㅎ')">ㅎ.ㅎ</li>
          <li @click="addChar('(*-*)')">(*-*)</li>
          <li @click="addChar('^.~')">^.~</li>

          <li @click="addChar('^ε^')">^ε^</li>
          <li @click="addChar('=^.^=')">=^.^=</li>
          <li @click="addChar('~_~')">~_~</li>
          <li @click="addChar('(~.^)s')">(~.^)s</li>
          <li @click="addChar('⊙.⊙')">⊙.⊙</li>
          <li @click="addChar('*♥o♥*')">*♥o♥*</li>

          <li @click="addChar('(^ε^*)')">(^ε^*)</li>
          <li @click="addChar('o(^^o')">o(^^o</li>
          <li @click="addChar('~^.^~')">~^.^~</li>
          <li @click="addChar('(*^}{^*)')">(*^}{^*)</li>
          <li @click="addChar('@-m-m--')">@-m-m--</li>
          <li @click="addChar('(*..)(..*)')">(*..)(..*)</li>

          <li @click="addChar('^^a')">^^a</li>
          <li @click="addChar('↖(^o^)↗')">↖(^o^)↗</li>
          <li @click="addChar('^o^♬')">^o^♬</li>
          <li @click="addChar('(/^o^)/♡')">(/^o^)/♡</li>
          <li @click="addChar('^_^;(^0^)')">^_^;(^0^)</li>
          <li @click="addChar('(^.*)')">(^.*)</li>

          <li @click="addChar('(-_-+)')">(-_-+)</li>
          <!-- <li @click="addChar('<~_~>')"><~_~></li>
          <li @click="addChar('{>-<}')">{>-<}</li> -->
          <li @click="addChar('<~_~>')"><span v-html="'<~_~>'"/> </li>
          <li @click="addChar('{>-<}')"><span v-html="'{>-<}'"/></li>        
          <li @click="addChar('(=_=)z')">(=_=)z</li>
          <li @click="addChar('($_$)')">($_$)</li>
          <li @click="addChar('☜_☞')">☜_☞</li>

          <li @click="addChar('♡..♡')">♡..♡</li>
          <li @click="addChar('*♥♥*')">*♥♥*</li>
          <li @click="addChar('(^_^)/')">(^_^)/</li>
          <li @click="addChar('⊙⊙;')">⊙⊙;</li>
          <li @click="addChar('⊙-⊙')">⊙-⊙</li>
          <li @click="addChar('^_^)b')">^_^)b</li>

          <li @click="addChar('-_-)a')">-_-)a</li>
          <li @click="addChar('(/^0^)/')">(/^0^)/</li>
          <li @click="addChar('(-.-)Zz')">(-.-)Zz</li>
          <li @click="addChar('(-_-)')">(-_-)</li>
          <li @click="addChar('(_ _)')">(_ _)</li>
          <li @click="addChar('(-.-)')">(-.-)</li>
        </ul>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-default" @click="hideModal">{{ $t('general.close') }}</button>
    </div>
  </b-modal>
</template>

<script>
import component_base from '../../../components/common/component-base/component-base'

export default {
  extends: component_base,
  methods: {
    addChar(ch) {
      this.$emit('addChar', ch)
    },
    hideModal(){
      this.hideDialogById('text-special-emoticon-modal')
    }
  }
}
</script>