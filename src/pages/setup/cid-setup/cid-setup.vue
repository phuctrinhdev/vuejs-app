<template>
  <main class="app-content">
    <section class="contents-style cid-setup common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('cid-setup.title') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <div class="clearfix mb5">
            <button class="btn secondary flr" @click="onCidHistory">{{ $t('cid-history.title') }}</button>&nbsp;&nbsp;
            <a :href="kt_cid_file.loc" download class="btn secondary flr">{{ $t('cid-setup.download-file') }}</a>&nbsp;&nbsp;
          </div>
          <table class="normal mb5">
            <tbody>
              <tr>
                <td class="bg-th">{{ $t('cid-setup.device-usage-status') }}</td>
                <td class="tal" colspan="3">
                  <div class="switch">
                    <radio-group v-model="cid_account.fields.status" :options="options.options_cid_usage_status" :buttons="true" 
                                 @change="onChangeStatus()"/>
                  </div>
                </td>
              </tr>
              <tr v-if="cid_account.fields.status==options.cid_usage_status.active">
                <td class="bg-th">{{ $t('cid-setup.account-setup') }}</td>
                <td v-if="!login_yn" colspan="3" class="tal">
                  <label>ID: </label><input v-model="cid_account.fields.cid_login_id" type="text" class="w60p">
                  <label>Password: </label><input v-model="cid_account.fields.cid_login_password" type="password" class="w40p">
                  <div class="btn-action-group">
                    <b-button class="btn2" @click="onAddOrUpdate()">{{ $t('cid-setup.apply') }}</b-button>
                    <b-button class="btn2" @click="onFindPassword()">{{ $t('cid-setup.find-password') }}</b-button>
                  </div>
                </td>
                <td v-else-if="login_yn" colspan="3" class="tal">
                  <label>ID: </label>
                  <input v-model="cid_account.fields.cid_login_id" type="text" class="w70p" 
                         disabled>
                  <div class="btn-action-group">
                    <b-button class="btn2" @click="onLogoutCid()">{{ $t('cid-setup.logout') }}</b-button>
                    <b-button class="btn2" @click="onCidAccountSetup()">{{ $t('cid-setup.environment-setup') }}</b-button>
                    <b-button class="btn2" @click="onSetMacAddress()">{{ $t('cid-setup.set-site') }}</b-button>
                  </div>
                </td>
              </tr>
              <tr v-if="shop_environment_setup.cid=='KT'">
                <td class="bg-th">{{ $t('cid-setup.cp-code') }}</td>
                <td class="tal">
                  70410
                </td>
                <td class="bg-th">{{ $t('cid-setup.solution-code') }}</td>
                <td class="tal">
                  01
                </td>
              </tr>
              <tr>                  
                <td colspan="4" class="tal">
                  <div class="text-box">
                    <p class="fz13">
                      {{ $t('cid-setup.info-1') }}
                    </p>
                    <p class="fz13">
                      {{ $t('cid-setup.info-2') }}
                    </p>
                    <p class="fz13">
                      {{ $t('cid-setup.info-3') }}
                    </p>                    
                  </div>
                  <div class="buttonbox clearfix">
                    <button class="btn secondary text-long flr" @click="showSample">{{ $t('cid-setup.view-sample') }}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>    
    <cid-information/>
  </main>
</template>

<script>
import cid_information from '../../../components/setup/cid-information/cid-information.vue'
import { mapGetters, mapActions } from 'vuex'
import component_base from '../../../components/common/component-base/component-base'
import CIDAccountViewModel from '../../../view-model/account/cid-account-view-model.js'
import { options } from '../../../helpers/options'
import CIDAccountApi from '../../../api/cid/cid-account-api'
import { equalObject }    from '../../../helpers/common'
import radio_group          from '../../../components/common/form/radio/radio-group/radio-group' 

