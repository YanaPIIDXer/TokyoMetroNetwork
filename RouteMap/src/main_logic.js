// メインロジックのイベント実装用インタフェース
class IMainLogicEvent
{
    // 駅データが更新された。
    onUpdateStationDatas(stations, renderRange) {}
    // 通信エラーが発生した。
    onError() {}
}

// メインロジッククラス
class MainLogic
{
    #logicEvent = null;
    
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
    fetchStationDatas()
    {
        this.fetchFromAPI("stations", function(self, result)
        {
            self.onFetchStationDatas(result);
        });
    }

    // APIを使って情報を取得
    fetchFromAPI(apiName, onSuccess)
    {
        var url = MainLogic.buildAPIURI(apiName);
        var self = this;        // クロージャ内ではthisがundefinedになるための処置。

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            timespan: 5000,
        }).done(function(result)
        {
            onSuccess(self, result);
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
        var stationDatas = datas["data"];

        var range = this.calcRange(stationDatas);
        this.#logicEvent.onUpdateStationDatas(stationDatas, range);
    }

    // 範囲の計算
    calcRange(stationDatas)
    {
        var range = new class
        {
            left = 65535.0;
            top = 65535.0;
            right = 0;
            bottom = 0;
        };
        
        stationDatas.map(data =>
        {
            var location = data["location"];
            var x = location["lat"];
            var y = location["lon"];
            if(range.left > x)
            {
                range.left = x;
            }
            if(range.right < x)
            {
                range.right = x;
            }
            if(range.top > y)
            {
                range.top = y;
            }
            if(range.bottom < y)
            {
                range.bottom = y;
            }
        });

        return range;
    }
}