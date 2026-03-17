//■■■■ブラウザをバックグラウンドにしたときにwaitページに移動
// ページ遷移中かどうかを追跡
let isNavigating = false; 
document.addEventListener("DOMContentLoaded", function () {
    //androidflg    
    let androidflg=false;
    if (navigator.userAgent.indexOf('Android') > 0) {
        androidflg = true;
    }
    function fc_wait(){        
        window.location.href = "wait.html";        
    }
    // 通常のリンククリック時にフラグを設定
    document.addEventListener("click", function (event) {
        const target = event.target.closest("a"); // 最も近い<a>タグを取得
        if (target && target.href) {
            isNavigating = true; // ページ遷移中フラグを有効化
        }
    });

    // visibilitychangeイベントの処理
    document.addEventListener("visibilitychange", function () {
        if (!isNavigating && document.visibilityState === "hidden") {
            if(androidflg){
                window.setTimeout(fc_wait, 500);
            }else{
                fc_wait();
            }
        }
    });

    // beforeunloadイベントでブラウザが閉じられる時にも対応
    window.addEventListener("beforeunload", function (event) {
        if (!isNavigating) {
            if(androidflg){
                window.setTimeout(fc_wait, 500);
            }else{
                fc_wait();
            }
        }
    });

    // window.location.hrefを監視してフラグを設定
    const locationProto = Object.getPrototypeOf(window.location); // プロトタイプを取得
    const hrefDescriptor = Object.getOwnPropertyDescriptor(locationProto, "href"); // hrefのプロパティを取得

    // 元のgetter/setterをラップする形で再定義
    Object.defineProperty(locationProto, "href", {
        configurable: true,
        enumerable: true,
        get: function () {
            return hrefDescriptor.get.call(this); // 元のgetterを呼び出す
        },
        set: function (url) {
            isNavigating = true; // ページ遷移中フラグを設定
            hrefDescriptor.set.call(this, url); // 元のsetterを呼び出す
        }
    });

});

    // ページ遷移が完了した後にフラグをリセット
window.addEventListener("pageshow", function () {
    isNavigating = false; // フラグをリセット 
});

