<template>
  <li class="home-board">
    <h2 @click="onSetBoardPage(data.board_code)">{{ data.head_title }}</h2>
    <dl v-if="data.board_code==options.boards_enum.board_type.sys_board 
    || data.board_code==options.boards_enum.board_type.chn_board" class="home-board-list">
      <dd v-for="item in data.items" :key="item.index"
          @click="onSetBoardViewPage(item, data.board_code)">
        <label v-for="index in item.depth" :key="index">
          &nbsp;
        </label>
        <label v-if="item.depth>0">
          ▷
        </label>
        {{ item.title }}
      </dd>
    </dl>
    <dl v-else class="home-board-list">
      <dd v-for="item in data.items" :key="item.index"
          @click="onSetBoardViewPage(item, data.board_code)">{{ item.title }}</dd>
    </dl>
  </li>
</template>

<script>
import { options }    from '../../../helpers/options'
import { mapActions } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      options: options,
    }
  },
  methods: {
    ...mapActions({
      boardPageFilter: 'board/setPageFilterData',
    }),
    ...mapActions('board', [
      'setBoardActionData',
    ]),
    onSetBoardPage(board_code){
      if(board_code == this.options.boards_enum.board_type.sys_notice 
          || board_code == this.options.boards_enum.board_type.sys_board 
          || board_code == this.options.boards_enum.board_type.chn_notice 
          || board_code == this.options.boards_enum.board_type.chn_board){
        this.boardPageFilter({
          search_type : this.options.boards_enum.search_board_type.title,
          contents    : null,
          page_number : 1
        })
        this.$router.push({ name: 'boards', params: { type: board_code }})
      }
    },
    onSetBoardViewPage(board, board_code){
      this.boardPageFilter({
        search_type : this.options.boards_enum.search_board_type.title,
        contents    : null,
        page_number : 1
      })
      let board_action = {
        id: board.id, 
        action: this.options.form_actions.view,
        board_type: board.board_code //1: notice, 2: popup
      }      
      this.setBoardActionData(board_action)
      this.$router.push({ name: 'board-view', params: { board_code: board_code }})
    }
  }
}
</script>

<style lang='scss'>
@import './home-board.scss';
</style>
