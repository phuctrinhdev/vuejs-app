<template>
  <dd class="user-translate">
    <multiselect ref="multiselect" 
                 v-model="locale" :options="locales"
                 :searchable="false" :show-labels="false" :allow-empty="false"
                 @input="loadLocale($event)"
                 @mouseleave.native="onMouseleave"/>
  </dd>
</template>

<script>
import multiselect from 'vue-multiselect'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: { 
    'multiselect': multiselect
  },
  data () {
    return {
      locale: this.$i18n.locale,
      locales: ['en', 'ko'],
      locales_loaded: [this.$i18n.locale]
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
  },
  watch: {
    'user_data.language'(){
      this.setData()
    },
  },
  beforeMount() {
    this.locale = this.user_data.language
  },
  methods: {
    ...mapActions('translate', [
      'setLocaleData',
    ]),
    loadLocale: function(locale) {
      const i18n = this.$i18n
      return import(/* webpackChunkName: "locale--[request]" */ `./../../../translate/${locale}.json`)
        .then(msgs => {
          i18n.locale = locale
          i18n.setLocaleMessage(locale, msgs.default)
          document.querySelector('html').setAttribute('lang', locale)

          this.setLocaleData(locale)
          this.$root.$emit('change-locale', locale)
        })
    },
    setData(){
      this.locale = this.user_data.language
      this.loadLocale(this.user_data.language)
    },
    onMouseleave(){
      if(this.$refs.multiselect.isOpen) 
        this.$refs.multiselect.toggle()
    }
  }
}
</script>

<style lang='scss'>
@import './translate.scss';
</style>
