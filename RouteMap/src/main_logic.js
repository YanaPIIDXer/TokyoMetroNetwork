// メインロジックのイベント実装用インタフェース
class IMainLogicEvent {
    // 駅データが更新された。
    onUpdateStationDatas(stations, renderRange) {}
    // 通信エラーが発生した。
    onError() {}
}

// メインロジッククラス
class MainLogic {
    #stationDatas = null;
    #logicEvent = null;
    #range = new class
    {
        left = 65535.0;
        top = 65535.0;
        right = 0;
        bottom = 0;
    }
    
    // コンストラクタ
    constructor(logicEvent)
    {
        this.#logicEvent = logicEvent;
    }

    // APIのURIを生成。
    static buildAPIURI(apiName)
    {
        // ↓同じホストでＡＰＩサーバが動いている前提の処理。
        //  （docker-compose使ってるならまぁ大丈夫だけど。）
        var host = location.hostname;
        var port = 3000;
        var url = "http://" + host + ":" + port + "/";
        url += "tokyo-metro-network/api/" + apiName + ".php";
        return url;
    }

    // 駅データ取得
    fetchStationDatas(onFail)
    {
        var url = MainLogic.buildAPIURI("stations");
        var self = this;

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            timespan: 5000,
        }).done(function(result)
        {
            self.onFetchStationDatas(result);
        })
        .fail(function(jqxHR, textStatus, errorThrown)
        {
            this.#logicEvent.onError();
        });
    }

    // 駅データを取得した
    onFetchStationDatas(result)
    {
        var datas = JSON.parse(JSON.stringify(result));
        this.#stationDatas = datas["data"];

        this.recalcRange();
        this.#logicEvent.onUpdateStationDatas(this.#stationDatas, this.#range);
    }

    // 範囲の再計算
    recalcRange()
    {
        this.#stationDatas.map(data =>
        {
            var location = data["location"];
            var x = location["lat"];
            var y = location["lon"];
            if(this.#range.left > x)
            {
                this.#range.left = x;
            }
            if(this.#range.right < x)
            {
                this.#range.right = x;
            }
            if(this.#range.top > y)
            {
                this.#range.top = y;
            }
            if(this.#range.bottom < y)
            {
                this.#range.bottom = y;
            }
        });
    }
}