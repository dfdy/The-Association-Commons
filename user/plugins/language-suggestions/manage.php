<?php
// CLI-only maintenance: never expose personal records through a web route.
if (PHP_SAPI!=='cli') {http_response_code(404);exit;}
require_once __DIR__.'/SubmissionStore.php';
use Grav\Plugin\LanguageSuggestions\SubmissionStore;
$directory=dirname(__DIR__,2).'/data/commons-private/language-suggestions';
$store=new SubmissionStore($directory);$action=$argv[1]??'help';
if ($action==='cleanup') {$store->prepare();$store->purge(max(1,(int)($argv[2]??90)));echo "Retention cleanup complete.\n";exit;}
if ($action==='list') {
    foreach (glob($directory.'/*.json')?:[] as $file) {
        $record=json_decode(file_get_contents($file),true,512,JSON_THROW_ON_ERROR);
        echo $record['id']."\t".$record['submitted_at']."\n";
    }
    exit;
}
if (in_array($action,['show','delete'],true)) {
    $id=$argv[2]??'';
    if (!preg_match('/^[a-f0-9]{32}$/D',$id)) {fwrite(STDERR,"Supply a valid record ID.\n");exit(1);}
    $file=$directory.'/'.$id.'.json';
    if (!is_file($file)) {fwrite(STDERR,"Record not found.\n");exit(1);}
    if ($action==='show') echo file_get_contents($file);
    else {unlink($file);echo "Record deleted.\n";}
    exit;
}
echo "Usage: php manage.php list | show ID | delete ID | cleanup [DAYS]\n";
