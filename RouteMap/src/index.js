window.onload = function() {
    var context = getContextFromCanvas();
    if(context == null)
    {
        alert("Contextが取得できませんでした。");
        return;
    }

    drawBackground(context);

    context.font = "64px serif";
    setColor(context, 0, 0, 0, 255);
    context.fillText("読み込み中・・・", 450, 350);
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
