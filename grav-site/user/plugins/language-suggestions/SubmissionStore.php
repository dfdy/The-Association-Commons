<?php
namespace Grav\Plugin\LanguageSuggestions;

require_once __DIR__.'/LanguageRegistry.php';
final class SubmissionStore
{
    public function __construct(private string $directory) {}
    public function prepare(): void
    {
        if (!is_dir($this->directory) && !mkdir($this->directory,0700,true) && !is_dir($this->directory)) throw new \RuntimeException('Private storage unavailable.');
        chmod($this->directory,0700);
    }
    public static function validate(array $input): array
    {
        $raw=$input['language_name']??'';$errors=[];
        if (!is_string($raw) || preg_match('//u',$raw)!==1 || preg_match('/[\x00-\x1F\x7F]/',$raw) || mb_strlen($raw)>100) {
            return [['language_name'=>''],['language_name'=>'Enter a language name of up to 100 characters.']];
        }
        $raw=trim($raw);$found=LanguageRegistry::find($raw);
        $selected=$input['language_code']??'';$language=null;
        if (!is_string($selected)) $selected='';
        if ($selected!=='') {foreach ($found['matches'] as $match) if ($match['code']===$selected) $language=$match;}
        elseif ($found['exact'] && count($found['matches'])===1) $language=$found['matches'][0];
        if (!$language) $errors['language_name']=$found['matches']?'Confirm the registered language below, then submit again.':'No registered language matched. Check the spelling or try another name.';
        if (LanguageRegistry::existing($raw,$language['code']??'')) $errors['language_name']='This language already has an edition. Choose it from the language menu, or use Join to offer translation help.';
        if (!is_string($input['website']??'') || trim($input['website']??'')!=='') $errors['form']='The submission could not be accepted. Reload the page and try again.';
        return [['language_name'=>$raw,'language'=>$language,'matches'=>$found['matches']],$errors];
    }
    /** One private lock covers rate checks, deduplication, and atomic record creation. */
    public function save(string $id,array $record,string $rateKey,int $limit,int $retentionDays): bool
    {
        if (!preg_match('/^[a-f0-9]{32}$/D',$id) || !preg_match('/^[a-f0-9]{64}$/D',$rateKey)) throw new \RuntimeException('Invalid storage key.');
        $this->prepare();$lock=fopen($this->directory.'/.lock','c');
        if (!$lock || !flock($lock,LOCK_EX)) throw new \RuntimeException('Private storage unavailable.');
        chmod($this->directory.'/.lock',0600);
        try {
            $this->purge($retentionDays);
            $file=$this->directory.'/'.$id.'.json';
            if (is_file($file)) return true;
            $rateFile=$this->directory.'/.rate-'.$rateKey;
            $rate=is_file($rateFile)?json_decode(file_get_contents($rateFile),true):null;
            if (!is_array($rate) || ($rate['expires']??0)<=time()) $rate=['count'=>0,'expires'=>time()+3600];
            if ($rate['count']>=$limit) return false;
            $rate['count']++;
            $this->atomicWrite($rateFile,json_encode($rate,JSON_THROW_ON_ERROR));
            $this->atomicWrite($file,json_encode($record,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_THROW_ON_ERROR)."\n");
            return true;
        } finally {flock($lock,LOCK_UN);fclose($lock);}
    }
    /** Authenticated administrative reads also apply the configured retention. */
    public function records(int $days): array
    {
        if (!is_dir($this->directory)) return [];
        $lock=fopen($this->directory.'/.lock','c');
        if (!$lock || !flock($lock,LOCK_EX)) throw new \RuntimeException('Private storage unavailable.');
        try {
            $this->purge($days);$records=[];
            foreach (glob($this->directory.'/*.json')?:[] as $file) {
                $record=json_decode(file_get_contents($file),true,512,JSON_THROW_ON_ERROR);
                $records[]=$record;
            }
            usort($records,static fn($a,$b)=>strcmp($b['submitted_at'],$a['submitted_at']));
            return $records;
        } finally {flock($lock,LOCK_UN);fclose($lock);}
    }
    public function delete(string $id): bool
    {
        if (!preg_match('/^[a-f0-9]{32}$/D',$id) || !is_dir($this->directory)) return false;
        $lock=fopen($this->directory.'/.lock','c');
        if (!$lock || !flock($lock,LOCK_EX)) throw new \RuntimeException('Private storage unavailable.');
        try {
            $file=$this->directory.'/'.$id.'.json';
            return is_file($file) && unlink($file);
        } finally {flock($lock,LOCK_UN);fclose($lock);}
    }
    private function atomicWrite(string $path,string $text): void
    {
        $temp=tempnam($this->directory,'.pending-');
        if (!$temp) throw new \RuntimeException('Private storage unavailable.');
        try {
            chmod($temp,0600);
            if (file_put_contents($temp,$text,LOCK_EX)!==strlen($text) || !rename($temp,$path)) throw new \RuntimeException('Private storage unavailable.');
        } finally {if (is_file($temp)) unlink($temp);}
    }
    public function purge(int $days): void
    {
        $cutoff=time()-max(1,$days)*86400;
        foreach (glob($this->directory.'/*.json')?:[] as $file) if (filemtime($file)<$cutoff) unlink($file);
        foreach (glob($this->directory.'/.rate-*')?:[] as $file) if (filemtime($file)<time()-3600) unlink($file);
    }
}
