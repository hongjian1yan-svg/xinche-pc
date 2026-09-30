<template>
  <!-- 右侧悬浮栏（全站公共，迁移 js/common.js renderFloatBar：hover 弹层为 CSS :hover 实现；电话/小程序/公众号/回顶部） -->
  <div class="float-bar">
    <div class="float-item" :aria-label="t('ui.phone')">
      <span class="fi-icon el-icon-phone-outline"></span><span class="fi-text">{{ t("ui.phone") }}</span>
      <div class="float-pop">
        <div class="fp-phone"><i class="el-icon-phone-outline"></i>{{ SITE.hotline }}</div>
        <div v-if="SITE.contactEmail" class="fp-email"><i class="el-icon-message"></i>{{ SITE.contactEmail }}</div>
      </div>
    </div>
    <div class="float-item" :aria-label="t('ui.miniapp')">
      <span class="fi-icon fi-svg"><svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M626.176 279.552c74.24 0 134.656 55.808 134.656 124.928 0 21.504-6.144 42.496-17.408 61.44-16.896 27.648-44.032 48.128-76.8 57.856-8.704 2.56-15.36 3.584-21.504 3.584-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6c1.024 0 3.072 0 5.632-1.024 22.016-6.144 39.424-18.944 49.152-35.84 6.656-10.752 9.728-22.528 9.728-34.816 0-40.448-37.376-73.728-82.944-73.728-15.872 0-31.232 4.096-45.056 11.776-24.064 13.824-38.4 36.864-38.4 61.952v214.528c0 43.52-24.064 83.456-64 105.984-21.504 12.288-45.568 18.432-70.144 18.432-74.24 0-134.656-55.808-134.656-124.928 0-21.504 6.144-42.496 17.408-61.44 16.896-27.648 44.032-48.128 76.8-57.856 9.216-2.56 15.36-3.584 21.504-3.584 14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6c-1.024 0-3.072 0-5.632 1.024-22.016 6.656-39.424 19.456-49.152 35.84-6.656 10.752-9.728 22.528-9.728 34.816 0 40.448 37.376 73.728 83.456 73.728 15.872 0 31.232 4.096 45.056-11.776 24.064-13.824 38.4-36.864 38.4-61.952V404.48c0-43.52 24.064-83.456 64-105.984 20.992-12.8 45.056-18.944 69.632-18.944z m-520.704 230.4c0 226.304 183.296 409.6 409.6 409.6s409.6-183.296 409.6-409.6-183.296-409.6-409.6-409.6-409.6 183.296-409.6 409.6z m-51.2 0c0-254.464 206.336-460.8 460.8-460.8s460.8 206.336 460.8 460.8-206.336 460.8-460.8 460.8-460.8-206.336-460.8-460.8z m0 0"/></svg></span>
      <span class="fi-text">{{ t("ui.miniapp") }}</span>
      <!-- REPLACE: 小程序码 /img/qr-miniapp.png（当前占位图，样式 .qr-ph 背景） -->
      <div class="float-pop"><div class="qr-ph" :data-label="t('ui.miniapp')"></div>{{ t("ui.miniappTip") }}</div>
    </div>
    <div class="float-item" :aria-label="t('ui.wechat')">
      <span class="fi-icon fi-svg"><img src="/img/wechat-float.svg" alt="" aria-hidden="true"></span>
      <span class="fi-text">{{ t("ui.wechat") }}</span>
      <!-- REPLACE: 公众号二维码（当前占位图 .qr-ph） -->
      <div class="float-pop"><div class="qr-ph" data-label="WeChat"></div>{{ t("ui.scanTip") }}</div>
    </div>
    <div class="float-item ft-top" :aria-label="t('ui.top')" :title="t('ui.top')" @click="toTop">
      <span class="fi-icon el-icon-caret-top"></span>
    </div>
  </div>
</template>

<script>
/* #AI:dev 悬浮栏：hover 弹出（CSS）、回顶部平滑滚动；与原实现一致 */
import { SITE } from "@/mixins/site";
import { t } from "@/i18n";
export default {
  name: "FloatBar",
  mixins: [SITE],
  methods: {
    t,
    toTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
  }
};
</script>
