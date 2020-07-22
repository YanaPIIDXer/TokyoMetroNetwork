window.onload = function() {
    var context = getContextFromCanvas();
    if(context == null)
    {
        alert("Contextが取得できませんでした。");
        return;
    }

    drawBackground(context);
}

// 背景色描画
function drawBackground(context)
{
    context.fillStyle = 'rgb(0, 0, 255)';
    context.globalAlpha = 0.5;
    context.fillRect(0, 0, 1280, 700);
}

// CanvasからContextを取得。
function getContextFromCanvas()
{
    var canvas = document.getElementById("drawCanvas");
    if(canvas == null) { return null; }

    if(canvas.getContext == undefined) { return null; }

    return canvas.getContext("2d");
}
