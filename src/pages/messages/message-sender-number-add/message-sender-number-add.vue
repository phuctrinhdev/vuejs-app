<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>발신번호 등록 - todo (need certification, korea only)</h3>
          <button class="btn secondary flr mt5">
            <router-link :to="{ name: 'message-sender-numbers' }">발신번호 설정</router-link>
          </button>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part">
              <span class="badge badge-info badge-pill search-part">발신번호 입력</span> 
              <input type="text">
            </li>
            <li>
              <button class="btn secondary small mt5">인증수단선택</button>
            </li>
          </ul>
        </div>
        <div class="section-search-part clearfix">
          <table class="normal mb5">
            <tbody>
              <tr>
                <td class="bg-th">인증수단 선택</td>
                <td class="tal">
                  <b-form-radio-group class="dib">
                    <b-form-radio>휴대폰 본인인증</b-form-radio>
                    <b-form-radio>서류인증</b-form-radio>
                  </b-form-radio-group>
                </td>
              </tr>
              <tr>
                <td class="bg-th">이용자 성명</td>
                <td class="tal">
                  <input type="text">
                </td>
              </tr>
            </tbody>
          </table>
          <div class="certify"><button class="btn default">인증하기</button></div>
          <table class="normal mb5">
            <tbody>
              <tr>
                <td class="bg-th">인증수단 선택</td>
                <td class="tal">
                  <b-form-radio-group class="dib">
                    <b-form-radio>ARS 인증</b-form-radio>
                    <b-form-radio>서류인증</b-form-radio>
                  </b-form-radio-group>
                  <button class="btn secondary small">인증하기</button>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="tal">
                  <p class="mb5 fz13">* ARS ‘인증하기’ 버튼을 누른 후 ARS 전화가 걸려오면 인증번호를 듣고 입력하세요.</p>
                  <p class="mb3 fz13">* ARS 인증전화가 연결되지 않는경우</p>  
                  <p class="fz13">
                    - 현재 전화 수신이 가능한 상태인지 확인해 주세요.<br>
                    - 수신거부 및 착신전환 여부를 확인해 주세요.
                  </p>
                </td>
              </tr>
              <tr>
                <td class="bg-th">인증번호 입력</td>
                <td class="tal">
                  <input type="text">
                  <button class="btn secondary small">확인</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="bd caller-id-setup-info">
            <h4 class="mb10 fw-bold">■ 등록안내</h4>
            <dl>
              <dt class="mb5">▷ 등록순서</dt>
              <dd>- 등록할 발신번호를 입력 후 '인증수단선택'버튼을 눌러주세요.</dd>
              <dd>- 번호 인증수단을 선택하세요.</dd>
              <dd>- 인증수단에 따라 추가정보를 입력합니다.</dd>
            </dl>
            <dl>
              <dt class="mb5">▷ 등록가능한 번호</dt>
              <dd>- 유선전화 : 앞에 지역번호 필요(예 : 02.1111.2222) 내선번호는 불가</dd>
              <dd>- 휴대폰</dd>
              <dd>- 전국대표번호(15YY,16YY,18YY) : 총 8자리 숫자만 가능(예 : 15440001) 내선번호는 불가</dd>
              <dd>- 0N0 번호(030,050,070 등)</dd>
            </dl>
            <dl>
              <dt class="mb5">▷ 서류인증</dt>
              <dd>- 통신서비스 이용증명원(통신사에서 발급)을 보내주시면 확인 후 등록해드립니다.</dd>
              <dd>- Fax : (02) 6280-2285</dd>
              <dd>- 우편 : (431-060) 경기도 안양시 동안구 시민대로 401, 812호(주)아하소프트</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { options }    from '../../../helpers/options'
import component_base from '../../../components/common/component-base/component-base'

export default {
  extends: component_base,
  data() {
    return {
      options : options,
    }
  },
}
</script>

<style lang="scss">
@import './message-sender-number-add.scss';
</style>
