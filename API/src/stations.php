<?php
    require_once "classes/CSVTable.php";

    const TOKYO_PREF_CODE = "13";     // 東京の都道府県コード

    // データ作成
    function make_data()
    {
        $datas = [];
        
        $stations = CSVTable::open("resources/station.csv");
        if($stations === null) { return null; }

        $lines = CSVTable::open("resources/line.csv");
        if($lines === null) { return null; }

        foreach($stations as $record)
        {
            // 都道府県コードをチェックし、東京都以外なら読み飛ばす。
            $pref_code = $record["pref_cd"];
            if($pref_code !== TOKYO_PREF_CODE) { continue; }

            // 駅名
            $name = $record["station_name"];
            // 路線名
            $line_name = $lines->get_with_column_value("line_cd", $record["line_cd"])["line_name"];

            $data = array(
                "name" => $name,
                "line_name" => $line_name
            );
            array_push($datas, $data);
        }

        return $datas;
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
