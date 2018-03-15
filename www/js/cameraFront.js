/*撮影に関するscript*/

//canvas変数
var canvas;
var context;
//画像
var imgPanelFile = ["./img/takehara2.png","./img/panel_2.png"];
var imgPanel;
/*place場所に関する変数
    場所 0:パルディ 1:学校*/
var placeLat = [34.252477, 34.253453];
var placeLng = [132.906987, 132.904284];

//顔をハメる空間を設定する変数
var position_x = [90,170];
var position_y = [380,300];
//円の半径
var radius = [70,80];
var number = 0;


    
var takeCheck = 0;
//localStrage.setItem("takeCheck", 0);

var stampListStore;

/*
if(ls_data != 1){
    localStrage.setItem("takeCheck", 0);
}*/

$(document).ready(function(){
    initVideo();
    //setInterval(getGeolocation, 1000);
    localStorage.setItem("takeCheck", 0);
    stampListStore = JSON.parse(localStorage.getItem("stampList"));

    $("#mapButton").click(function(){
        window.location.href = "map.html";
    });
    $("#stampButton").click(function(){
        window.location.href = "stamp.html";
    });
    
});

//**  canvasに関する処理  **//

//ビデオの初期化
function initVideo(){
    imgPanel = new Image();
    imgPanel.src = imgPanelFile[number];
    //videoの初期化
    var video = document.getElementById("video");
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia({
        audio: false, /*音声使用の有無*/
        video: {facingMode: { exact: "environment"}}
    }, function(stream) {
        video.src = URL.createObjectURL(stream);
        initCanvas();
    }, function(error) {
        console.error(error);
    });
}

//canvasの初期化
function initCanvas(){
    canvas = document.getElementById("dst");
    /*canvasのサイズをスマホサイズに調整*/
    canvas.width = $(document).width();
    canvas.height = $(document).height();
    context = canvas.getContext("2d");
    /*反転処理*/
    context.translate(canvas.width,0);
    context.scale(-1,1);
    /* 背景を画像を設定 */
    context.beginPath();
    context.drawImage(imgPanel, 0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    context.arc(position_x[number], position_y[number], radius[number], 0, Math.PI * 2, false);
    //context.arc(120, 90, 80, 0, Math.PI * 2, false);
    context.clip();
    setInterval(drawCanvas, 30);
}

//canvansに顔ハメパネルを描画する
function drawCanvas(){
    /*顔を当てはめる場所を設定*/
    /*写真を撮影*/
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}





//** 画像を保存する処理　**//

//canvasを画像に変換し、保存する
function savePhoto(){
    var base64 = canvas.toDataURL("image/png");
    var blob = Base64toBlob(base64);
    var fileName = "sample.png";
    
    document.getElementById('shutter').play();
    // blobデータをa要素を使ってダウンロード
    saveBlob(blob, fileName);
}

// Base64データをBlobデータに変換
function Base64toBlob(base64)
{
    // カンマで分割して以下のようにデータを分ける
    // tmp[0] : データ形式（data:image/png;base64）
    // tmp[1] : base64データ（iVBORw0k～）
    var tmp = base64.split(',');
    // base64データの文字列をデコード
    var data = atob(tmp[1]);
    // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
    var mime = tmp[0].split(':')[1].split(';')[0];
    //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
    var buf = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成
	var blob = new Blob([buf], { type: mime });
    return blob;
}

// 画像のダウンロード
function saveBlob(blob, fileName)
{
    var url = (window.URL || window.webkitURL);
    // ダウンロード用のURL作成
    var dataUrl = url.createObjectURL(blob);
    // イベント作成
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // a要素を作成
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    // ダウンロード用のURLセット
    a.href = dataUrl;
    // ファイル名セット
    a.download = fileName;
    // イベントの発火
    a.dispatchEvent(event);
}

//** 顔をハメる写真を決定する **//

//位置情報を取得する
function getGeolocation() {
    //対応しているデバイスか判断
    if (navigator.geolocation) {
        //緯度経度を取得する
        navigator.geolocation.getCurrentPosition(function(position) {
            getImage(position);
        }, function(error) {
            // エラー番号に対応したメッセージ
            var errorInfo = ["原因不明のエラーが発生しました…。", "位置情報の取得が許可されませんでした…。", "電波状況などで位置情報が取得できませんでした…。", "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"];
            // エラー番号
            var errorNo = error.code;
            // エラーメッセージmage();
            var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[errorNo];
            // アラート表示
            alert(errorMessage);
        }, {
            "enableHighAccuracy": false,
            "timeout": 1000000,
            "maximumAge": 0,
        });
    } else {
        // エラーメッセージ
        var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。";
        // アラート表示
        alert(errorMessage);
    }
}

//自分の位置と顔ハメ名所の距離を測り一定以上だと対応した画像にする
function getImage(position){
    //自身の位置情報
    var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    for (var i = 0; i < imgPanelFile.length; i++) {
        var pos = [myLatLng, new google.maps.LatLng(placeLat[i], placeLng[i])];
        var dist = google.maps.geometry.spherical.computeLength(pos);  
        if (dist < 85) {
            number = i;
            imgPanel.src = imgPanelFile[number];
            return 0;
        }
    }
}

