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
    var data = JSON.parse(JSON.stringify(result));
    drawInfo(context,　data["data"][0]["name"]);
}

// テキスト描画
function drawInfo(context, infoText)
{
    context.clearRect(0, 0, 1280, 700);
    
    drawBackground(context);

    context.font = "64px serif";
    setColor(context, 0, 0, 0, 255);
    context.fillText(infoText, 450, 350);
}

// 背景色描画
function drawBackground(context)
{
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
