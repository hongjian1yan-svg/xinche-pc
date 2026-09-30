/* #AI:dev 剪贴板 + 轻提示工具（迁移预览包 cardetail.html copyText/showToast 逻辑；
   toast 规格按 el-message（.dt-toast 样式在 styles/style.css），2200ms 自动消失） */
let toastTimer = null;
export function showToast(msg) {
  let el = document.getElementById("hyToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "hyToast";
    el.className = "dt-toast";
    document.body.appendChild(el);
  }
  el.innerHTML = '<i class="el-icon-success"></i><span></span>';
  el.querySelector("span").textContent = msg;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("on"); }, 2200);
}

export function copyText(text, okMsg) {
  function fallback() {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(ta);
    ta.select();
    var done = false;
    try { done = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    if (done && okMsg) showToast(okMsg);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { if (okMsg) showToast(okMsg); }, fallback);
  } else fallback();
}
