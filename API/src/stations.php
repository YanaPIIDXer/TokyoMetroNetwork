<?php
    $fp = fopen("resources/station.csv", "r");
    $data = [];
    fgetcsv($fp);
    while($row = fgetcsv($fp))
    {
        // 都道府県コードをチェックし、東京都以外なら読み飛ばす。
        $pref_code = $row['6'];
        if($pref_code !== "13") { continue; }

        $station_name = $row['2'];
        array_push($data, $station_name);
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
?>