export default {
  components : {
    'cid-information' :cid_information,
    'radio-group': radio_group,
  },
  extends: component_base,
  data() {
    return {
      options,
      shop_environment_setup: {},
      cid_account: {},
      cid_account_errors: [],
      exist_cid_account: false, 
      show_login_form: false,
      login_yn: false,
      kt_cid_file: {title: 'Upload Template', loc: require('../../../files/Ahasoft_KT_CID_1.0.1.18.zip')},
    }
  },
  computed: {
    ...mapGetters('shop', {
      shop_environment_data: 'getShopEnvironment'
    }),
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
    ...mapGetters('cid', {
      cid_status: 'getCidStatus'
    }),
    ...mapGetters('mac_address', {
      mac_address: 'getMacAddresses'
    }),  
  },
  watch: {
    'cid_status'(){
      this.getCidStatus()
    }
  },
  beforeMount(){  
    this.cid_account = new CIDAccountViewModel()
  },
  mounted() {
    this.show_login_form = false
    this.exist_cid_account=false
    this.getShopEnvironmentSetupData()
    this.login_yn = this.cid_status
  },
  methods: {
    ...mapActions('shop', [
      'setShopEnvironmentDataAsync'
    ]),
    getCidStatus(){

      this.login_yn = this.cid_status
    },
    async getShopEnvironmentSetupData(){
      let send_data = {
        shop_id            : this.shop_data.shop_id,
        country_code       : this.shop_data.country
      }
      this.preLoader()
      this.setShopEnvironmentDataAsync(send_data).then(() => {
        if(!this.shop_environment_data.is_ok){
          this.error_messages.push(this.shop_environment_data.error_messages)
        } 
        else{
          this.shop_environment_setup = this.shop_environment_data.data.fields
          if(this.shop_environment_setup.cid_accounts.length > 0)
          {
            for(let i in this.shop_environment_setup.cid_accounts){
              let item = this.shop_environment_setup.cid_accounts[i]
              if(equalObject(item.manager_id, this.user_data.user_name))
              {
                this.setCidAccountData(item.cid_account_id)
              }
              else this.exist_cid_account=false
            }
          }
        }
      })
      this.preLoader(false)
    },
    async setCidAccountData(cid_account_id){
      let query={
        shop_id: this.shop_data.shop_id,
        cid_account_id: cid_account_id
      }
      this.preLoader(true)
      let cid_account_api = new CIDAccountApi()
      let result = await cid_account_api.getCIDAccountAsync(query)
      this.preLoader(false)
      if(result.is_ok) {
        this.cid_account.fields = Object.assign({}, result.data)
        this.exist_cid_account=true
      }
      if(!this.login_yn) this.cid_account.fields.cid_login_password ='' 
    },
    onChangeStatus(){
      if(this.cid_account.fields.status==options.cid_usage_status.active) this.cid_account.fields.status=options.cid_usage_status.inactive
      else
      {
        this.cid_account.fields.status=options.cid_usage_status.active
      } 

      if(this.exist_cid_account) this.onAddOrUpdate()
      else this.show_login_form = true
    },
    onAddOrUpdate(){
      this.submitActionAsync()
    },
    async submitActionAsync(){
      this.cid_account.fields.shop_id = this.shop_data.shop_id
      // validate
      this.cid_account_errors = this.cid_account.isValid(this.cid_account.fields)
      if(this.cid_account_errors.length == 0) {
        this.preLoader(true)
        let cid_account_api = new CIDAccountApi()
        let result = await cid_account_api.addOrUpdateCIDAccountAsync(this.cid_account.fields)
        this.preLoader(false)
        if(result.is_ok)
        {
          if(result.data.status == options.cid_usage_status.active){
            this.loginCid(result.data)
          } 
          else  this.logoutCid()
        }
        else this.cid_account_errors = result.error_messages
      }
    },
    loginCid(test){
      this.$root.$emit('ktCid:login', test)
    },
    logoutCid(){
      this.$root.$emit('ktCid:logout')
    },
    onCidHistory(){
      this.$router.push({ name: 'cid-history'})
    },
    onFindPassword(){
      this.$root.$emit('ktCid:findPassword')
    },
    onLogoutCid(){
      this.cid_account.fields.cid_login_password=''
      this.$root.$emit('ktCid:logout')
    },
    onCidAccountSetup(){
      this.$root.$emit('ktCid:cidEnvironmenSetup')
    },
    onSetMacAddress(){
      this.cid_account.fields.mac_address = this.mac_address
      this.submitActionAsync()
    },
    showSample(){
      let routeData = {}
      routeData = this.$router.resolve({ name: 'cid-receive-call-popup', query: { cid_len: '00000000', type: 'sample' }})
      window.open(routeData.href, '_blank', ' left= 100' + ', top= 100' + ', width= 800px' + ', height=400px ' )
    }
  }
}
</script>

<style lang='scss'>
@import './cid-setup.scss';
</style>