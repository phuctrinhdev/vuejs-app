<template>
  <li class="sales-today">
    <h2>{{ data.head_title }}</h2>
    <div class="sales-today-list">
      <dl class="sub-title">
        <dd v-for="item in data.items" :key="item.index">
          <span>{{ item.text }}</span>
          <span class="value">{{ $n(item.value) }}</span>
        </dd>
      </dl>
      <p v-if="data.total > 0" class="total">
        <span slot="end-title">{{ data.end_title }}</span>
        <strong>{{ $n(data.total) }}</strong>
      </p>
    </div>
  </li>
</template>

<script>

export default {
  props: { 
    data: {
      type: Object,
      default: () => []
    }
  },
  methods: {
    onSendMessagePage(){
      this.$router.push('send-text-messages')
    }
  },
}
</script>

<style lang='scss' scoped>
@import './sales-today.scss';
</style>
