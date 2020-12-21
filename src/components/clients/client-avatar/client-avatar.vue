<template>
  <div class="client-avatar">
    <div class="fll" @click="onClickClientAvatarOnPC()">
      <img v-if="has_avatar" :src="x_client.data.avatar.storage_file_name">
      <img v-else src="http://placehold.it/105x140">
    </div>
    
    <!-- <template v-if="is_mobile">
      <file-upload ref="file_upload" 
                   v-model="client_avatar.fields.files" 
                   accept="gif,png,jpeg,jpg"
                   @input-file="inputFile"
                   @input-filter="inputFilter">
        <img v-if="has_avatar" :src="x_client.data.avatar.storage_file_name">
        <img v-else src="http://placehold.it/105x140">
      </file-upload>
    </template>
    <template else>
      <div class="fll" @click="onClickClientAvatarOnPC()">
        <img v-if="has_avatar" :src="x_client.data.avatar.storage_file_name">
        <img v-else src="http://placehold.it/105x140">
      </div>
    </template> -->
    <client-avatar-action @add="onAddAvatar" @delete="onDeleteAvatar"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import component_base    from '../../../components/common/component-base/component-base'
import file_upload from 'vue-upload-component'
import client_avatar_action from '../client-avatar-action/client-avatar-action'
import {
  
} from '../../../helpers/common'

export default {
  components: {
    'client-avatar-action'      : client_avatar_action,
    'file-upload'               : file_upload
  },
  extends: component_base,
  props: { 
    
  },
  data(){
    return {
      is_mobile: this.isMobile(),
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    has_avatar(){
      return this.x_client.data && this.x_client.data.avatar && this.x_client.data.avatar.file_id
    },
  },
  methods: {
    isMobile(){
      return window.innerWidth <= 767.98 ? true : false
    },
    onClickClientAvatarOnPC(){
      this.showDialogById('client-avatar-action-modal')
    },
    onAddAvatar(){
      // compress image

      // connect api addClientAvatarAsync

    },
    onDeleteAvatar(){
      // connect api deleteClientAvatarAsync
    },
  }
}
</script>

<style lang='scss'>
@import './client-avatar.scss';
</style>