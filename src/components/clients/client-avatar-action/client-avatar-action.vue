<template>
  <b-modal :id="modal_id"
           :class="modal_id"
           :title="form_title"
           :no-close-on-backdrop="true"
           size="sm"
           hide-footer
           @show="onLoadForm()"
           @hide="onCancel()">
    <div/>
    <div class="modal-wrapper">
      <div v-if="has_avatar" class="has-avatar">
        <div class="view-image-wrapper">
          <img src="http://skysky.wo.tc:33885/images/contents1/nolan.png">
        </div>
        <div class="modal-footer">
          <div class="btn-action-group">
            <button class="btn btn-default" @click="onDeleteImage">{{ $t('general.delete') }}</button>
            <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
          </div>
        </div>
      </div>

      <div v-else class="no-avatar">
        <div v-show="!can_edit_image" class="add-image-wrapper">
          <div class="search-image-wrapper">
            <div class="search-intro">
              <h3>{{ $t('client-photo.register-client-image') }}</h3>
              <ul>
                <li>- {{ $t('client-photo.file-extension-only') }}</li>
                <li>- {{ $t('client-photo.image-size-limit') }}</li>
              </ul>
            </div>
            <div class="search-image">
              <input v-if="!has_files" class="file-name" disabled>
              <input v-else 
                     v-model="client_avatar.fields.files[0].name" 
                     class="file-name" 
                     @input="onInputFileName()">
              <file-upload ref="file_upload" 
                           v-model="client_avatar.fields.files" 
                           accept="gif,png,jpeg,jpg"
                           @input-file="inputFile"
                           @input-filter="inputFilter">
                <button class="btn secondary small">{{ $t('client-photo.search-image') }}</button>
              </file-upload>
            </div>
          </div>
          <error-box :errors="errors"/>
          <div class="modal-footer">
            <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
          </div>
        </div>
        <div v-if="can_edit_image" class="edit-image-wrapper">
          <div v-if="has_files" class="avatar-edit-image">
            <img ref="edit_image" :src="client_avatar.fields.files[0].url">
          </div>
          <div class="modal-footer">
            <div class="btn-action-group">
              <button class="btn btn-default" @click="onEditImage">{{ $t('general.save') }}</button>
              <button class="btn btn-secondary" @click="onClearImage">{{ $t('general.cancel') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import radio_group                   from '../../common/form/radio/radio-group/radio-group.vue'
import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import { common_options }            from '../../../helpers/options/common-options.js'
import { options }                   from '../../../helpers/options'
import file_upload        from 'vue-upload-component'
import ClientPhotoApi from '../../../api/clients/client-photo-api'
import ClientAvatarViewModel from '../../../view-model/clients/client-photo/client-avatar-view-model'
import Cropper from 'cropperjs'

export default {
  components: {
    'error-box'       : error_box,
    'radio-group'     : radio_group,
    'btn-action-group': btn_action_group,
    'file-upload': file_upload
  },
  extends : component_base,
  data(){
    return {
      // common
      options,
      common_options,

      // modal
      modal_id: 'client-avatar-action-modal',
      form_options : {
        delete: false
      },
      errors       : [],

      // client avatar
      client_photo_api: new ClientPhotoApi(),
      client_avatar: new ClientAvatarViewModel(),
      is_avatar: false,
      is_edit: false,
      cropper: false
    }
  },
  computed:{
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('client_photo', {
      // x_client_avatar_action: 'getClientAvatarAction'
    }),
    form_title(){
      return this.$t('client-photo.image-register')
    },
    has_avatar(){
      return this.x_client.data && this.x_client.data.avatar && this.x_client.data.avatar.file_id
    },
    has_files(){
      return this.client_avatar.fields.files.length > 0
    },
    can_edit_image(){
      return this.has_files && this.is_edit
    }
  },
  watch: {
    is_edit(value) {
      if(value) {
        this.$nextTick(() => {
          if(this.can_edit_image) {
            let cropper = new Cropper(this.$refs.edit_image, {
              aspectRatio: 3 / 4,
              viewMode: 1,
            })
            this.cropper = cropper
          }
        })
      }
      else {
        if (this.cropper) {
          this.cropper.destroy()
          this.cropper = false
        }
      }
    },
    can_edit_image(){
      return this.has_files && this.is_edit
    }
  },
  methods:{
    ...mapMutations('client',[
      'updateClientAvatarToClientInformation'
    ]),
    
    hideModal(){
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },

    onLoadForm(){
      if(!this.has_avatar){
        this.client_avatar = new ClientAvatarViewModel()
      }
    },

    // Add Image
    inputFile(new_file, old_file) {
      if(new_file && !old_file) {
        this.$nextTick(() => {
          this.is_edit = true
        })
      }
      if(!new_file && old_file) {
        this.is_edit = false
      }
    },
    inputFilter(new_file, old_file, prevent) {
      if(new_file && !old_file) {
        let errors = []
        if (!(/\.(gif?|png?|jpeg?|jpg)$/i.test(new_file.name.toLowerCase()))) {
          errors.push(this.$i18n.t('client-photo.file-extension-only'))
        }
        if(new_file.size >= 1048576){
          errors.push(this.$i18n.t('boards.upload-error-image-size'))
        }
        if(errors.length > 0){
          this.showAlert(errors)
          return prevent()
        }

        if(new_file && (!old_file || new_file.file !== old_file.file)) {
          new_file.url = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            new_file.url = URL.createObjectURL(new_file.file)
          }
        }
      }
    },

    // Edit Image
    onEditImage(){
      this.is_edit = false

      let old_file = this.client_avatar.fields.files[0]
      let bin_str = atob(this.cropper.getCroppedCanvas().toDataURL(old_file.type).split(',')[1])
      let arr = new Uint8Array(bin_str.length)
      for(let i = 0; i < bin_str.length; i++) {
        arr[i] = bin_str.charCodeAt(i)
      }
      let file = new File([arr], old_file.name, { type: old_file.type })
      this.$refs.file_upload.update(old_file.id, {
        file,
        type: file.type,
        size: file.size,
        active: true,
      })
      this.client_avatar.mapAvatarFromFiles()
    },
    onClearImage(){
      this.client_avatar.fields.files = []
    },

    // Add Avatar
    async onConfirm() {
      // sample UI
      this.updateClientAvatarToClientInformation(this.client_avatar.fields.avatar)
      this.$emit('add')
      this.hideModal()

      // this.preLoader()
      // let response = this.client_photo_api.addClientAvatarAsync(this.client_avatar)
      // this.preLoader(false)

      // if(response.is_ok) {
      //   this.updateClientAvatarToClientInformation(this.client_avatar.fields.avatar)
      //   this.hideModal()
      // }
      // else this.showAlert(response.error_messages)
    },

    // Delete Avatar
    async onDeleteImage(){
      // sample UI
      this.updateClientAvatarToClientInformation({})
      this.$emit('delete')
      this.hideModal()

      // this.preLoader()
      // let response = this.client_photo_api.deleteClientAvatarAsync(this.client_avatar)
      // this.preLoader(false)

      // if(response.is_ok) {
      //   this.updateClientAvatarToClientInformation({})
      //   this.hideModal()
      // }
      // else this.showAlert(response.error_messages)
    },
  }
}
</script>

<style lang="scss">
@import './client-avatar-action.scss';
</style>
