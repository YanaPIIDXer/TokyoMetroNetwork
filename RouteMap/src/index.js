window.onload = function() {
    var context = getContextFromCanvas();
    if(context == null)
    {
        alert("Contextが取得できませんでした。");
        return;
    }

    drawInfo(context, "通信中・・・");

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
    }).done(function(result)
    {
        onResponseStations(context, result);
    }).fail(function(jqxHR, textStatus, errorThrown)
    {
        drawInfo(context, "通信エラー"); 
    });
}

// stations.phpからのレスポンスを受信。
function onResponseStations(context, result)
{
    var datas = JSON.parse(JSON.stringify(result));

    drawBackground(context);

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
    context.font = "8px serif";
    setColor(context, 128, 255, 128, 255);
    datas["data"].map(data =>
    {        
        var location = data["location"];

        // 計算した範囲から0 ~ 1の範囲にクリッピング。
        const norm = (x, y, p) => { return (p - x) / (y - x); }
        var x = norm(left, right, location["lat"]) * 1180 + 50;
        var y = norm(top, bottom, location["lon"]) * 600 + 50;

        context.fillText(data["name"], x, y);
    });
}

// テキスト描画
function drawInfo(context, infoText)
{   
    drawBackground(context);

    context.font = "64px serif";
    setColor(context, 0, 0, 0, 255);
    context.fillText(infoText, 450, 350);
}

// 背景色描画
function drawBackground(context)
{
    context.clearRect(0, 0, 1280, 700);

    setColor(context, 0, 0, 255, 128);
    context.fillRect(0, 0, 1280, 700);
}

// 描画色を設定。
// ※各要素0～255の範囲。
function setColor(context, R, G, B, A = 255)
{
    var fillStyle = "rgb(" + R + ", " + G + ", " + B + ")";
    context.fillStyle = fillStyle;
    context.globalAlpha = A / 255.0;
}

// CanvasからContextを取得。
function getContextFromCanvas()
{
    var canvas = document.getElementById("drawCanvas");
    if(canvas == null) { return null; }

    // HACK:これここでやる事じゃなくね？
    canvas.width = 1280;
    canvas.height = 700;

    if(canvas.getContext == undefined) { return null; }

    return canvas.getContext("2d");
}
