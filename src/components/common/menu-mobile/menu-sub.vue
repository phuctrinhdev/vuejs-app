<template>
  <div :class="{ expand: is_expand || menu_sub.text.length == 0 }" class="menu-sub">
    <h2 v-if="menu_sub.text.length > 0" @click="onTriggerSubmenu">{{ $t('menu.' + menu_sub.text) }}</h2>
    <ul>
      <li v-for="menu_sub_sub in menu_sub.submenu" :key="menu_sub_sub.index" class="menu-sub-sub"
          @click="onCloseMenuMobile">
        <router-link :to="menu_sub_sub.link">{{ $t('menu.' + menu_sub_sub.text) }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    menu_sub: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      is_expand: false
    }
  },
  methods: {
    onTriggerSubmenu(){
      this.is_expand = !this.is_expand
    },
    onCloseMenuMobile() {
      this.$emit('close-menu-mobile')
    }
  }
}
</script>