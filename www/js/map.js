/* マップに関するスクリプト
   位置情報を取得し、地図を表示する
   竹原の名所に目印(画像を配置する)
*/
var syncerWatch = {
    map: null,
    myMarker: null,
};
/*place場所に関する変数
    場所 0:パルディ 1:学校*/
var placeLat = [34.252477, 34.253453];
var placeLng = [132.906987, 132.904284];
var placeImage = ["./img/icon/school.png", "./img/icon/tokyoskytree.png"];

$(document).ready(function() {
    setInterval(getGeolocation, 1000);
});
//初期化してgoogle mapを表示する
function initMap(_position) {
    //取得できないならリターン
    if (_position.coords.latitude == null || _position.coords.longitude == null) {
        return false;
    }
    // 位置情報
    var latlng = new google.maps.LatLng(_position.coords.latitude, _position.coords.longitude);
    //初期読み込み時
    if (syncerWatch.map == null) {
        //地図を表示
        syncerWatch.map = new google.maps.Map(document.getElementById('map'), {
            center: latlng,
            zoom: 15
        });
        //自身の位置にMartkerを描画する
        syncerWatch.myMarker = new google.maps.Marker({
            position: latlng,
            map: syncerWatch.map,
            animation: google.maps.Animation.BOUNCE
        });
        for (var i = 0; i < placeImage.length; i++) {
            //撮影場所の中心座標
            var center = new google.maps.LatLng(parseFloat(placeLat[i]), parseFloat(placeLng[i]));
            //撮影場所にアイコンを置く
            var placeMarker = new google.maps.Marker({
                position: center,
                map: syncerWatch.map,
                icon: placeImage[i]
            });
            //撮影場所を中心として撮影可能範囲を示す円を描画
            var circle = new google.maps.Circle({
                map: syncerWatch.map,
                strokeColor: "red", //線の色
                fillColor: "purple", //円の塗りつぶし色
                center: center,
                radius: 100
            })
        }
    }
    //二回目以降
    else {
        for (var i = 0; i < placeImage.length; i++) {
            var pos = [latlng, new google.maps.LatLng(placeLat[i], placeLng[i])];
            var dist = google.maps.geometry.spherical.computeLength(pos);
            if (dist < 350) {
                sessionStorage.setItem('placeNumber', i);
            }
        }
        // マーカーの場所を変更
        syncerWatch.myMarker.setPosition(latlng);
    }
}
//位置情報を取得する
function getGeolocation() {
    //対応しているデバイスか判断
    if (navigator.geolocation) {
        //緯度経度を取得し、initMao関数呼び出し
        navigator.geolocation.getCurrentPosition(function(position) {
            initMap(position);
        }, function(error) {
            // エラー番号に対応したメッセージ
            var errorInfo = ["原因不明のエラーが発生しました…。", "位置情報の取得が許可されませんでした…。", "電波状況などで位置情報が取得できませんでした…。", "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"];
            // エラー番号
            var errorNo = error.code;
            // エラーメッセージ
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