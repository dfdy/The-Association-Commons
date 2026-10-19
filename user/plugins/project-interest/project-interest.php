<?php
namespace Grav\Plugin;
use Grav\Common\Plugin;
use Grav\Common\Utils;
use Grav\Common\Security;
use RocketTheme\Toolbox\Event\Event;
use Grav\Plugin\ProjectInterest\SubmissionStore;
require_once __DIR__.'/SubmissionStore.php';

class ProjectInterestPlugin extends Plugin
{
    private array $values=[];
    private array $errors=[];
    private string $formId='';
    private string $nonce='';
    private bool $success=false;
    private bool $formActive=false;
    private bool $rendered=false;
    private ?array $translatedMessages=null;
    public static function getSubscribedEvents(): array
    {
        return ['onApiRegisterRoutes'=>['adminRoutes',0],'onApiSidebarItems'=>['adminSidebar',0],'onPluginsInitialized'=>['initialize',0],'onShortcodeHandlers'=>['shortcodes',0],'onPageInitialized'=>['page',20],'onTwigSiteVariables'=>['assets',0],'onCommonsExportMarkdown'=>['exportMarkdown',0]];
    }
    public function adminRoutes(Event $event): void
    {
        $event['routes']->get('/project-interest/submissions',[\Grav\Plugin\ProjectInterest\AdminController::class,'index']);
        $event['routes']->delete('/project-interest/submissions/{id}',[\Grav\Plugin\ProjectInterest\AdminController::class,'delete']);
    }
    public function adminSidebar(Event $event): void
    {
        $items=$event['items'];
        $items[]=['id'=>'project-interest','plugin'=>'project-interest','label'=>'Project interest','icon'=>'fa-users','route'=>'/plugin/project-interest','priority'=>0,'authorize'=>'admin.super'];
        $event['items']=$items;
    }
    public function initialize(): void
    {
        $this->grav['project-interest']=$this;
        spl_autoload_register(static function(string $class): void {
            if ($class===\Grav\Plugin\ProjectInterest\AdminController::class) require_once __DIR__.'/AdminController.php';
        });
    }
    public function shortcodes(): void {$this->grav['shortcode']->registerAllShortcodes(__DIR__.'/shortcodes');}
    private function store(): SubmissionStore {return new SubmissionStore(GRAV_ROOT.'/user/data/commons-private/project-interest');}
    private function configValue(string $key,int $default): int {return max(1,(int)$this->config->get('plugins.project-interest.'.$key,$default));}
    public function page(): void
    {
        if ($this->isAdmin()) return;
        $page=$this->grav['page'];
        if (!$page->published() || !$page->routable() || !str_contains($page->rawMarkdown(),'[project-interest /]')) return;
        $this->formActive=true;$page->header()->cache_enable=false;
        header('Cache-Control: private, no-store');
        $session=$this->grav['session'];
        $this->nonce=Utils::getNonce('ddc-project-interest');
        $issued=($session->ddc_interest_forms??[]);
        if (!is_array($issued)) $issued=[];
        $issued=array_filter($issued,static fn($value)=>is_array($value) && ($value['time']??0)>time()-3600);
        if (($_SERVER['REQUEST_METHOD']??'GET')==='POST' && ($_POST['interest_action']??'')==='submit') {
            if ((int)($_SERVER['CONTENT_LENGTH']??0)>32768) {$this->errors=['form'=>'The submission is too large. Please shorten your message.'];$this->respond(413);}
            $id=$_POST['form_id']??'';
            $crossSite=($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site';
            $origin=$_SERVER['HTTP_ORIGIN']??null;
            if ($origin!==null) {
                $parts=parse_url($origin);
                $originHost=strtolower(($parts['host']??'').(isset($parts['port'])?':'.$parts['port']:''));
                $crossSite=$crossSite || $originHost!==strtolower($_SERVER['HTTP_HOST']??'');
            }
            if (!$this->errors && ($crossSite || !Utils::verifyNonce($_POST['nonce']??null,'ddc-project-interest') || !is_string($id) || !isset($issued[$id]) || $issued[$id]['route']!==$page->route())) {
                $this->errors=['form'=>'This form has expired or could not be verified. Reload the page and try again.'];$this->respond(403);
            }
            if (!$this->errors) {
                [$this->values,$this->errors]=SubmissionStore::validate($_POST);
                if ($this->errors) $this->respond(422);
                else {
                    try {
                        $rate=hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',Security::getNonceKey());
                        $record=['id'=>$id,'submitted_at'=>gmdate('c'),'request_type'=>'project_interest','source_route'=>$this->grav['uri']->route(),'language_code'=>(string)($page->header()->language_code??'en'),'name'=>$this->values['name'],'email'=>$this->values['email'],'organisation'=>$this->values['organisation'],'message'=>$this->values['message'],'consent'=>true,'consent_notice_version'=>'0.3.0-2026-10-18'];
                        if (!$this->store()->save($id,$record,$rate,$this->configValue('hourly_limit',10),$this->configValue('retention_days',90))) {
                            $this->errors=['form'=>'Too many submissions have been received from this connection. Please try again in an hour.'];$this->respond(429);
                        } else {
                            $this->success=true;
                            if ($this->wantsJson()) $this->respond(201);
                            $session->ddc_interest_receipt=$page->route();
                            header('Location: '.$this->grav['uri']->route().'#project-interest',true,303);exit;
                        }
                    } catch (\Throwable $error) {
                        $this->errors=['form'=>'We could not save your interest. Please try again later.'];$this->respond(503);
                    }
                }
            }
        }
        if (($session->ddc_interest_receipt??null)===$page->route()) {$this->success=true;unset($session->ddc_interest_receipt);}
        $this->formId=bin2hex(random_bytes(16));
        $issued[$this->formId]=['time'=>time(),'route'=>$page->route()];
        $session->ddc_interest_forms=array_slice($issued,-20,null,true);
    }
    private function wantsJson(): bool {return str_contains($_SERVER['HTTP_ACCEPT']??'','application/json');}
    private function respond(int $status): void
    {
        if (!$this->wantsJson()) {http_response_code($status);return;}
        http_response_code($status);header('Content-Type: application/json; charset=utf-8');header('X-Content-Type-Options: nosniff');
        echo json_encode(['success'=>$this->success,'message'=>$this->translate($this->success?'Thank you. Your interest has been recorded. This does not confer membership.':'Please check your submission.'),'errors'=>array_map(fn($error)=>$this->translate($error),$this->errors)],JSON_THROW_ON_ERROR);exit;
    }
    public function assets(): void
    {
        if (!$this->formActive) return;
        $this->grav['assets']->addCss('plugin://project-interest/assets/project-interest.css');
        $this->grav['assets']->addJs('plugin://project-interest/assets/project-interest.js',['loading'=>'defer']);
    }
    private static function e($value): string {return htmlspecialchars((string)$value,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
    private function formLanguage(): string
    {
        $code=(string)($this->grav['page']->header()->language_code??'en');
        return preg_match('/^[a-z]{2,3}(?:-x-[a-z]+)?$/D',$code) && is_file(__DIR__.'/languages/'.$code.'.json')?$code:'en';
    }
    private function messages(): array
    {
        $language=$this->formLanguage();
        return $this->translatedMessages??=($language==='en'?[]:json_decode(file_get_contents(__DIR__.'/languages/'.$language.'.json'),true,512,JSON_THROW_ON_ERROR));
    }
    private function translate(string $text): string {return $this->messages()[$text]??$text;}
    public function render(): string
    {
        if (!$this->formActive || $this->rendered) return '';
        $this->rendered=true;
        $text=fn(string $value): string=>self::e($this->translate($value));
        $html='<div class="project-interest" id="project-interest" lang="'.self::e($this->formLanguage()).'" data-messages="'.self::e(json_encode($this->messages(),JSON_THROW_ON_ERROR)).'"><p id="interest-instructions">'.$text('Express your interest in helping develop this project. Required fields are labelled. We will use your details to consider and respond to your interest; submitting this form does not confer membership or subscribe you to a mailing list.').'</p><p>'.$text('Do not include sensitive personal information. Read the ').'<a href="/en/privacy">'.$text('privacy policy').'</a>'.$text(' before submitting.').'</p><p class="interest-status" role="status" tabindex="-1">'.($this->success?$text('Thank you. Your interest has been recorded. This does not confer membership.'):'').'</p>';
        if ($this->success) return $html.'</div>';
        $html.='<form method="post" action="'.self::e($this->grav['uri']->route()).'#project-interest" aria-label="'.$text('Express interest in the project').'" aria-describedby="interest-instructions" novalidate><input type="hidden" name="interest_action" value="submit"><input type="hidden" name="form_id" value="'.self::e($this->formId).'"><input type="hidden" name="nonce" value="'.self::e($this->nonce).'">';
        $html.='<div class="interest-errors" id="interest-errors" role="alert" tabindex="-1"'.(!$this->errors?' hidden':'').'><p>'.$text('Please check the following:').'</p><ul>';
        foreach ($this->errors as $field=>$error) $html.='<li>'.($field==='form'?$text($error):'<a href="#interest-'.self::e($field).'">'.$text($error).'</a>').'</li>';
        $html.='</ul></div><div class="interest-fields">';
        foreach (['name'=>['Name (required)',120,'text','name'],'email'=>['Email address (required)',254,'email','email'],'organisation'=>['Organisation or community (optional)',160,'text','organization'],'message'=>['How would you like to take part? (optional)',1500,'textarea','off']] as $key=>[$label,$limit,$type,$autocomplete]) {
            $error=$this->errors[$key]??'';
            $html.='<div><label for="interest-'.$key.'">'.$text($label).'</label>';
            $attrs=' id="interest-'.$key.'" name="'.$key.'" maxlength="'.$limit.'" autocomplete="'.$autocomplete.'" aria-describedby="interest-'.$key.'-error'.($key==='message'?' interest-message-help':'').'"'.($error?' aria-invalid="true"':'').(in_array($key,['name','email'],true)?' required':'');
            $html.=$type==='textarea'?'<textarea'.$attrs.' rows="4">'.self::e($this->values[$key]??'').'</textarea>':'<input type="'.$type.'"'.$attrs.' value="'.self::e($this->values[$key]??'').'">';
            if ($key==='message') $html.='<p id="interest-message-help">'.$text('Up to 1,500 characters. You can mention discussion, translation, practical use, research, or another interest.').'</p>';
            $html.='<p class="interest-field-error" id="interest-'.$key.'-error"'.(!$error?' hidden':'').'>'.$text($error).'</p></div>';
        }
        $html.='</div><div hidden aria-hidden="true"><label for="interest-website">'.$text('Leave this field empty').'</label><input id="interest-website" name="website" tabindex="-1" autocomplete="off"></div><label class="interest-consent" for="interest-consent"><input type="checkbox" id="interest-consent" name="consent" value="yes" required aria-describedby="interest-consent-error"'.(!empty($this->values['consent'])?' checked':'').(isset($this->errors['consent'])?' aria-invalid="true"':'').'><span>'.$text('I agree that the project may store and use these details to consider and respond to my interest, as described in the privacy policy. (required)').'</span></label><p class="interest-field-error" id="interest-consent-error"'.(!isset($this->errors['consent'])?' hidden':'').'>'.$text($this->errors['consent']??'').'</p><button type="submit">'.$text('Express interest').'</button></form></div>';
        return $html;
    }
    public function exportMarkdown(Event $event): void
    {
        $route=$this->grav['uri']->route();
        $event['markdown']=str_replace('[project-interest /]','To express interest in the project, use the form on this [proposal page](/LANGUAGE#project-interest). Read the [privacy policy](/en/privacy) before submitting.',$event['markdown']);
        $event['markdown']=str_replace('/LANGUAGE#project-interest',$route.'#project-interest',$event['markdown']);
    }
}
