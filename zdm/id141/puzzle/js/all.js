//すべてのページに適応するjs
//■■■PC・SP判別■■■
const ua = navigator.userAgent.toLowerCase();
let pcflg = false;
let spflg = false;
let iPhoneflg = false;
let iPadflg = false;
let Androidflg = false;
let twflg = false;
// iPhone
if (ua.includes("iphone") || ua.includes("ipod")) {
    spflg = true;
    iPhoneflg = true;
}
// Android
if (ua.includes("android")) {
    spflg = true;
    Androidflg = true;
}
// iPad
if (ua.includes("ipad") || (ua.includes("macintosh") && "ontouchend" in document)) {
    spflg = true;
    iPadflg = true;
}
// Windows
if (ua.includes("win")) {
    pcflg = true;
    spflg = false;
}
// Mac（iPadは除外）
if (ua.includes("macintosh") && !"ontouchend" in document) {
    pcflg = true;
    spflg = false;
}

//■■■拡大禁止(no pinch up)■■■
if ('ontouchstart' in document.documentElement) {
  document.addEventListener("DOMContentLoaded", function () {
    function preventMultiTouch(e) {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    }
    document.body.addEventListener("touchstart", preventMultiTouch, { passive: false });
    document.body.addEventListener("touchmove", preventMultiTouch, { passive: false });
  });
}
//■■■戻るボタン禁止（が、おまじないレベル）■■■
history.replaceState(null, null, location.href);
history.pushState(null, null, location.href);
window.addEventListener('popstate', function () {
  history.pushState(null, null, location.href);
});


//■■■ローカルストレージチェッカー■■■
console.log("0nowarea:" + localStorage.getItem("nowarea"));
console.log("0cleararea:" + localStorage.getItem("cleararea"));
console.log("0allclear:" + localStorage.getItem("allclear"));
