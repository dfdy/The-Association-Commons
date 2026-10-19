<?php
if (PHP_SAPI!=='cli') {http_response_code(404);exit;}
chdir('/var/www/html');define('GRAV_CLI',true);define('GRAV_REQUEST_TIME',microtime(true));
$loader=require 'vendor/autoload.php';$grav=Grav\Common\Grav::instance(['loader'=>$loader]);$grav->setup();$grav->initializeCli();$grav['plugins']->init();$grav->fireEvent('onPluginsInitialized');
$input=json_decode(stream_get_contents(STDIN),true,512,JSON_THROW_ON_ERROR);
foreach ($input['users'] as $spec) {
    if (!preg_match('/^ddc-test-[a-f0-9]{12}-(admin|editor)$/D',$spec['name'])) throw new RuntimeException('Invalid fixture user.');
    $file='/var/www/html/user/accounts/'.$spec['name'].'.yaml';
    if ($input['action']==='cleanup') {if (is_file($file)) unlink($file);continue;}
    if (is_file($file)) throw new RuntimeException('Refusing to overwrite an account.');
    $u=$grav['accounts']->load($spec['name']);$u->set('email','synthetic@example.invalid');$u->set('fullname','Synthetic backend test');$u->set('state','enabled');
    $u->set('access',$spec['role']==='admin'?['admin'=>['super'=>true,'login'=>true],'api'=>['access'=>true]]:['api'=>['access'=>true,'pages'=>['read'=>true]]]);
    $u->set('hashed_password',Grav\Common\User\Authentication::create($spec['password']));$u->save();
}
require_once '/var/www/html/user/plugins/project-interest/SubmissionStore.php';
$store=new Grav\Plugin\ProjectInterest\SubmissionStore('/var/www/html/user/data/commons-private/project-interest');
if ($input['action']==='cleanup') {$store->delete($input['record_id']);$rate='/var/www/html/user/data/commons-private/project-interest/.rate-'.hash('sha256',$input['record_id']);if(is_file($rate))unlink($rate);echo "Synthetic fixture removed.\n";exit;}
$id=$input['record_id'];$store->save($id,['id'=>$id,'submitted_at'=>gmdate('c'),'request_type'=>'project_interest','source_route'=>'/en','language_code'=>'en','name'=>'Automated <img src=x onerror=alert(1)>','email'=>'admin-fixture@example.invalid','organisation'=>'Synthetic group','message'=>'Synthetic backend review test','consent'=>true,'consent_notice_version'=>'2026-10-18'],hash('sha256',$id),10,90);
echo "Synthetic fixture created.\n";
