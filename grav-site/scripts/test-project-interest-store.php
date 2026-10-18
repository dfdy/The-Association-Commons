<?php
require_once (getenv('GRAV_ROOT') ?: dirname(__DIR__)).'/user/plugins/project-interest/SubmissionStore.php';
use Grav\Plugin\ProjectInterest\SubmissionStore;
function check(bool $value,string $message): void {if (!$value) throw new RuntimeException($message);}
$dir=sys_get_temp_dir().'/ddc-interest-test-'.bin2hex(random_bytes(8));
try {
    [$values,$errors]=SubmissionStore::validate(['name'=>' Test Person ','email'=>'test@example.invalid','consent'=>'yes','message'=>'Ordinary test text']);
    check(!$errors && $values['name']==='Test Person','Valid inputs must pass and be trimmed.');
    [, $errors]=SubmissionStore::validate(['name'=>[],'email'=>'invalid','message'=>str_repeat('x',1501)]);
    check(isset($errors['name'],$errors['email'],$errors['consent'],$errors['message']),'Invalid types, email, consent, and lengths must fail.');
    [, $errors]=SubmissionStore::validate(['name'=>'Test','email'=>'test@example.invalid','consent'=>'yes','website'=>'bot']);
    check(isset($errors['form']),'Honeypot must be rejected.');
    $store=new SubmissionStore($dir);$id=str_repeat('a',32);$key=str_repeat('b',64);
    check($store->save($id,['id'=>$id],$key,1,90),'First record must save.');
    check($store->save($id,['id'=>'changed'],$key,1,90),'Retry must be idempotent.');
    check(json_decode(file_get_contents($dir.'/'.$id.'.json'),true)['id']===$id,'Retry must not overwrite the original.');
    check(!$store->save(str_repeat('c',32),['id'=>'new'],$key,1,90),'Rate limit must reject another record.');
    check((fileperms($dir.'/'.$id.'.json') & 0777)===0600,'Files must be private.');
    check((fileperms($dir) & 0777)===0700,'Directory must be private.');
    touch($dir.'/'.$id.'.json',time()-91*86400);$store->purge(90);
    check(!is_file($dir.'/'.$id.'.json'),'Expired records must be purged.');
    echo "PASS: field validation, honeypot, idempotency, rate limit, private permissions, and retention.\n";
} finally {
    if (is_dir($dir)) {foreach (glob($dir.'/{*,.*}',GLOB_BRACE)?:[] as $file) if (is_file($file)) unlink($file);rmdir($dir);}
}
