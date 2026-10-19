<?php
namespace Grav\Plugin;
use Grav\Common\Plugin;
use Grav\Common\Utils;
use Grav\Common\Security;
use RocketTheme\Toolbox\Event\Event;
use Grav\Plugin\LanguageSuggestions\SubmissionStore;
require_once __DIR__.'/SubmissionStore.php';

class LanguageSuggestionsPlugin extends Plugin
{
    private array $values=[];
    private array $errors=[];
    private string $formId='';
    private string $nonce='';
    private bool $success=false;
    private bool $formActive=false;
    private bool $rendered=false;
    public static function getSubscribedEvents(): array
    {
        return ['onApiRegisterRoutes'=>['adminRoutes',0],'onApiSidebarItems'=>['adminSidebar',0],'onPluginsInitialized'=>['initialize',0],'onShortcodeHandlers'=>['shortcodes',0],'onPageInitialized'=>['page',20],'onTwigSiteVariables'=>['assets',0],'onCommonsExportMarkdown'=>['exportMarkdown',0]];
    }
    public function adminRoutes(Event $event): void
    {
        $event['routes']->get('/language-suggestions/submissions',[\Grav\Plugin\LanguageSuggestions\AdminController::class,'index']);
        $event['routes']->delete('/language-suggestions/submissions/{id}',[\Grav\Plugin\LanguageSuggestions\AdminController::class,'delete']);
    }
    public function adminSidebar(Event $event): void
    {
        $items=$event['items'];
        $items[]=['id'=>'language-suggestions','plugin'=>'language-suggestions','label'=>'Language suggestions','icon'=>'fa-users','route'=>'/plugin/language-suggestions','priority'=>0,'authorize'=>'admin.super'];
        $event['items']=$items;
    }
    public function initialize(): void
    {
        $this->grav['language-suggestions']=$this;
        spl_autoload_register(static function(string $class): void {
            if ($class===\Grav\Plugin\LanguageSuggestions\AdminController::class) require_once __DIR__.'/AdminController.php';
        });
    }
    public function shortcodes(): void {$this->grav['shortcode']->registerAllShortcodes(__DIR__.'/shortcodes');}
    private function store(): SubmissionStore {return new SubmissionStore(GRAV_ROOT.'/user/data/commons-private/language-suggestions');}
    private function configValue(string $key,int $default): int {return max(1,(int)$this->config->get('plugins.language-suggestions.'.$key,$default));}
    public function page(): void
    {
        if ($this->isAdmin()) return;
        $page=$this->grav['page'];
        if (!$page->published() || !$page->routable() || !str_contains($page->rawMarkdown(),'[language-suggestions /]')) return;
        $this->formActive=true;$page->header()->cache_enable=false;
        header('Cache-Control: private, no-store');
        $session=$this->grav['session'];
        $this->nonce=Utils::getNonce('ddc-language-suggestions');
        $issued=($session->ddc_language_suggestions_forms??[]);
        if (!is_array($issued)) $issued=[];
        $issued=array_filter($issued,static fn($value)=>is_array($value) && ($value['time']??0)>time()-3600);
        if (($_SERVER['REQUEST_METHOD']??'GET')==='POST' && ($_POST['suggestion_action']??'')==='submit') {
            if ((int)($_SERVER['CONTENT_LENGTH']??0)>32768) {$this->errors=['form'=>'The submission is too large. Please shorten your message.'];$this->respond(413);}
            $id=$_POST['form_id']??'';
            $crossSite=($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site';
            $origin=$_SERVER['HTTP_ORIGIN']??null;
            if ($origin!==null) {
                $parts=parse_url($origin);
                $originHost=strtolower(($parts['host']??'').(isset($parts['port'])?':'.$parts['port']:''));
                $crossSite=$crossSite || $originHost!==strtolower($_SERVER['HTTP_HOST']??'');
            }
            if (!$this->errors && ($crossSite || !is_string($_POST['nonce']??null) || !Utils::verifyNonce($_POST['nonce'],'ddc-language-suggestions') || !is_string($id) || !isset($issued[$id]) || $issued[$id]['route']!==$page->route())) {
                $this->errors=['form'=>'This form has expired or could not be verified. Reload the page and try again.'];$this->respond(403);
            }
            if (!$this->errors) {
                [$this->values,$this->errors]=SubmissionStore::validate($_POST);
                if ($this->errors) $this->respond(422);
                else {
                    try {
                        $rate=hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',Security::getNonceKey());
                        $record=['id'=>$id,'submitted_at'=>gmdate('c'),'code'=>$this->values['language']['code'],'name'=>$this->values['language']['name']];
                        if (!$this->store()->save($id,$record,$rate,$this->configValue('hourly_limit',10),$this->configValue('retention_days',90))) {
                            $this->errors=['form'=>'Too many submissions have been received from this connection. Please try again in an hour.'];$this->respond(429);
                        } else {
                            $this->success=true;
                            if ($this->wantsJson()) $this->respond(201);
                            $session->ddc_language_suggestions_receipt=$page->route();
                            header('Location: '.$this->grav['uri']->route().'#language-suggestions',true,303);exit;
                        }
                    } catch (\Throwable $error) {
                        $this->errors=['form'=>'We could not save your suggestion. Please try again later.'];$this->respond(503);
                    }
                }
            }
        }
        if (($session->ddc_language_suggestions_receipt??null)===$page->route()) {$this->success=true;unset($session->ddc_language_suggestions_receipt);}
        $this->formId=bin2hex(random_bytes(16));
        $issued[$this->formId]=['time'=>time(),'route'=>$page->route()];
        $session->ddc_language_suggestions_forms=array_slice($issued,-20,null,true);
    }
    private function wantsJson(): bool {return str_contains($_SERVER['HTTP_ACCEPT']??'','application/json');}
    private function respond(int $status): void
    {
        if (!$this->wantsJson()) {http_response_code($status);return;}
        http_response_code($status);header('Content-Type: application/json; charset=utf-8');header('X-Content-Type-Options: nosniff');
        echo json_encode(['success'=>$this->success,'message'=>$this->success?'Thank you. Your language suggestion has been recorded.':'Please check your submission.','errors'=>$this->errors],JSON_THROW_ON_ERROR);exit;
    }
    public function assets(): void
    {
        if (!$this->formActive) return;
        $this->grav['assets']->addCss('plugin://language-suggestions/assets/language-suggestions.css');
        $this->grav['assets']->addJs('plugin://language-suggestions/assets/language-suggestions.js',['loading'=>'defer']);
    }
    private static function e($value): string {return htmlspecialchars((string)$value,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
    public function render(): string
    {
        if (!$this->formActive || $this->rendered) return '';
        $this->rendered=true;
        $html='<section class="language-suggestions" id="language-suggestions" aria-label="Suggest a language" lang="en"><p id="suggestion-help">Enter a registered language name. Minor spelling mistakes may be matched; uncertain matches require your confirmation. Existing editions are listed in the language menu. Do not enter personal information. Only the registered language name, code, a random identifier, and submission time are saved. Read the <a href="/en/privacy">privacy policy</a>.</p>';
        if ($this->success) $html.='<p role="status" tabindex="-1">Thank you. Your language suggestion has been recorded.</p>';
        else {
            $html.='<form method="post" action="'.self::e($this->grav['uri']->route()).'#language-suggestions" aria-describedby="suggestion-help" aria-label="Suggest a language" novalidate><input type="hidden" name="suggestion_action" value="submit"><input type="hidden" name="form_id" value="'.self::e($this->formId).'"><input type="hidden" name="nonce" value="'.self::e($this->nonce).'">';
            if ($this->errors) {
                $html.='<div class="interest-errors" id="suggestion-errors" role="alert" tabindex="-1"><p>Please check your suggestion:</p><ul>';
                foreach ($this->errors as $error) $html.='<li>'.self::e($error).'</li>';
                $html.='</ul></div>';
            }
            $html.='<label for="suggestion-name">Language name (required)</label><input id="suggestion-name" name="language_name" maxlength="100" required autocomplete="off" value="'.self::e($this->values['language_name']??'').'"'.(isset($this->errors['language_name'])?' aria-invalid="true"':'').' aria-describedby="suggestion-help'.($this->errors?' suggestion-errors':'').'">';
            if (!empty($this->values['matches'])) {
                $html.='<label for="suggestion-code">Confirm the registered language (required)</label><select id="suggestion-code" name="language_code" required><option value="">Choose a language</option>';
                foreach ($this->values['matches'] as $match) $html.='<option value="'.self::e($match['code']).'">'.self::e($match['name'].' ('.$match['code'].')').'</option>';
                $html.='</select>';
            }
            $html.='<div hidden aria-hidden="true"><label for="suggestion-website">Leave empty</label><input id="suggestion-website" name="website" tabindex="-1" autocomplete="off"></div><button type="submit">Suggest a language</button></form>';
        }
        $html.='<h2>Suggested languages</h2><p>Tallies count accepted suggestions, not verified unique people. Counts cover retained records and may decrease after expiry or deletion. Suggestions do not automatically create a translated edition.</p>';
        try {
            $tallies=[];
            foreach ($this->store()->records($this->configValue('retention_days',90)) as $record) {
                $code=$record['code'];if (!isset($tallies[$code])) $tallies[$code]=['name'=>$record['name'],'count'=>0];$tallies[$code]['count']++;
            }
            uasort($tallies,static fn($a,$b)=>($b['count']<=>$a['count'])?:strcmp($a['name'],$b['name']));
            if (!$tallies) $html.='<p>No suggestions yet.</p>';
            else {
                $html.='<table><caption>Language suggestion counts</caption><thead><tr><th scope="col">Language</th><th scope="col">Suggestions</th></tr></thead><tbody>';
                foreach ($tallies as $tally) $html.='<tr><th scope="row">'.self::e($tally['name']).'</th><td>'.$tally['count'].'</td></tr>';
                $html.='</tbody></table>';
            }
        } catch (\Throwable $error) {$html.='<p>Suggestion counts could not be loaded. Please try again later.</p>';}
        return $html.'</section>';
    }
    public function exportMarkdown(Event $event): void
    {
        $event['markdown']=str_replace('[language-suggestions /]','[Suggest a language online](/en/languages). Only registered language information is saved; see the [privacy policy](/en/privacy).',$event['markdown']);
    }
}
