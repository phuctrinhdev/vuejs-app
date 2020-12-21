<template>
  <div class="common-style">
    <b-modal id="photo-show-modal" 
             ref="my-modal"            
             :title="'Photo Magnified'"             
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm()">             
      
      <div class="photo-show-box">
        <p class="photo-border-box tac">
          <img src="http://placehold.it/300x300" alt="임시 이미지">
        </p>
        <div class="clearfix photo-text-box">
          <div class="left-box fll">
            <div class="view-box">
              <p class="color-gray fz13">
                03-01-2018 by Bruno Mars
              </p>
              <p class="multiple-line-ellipsis color-gray photo-note-show">
                If ther is notes show it here 
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos atque dignissimos, at accusamus explicabo provident ratione esse odio facere magnam repudiandae unde ipsam sunt ab est temporibus, exercitationem ducimus consectetur.
              </p>
            </div>
            <div class="edit-box">
              <select class="w100p custom-select">
                <option>Bruno Mars</option>
              </select>
              <textarea class="note noresize w100p" cols="30" rows="10"/>
            </div>
          </div>
          <div class="buttonbox flr">
            <ul class="view-box-button">
              <li><a class="btn secondary">Edit</a></li>
              <li><a class="btn secondary">Delete</a></li>
              <li><a class="btn secondary">Cancel</a></li>
            </ul>
            <ul class="edit-box-button">
              <li><a class="btn secondary">Save</a></li>
              <li><a class="btn secondary">Cancel</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <a class="btn default" block @click="hideModal">Save</a>
        <a class="btn default cancel" block @click="hideModal">Cancel</a>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { options } from '../../../helpers/options'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'

export default {
  components: {
    // pagination,
    'btn-action-group': btn_action_group
  },
  data(){
    return {
      // options
      options: options,

    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  methods: {
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
      this.$refs['my-modal'].hide()
    },
  }
}
</script>
<style lang="scss">
@import './client-information.scss';
</style>