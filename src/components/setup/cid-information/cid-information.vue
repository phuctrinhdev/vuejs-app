<template>
  <div class="common-style">
    <b-modal id="modal-cid-information"
             ref="formModal"
             :no-close-on-backdrop="true"
             title="CID Information"
             hide-footer
             size="lg"
             class="modal-cid-information"
             @show="onLoadForm()">            
      <form class="form-wrapper clearfix">
        <div class="slide-x small">
          <table class="normal">
            <tbody>
              <tr>
                <td colspan="5">
                  <div class="clearfix">
                    <span class="fll">김응삼 고객님 010-1111-2222</span>
                    <span class="flr">2018-10-10 13:33:24</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td rowspan="6">
                  <img src="../../../template/images/common/cid-sample.jpg" alt="cid-sample">
                </td>
                <td class="bg-th">고객번호</td>
                <td>12345</td>
                <td class="bg-th">생일</td>
                <td>05-01 (양)</td>
              </tr>
              <tr>
                <td class="bg-th">고객등급</td>
                <td>VIP</td>
                <td class="bg-th">담당자</td>
                <td>김쌤</td>
              </tr>
              <tr>
                <td class="bg-th">총횟수</td>
                <td>2</td>
                <td class="bg-th">등록일</td>
                <td>2017-05-24</td>
              </tr>
              <tr>
                <td class="bg-th">마지막 방문</td>
                <td>2018-10-01<br>(스트레이트펌 외 2건)</td>
                <td class="bg-th">선불잔액</td>
                <td>200,000</td>
              </tr>
              <tr>
                <td class="bg-th">예약</td>
                <td colspan="3">
                  최근 1년간 예약 총 2건, <strong class="color-red">불이행 1건</strong> (최근:2018-09-21)
                </td>
              </tr>
              <tr>
                <td class="bg-th">메모</td>
                <td colspan="3">
                  <textarea class="note noresize w100p" cols="30" rows="10"/>
                </td>
              </tr>
              <tr>
                <td colspan="6">
                  <div class="buttonbox">
                    <button class="btn secondary text-long">고객상세정보</button>
                    <button class="btn secondary text-long">예약등록</button>
                    <button class="btn secondary text-long">창닫기</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form> 
    </b-modal>
  </div>
</template>

<script>

</script>

<style lang="scss">
@import './cid-information.scss';
</style>
