<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ title }}</h3>
        </article>
        <div class="section-part">            
          <div class="slide-x small">
            <div id="System_in">
              <div class="inner show clearfix">
                <table style=":hover { border: 0 }">
                  <tbody>
                    <tr>
                      <td>{{ $t('boards.title') }}</td>
                      <td colspan="3" class="txt hover-none">{{ board.title }}</td>
                    </tr>
                    <tr>
                      <td>{{ $t('general.registered-date') }}</td>
                      <td :colspan="setting_form && setting_form.display_read_count? 1 : 3" class="txt hover-none">{{ formatDateBySetting(convertDateFromUtcToTimezone(board.registration_data, shop_data.timezone), true) }}</td>
                      <template v-if="setting_form && setting_form.display_read_count">
                        <td>{{ $t('boards.read-count') }}</td>
                        <td class="txt hover-none">
                          {{ board.read_count }}
                        </td>
                      </template>
                    </tr>
                    <tr>
                      <td>{{ $t('boards.writer') }}</td>
                      <td class="txt hover-none">
                        <div v-if="(board.created_by_user_role == options.user_roles.admin_master) || (board_code == options.boards_enum.board_type.sys_notice && board_type == options.boards_enum.board_code.popup)">
                          {{ $t('general.ahasoft') }}
                        </div>
                        <div v-else>
                          {{ board.created_by_user_id }} ( {{ board.shop_name }} )
                        </div>
                      </td>
                      <td>{{ $t('boards.user-role') }}</td>
                      <td class="txt hover-none">{{ showUserRole(board.created_by_user_role) }}</td>
                    </tr>
                    <tr v-if="setting_form && setting_form.allow_master_only_reading">
                      <td>{{ $t('boards.master-only-post') }}</td>
                      <td colspan="3" class="txt hover-none">
                        <b-form-checkbox v-model="board.master_only_reading"
                                         :value="true"
                                         :unchecked-value="false"
                                         disabled
                                         class="check-custom check-secondary">{{ $t('boards.master-only') }}</b-form-checkbox></td>
                    </tr>
                    <tr>
                      <td v-if="board_type == options.boards_enum.board_code.popup" colspan="4" class="contents">
                        <p class="p-contents">{{ board.contents }}</p>
                        <template v-if="board.file!=null">
                          <img v-if="isImage(board.file)" :src="imagePath(board.file)">
                        </template>
                      </td>
                      <td v-else-if="setting_form && setting_form.board_group_type == options.boards_enum.board_group_type.notice" colspan="5" class="contents">
                        <p class="p-contents">{{ board.contents }}</p>
                        <template v-for="(file, index) in board.files">
                          <p :key="index"><img v-if="isImage(file)" :key="index" :src="imagePath(file)"></p>
                        </template>
                      </td>
                      <td v-else-if="setting_form && setting_form.board_group_type == options.boards_enum.board_group_type.board" colspan="5" class="contents">
                        <p class="p-contents">{{ board.contents }}</p>
                      </td>
                    </tr>
                    <tr v-if="(setting_form && setting_form.allow_file_attachment && board.file_attachment_count > 0) || (board_type == options.boards_enum.board_code.popup && board.file != null)">
                      <td>{{ $t('boards.attached-files') }}</td>
                      <td colspan="3" class="txt hover-none">
                        <table class="type-top mb5">
                          <thead>
                            <tr>
                              <td class="bg-deepgreen" style="width:80%">{{ $t('boards.file-name') }}</td>
                              <td class="bg-deepgreen tac" style="width:20%">{{ $t('boards.file-size') }}</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colspan="2">
                                <div v-if="board_type == options.boards_enum.board_code.popup" class="bd slide-y sssm padding-sm">
                                  <ul v-if="board.file != null" class="file-attachment" 
                                      @click="onDownloadFile(board.file)">
                                    <li class="fll p3" style="width:80%;">{{ board.file.name }}</li>
                                    <li class="fll p3" style="width:20%">{{ formatSize(board.file.size) }} </li>
                                  </ul>
                                </div>
                                <div v-else class="bd slide-y sssm">
                                  <ul v-for="(file, index) in board.files" :key="index" class="file-attachment"
                                      @click="onDownloadFile(file)">
                                    <li class="fll p3" style="width:80%">{{ file.name }}</li>
                                    <li class="fll p3" style="width:20%">{{ formatSize(file.size) }} </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>	
                <div class="flr mt10">
                  <button v-if="setting_form && setting_form.board_group_type == options.boards_enum.board_group_type.board" 
                          class="btn secondary" @click="onActionBoard(options.form_actions.add)">{{ $t('boards.reply') }}</button>
                  <button v-if="x_user.user_name == board.created_by_user_id" class="btn secondary" @click="onActionBoard(options.form_actions.edit)">{{ $t('general.edit') }}</button>
                  <button class="btn secondary" block @click="onListPage()">{{ $t('general.cancel') }}</button>
                  <button v-if="x_user.user_name == board.created_by_user_id" class="btn secondary" @click="onActionBoard(options.form_actions.delete)">{{ $t('general.delete') }}</button>
                </div>					
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import { mapActions
  , mapGetters }          from 'vuex'
