<?php
    require_once "classes/CSVTable.php";

    const TOKYO_PREF_CODE = "13";     // 東京都の都道府県コード

    // 駅を列挙
    function enumrate_stations($stations_csv, $lines_csv)
    {
        $result = [];
        foreach($stations_csv as $record)
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
            $line_name = $lines_csv->get_with_column_value("line_cd", $line_code)["line_name"];
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
            array_push($result, $data);
        }

        return $result;
    }

    // 一つの駅に複数の路線が敷かれているケースを考慮した形に修正する。
    function collect_stations($stations)
    {
        $result = [];
        for($i = 0; $i < count($stations); $i++)
        {
            $lines = [];
            array_push($lines, $stations[$i]["line"]);
            for($j = count($stations) - 1; $j > $i; $j--)
            {
                if($stations[$i]["name"] !== $stations[$j]["name"]) { continue; }
                
                array_push($lines, $stations[$j]["line"]);
                array_splice($stations, $j, 1);
            }
            array_push($result, array(
                "name" => $stations[$i]["name"],
                "lines" => $lines,
                "location" => $stations[$i]["location"],
            ));
        }

        return $result;
    }

    // データ作成
    function make_data()
    {        
        $stations_csv = CSVTable::open("resources/station.csv");
        if($stations_csv === null) { return null; }

        $lines_csv = CSVTable::open("resources/line.csv");
        if($lines_csv === null) { return null; }

        $stations = enumrate_stations($stations_csv, $lines_csv);
        $result = collect_stations($stations);
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
