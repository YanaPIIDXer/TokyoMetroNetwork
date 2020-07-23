# 概要
東京の路線情報を色々扱ってみるもの

- 本プロジェクトは東京都の路線情報を使って色々やってみるプロジェクトです。
- 路線情報のソースは「駅データ.jp」のものとします。
  -  [参考資料](https://qiita.com/saka1029/items/55a9eff302864d307ec7)
- リポジトリ名には「TokyoMetro」と銘打ってありますが、「東京メトロ」以外の路線も扱います。
  - 「Metroは『地下鉄』だろ」と言うツッコミは無しでお願いします。（リポジトリ作成後に気付きました。）
- 本プロジェクトは個人運用のものです。 ***東京都、及び各種路線経営元とは一切の関係がありません。***

# 構成
## API
路線情報を返すAPIです。  
駅データ.jpの取得するデータを加工し、独自のデータとしてJSON形式で返します。  

## RouteMap
APIから取得したデータを元に、東京都の路線図を表示してみるものです。  

# インフラについて
それぞれの実験を兼ねて、Terraformを使ってAWS上にインフラを構築する手法を取っています。  
TerraformのソースコードはInfrastructure/Terraformディレクトリ内に置いています。  

# 注意
駅データ.jpのデータは無料会員登録をしないと手に入らないらしく、該当ファイルをGit上で管理するのは問題があるため、以下の形を取っています。  

1. 該当ファイルを格納する為の「resources」ディレクトリ（API/src/resources）を作成。
1. 各自で駅データ.jpより該当ファイルを取得し、上記ディレクトリに格納。

