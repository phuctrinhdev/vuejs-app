<template>
  <div class="common-style">
    <b-modal id="fail-code-modal" 
             :title="'Fail Code'"
             :no-close-on-backdrop="true"
             hide-footer
             size="lg"
             @show="onLoadForm()">
      
      <div class="fail-code-box">
        <b-table
          id="my-table"
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
          small/>
            
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"/>
      </div>

      <div class="modal-footer">
        <a class="btn default cancel" block @click="hideModal">close</a>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { options } from '../../../helpers/options'
// import pagination from '../../../components/common/pagination/pagination.vue'

export default {
  data(){
    return {
      // options
      options: options,
      
      // temp data
      /*pagination: {
        page_number: 1,
        page_size: 10,
        total_items: 100,
        total_pages: 10
      },*/

      perPage: 9,
      currentPage: 1,
      items: [
        { id: 2002,  first_name: '결번 혹은 알 수 없는 번호', age: 2004, last_name: '지원하지 않는 미디어타입이거나 형식오류' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2007.2101, first_name: '메세지 포맷/값 오류', age: 2102, last_name: '일시적인 단말기 장애' },
        { id: 2101, first_name: '올바른 컨텐츠가 아님', age: 2104, last_name: '제한된 컨텐츠 크기 넘음' },
        { id: 2103, first_name: '미지원 단말기', age: 4006, last_name: '사용자가 많아 일시적 장애' },
        { id: 2511, first_name: '통신사 메시지 전송 대기시간 초과', age: 4007, last_name: '서비스를 요청한 client가 Permission이 없음' },
        { id: 3000, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2002,  first_name: '결번 혹은 알 수 없는 번호', age: 2004, last_name: '지원하지 않는 미디어타입이거나 형식오류' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2007.2101, first_name: '메세지 포맷/값 오류', age: 2102, last_name: '일시적인 단말기 장애' },
        { id: 2101, first_name: '올바른 컨텐츠가 아님', age: 2104, last_name: '제한된 컨텐츠 크기 넘음' },
        { id: 2103, first_name: '미지원 단말기', age: 4006, last_name: '사용자가 많아 일시적 장애' },
        { id: 2511, first_name: '통신사 메시지 전송 대기시간 초과', age: 4007, last_name: '서비스를 요청한 client가 Permission이 없음' },
        { id: 3000, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2002,  first_name: '결번 혹은 알 수 없는 번호', age: 2004, last_name: '지원하지 않는 미디어타입이거나 형식오류' },
        { id: 2003, first_name: '미등록 사용자', age: 2005, last_name: 'Message ID가 없음' },
        { id: 2007.2101, first_name: '메세지 포맷/값 오류', age: 2102, last_name: '일시적인 단말기 장애' },
        { id: 2101, first_name: '올바른 컨텐츠가 아님', age: 2104, last_name: '제한된 컨텐츠 크기 넘음' },
      ]

    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  methods: {
    onLoadForm(){
      // console.log('onLoadForm...')
    },
    onConfirm(){
      this.hideModal()
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('fail-code-modal')
    },
  }
}
</script>
<style lang="scss">
@import './client-information.scss';
</style>