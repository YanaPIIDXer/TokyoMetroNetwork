// キャンバス描画クラス
class CanvasRenderer
{
    #canvas = null;
    #context = null;
    #width = 0;
    #height = 0;

    // 初期化
    init(elementId, width, height)
    {
        var canvas = document.getElementById(elementId);
        if(canvas == null) { return false; }

        canvas.width = width;
        canvas.height = height;

        if(canvas.getContext == undefined) { return false; }
        var context = canvas.getContext("2d");

        this.#canvas = canvas;
        this.#context = context;
        this.#width = width;
        this.#height = height;
        return true;
    }
    
    // インフォメーションテキスト描画
    drawInfo(infoText)
    {   
        this.drawBackground();

        this.setFont("64px serif");
        this.setColor(0, 0, 0, 255);
        this.drawText(infoText, 450, 350);
    }

    // テキスト描画
    drawText(text, x, y)
    {
        this.#context.fillText(text, x, y);
    }

    // フォント設定
    setFont(font)
    {
        this.#context.font = font;
    }

    // 背景色描画
    drawBackground()
    {
        this.#context.clearRect(0, 0, this.#width, this.#height);

        this.setColor(0, 0, 255, 128);
        this.#context.fillRect(0, 0, this.#width, this.#height);
    }

    // 描画色を設定。
    // ※各要素0～255の範囲。
    setColor(R, G, B, A = 255)
    {
        var fillStyle = "rgb(" + R + ", " + G + ", " + B + ")";
        this.#context.fillStyle = fillStyle;
        this.#context.globalAlpha = A / 255.0;
    }

}