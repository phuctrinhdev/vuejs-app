<template>
  <b-modal id="text-special-character-modal" 
           :title="$t('messages.special-character-add-title')"
           :no-close-on-backdrop="true"
           hide-footer
           size="sm">
    <div class="mespop">
      <div class="bd slide-y sm">    
        <ul class="cf">
          <li @click="addChar('＃')">＃</li>
          <li @click="addChar('＆')">＆</li>
          <li @click="addChar('＊')">＊</li>
          <li @click="addChar('＠')">＠</li>
          <li @click="addChar('§')">§</li>
          <li @click="addChar('※')">※</li>
          <li @click="addChar('☆')">☆</li>
          <li @click="addChar('★')">★</li>
          <li @click="addChar('○')">○</li>
          <li @click="addChar('●')">●</li>
          <li @click="addChar('◎')">◎</li>
          <li @click="addChar('◇')">◇</li>
          <li @click="addChar('◆')">◆</li>
          <li @click="addChar('□')">□</li>
          <li @click="addChar('■')">■</li>
          <li @click="addChar('△')">△</li>
          <li @click="addChar('▲')">▲</li>
          <li @click="addChar('▽')">▽</li>
          <li @click="addChar('▼')">▼</li>
          <li @click="addChar('→')">→</li>
          <li @click="addChar('←')">←</li>
          <li @click="addChar('↑')">↑</li>
          <li @click="addChar('↓')">↓</li>
          <li @click="addChar('↔')">↔</li>
          <li @click="addChar('〓')">〓</li>

          <li @click="addChar('◁')">◁</li>
          <li @click="addChar('◀')">◀</li>
          <li @click="addChar('◈')">◈</li>
          <li @click="addChar('▣')">▣</li>
          <li @click="addChar('◐')">◐</li>
          <li @click="addChar('◑')">◑</li>
          <li @click="addChar('▒')">▒</li>
          <li @click="addChar('▤')">▤</li>
          <li @click="addChar('▥')">▥</li>
          <li @click="addChar('▨')">▨</li>
          <li @click="addChar('▧')">▧</li>
          <li @click="addChar('▦')">▦</li>
          <li @click="addChar('▩')">▩</li>
          <li @click="addChar('♨')">♨</li>
          <li @click="addChar('☏')">☏</li>
          <li @click="addChar('☎')">☎</li>
          <li @click="addChar('☜')">☜</li>
          <li @click="addChar('☞')">☞</li>
          <li @click="addChar('¶')">¶</li>
          <li @click="addChar('†')">†</li>
          <li @click="addChar('‡')">‡</li>
          <li @click="addChar('↕')">↕</li>
          <li @click="addChar('↗')">↗</li>
          <li @click="addChar('↙')">↙</li>
          <li @click="addChar('↖')">↖</li>

          <li @click="addChar('↘')">↘</li>
          <li @click="addChar('♭')">♭</li>
          <li @click="addChar('♩')">♩</li>
          <li @click="addChar('♪')">♪</li>
          <li @click="addChar('♬')">♬</li>
          <li @click="addChar('㉿')">㉿</li>
          <li @click="addChar('㈜')">㈜</li>
          <li @click="addChar('№')">№</li>
          <li @click="addChar('㏇')">㏇</li>
          <li @click="addChar('™')">™</li>
          <li @click="addChar('㏂')">㏂</li>
          <li @click="addChar('㏘')">㏘</li>
          <li @click="addChar('℡')">℡</li>
          <li @click="addChar('®')">®</li>
          <li @click="addChar('ª')">ª</li>
          <li @click="addChar('º')">º</li>
          <li @click="addChar('！')">！</li>
          <li @click="addChar('＇')">＇</li>
          <li @click="addChar('，')">，</li>
          <li @click="addChar('．')">．</li>
          <li @click="addChar('／')">／</li>
          <li @click="addChar('：')">：</li>
          <li @click="addChar('；')">；</li>
          <li @click="addChar('＾')">＾</li>
          <li @click="addChar('＿')">＿</li>

          <li @click="addChar('｀')">｀</li>
          <li @click="addChar('。')">。</li>
          <li @click="addChar('·')">·</li>
          <li @click="addChar('‥')">‥</li>
          <li @click="addChar('…')">…</li>
          <li @click="addChar('〃')">〃</li>
          <li @click="addChar('∥')">∥</li>
          <li @click="addChar('＼')">＼</li>
          <li @click="addChar('∼')">∼</li>
          <li @click="addChar('´')">´</li>
          <li @click="addChar('∧')">∧</li>
          <li @click="addChar('∨')">∨</li>
          <li @click="addChar('～')">～</li>
          <li @click="addChar('ˇ')">ˇ</li>
          <li @click="addChar('˘')">˘</li>
          <li @click="addChar('˝')">˝</li>
          <li @click="addChar('˚')">˚</li>
          <li @click="addChar('˙')">˙</li>
          <li @click="addChar('¸')">¸</li>
          <li @click="addChar('˛')">˛</li>
          <li @click="addChar('¡')">¡</li>
          <li @click="addChar('¿')">¿</li>
          <li @click="addChar('ː')">ː</li>
          <li @click="addChar('＋')">＋</li>
          <li @click="addChar('－')">－</li>

          <li @click="addChar('±')">±</li>
          <li @click="addChar('×')">×</li>
          <li @click="addChar('÷')">÷</li>
          <li @click="addChar('≠')">≠</li>
          <li @click="addChar('≤')">≤</li>
          <li @click="addChar('≥')">≥</li>
          <li @click="addChar('∞')">∞</li>
          <li @click="addChar('∴')">∴</li>
          <li @click="addChar('♂')">♂</li>
          <li @click="addChar('♀')">♀</li>
          <li @click="addChar('∠')">∠</li>
          <li @click="addChar('⊥')">⊥</li>
          <li @click="addChar('⌒')">⌒</li>
          <li @click="addChar('∂')">∂</li>
          <li @click="addChar('∇')">∇</li>
          <li @click="addChar('≡')">≡</li>
          <li @click="addChar('≒')">≒</li>
          <li @click="addChar('≪')">≪</li>
          <li @click="addChar('≫')">≫</li>
          <li @click="addChar('√')">√</li>
          <li @click="addChar('∽')">∽</li>
          <li @click="addChar('∝')">∝</li>
          <li @click="addChar('∵')">∵</li>
          <li @click="addChar('∪')">∪</li>
          <li @click="addChar('∩')">∩</li>
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
      this.hideDialogById('text-special-character-modal')
    }
  }
}
</script>