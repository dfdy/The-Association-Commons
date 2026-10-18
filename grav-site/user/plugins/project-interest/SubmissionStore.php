<?php
namespace Grav\Plugin\ProjectInterest;

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
        $values=[];$errors=[];
        foreach (['name'=>120,'email'=>254,'organisation'=>160,'message'=>1500] as $key=>$limit) {
            $raw=$input[$key]??'';
            if (!is_string($raw)) {$errors[$key]='Enter text in this field.';$raw='';}
            $value=trim($raw);
            if (preg_match('//u',$value)!==1 || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/',$value)) {$errors[$key]='Use ordinary text without control characters.';$value='';}
            if (mb_strlen($value)>$limit) $errors[$key]='Use '.$limit.' characters or fewer.';
            $values[$key]=mb_substr($value,0,$limit);
        }
        if ($values['name']==='') $errors['name']='Enter your name.';
        if (!filter_var($values['email'],FILTER_VALIDATE_EMAIL)) $errors['email']='Enter a valid email address.';
        if (($input['consent']??'')!=='yes') $errors['consent']='Confirm that we may use these details to respond to your interest.';
        $values['consent']=($input['consent']??'')==='yes';
        if (!is_string($input['website']??'') || trim($input['website']??'')!=='') $errors['form']='The submission could not be accepted. Please reload the page and try again.';
        return [$values,$errors];
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
