const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 1500;

var renderer = new CanvasRenderer();

window.onload = function() {
    if(!renderer.init("drawCanvas", CANVAS_WIDTH, CANVAS_HEIGHT))
    {
        alert("CanvasRendererの初期化に失敗しました。");
        return;
    }
    
    renderer.drawInfo("通信中・・・");

    // ↓同じホストでＡＰＩサーバが動いている前提の処理。
    //  （docker-compose使ってるならまぁ大丈夫だけど。）
    var host = location.hostname;
    var port = 3000;
    var url = "http://" + host + ":" + port + "/";
    url += "tokyo-metro-network/api/stations.php";

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        timespan: 5000,
    }).done(onResponseStations)
    .fail(function(jqxHR, textStatus, errorThrown)
    {
        renderer.drawInfo(context, "通信エラー"); 
    });
}

// stations.phpからのレスポンスを受信。
function onResponseStations(result)
{
    var datas = JSON.parse(JSON.stringify(result));

    renderer.drawBackground();

    // 範囲計算
    var left = 65535.0;
    var top = 65535.0;
    var right = 0;
    var bottom = 0;
    datas["data"].map(data =>
    {
        var location = data["location"];
        var x = location["lat"];
        var y = location["lon"];
        if(left > x)
        {
            left = x;
        }
        if(right < x)
        {
            right = x;
        }
        if(top > y)
        {
            top = y;
        }
        if(bottom < y)
        {
            bottom = y;
        }
    });
    
    // 描画
    renderer.setFont("8px serif");
    renderer.setColor(128, 255, 128, 255);
    datas["data"].map(data =>
    {        
        var location = data["location"];

        // 計算した範囲から0 ~ 1の範囲にクリッピング。
        const norm = (x, y, p) => { return (p - x) / (y - x); }
        var x = norm(left, right, location["lat"]) * (CANVAS_WIDTH - 100) + 50;
        var y = norm(top, bottom, location["lon"]) * (CANVAS_HEIGHT - 100) + 50;

        renderer.drawText(data["name"], x, y);
    });
}
