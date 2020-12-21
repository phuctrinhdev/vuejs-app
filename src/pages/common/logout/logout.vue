<template>
  <div/>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      
    }
  },
  created () {
    this.setLogout()
    this.$router.push({ name: 'login' })
  },
  methods: {
    ...mapMutations('user',[
      'setLogout'
    ]),
  }
}
</script>
