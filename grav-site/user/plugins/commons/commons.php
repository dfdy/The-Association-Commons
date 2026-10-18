<?php
namespace Grav\Plugin;
use Grav\Common\Plugin;
class CommonsPlugin extends Plugin
{
    public static function getSubscribedEvents(): array {return ['onPluginsInitialized'=>['redirectAliases',0],'onPageInitialized'=>['download',0]];}
    public function redirectAliases(): void
    {
        $path=rtrim(parse_url($_SERVER['REQUEST_URI']??'',PHP_URL_PATH)??'','/');
        if (in_array($path,['/donate','/languages','/stadgar','/white-paper','/privacy','/licence','/licence/content','/licence/software'],true)) {
            $query=$_SERVER['QUERY_STRING']??'';
            header('Location: /en'.$path.($query!==''?'?'.$query:''),true,302);exit;
        }
    }
    public function download(): void
    {
        $format=$_GET['download']??null;
        if (!in_array($format,['md','rtf','pdf'],true)||$this->isAdmin()) return;
        $page=$this->grav['page'];
        if (!$page->published() || !$page->routable() || !$page->isPage()) {http_response_code(404);exit;}
        $title=$page->title(); $markdown=$page->rawMarkdown();
        $export=new \RocketTheme\Toolbox\Event\Event(['markdown'=>$markdown]);
        $this->grav->fireEvent('onCommonsExportMarkdown',$export);
        $markdown=$export['markdown'];
        if ($page->template()==='stadgar') {
            if (($_SERVER['REQUEST_METHOD']??'GET')!=='POST') {http_response_code(405);exit;}
            if ((int)($_SERVER['CONTENT_LENGTH']??0)>250000) {http_response_code(413);exit;}
            $input=json_decode(file_get_contents('php://input',false,null,0,250001),true);
            if (!is_array($input)) {http_response_code(400);exit;}
            $markdown='';
            foreach ($page->header()->builder_fields??[] as $field) {
                $id=$field['id'];$value=$input[$id]??'';
                if (!is_string($value)||mb_strlen($value)>12000||(!empty($field['required'])&&trim($value)==='')) {http_response_code(422);exit;}
                if ($value==='') continue;
                $markdown.=($id==='name'?'# ':'## ').($id==='name'?$value:$field['label']."\n\n".$value)."\n\n";
            }
            $title='Constitution';
        }
        $markdown.="\n\nThe Association Commons · Content: CC BY-NC-SA 4.0 · https://creativecommons.org/licenses/by-nc-sa/4.0/\n";
        header('Cache-Control: private, no-store');header('X-Content-Type-Options: nosniff');
        header('Content-Disposition: attachment; filename="'.($page->template()==='stadgar'?'constitution':'association-commons').'.'.$format.'"');
        if ($format==='md') {header('Content-Type: text/markdown; charset=utf-8');echo $markdown;exit;}
        if ($format==='rtf') {
            header('Content-Type: application/rtf');
            require_once __DIR__.'/FormattedRtf.php';
            echo FormattedRtf::render($markdown);exit;
        }
        require_once '/opt/pdf/vendor/autoload.php';
        $pdf=new \Dompdf\Dompdf(['isRemoteEnabled'=>false,'isPhpEnabled'=>false,'isJavascriptEnabled'=>false,'chroot'=>'/opt/pdf','fontDir'=>'/tmp/commons-pdf-font-cache','fontCache'=>'/tmp/commons-pdf-font-cache','tempDir'=>'/tmp']);
        // Escape all text; no user-provided markup, URLs or images reach the renderer.
        $body='';foreach(explode("\n\n",trim($markdown)) as $paragraph){$tag='p';if(preg_match('/^(#{1,3}) (.*)$/s',$paragraph,$m)){$tag='h'.strlen($m[1]);$paragraph=$m[2];}$body.='<'.$tag.'>'.nl2br(htmlspecialchars($paragraph,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8')).'</'.$tag.'>';}
        $pdf->loadHtml('<!doctype html><meta charset="utf-8"><style>@font-face{font-family:Commons;src:url(/opt/pdf/fonts/NotoSans-Regular.ttf)}body{font-family:Commons,sans-serif;font-size:10pt;line-height:1.5;color:#22342f}h1{font-size:23pt}h2{font-size:16pt}h3{font-size:12pt}@page{margin:22mm}</style>'.$body);
        $pdf->setPaper('A4');$pdf->render();header('Content-Type: application/pdf');echo $pdf->output();exit;
    }
}
