<?php

$config = parse_ini_file('config.ini', true);
if (!$config) { die("Failed to read ini-file\n"); }

define ('PER_PAGE', 25);
$page = 0;
if (isset($_GET['page'])) {
    $page = intval($_GET['page']) - 1;
}

$mem = new Memcache();
@$mem->pconnect("127.0.0.1", 11211);

try {
    $dbc = $config['DB'];
    $connector = array_key_exists('connector', $dbc) ? $dbc['connector'] : 'host=localhost';
    $pdo = new PDO('mysql:' . $connector .  ';dbname=' . $dbc['name'], $dbc['user'], base64_decode($dbc['pass']));
} catch (PDOException $e) {
    die ("Couldn't connect to the DB: " . $e->getMessage() . "\n");
}

$pattern = $_GET['pattern'];
$callback = isset($_GET['callback']) ? $_GET['callback'] : "";
/*$pattern = preg_replace_callback("/./", function ($match) {
    return "\\x".dechex(ord($match[0]));
}, $pattern);*/

$mkey = 'english.query.page_ids:' . $pattern;
$keys = $mem->get($mkey);
if (!$keys) { $keys = array(); }

$query = 
    "SELECT * FROM `lines` " .
    "WHERE `lines`.`text` RLIKE " . $pdo->quote($pattern) .
    (   isset($keys[$page-1])
        ? (" AND `id` > ".$keys[$page-1]. " LIMIT " . PER_PAGE)
        : (" LIMIT " . (PER_PAGE * $page) . "," . PER_PAGE)
    );
$stmt = $pdo->query($query);
/*if (!$stmt) {
    $ei = $pdo->errorInfo();
    die('[SQL'.$ei[0].'] '.$ei[2]);
}*/

$lines = array();
$videoIds = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $lines []= $row;
    $videoIds[$row['video_id']] = true;
}
$last = end($lines);
$keys[$page] = $last['id'];
$mem->set($mkey, $keys, false, 600);

if (!empty($videoIds)) {
    $stmt = $pdo->query("SELECT `id`, `key`, `title`, `author` FROM `videos` WHERE `id` IN (" . implode(",", array_keys($videoIds)) . ")");
    $videos = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $id = $row['id'];
        unset($row['id']);
        $videos[$id] = $row;
    }
}

foreach ($lines as &$line) {
    $video = $videos[$line['video_id']];
    unset($line['video_id']);
    $line['key'] = $video['key'];
    $line['title'] = $video['title'];
    $line['author'] = $video['author'];
}

$json = json_encode($lines);
if ($callback) {
    header("Content-type: text/javascript");
    echo $callback . "(" . $json . ");";
} else {
    header("Content-type: application/json");
    echo $json;
}

?>
