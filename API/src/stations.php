<?php
    require_once "classes/CSVTable.php";

    const TOKYO_PREF_CODE = "13";     // 東京都の都道府県コード

    // データ作成
    function make_data()
    {
        $datas = [];
        
        $stations = CSVTable::open("resources/station.csv");
        if($stations === null) { return null; }

        $lines = CSVTable::open("resources/line.csv");
        if($lines === null) { return null; }

        // HACK:$datasが一時領域扱いになっている。
        //      後程関数を分割して対処。

        // 東京都の駅を列挙。
        foreach($stations as $record)
        {
            // 都道府県コードをチェックし、東京都以外なら読み飛ばす。
            // ※当然、都外の駅は弾かれる。（ex:東京メトロ各線 和光市）
            // TODO:都内の駅からの接続がある駅も含められるように考慮する。
            $pref_code = $record["pref_cd"];
            if($pref_code !== TOKYO_PREF_CODE) { continue; }

            // 駅名
            $name = $record["station_name"];
            // 路線コード・路線名
            $line_code = $record["line_cd"];
            $line_name = $lines->get_with_column_value("line_cd", $line_code)["line_name"];
            $line = array("code" => $line_code, "name" => $line_name);
            // 経度・緯度
            $lon = $record["lon"];
            $lat = $record["lat"];
            $location = array("lon" => $lon, "lat" => $lat);

            $data = array(
                "name" => $name,
                "line" => $line,
                "location" => $location,
            );
            array_push($datas, $data);
        }

        // 一つの駅に複数の路線が敷かれているケースを考慮した形に修正する。
        $result = [];
        $count = count($datas);
        for($i = 0; $i < $count; $i++)
        {
            $data = array("name" => $datas[$i]["name"]);
            $lines = [];
            array_push($lines, $datas[$i]["line"]);
            for($j = $count - 1; $j >= $i; $j--)
            {
                if($datas[$i]["name"] !== $datas[$j]["name"]) { continue; }

                array_push($lines, $datas[$j]["line"]);
                array_splice($datas, $j, 1);
            }
            array_push($result, array(
                "name" => $datas[$i]["name"],
                "lines" => $lines,
            ));
        }

        return $result;
    }

    $json = ["success" => false, "data" => null];
    $data = make_data();
    if($data !== null)
    {
        $json["success"] = true;
        $json["data"] = $data;
    }

    echo json_encode($json, JSON_UNESCAPED_UNICODE);
?>
