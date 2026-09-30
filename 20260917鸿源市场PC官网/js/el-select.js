/* #AI:design —— el-select 仿 ElementUI 2.15.14 下拉选择组件（纯静态实现，零依赖）
   用法：<select id="x">…</select> 后调用 enhanceSelect(el) 即自动替换为 Element 风格组件。
   原 select 保留在 DOM 中隐藏，value 同步，校验/取值为零改动。
   视觉规格（Element theme-chalk select）：
   - 触发器：高40 边框#dcdfe6 圆角4 文字14px #606266；占位 #a8abb2；caret #C0C4CC，展开旋转180°
   - 面板：border #e4e7ed 圆角4 阴影 0 2px 12px rgba(0,0,0,.1)；max-height 274 滚动；padding 6px 0
   - 选项：height 34 line-height 34 padding 0 20px 14px；hover #f5f7fa；选中 主色加粗(单选)；空选项 -/disabled #c0c4cc */
(function () {
  var OPEN = null; /* 当前展开组件 */

  function closeOpen() {
    if (!OPEN) return;
    OPEN.wrap.classList.remove("is-open");
    OPEN = null;
  }
  document.addEventListener("click", function () { closeOpen(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeOpen(); });

  function enhanceSelect(sel) {
    if (sel.dataset.elEnhanced) { syncView(sel); return; }
    sel.dataset.elEnhanced = "1";

    /* 防止原生 select 被聚焦/键盘触发弹出系统下拉（与自定义面板叠压） */
    sel.tabIndex = -1;
    sel.addEventListener("keydown", function (e) { e.preventDefault(); });
    sel.addEventListener("mousedown", function (e) { e.preventDefault(); });

    var wrap = document.createElement("div");
    wrap.className = "el-select";
    wrap.innerHTML =
      '<div class="el-select-trigger" tabindex="0">' +
        '<span class="el-select-display"></span>' +
        '<i class="el-icon-caret-bottom el-select-caret"></i>' +
      '</div>' +
      '<div class="el-select-dropdown"><div class="el-select-scroll"><ul class="el-select-menu"></ul></div></div>';
    sel.parentNode.insertBefore(wrap, sel.nextSibling);
    wrap.appendChild(sel); /* select 移入 wrap 内隐藏，保持 value 归属 */
    sel.classList.add("el-select-native");

    var trigger = wrap.querySelector(".el-select-trigger");
    var display = wrap.querySelector(".el-select-display");
    var menu = wrap.querySelector(".el-select-menu");
    var scrollBox = wrap.querySelector(".el-select-scroll");

    function options() { return Array.prototype.slice.call(sel.options); }

    function renderMenu() {
      menu.innerHTML = options().map(function (o, i) {
        var disabled = o.value === "" || o.disabled;
        var cls = "el-select-opt" + (o.value === sel.value ? " selected" : "") + (disabled ? " is-empty" : "");
        return '<li class="' + cls + '" data-i="' + i + '">' +
          (o.value === sel.value && o.value !== "" ? '<i class="el-icon-check"></i>' : "") +
          '<span>' + esc(o.textContent) + "</span></li>";
      }).join("");
    }

    window.__syncSel = window.__syncSel || [];
    window.__syncSel.push(function () { syncView(sel); });

    function syncViewInner() {
      var o = sel.options[sel.selectedIndex];
      var empty = !sel.value;
      display.textContent = o ? o.textContent : "";
      display.classList.toggle("is-placeholder", empty);
      sel.classList.toggle("is-empty", empty);
      renderMenu();
    }
    sel.__sync = syncViewInner;
    syncViewInner();
    if (window.MutationObserver) {
      var optionObserver = new MutationObserver(syncViewInner);
      optionObserver.observe(sel, { childList: true, subtree: true, characterData: true });
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = wrap.classList.contains("is-open");
      closeOpen();
      if (!wasOpen) {
        wrap.classList.add("is-open");
        OPEN = { wrap: wrap };
        /* 当前选中项滚动可见 */
        var cur = menu.querySelector(".selected");
        if (cur) scrollBox.scrollTop = Math.max(0, cur.offsetTop - scrollBox.clientHeight / 2 + cur.clientHeight / 2);
      }
    });

    menu.addEventListener("click", function (e) {
      var li = e.target.closest(".el-select-opt");
      if (!li) return;
      e.stopPropagation();
      var o = options()[+li.dataset.i];
      if (!o || o.value === "" || o.disabled) return;
      sel.value = o.value;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      syncViewInner();
      closeOpen();
    });

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger.click(); }
    });

    /* label[for] 点击会转发给原生 select 并弹出系统下拉，改为拦截后打开自定义面板 */
    if (sel.id) {
      var lab = document.querySelector('label[for="' + sel.id + '"]');
      if (lab) lab.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); trigger.click(); });
    }
  }

  function syncView(sel) { if (sel.__sync) sel.__sync(); }

  /* 自动增强页面上所有 select（load 时 + 语言重渲染后可手动再调一次） */
  window.enhanceAllSelects = function (root) {
    (root || document).querySelectorAll("select").forEach(enhanceSelect);
  };
  window.addEventListener("load", function () { window.enhanceAllSelects(); });
})();
