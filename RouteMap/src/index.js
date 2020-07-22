const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 1500;

var renderer = new CanvasRenderer();
class MainLogicEvent extends IMainLogicEvent
{
    #renderer = null;
    constructor(renderer)
    {
        super();
        this.#renderer = renderer;
    }
    
    // 駅データが更新された。
    onUpdateStationDatas(stations, renderRange)
    {
        this.#renderer.drawBackground();
        
        this.#renderer.setFont("8px serif");
        this.#renderer.setColor(128, 255, 128, 255);
        stations.map(data =>
        {        
            var location = data["location"];
    
            // 計算した範囲から0 ~ 1の範囲にクリッピング。
            const norm = (x, y, p) => { return (p - x) / (y - x); }
            var x = norm(renderRange.left, renderRange.right, location["lat"]) * (CANVAS_WIDTH - 100) + 50;
            var y = norm(renderRange.top, renderRange.bottom, location["lon"]) * (CANVAS_HEIGHT - 100) + 50;
    
            this.#renderer.drawText(data["name"], x, y);
        });
    }

    // 通信エラーが発生した。
    onError()
    {
        drawInfo("通信エラー");
    }
}
var logic = new MainLogic(new MainLogicEvent(renderer));

window.onload = function() {
    if(!renderer.init("drawCanvas", CANVAS_WIDTH, CANVAS_HEIGHT))
    {
        alert("CanvasRendererの初期化に失敗しました。");
        return;
    }
    
    drawInfo("通信中・・・");

    logic.fetchStationDatas();
}

// インフォメーションテキスト描画
function drawInfo(infoText)
{   
    renderer.drawBackground();

    renderer.setFont("64px serif");
    renderer.setColor(0, 0, 0, 255);
    renderer.drawText(infoText, 450, 350);
}
