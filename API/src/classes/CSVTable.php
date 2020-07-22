<?php
    // CSVファイル二格納されたデータを、SQLのテーブルのようなオブジェクトとして扱うクラス。
    class CSVTable implements \IteratorAggregate, \ArrayAccess, \Countable
    {
        // カラム名
        private $column_name = [];

        // レコード
        private $records = [];
        
        // 展開
        public static function open(string $file_name) : CSVTable
        {
            $fp = fopen($file_name, "r");
            if($fp == null) { return null; }

            $column_name = fgetcsv($fp);
            $csv_table = new CSVTable($column_name);

            while($row = fgetcsv($fp))
            {
                $csv_table->add_record($row);
            }

            return $csv_table;
        }

        // ダンプ
        public function dump()
        {
            $html = '<table border="1">';
            $html .= '<tr>';
            foreach($this->column_name as $column)
            {
                $html .= '<th>' . $column . '</th>';
            }
            $html .= '</tr>';

            foreach($this->records as $record)
            {
                $html .= '<tr>';
                foreach($record as $field)
                {
                    $html .= '<td>';
                    foreach($field as $key => $value)
                    {
                        $html .= $value;
                    }
                    $html .= '</td>';
                }
                $html .= '</tr>';
            }

            $html .= '</table>';

            echo $html;
        }

        /* IteratorAggregateの実装 */
        public function offsetGet($offset)
        {
            return $this->offsetExists($offset) ? $this->records[$offset] : null;
        }

        /* ArrayAccessの実装 */
        public function offsetExists($offset)
        {
            return isset($this->records[$offset]);
        }

        public function offsetSet($offset, $value)
        {
            // そんなことしちゃいけない
        }

        public function offsetUnset($offset)
        {
            // そんなことしちゃいけない
        }

        public function getIterator() : ArrayIterator
        {
            return new ArrayIterator($this->records);
        }

        /* Countableの実装 */
        public function count() : int
        {
            return count($this->records);
        }

        // コンストラクタ
        private function __construct($column_name)
        {
            $this->column_name = $column_name;
        }

        // レコード追加
        private function add_record($record)
        {
            $key_value = array();
            $count = count($record);
            for($i = 0; $i < $count; $i++)
            {
                $key_value[$this->column_name[$i]] = $record[$i];
            }
            array_push($this->records, $key_value);
        }
    }
?>
