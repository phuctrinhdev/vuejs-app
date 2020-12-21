<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('user-accounts.title') }}</h3>
        </article>
        <div class="section-part">            
          <div class="top-text clearfix mb10">
            <div class="cutom-checkbox fll">
              <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
            </div>
            <ul class="btn-group clearfix flr">
              <li>
                <b-button class="btn secondary" @click="onLoginHistory">{{ $t('user-accounts.login-history') }}</b-button>
              </li>
              <li>
                <b-button class="btn secondary" @click="onActionUserAccount(options.form_actions.add)">{{ $t('user-accounts.add-user') }}</b-button>
              </li>
            </ul>
          </div>
          <div class="slide-x small">
            <view-table :data="table_data">
              <template slot="edit" slot-scope="{ row }">
                <b-button @click="onActionUserAccount(options.form_actions.edit, row)">{{ $t('general.edit') }}</b-button>
              </template>
              <template slot="password" slot-scope="{ row }">
                <b-button @click="onPasswordEdit(row)">{{ $t('user-accounts.change') }}</b-button>
              </template>
            </view-table>
          </div>
          <p class="fz13 mt5">
            {{ $t('user-accounts.create-info') }}
          </p>
        </div>
        <div class="bd" v-html="$t('user-accounts.info')"/>
      </div>
    </section> 
    <!-- modal action -->
    <user-account-action @reload-page="onReloadPage"/>
    <password-edit :data="password_data"/>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }                from '../../../helpers/options'
import component_base             from '../../../components/common/component-base/component-base'
import user_account_action        from '../../../components/account/user-account-action/user-account-action'
import password_edit              from '../../../components/account/password-edit/password-edit'
import view_table                 from '../../../components/common/view-table/view-table'
import show_inactives from '../../../components/common/show-inactives/show-inactives.vue'

export default {
  components: {
    'show-inactives'      : show_inactives,
    'view-table'          : view_table,
    'user-account-action' : user_account_action,
    'password-edit'       : password_edit
  },
  extends: component_base,
  data() {
    return {
      options : options,
      table_data: {
        fields: [
          { field: 'user_id',        label: 'user-accounts.id',             width: '23%',  sortable: false },
          { field: 'user_role_name', label: 'user-accounts.user-privilege', width: '22%',  sortable: false },
          { field: 'staff_name',     label: 'user-accounts.staff',          width: '25%',  sortable: false },
          { field: 'edit',           label: 'general.edit',                 width: '15%',  sortable: false, expand: true },
          { field: 'password',       label: 'general.password',             width: '15%',  sortable: false, expand: true },
        ],
        rows: [],
        options: {
          pagination: false,
          fixed_header: false
        },
        style: 'normal'
      },
      table_filter: {
        page_size: options.pagination.max,
        page_number: 1,
        status: options.common_status.all,
        shop_id: 0,
        search_solution_name: null
      },
      password_data: {}
    }
  },
  computed: {
    ...mapGetters('user_account', {
      user_account_data: 'getUserAccounts'
    })
  },
  mounted() {
    this.table_filter.solution_id = this.shop_data.solution_id
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
  },
  methods: {
    ...mapActions('user_account', [
      'getUserAccountsDataAsync',
      'setUserAccountActionDataAsync',
    ]),
    async loadTableData() {
      this.preLoader()
      await this.getUserAccountsDataAsync(this.table_filter)
      if(this.user_account_data.is_ok){
        this.table_data.rows = this.user_account_data.data.items
      }
      else this.showAlert(this.user_account_data.error_messages)

      this.preLoader(false)
    },
    onActionUserAccount(action, user_account = {}){
      let user_account_action = {
        action: action,
        id: user_account.id,
        shop_id: this.shop_data.shop_id,
        status: user_account.status
      }
      this.setUserAccountActionDataAsync(user_account_action).then(() => {
        this.showDialogById('action-user-account-modal')
      })
    },
    onPasswordEdit(user_account){
      this.password_data = {
        user_account_id: user_account.id,
        shop_id: this.shop_data.shop_id,
        user_id: user_account.user_id
      }
      this.$nextTick(() => {
        this.showDialogById('password-edit-modal')
      })
    },
    onReloadPage(){
      this.loadTableData()
    },
    onLoginHistory(){
      this.$router.push(({ name: 'login-histories' }))
    },
    onShowInactives(){
      this.loadTableData(this.table_filter)
    },
  }
}
</script>