<?php
    require_once "classes/CSVTable.php";

    // データ作成
    function make_data()
    {
        $data = [];
            
        $stations = CSVTable::open("resources/station.csv");
        if($stations === null) { return null; }

        foreach($stations as $record)
        {
            // 都道府県コードをチェックし、東京都以外なら読み飛ばす。
            $pref_code = $record["pref_cd"];
            if($pref_code !== "13") { continue; }

            $station_name = $record["station_name"];
            array_push($data, $station_name);
        }

        return $data;
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