<?php
header('Content-Type: application/json');

$env = parse_ini_file(__DIR__ . '/.env');

$IS_DEV = $env['IS_DEV'];

if ($IS_DEV) {
	header("Access-Control-Allow-Origin: *");
	require_once __DIR__.'./mysqli.php';
	$conn = new SimpleMySQLi("127.0.0.1:3307", "root", "", "s53143__spring_p", "utf8mb4", "assoc");
} else {
	require_once __DIR__.'/../php/ToolforgeCommon.php';
	
	$tfc = new ToolforgeCommon('edgars');
	$tfc->tool_user_name = 'edgars';
	
	$conn = $tfc->openDBtool('spring_p');	
}

$action	 = $_REQUEST[ "act" ] ? $_REQUEST[ "act" ] : "";
$list	 = isset($_REQUEST[ "val" ]) ? $_REQUEST[ "val" ] : "";
$subselection	 = isset($_REQUEST[ "sub" ]) ? $_REQUEST[ "sub" ] : "";

if ( isset( $action ) && !empty( $action ) ) {
	switch ( $action ) {
		case "updated":
			echo json_encode(['date'=>'2020-03-01']);
			break;
		case "get_main_list":
			mainList('main');
			break;
		case "countries":
			getCountries();
			break;
		case "country":
			getCountryArticles($list,$subselection);
			break;
		case "get_women_list":
			mainList('women');
			break;
		case "map_data":
			getMapData();
			break;
	}
}

function mainList($listType) {
	global $conn;
	$filter = '';
	
	if ($listType=='women') {
		$filter = ' JOIN women ON women.wikidata_item=articles.wikidata ';
	}
	$sql = "SELECT original as title, orig_wiki as wiki, wikidata, iws,
		(SELECT GROUP_CONCAT(distinct country SEPARATOR ', ') FROM countries WHERE countries.article=articles.wikidata) as countries
	FROM articles
	$filter
	where archived is null
	ORDER BY iws DESC, original ASC
	LIMIT 500";

	$data = $conn->query($sql)->fetchAll("assoc");
	echo json_encode(['articles'=>$data]);
}

function getMapData() {
	global $conn;
	$sql = "SELECT original as title, orig_wiki as wiki, iws, value as coords
	FROM articles art
	JOIN attributes attr ON attr.name='coords' AND attr.article=art.wikidata
	WHERE original<>'' AND attr.article NOT IN (SELECT att.article FROM attributes att WHERE VALUE IN ('Infobox settlement','Infobox Subdivision administrative'))
	";

	$data = $conn->query($sql)->fetchAll("assoc");
	foreach($data as &$entry) {
		$entry['coords'] = explode(",",$entry['coords']);
	}
	echo json_encode($data);
}

function getCountries() {
	global $conn;
	$sql = "SELECT DISTINCT country FROM countries ORDER BY country asc";

	$data = $conn->query($sql)->fetchAll("col");
	echo json_encode($data);
}

function getByInfobox($country,$lang) {
	global $conn;
	$sql = "SELECT original as title, orig_wiki as wiki, wikidata, iws, attributes.value as infobox
	FROM articles
	JOIN attributes ON attributes.article=articles.wikidata AND attributes.wiki=? AND attributes.name=?
	WHERE wikidata IN (SELECT countries.article FROM countries WHERE countries.article=articles.wikidata AND country=?)
	ORDER BY iws DESC, original ASC";

	$data = $conn->query($sql,[$lang,'inf',$country])->fetchAll("assoc");

	$res = [];

	foreach($data as $row) {
		$inf = $row['infobox'];
		$res[$inf][] = $row;
	}
	
	$res2 = [];
	$infoboxList = [];

	foreach($res as $infobox => $values) {
		$infoboxList[] = $infobox;
		$res2[$infobox] = array_slice($values, 0, 250);
	}

	usort($infoboxList, 'strnatcasecmp');

	return json_encode(['articles'=>['data'=>$res2,'order'=>$infoboxList]]);
}

function getCountryArticles($country,$subselection) {
	global $conn;

	//['full','women','infoboxes']
	if ($subselection == 'full') {
		$sql = "SELECT original as title, orig_wiki as wiki, wikidata, iws
		FROM articles
		WHERE wikidata IN (SELECT countries.article FROM countries WHERE countries.article=articles.wikidata AND country=?)
		ORDER BY iws DESC, original ASC
		LIMIT 1000";
		
		$data = $conn->query($sql,[$country])->fetchAll("assoc");
		echo json_encode(['articles'=>$data]);
	} else if ($subselection == 'women') {
		$sql = "SELECT original as title, orig_wiki as wiki, wikidata, iws
		FROM articles
		JOIN women ON women.wikidata_item=articles.wikidata
		WHERE wikidata IN (SELECT countries.article FROM countries WHERE countries.article=articles.wikidata AND country=?)
		ORDER BY iws DESC, original ASC
		LIMIT 1000";
		$data = $conn->query($sql,[$country])->fetchAll("assoc");
		echo json_encode(['articles'=>$data]);
	} else if ($subselection == 'frinfoboxes') {
		echo getByInfobox($country,'fr');
	} else if ($subselection == 'eninfoboxes') {
		echo getByInfobox($country,'en');
	}

}
