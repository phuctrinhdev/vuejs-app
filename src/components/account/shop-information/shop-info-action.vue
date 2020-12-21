<template>
  <div class="common-style add-item-modal">
    <b-modal :id="page_id"
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="md"
             @show="onLoadForm()">
      <form ref="form" class="form-wrapper clearfix">
        <div class="form-group">
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.shop-name') }}</dt>
            <dd>{{ shop_info.fields.shop_name }}</dd>
          </dl> 
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.business-type') }}</dt>
            <dd>{{ shop_info.fields.business_type_name }}</dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.owner-name') }}</dt>
            <dd><input v-model="shop_info.fields.owner_name" type="text" class="w80p"></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.owner-mobile-number') }}</dt>
            <dd><input v-model="shop_info.fields.owner_mobile_number" type="number" class="w80p"></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.manager-name') }}</dt>
            <dd><input v-model="shop_info.fields.manager_name" type="text" class="w80p"></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.manager-title') }}</dt>
            <dd><input v-model="shop_info.fields.manager_title" type="text" class="w80p"></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.phone-number') }}</dt>
            <dd><input v-model="shop_info.fields.phone_number" type="number" class="w80p"></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.mobile-number') }}</dt>
            <dd><input v-model="shop_info.fields.mobile_number" type="number" class="w80p"></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.email') }}</dt>
            <dd><input v-model="shop_info.fields.email" type="text" class="w80p"></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.postcode') }}</dt>
            <dd><input v-model="shop_info.fields.post_code" :disabled="isKorea" type="text" 
                       class="w80p"> <span v-if="isKorea" class="search-img" @click="onFindPostCodeKR"/></dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('shop-info.address') }}</dt>
            <dd>
              <p class="mb5"><input v-model="shop_info.fields.address1" :disabled="isKorea" type="text" 
                                    class="w100p"></p>
              <p><input v-model="shop_info.fields.address2" type="text" class="w100p"></p>
            </dd>
          </dl>
        </div>      
      </form>
      <error-box :errors="shop_info_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="hideModal"/>
      </div>
    </b-modal>
    <find-postcode-kr v-if="isKorea" ref="find_postcode" @update-address = "setPostCodeKR"/>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { options } from '../../../helpers/options'
import radio_group from '../../common/form/radio/radio-group/radio-group'
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import find_postcode_kr    from '../../../components/common/find-postcode/find-postcode-kr'

import component_base    from '../../common/component-base/component-base'

import ShopInfoViewModel from '../../../view-model/account/shop-info-view-model'
import ShopInfoApi       from '../../../api/account/shop-info-api'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'find-postcode-kr': find_postcode_kr
  },
  extends: component_base,
  data(){
    return {
      page_id: 'shop-info-action-modal',
      options : options,

      shop_info: new ShopInfoViewModel(),
      shop_info_errors: [],

      form_title: this.$t('shop-info.basic-info'),
      form_options: {
        delete: false
      },
      isKorea: false
    }
  },
  
  computed: {
    ...mapGetters('shop', {
      action_data: 'getShopInfoAction'
    }),
    ...mapGetters('user', {
      user_data: 'getUser',
      shop_data: 'getShop'
    })
  },
  mounted() {
    this.isKorea = false
    if(this.shop_data.country == options.country_code.kr) this.isKorea= true
  },
  methods: {
    ...mapMutations('user',[
      'setUserFromUpdateShopInfo'
    ]),
    onFindPostCodeKR() {
      this.$refs.find_postcode.onFindPostCodeKR()
    },	
    setPostCodeKR(postcode, address){
      this.shop_info.fields.post_code = postcode
      this.shop_info.fields.address1 =  address
      this.shop_info.fields.address2 = ''
    },
    onLoadForm(){
      if(this.action_data.action == options.form_actions.edit){
        this.shop_info.fields = Object.assign({}, this.action_data.data)
      }     
    },
    onConfirm(){
      this.shop_info_errors=[]      
      if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateShopInfoAsync')
      }
    },
    async submitActionAsync(api_action){      
      this.shop_info_errors = this.shop_info.isValid()
      if(this.shop_info_errors.length == 0) {
        this.preLoader(true)
        let api = new ShopInfoApi()
        //let result = await api[api_action](this.shop_info.fields)
        let result = await api[api_action](this.shop_info)
        this.preLoader(false)
        if(result.is_ok) {
          let user = {
            user_auth_info: this.user_data,
            shop_basic_info:  this.shop_data
          }
          user.shop_basic_info.phone_number = this.shop_info.fields.phone_number
          this.setUserFromUpdateShopInfo(user)
          this.$emit('reload-page')
          this.hideModal()
        }
        else this.shop_info_errors = result.error_messages
      }
    },
    hideModal(){
      this.hideDialogById(this.page_id)
    },    
  }
}
</script>
<style lang="scss">
@import './shop-information.scss';
</style>
