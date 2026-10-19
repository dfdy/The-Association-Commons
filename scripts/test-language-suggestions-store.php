<?php
require_once (getenv('GRAV_ROOT')?:dirname(__DIR__)).'/user/plugins/language-suggestions/SubmissionStore.php';
use Grav\Plugin\LanguageSuggestions\SubmissionStore;
function check($condition,$message) {if (!$condition) throw new RuntimeException($message);}
[$v,$e]=SubmissionStore::validate(['language_name'=>'French']);check(!$e && $v['language']['code']==='fr','Exact match');
[$v,$e]=SubmissionStore::validate(['language_name'=>'Frnech']);check(isset($e['language_name']) && $v['matches'][0]['code']==='fr','Typo needs confirmation');
[$v,$e]=SubmissionStore::validate(['language_name'=>'Frnech','language_code'=>'fr']);check(!$e && $v['language']['code']==='fr','Confirm matching code');
foreach ([['language_name'=>'French','language_code'=>'de'],['language_name'=>['French']],['language_name'=>"French\x00"],['language_name'=>str_repeat('a',101)],['language_name'=>'Kaaps'],['language_name'=>'Zulu'],['language_name'=>'South African Sign Language'],['language_name'=>'French','website'=>'spam']] as $input) {[, $e]=SubmissionStore::validate($input);check((bool)$e,'Reject invalid, existing, or spam input');}
$directory=sys_get_temp_dir().'/ddc-languages-'.bin2hex(random_bytes(8));$store=new SubmissionStore($directory);$id=bin2hex(random_bytes(16));$rate=hash('sha256',$id);
try {
 $record=['id'=>$id,'submitted_at'=>gmdate('c'),'code'=>'fr','name'=>'French'];
 check($store->save($id,$record,$rate,1,90),'Save');
 check($store->save($id,$record,$rate,1,90),'Retry deduplication');
 check(!$store->save(bin2hex(random_bytes(16)),$record,$rate,1,90),'Rate limit');
 check($store->records(90)===[$record],'Store only canonical fields');
 check((fileperms($directory.'/'.$id.'.json')&0777)===0600,'Private record mode');
 touch($directory.'/'.$id.'.json',time()-91*86400);clearstatcache();check($store->records(90)===[],'Retention cleanup');
 echo "PASS: exact/fuzzy confirmation, forged code, existing languages, field validation, minimal storage, retry/rate protections, permissions, and retention.\n";
} finally {foreach (glob($directory.'/{*,.*}',GLOB_BRACE)?:[] as $file) if(is_file($file))unlink($file);if(is_dir($directory))rmdir($directory);}
