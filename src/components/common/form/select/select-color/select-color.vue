<template>
  <div class="select-color-wrapper">
    <multiselect ref="multiselect" 
                 v-model="color_id" :options="options.booking.booking_client_color_options"
                 :searchable="false" :close-on-select="true" :clear-on-select="false" 
                 :show-labels="false" :preserve-search="true"
                 label="name" track-by="id" placeholder=""
                 class="select-color"
                 @input="onInput($event)"
                 @mouseleave.native="onMouseleave">
      <template slot="selection">
        <span :style="{ background: getColorView(value) }" class="selected"/>
      </template>
      
      <template slot="option" slot-scope="props">
        <span :style="{ background: props.option.color }" class="color-option"/>
      </template>
    </multiselect>
  </div>
</template>

<script>
import { options } from '../../../../../helpers/options'
import multiselect from 'vue-multiselect'

export default {
  components: {
    multiselect
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
  },
  data(){
    return {
      options,

      set: 0
    }
  },
  computed: {
    color_id:{
      get(){
        return this.value
      },
      set(color_new){
        this.set = color_new.id
      }
    }
  },
  methods: {
    onInput(){
      this.$emit('input', this.set)
    },
    onMouseleave(){
      if(this.$refs.multiselect.isOpen) 
        this.$refs.multiselect.toggle()
    },
    getColorView(color_id){
      let color_selected_view = ''
      let color_selected_option = options.booking.booking_client_color_options.filter(option => option.id == color_id)
      if(color_selected_option.length > 0) 
        color_selected_view = color_selected_option[0].color

      return color_selected_view
    },
  }
}
</script>

<style lang="scss">
.select-color-wrapper{
  width: 80px;
  .multiselect.select-color {
    box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
    .multiselect__select {
      &:before {
        top: -4px;
        border-top: 7px solid $gray-dark;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }
    }
    .multiselect__tags {
      padding: 0;
      .selected {
        display: block;
        width: 100%;
        height: 100%;
      }
      .multiselect__single {
        display: none;
      }
    }
    .multiselect__content-wrapper {
      border-color: $gray;
      .multiselect__content {
        .multiselect__element {
          .multiselect__option{
            height: 24px;
            padding: 0;
            &.multiselect__option--highlight {
              background: transparent;
            }
            &>span.color-option {
              display: block;
              height: 100%;
              margin: 0;
              padding: 12px;
            }
          }
        }
      }
    }
  }
}
</style>