import { options }        from '../../../helpers/options'
import component_base     from '../../../components/common/component-base/component-base'
import BoardManagementApi from '../../../api/boards/board-management-api'
import NoticeApi          from '../../../api/boards/notice-api'
import BoardApi           from '../../../api/boards/board-api'
import POPUpApi              from '../../../api/boards/popup-api'
import FileAttachmentApi  from '../../../api/boards/file-attachment-api'
import { formatSize
  , cookieAction
  , formatDateBySetting
  , convertDateFromUtcToTimezone
  , showUserRoles } from '../../../helpers/common'

export default {
  extends: component_base,
  data() {
    return {
      options: options,
      title: null,
      board_code: null,
      setting_form: null,
      board: {},
      id: 0,
      file_attachment_api: null,
      board_type: options.boards_enum.board_code.sysnotice
    }
  },
  computed: {
    ...mapGetters('board', {
      action_data: 'getBoardAction',
    }),
  },
  async mounted() {
    this.board_type = this.action_data.board_type

    // Refresh...
    if(this.action_data.action == null){
      this.setPageFilterData({
        search_type : options.boards_enum.search_board_type.title,
        contents    : null,
        page_number : 1
      })
      this.$router.push({ name: 'boards', params: { type: this.$route.params.board_code }})
      return 
    }

    this.file_attachment_api = new FileAttachmentApi()
    this.id = this.action_data.id
    this.board_code = this.$route.params.board_code
    let data_send = {}
    let result = null

    await this.setForm()

    this.preLoader()
    let api = null
    if(this.setting_form.board_group_type == options.boards_enum.board_group_type.notice){
      if(this.board_type == options.boards_enum.board_code.popup)
      {
        let popup_api = new POPUpApi()
        let data_send = {
          popup_id     : this.id,
          country_code : this.shop_data.country
        }
        result = await popup_api.getPOPUpAsync(data_send)
      }
      else
      {
        api = new NoticeApi()
        data_send = {
          notice_id    : this.id,
          country_code : this.shop_data.country
        }
        result = await api.getNoticeAsync(data_send)
      }
    }else{
      api = new BoardApi()
      data_send = {
        board_id     : this.id,
        country_code : this.shop_data.country
      }
      result = await api.getBoardAsync(data_send)
    }

    if(result.is_ok){
      this.board = result.data

      // Increase Read Count
      if(this.x_user.user_id != this.board.created_by_user_id){
        let read_count_flag = false
        if(cookieAction(this, this.options.cookie_action.exist, 'board_id')){
          if(cookieAction(this, this.options.cookie_action.get, 'board_id').indexOf(';' + this.board_code + String(this.id) + ';') == -1){ // New BoardId
            cookieAction(this, this.options.cookie_action.set, 'board_id', '1d', cookieAction(this, this.options.cookie_action.get, 'board_id') + this.board_code + String(this.id) + ';')
            read_count_flag = true
          }
        }
        else{
          // Set First Cookie
          cookieAction(this, this.options.cookie_action.set, 'board_id', '1d', ';' + this.board_code + String(this.id) + ';')
          read_count_flag = true
        }

        if(this.board_type != options.boards_enum.board_code.popup)
        {
          // Increase Read Count Api Action
          if(read_count_flag){
            this.preLoader()
            let read_count_result = null
            if(this.setting_form.board_group_type == options.boards_enum.board_group_type.notice)
              read_count_result = await api.updateNoticeReadCountAsync(this.id)
            else
              read_count_result = await api.updateBoardReadCountAsync(this.id)
            
            if(!read_count_result.is_ok)
              this.showAlert(read_count_result.error_messages)
            this.preLoader(false)
          }
        }
        this.board.shop_name = this.action_data.shop_name
      }
    }
    else 
      this.showAlert(result.error_messages)
    this.preLoader(false)

    this.title = this.$i18n.t('boards.' + this.shop_data.country + '-' + this.board_code)
  },
  methods: {
    formatDateBySetting,
    convertDateFromUtcToTimezone,
    formatSize,
    ...mapActions('board', [
      'setPageFilterData',
      'setBoardActionData'
    ]),
    async setForm() {
      let data_send = {
        country_code: this.shop_data.country,
        board_code: this.board_code,
        status: options.common_status.all
      }

      this.preLoader()
      let board_management_api = new BoardManagementApi()
      let result = await board_management_api.getBoardManagementAsync(data_send)

      if(result.is_ok)
        this.setting_form = result.data
      else 
        this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    async onActionBoard(action){
      let result = null
      let api = null

      if(action == options.form_actions.delete){
        this.preLoader()
        
        this.setPageFilterData(1)
        if(this.setting_form.board_group_type == options.boards_enum.board_group_type.notice){
          api = new NoticeApi()
          result = await api.deleteNoticeAsync(this.id)
        }else{
          api = new BoardApi()
          result = await api.deleteBoardAsync(this.id)
        }
        if(result.is_ok) 
          this.onListPage()
        else 
          this.showAlert(result.error_messages)

        this.preLoader(false)
      }else { // Delete ,Reply (Only Board) : Id == ParentId
        let board_action = {
          id: this.id, 
          action: action
        }
        this.setBoardActionData(board_action)
        this.$router.push({ name: 'board-action', params: { board_code: this.board_code }})
      }
    },
    onListPage(){
      this.$router.push({ name: 'boards', params: { type: this.board_code }})
    },
    async onDownloadFile(file){
      file.country_code = this.shop_data.country
      await this.file_attachment_api.getFileAttachmentAsync(file)
    },
    imagePath(file){
      if(this.board_type == options.boards_enum.board_code.popup){
        // eslint-disable-next-line no-undef
        return process.env.AZURE_STORAGE_BOARD_URL + this.shop_data.country + '/POPUp/' + this.board.shop_id + '/' + file.storage_file_name
      }
      else{
        // eslint-disable-next-line no-undef
        return process.env.AZURE_STORAGE_BOARD_URL + this.shop_data.country + '/' + file.board_code + '/' + this.board.shop_id + '/' + file.storage_file_name
      }
    },
    isImage(file){
      if (/\.(gif?|png?|jpeg?|jpg?)$/i.test(file.name.toLowerCase()))
        return true
      else
        return false
    },
    showUserRole(user_role){
      return showUserRoles(user_role)
    }
  }
}

</script>
<style lang='scss'>
@import './board-view.scss';
</style>