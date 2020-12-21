<template>
  <div class="sales-total-header-wrapper">
    <div class="row">
      <div class="col-12">
        <div class="page-title">
          <h3>{{ $t('report.sales-report') }}</h3>
          <ul class="group-btn">
            <li class="btn"><a>{{ $t('general.print') }}</a></li>
          </ul>
        </div>
      </div>
      <div class="col-12">
        <div class="sales-total-links">
          <ul class="btn-group clearfix">
            <li v-for="(link, i) in sales_total_link_options" :key="i"
                :class="{ active: link.selected }" @click="onClickLink(link.name)">{{ $t(link.text) }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      sales_total_link_options: [
        { name: 'sales-total'       , text: 'report.sales-total',     selected: false },
        { name: 'sales-by-staff'    , text: 'report.sales-by-staff',  selected: false },
        { name: 'sales-by-item'     , text: 'report.sales-by-item',   selected: false }
      ]
    }
  },
  mounted(){
    this.sales_total_link_options.filter(link => link.name == this.$route.name)[0].selected = true
  },
  methods: {
    onClickLink(link){
      this.$router.push(link)
    },
  }
}
</script>

<style lang='scss'>
.sales-total-header-wrapper {
  .page-title {
    margin: 0 0px 10px;
    box-sizing: border-box;
    border-bottom: 1px solid $gray-dark;
    padding-bottom: 10px;
    h3 {
      display: inline-block;
      margin-top: 10px;
      padding-left: 0;
      font-weight: 900;
      font-size: 18px;
    }
    .group-btn {
      float: right;
      .btn {
        display: inline-block;
        width: 150px !important;
        a {
          display: block;
          color: $white;
        }
      }
    }
  }
  .sales-total-links {
    margin-bottom: 10px;
    ul {
      li {
        display: block;
        padding: 6px 27px;
        border: solid 1px #adb5bd;
        border-radius: 0;
        line-height: 21px;
        &:hover, &.active {
          background-color: #7c79b6;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
}
@media screen and (max-width: 575.98px) {
  .sales-total-header-wrapper {
    .sales-total-links {
      ul {
        li {
          padding: 5px 10px;
        }
      }
    }
  }
}
</style>