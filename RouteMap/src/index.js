window.onload = function() {
    var context = getContextFromCanvas();
    if(context == null)
    {
        alert("Contextが取得できませんでした。");
        return;
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(request.status == 200)
            {
                drawInfo(context, "通信成功");
            }
            else
            {
                drawInfo(context, "通信エラー");
            }
        }
        else
        {
            drawInfo(context, "通信中・・・");
        }
    }

    request.open("GET", "http://localhost:3000/tokyo-metro-network/api/statins.php");
    request.send(null);
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
