/*撮影に関するscript*/

//videoのidを取得する変数
var video;
//canvas変数
var canvas;
var context;
//画像
var imgPanelFile = ["./img/panel_1.png","./img/panel_2.png"];
var imgPanel;

var position_x = [150,170];
var position_y = [220,300];
var radius = [60,80];

var number;

$(document).ready(function(){
    initVideo();
    $("#mapButton").click(function(){
        window.location.href = "map.html"
    });    
});
//ビデオの初期化
function initVideo(){
    number = sessionStorage.getItem("placeNumber");
    if (number == null) {
        number = 0
    }
    //背景画像の読み込み
    imgPanel = new Image();
    imgPanel.src = imgPanelFile[number];

    //videoの初期化
    video = document.getElementById("video");
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia({
        audio: false, /*音声使用の有無*/
        video: true   /*カメラ使用の有無*/
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
    
    setInterval(drawCanvas, 30);
}

//canvansに顔ハメパネルを描画する
function drawCanvas(){
    /* 背景を画像を */
    context.beginPath();
    context.drawImage(imgPanel, 0, 0, canvas.width, canvas.height);
    
    /*顔を当てはめる場所を設定*/
    context.beginPath();
    context.arc(position_x[number], position_y[number], radius[number], 0, Math.PI * 2, false);
    context.clip();
    /*写真を撮影*/
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function savePhoto(){
    var base64 = canvas.toDataURL("image/png");
    var blob = Base64toBlob(base64);
    var fileName = "sample.png";
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