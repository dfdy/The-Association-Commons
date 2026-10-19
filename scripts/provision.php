<?php
// CLI-only bootstrap. Secrets stay in Grav's private named volume.
if (PHP_SAPI !== 'cli') exit(1);
chdir('/var/www/html');
define('GRAV_CLI',true);define('GRAV_REQUEST_TIME',microtime(true));
$loader=require 'vendor/autoload.php';
// Upgrade the former English home alias while retaining other operator settings.
$systemPath='user/config/system.yaml';
$system=\Symfony\Component\Yaml\Yaml::parseFile($systemPath);
if (($system['home']['alias']??null)==='/en') {
    $system['home']['alias']='/home';
    file_put_contents($systemPath,\Symfony\Component\Yaml\Yaml::dump($system,8,2));
}
$grav=\Grav\Common\Grav::instance(['loader'=>$loader]);
$grav->setup();$grav->initializeCli();$grav['plugins']->init();
$grav->fireEvent('onPluginsInitialized');
$accounts=$grav['accounts'];$directory='user/data/commons-private';
$lock=fopen($directory.'/provision.lock','c');flock($lock,LOCK_EX);
if ($accounts->count()===0) {
    $password=bin2hex(random_bytes(18)).'aA1!';
    $user=$accounts->load('admin');
    $user->set('email','admin@localhost.invalid');$user->set('fullname','Administrator');
    $user->set('state','enabled');$user->set('access',['site'=>['login'=>true],'api'=>['super'=>true],'admin'=>['super'=>true,'login'=>true]]);
    $user->set('hashed_password',\Grav\Common\User\Authentication::create($password));$user->set('created',time());$user->save();
    file_put_contents($directory.'/admin-login.txt',"URL: http://localhost:8388/admin\nUsername: admin\nPassword: $password\n\nChange your password and email in your Grav profile after signing in.\n");chmod($directory.'/admin-login.txt',0600);
}
// A revocation remains effective: the marker prevents automatic key replacement.
if (!file_exists($directory.'/mcp-issued')) {
    $user=$accounts->load('codex-editor');
    if ($user->exists()) throw new \RuntimeException('Reserved codex-editor account already exists; refusing to replace it.');
    $user->set('fullname','Codex content editor');$user->set('state','enabled');
    $user->set('access',['api'=>['access'=>true,'pages'=>['read'=>true,'write'=>true]]]);
    $user->set('hashed_password',\Grav\Common\User\Authentication::create(bin2hex(random_bytes(40))));$user->save();
    $manager=new \Grav\Plugin\Api\Auth\ApiKeyManager();
    $key=$manager->generateKey($user,'Local Codex', ['api.access','api.pages.read','api.pages.write'],90);
    file_put_contents($directory.'/mcp-key',$key['key']);chmod($directory.'/mcp-key',0600);
    file_put_contents($directory.'/mcp-issued',$key['id']);chmod($directory.'/mcp-issued',0600);
}
flock($lock,LOCK_UN);fclose($lock);
fwrite(STDERR,"Grav administrator and content-only MCP connection are ready.\n");
