<template>
  <main class="app-content">
    <section class="content login-page">
      <div class="inner">
        <div class="login-wrapper">
          <h2 class="logo">
            <span class="logo-icon"/>
          </h2>
          <h3 class="tac">{{ $t('login.salon-login') }}</h3>
          <form>
            <p class="mb10">
              <input id="username" ref="id" v-model="id" 
                     :placeholder="$i18n.t('login.enter-id')"
                     type="text" autocomplete="nope"
                     class="w100p">
            </p>
            <p class="mb10">
              <input id="password" ref="pw" v-model="pw" 
                     :placeholder="$i18n.t('login.enter-password')"
                     type="password" autocomplete="new-password"
                     class="w100p"
                     @keyup.enter="onTryLogin">
            </p>
            <p class="mb10">
              <b-form-checkbox v-model="remember_id" class="check-custom check-secondary">
                {{ $t('login.remember-id') }}
              </b-form-checkbox>
            </p>
          </form>
          <p class="mt20 mb10">
            <b-button id="btnLogin" class="login-btn btn2" @click="onTryLogin" >{{ $t('login.login') }}</b-button>
          </p>
          <span class="login-intro color-gray">{{ $t('login.if-forgot-id-password') }}</span>

          <!-- ======================= modal components ========================== -->
          <b-modal id="login-alert" ref="my-modal"
                   :title="$i18n.t('general.alert')" 
                   size="sm" class="alert"
                   hide-footer
                   @hidden="onAlertHidden">
            <p v-html="alert_msg"/>
            <footer class="modal-footer">
              <slot name="footer">
                <button class="btn2" block @click="hideModal">{{ $t('general.confirm') }}</button>
              </slot>
            </footer>
          </b-modal>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import component_base from '../../../components/common/component-base/component-base'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { options } from '../../../helpers/options'
import { cache_session } from '../../../helpers/common'
export default {
  extends: component_base,
  data(){
    return {
      options,
      id: '',
      pw: '',
      remember_id: false,
      alert_msg: ''
    }
  },
  computed: {
    ...mapGetters('user',[
      'getLoggedIn',
      'getRememberId'
    ]),
    text_please_enter_id(){return this.$t('login.please-enter-id')},
    text_please_enter_pw(){return this.$t('login.please-enter-password')},
  },
  created () {
    this.setLogout()

    let id = this.getRememberId
    if(id != '' ){
      this.id         = id
      this.remember_id= true
    }
  },
  mounted() {
    cache_session.clearAllSession()
  },
  methods: {
    ...mapMutations('user',[
      'setLogout',
      'setRememberId'
    ]),
    ...mapActions('user', [
      'setUserData',
      'setShopData',
      'getUserDataAsync'
    ]),
    hideModal() {
      this.hideDialogById('login-alert')
    },
    async onTryLogin(){
      cache_session.clearAllSession()
      if ( !this.remember_id) this.setRememberId('')

      if(this.id.trim() ==''){
        this.alert_msg = this.$t('logins.please-enter-id')
        this.showAlert([this.alert_msg])
      }
      else if(this.pw.trim() ==''){
        this.alert_msg = this.$t('logins.please-enter-password')
        this.showAlert([this.alert_msg])
      }
      else {
        let query={
          user_id : this.id,
          password: this.pw
        }
        this.preLoader()
        let result = await this.getUserDataAsync(query)
        this.preLoader(false)
        if (result.is_ok) {
          this.setUserData(result.data)
          if (this.remember_id) this.setRememberId(query.user_id)
          cache_session.setShopIdCache(result.data.user_auth_info.shop_id)
          this.$router.push({ name: 'home', params: { from_login: true } })
        }
        else {
          const error= result.error_messages[0]
          let fail_count= 0
          if (error.errorValues && error.errorValues[0] && error.errorValues[0].indexOf(': ')>=0) {
            fail_count =error.errorValues[0].split(': ')[1]
          }

          if(error.errorCode=='UA14C' || error.errorCode=='UA01R') { //The UserAccount does not exist            
            this.alert_msg = this.$t('logins.id-or-password-incorrect') 
            + '<p/>' + ( (fail_count>0) ? this.$t('logins.if-5times-fail') + `(${fail_count}/5)` :'' )
            this.showAlert([this.alert_msg])
          }
          else if(error.errorCode=='UA29C') { // Your account is blocked
            this.alert_msg = this.$t('logins.failed-5times')
            this.showAlert([this.alert_msg])
          }
          else if(error.errorCode=='UA28C') { // User account is inactive
            this.alert_msg = this.$t('logins.account-inactive')
            this.showAlert([this.alert_msg])
          }
          else {
            this.showAlert(result.error_messages)
          }
        }
      }
    },
    onAlertHidden(){
      this.$nextTick(() => {
        if(this.$refs.user_id.value.trim() =='')
          this.$refs.user_id.focus()
        else this.$refs.user_pw.focus()
      })
    }
  }
}
</script>

<style lang='scss'>
@import './login.scss';
</style>
