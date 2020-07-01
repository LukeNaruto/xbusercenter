<template>
  <footer>
    <div class="footer-link">
      <ul class="link-box">
        <li v-for="(item, key) in footerLink"
            :key="key"><a :href="item.url"
             target="_blank">{{item.name}}</a></li>
      </ul>
      <p>© {{year}} Minibai.com All Rights Reserved. 小白浏览器 蜀ICP备13014908号</p>
    </div>
  </footer>
</template>
<style lang="less" scoped>
footer {
  background: #f2f2f2;
}
.footer-link {
  width: 1100px;
  height: 120px;
  margin: 0 auto;
  padding: 14px 0 28px 0;
  box-sizing: border-box;
  font-size: 14px;
  & p {
    text-align: center;
    color: #b3b3b3;
  }
  //background: #000;
}
.link-box {
  padding: 28px 228px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  a {
    line-height: 12px;
    color: #5f6368;
    &:hover {
      color: #222;
    }
  }
}
</style>
<script>
import { footerLink } from '@const';
export default {
  created () {
  },
  data () {
    return {
      footerLink,
      year: (new Date()).getFullYear()
    }
  }
}

</script>
