<template>
  <div class="form-group repeat-week-type">
    <radio-group v-model="repeat_week_type" :options="repeat_week_type_options" :buttons="false"
                 @input="onInput" @change="onChange"/>
  </div>
</template> 
<script> 
import { options } from '../../../../../helpers/options'
import radio_group from '../radio-group/radio-group' 

export default {
  components: {   
    'radio-group': radio_group
  },
  props: {
    value: {
      type: Number, 
      default: 0
    },
    disabled_options: {
      type: Array, 
      default: () => []
    }
  },
  data(){
    return {
      options,

      set: 0
    }
  },
  computed: { 
    repeat_week_type: {
      set(type){
        this.set = type
      },
      get(){
        return this.value
      }
    },
    repeat_week_type_options() {
      let week_list = [
        { value: options.repeat_type.none,        text: 'booking-opening-hours.none'      },
        { value: options.repeat_type.every_week,  text: 'booking-opening-hours.every-week'},
        { value: options.repeat_type.biweekly,    text: 'booking-opening-hours.biweekly'  },
        { value: options.repeat_type.monthly,     text: 'booking-opening-hours.monthly'   },
      ]

      if(this.disabled_options.length > 0){
        for(let i in this.disabled_options){
          week_list = week_list.filter(week => week.value != this.disabled_options[i])
        }
      }

      return week_list
    }
  }, 
  methods: {
    onInput(){
      this.$emit('input', this.set)
    },
    onChange(){
      this.$emit('change', this.set)
    }
  }
}
</script>