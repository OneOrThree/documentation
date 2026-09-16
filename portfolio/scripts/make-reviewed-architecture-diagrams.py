"""v5: 흐름별 정렬과 상세 컴포넌트 설명으로 SVG/XML/HTML을 함께 생성한다.

운영 실측을 주장하지 않는다. main 대조 커밋과 배포 미확인 상태를 도면에 남긴다.
archify v3 HTML은 최초 실행 시 보존하며 다른 도면은 수정하지 않는다.
"""
import importlib
import json
from html import escape
from shutil import copy2

base = importlib.import_module("make-architecture-diagrams")
ROOT = base.ROOT
VERSION = 5
base.TARGET_VERSIONS.update({"03-service": VERSION, "04-system": VERSION})
COMMIT = "59790ce4916f3e91887caaa6945eefa86c0d6890"


def frame(name, title, height):
    d = base.Diagram(name, title,
                     "2026.09.17 · 역할·정본·전달·운영 상태 · main 구현과 운영 활성화는 별도", height)
    d.band(40, 120, 1680, 70, "상태")
    d.legend_items = [(180,155,"main 구현 · 운영 별도",""),
                      (680,155,"구현 · 기본 OFF","8 5"),
                      (1180,155,"설계 · 배포 미확정","2 5")]
    return d


def detailed(d, descriptions):
    """선의 경로는 유지하고 세로 여백을 늘려 상세 계약을 박스 안에 넣는다."""
    def y(value):
        return round(210 + (value - 210) * 1.6) if value >= 210 else value

    d.height = y(d.height)
    d.decorations = [(x, y(top), w, y(top+h)-y(top), title, subtitle)
                     for x, top, w, h, title, subtitle in d.decorations]
    for node in d.nodes:
        top = node['y']
        node['y'], node['h'] = y(top), y(top+node['h'])-y(top)
        if node['id'] in descriptions:
            node['lines'], node['stage'] = descriptions[node['id']]
        assert 59 + (len(node['lines'])-1)*24 < node['h']-30, node['id']
    for edge in d.edges:
        edge['points'] = [(x, y(top)) for x, top in edge['points']]
        if edge['at']:
            edge['at'] = (edge['at'][0], y(edge['at'][1]))
    return d


def service():
    d = frame("03-service", "Gromo · 서비스 아키텍처", 1590)
    d.band(40, 210, 1680, 350, "공개 REST", "공개 계약은 Business, 코어 정본과 원자 명령은 Data가 소유한다.")
    d.box("app", 60, 300, 260, 110, "모바일 앱", ["명령 · 화면 조회"], state="code")
    d.box("business", 500, 300, 300, 110, "Business API", ["인증 · DTO · 화면 조합", "영속 DB 없음"], state="code")
    d.box("dataHttp", 1000, 300, 300, 110, "Data API", ["권한 · 정산 · 원자 명령"], state="code")
    d.box("coreDb", 1450, 300, 250, 110, "코어 DB", ["gromo", "Data API 소유"], "data", state="code")
    d.box("previewRedis", 500, 455, 300, 90, "미리보기 Redis", ["Business 전용 · LRU · 비영속"], "data", state="code")
    d.edge("appRest", "app", "business", [(320,355),(500,355)], "REST", (410,345), state="code")
    d.edge("internalHttp", "business", "dataHttp", [(800,355),(1000,355)], "내부 HTTP", (900,345), state="code")
    d.edge("coreWrite", "dataHttp", "coreDb", [(1300,355),(1450,355)], "단일 TX", (1375,345), state="code")
    d.edge("previewCache", "business", "previewRedis", [(650,410),(650,455)], "캐시", (705,440), state="code")

    d.band(40, 590, 1680, 355, "실시간과 편지", "Redis는 상태 사본과 fanout. 편지 정본은 PostgreSQL이다.")
    d.box("chatDb", 500, 675, 300, 90, "편지 DB", ["gromo_chat · Realtime 소유"], "data", state="code")
    d.box("data", 1000, 675, 300, 90, "Data API · presence", ["커밋 후 상태 사본 작성"], state="code")
    d.box("socketApp", 60, 820, 260, 100, "모바일 앱", ["STOMP 연결"], state="code")
    d.box("realtime", 500, 820, 300, 100, "Realtime", ["세션 인증 · 편지 · fanout"], "event", state="code")
    d.box("chatRedis", 1000, 820, 300, 100, "채팅·집중 Redis", ["presence 사본 · Pub/Sub", "Realtime은 presence 읽기"], "data", state="code")
    d.edge("appSocket", "socketApp", "realtime", [(320,870),(500,870)], "STOMP", (410,860), state="code")
    d.edge("chatPersistence", "realtime", "chatDb", [(650,820),(650,765)], "저장·조회", (720,799), state="code")
    d.edge("focusPresence", "data", "chatRedis", [(1150,765),(1150,820)], "쓰기", (1200,799), state="code")
    d.edge("chatFanout", "realtime", "chatRedis", [(800,870),(1000,870)], "읽기 · fanout", (900,860), state="code")

    d.band(40, 975, 1680, 340, "알림 · 기본 OFF", "상태 변경·receipt·outbox는 같은 TX. 중복은 eventId, 역순은 version으로 처리한다.")
    d.box("outboxSource", 60, 1060, 260, 110, "Data API · outbox", ["커밋된 사건 보존"], state="code")
    d.box("relay", 500, 1060, 300, 110, "Outbox relay", ["선점 · 재시도 · ACK"], "event", state="off")
    d.box("kafka", 1000, 1060, 300, 110, "Kafka", ["notification-events · DLT", "단일 KRaft · RF 1"], "event", state="off")
    d.box("notification", 1450, 1060, 250, 110, "Notification", ["이벤트 소비 · FCM 발송"], "event", state="off")
    d.box("notiDb", 1410, 1220, 290, 90, "알림 DB", ["gromo_notification"], "data", state="off")
    d.edge("relayOwnership", "outboxSource", "relay", [(320,1115),(500,1115)], "outbox", (410,1105), state="off")
    d.edge("relayKafka", "relay", "kafka", [(800,1115),(1000,1115)], "발행", (900,1105), state="off")
    d.edge("kafkaConsume", "kafka", "notification", [(1300,1115),(1450,1115)], "소비", (1375,1105), state="off")
    d.edge("notificationWrite", "notification", "notiDb", [(1575,1170),(1575,1220)], "저장", (1630,1201), state="off")

    d.band(40, 1345, 1680, 155, "랭킹 · Target-2 · 조건 충족 후 도입")
    d.box("score", 60, 1410, 330, 80, "score-events · DLT", ["절대 점수 + version"], "future", state="plan")
    d.box("rankConsumer", 600, 1410, 330, 80, "랭킹 컨슈머", ["중복 · 역순 수렴"], "future", state="plan")
    d.box("rankRedis", 1130, 1410, 570, 80, "랭킹 Redis", ["projection · Business 조회 · DB로 재구축"], "future", state="plan")
    d.edge("scoreConsume", "score", "rankConsumer", [(390,1450),(600,1450)], "소비", (495,1440), state="plan")
    d.edge("rankProject", "rankConsumer", "rankRedis", [(930,1450),(1130,1450)], "반영", (1030,1440), state="plan")
    d.band(40, 1525, 1680, 55, "흐름별로 같은 서비스를 다시 표시했다. 링크·MMP는 Business/Data에 포함한다. 배치·활성화 조건은 시스템 문서를 따른다.")
    return detailed(d, {
        'app': (["REST 명령 · 화면 조회", "React Native · Expo"], "클라이언트"),
        'business': (["공개 DTO · 인증 · 화면 조합", "Data 명령 호출 · 내부 HTTP", "영속 DB 소유 없음"], "main 구현 · 전체 전환 미확인"),
        'dataHttp': (["권한 · 정산 · 원장 · receipt", "상태 + version + outbox", "같은 TX에서 원자적 반영"], "main 구현 · 운영 전환 미확인"),
        'coreDb': (["gromo · 코어 정본", "Data API 소유", "링크 원장도 코어 DB"], "PostgreSQL"),
        'previewRedis': (["Business 전용 · 재생성 가능", "128 MiB · LRU · 비영속"], "main dev · 채팅 Redis와 별도"),
        'chatDb': (["gromo_chat · 편지 정본", "Realtime 소유 · DB 히스토리"], "main dev · prod 배치 미확정"),
        'data': (["코어 상태 커밋 후 사본 작성", "presence:focus:* 쓰기"], "main 구현 · 서비스 ACL 미확인"),
        'socketApp': (["STOMP 구독 · 편지", "CONNECT 인증"], "클라이언트"),
        'realtime': (["STOMP CONNECT Bearer 인증", "편지 저장 · 조회 · fanout", "prod WSS 배선 미확정"], "main 구현 · dev overlay"),
        'chatRedis': (["presence:focus:* · 상태 사본", "Realtime 읽기 · chat:fanout", "Pub/Sub · 이벤트 재생 불가"], "main dev · 서비스 ACL 미확인"),
        'outboxSource': (["상태 · receipt · outbox", "같은 TX로 사건 보존", "커밋 이후 relay가 전달"], "Data API · 코어 DB 소유"),
        'relay': (["lease · 목적지별 재시도", "Kafka ACK 후 완료 표시", "eventId 보존 · 중복 가능"], "main 구현 · 기본 OFF"),
        'kafka': (["notification-events + .DLT", "userId 키 · 각 3 partitions", "KRaft 단일 노드 · RF 1"], "overlay · 활성화 미확인"),
        'notification': (["eventId 중복 제거", "version으로 역순 처리", "템플릿 · 이력 · FCM"], "소비 · 스케줄 기본 OFF"),
        'notiDb': (["gromo_notification", "Notification 소유"], "prod RDS 내 별도 DB: 목표"),
        'score': (["Data outbox", "절대 점수 + version"], "설계 · 알림과 별도 스트림"),
        'rankConsumer': (["중복 · 역순 적용 수렴", "랭킹 projection 반영"], "설계 · 조건 충족 후 도입"),
        'rankRedis': (["완료 ZSET + 라이브 presence", "Business 조회 · 정본 DB에서 재구축"], "설계 · 코어 정본의 projection"),
    })


def system():
    d = frame("04-system", "Gromo · 시스템 아키텍처", 1460)
    d.band(40, 210, 1680, 215, "Target-1 · 공개 REST", "배치 목표 · 현재 운영 전환은 별도 확인")
    for ident,x,w,title,lines,kind in [
        ("app",60,250,"모바일 앱",["HTTPS"],"core"),
        ("cloudflare",400,270,"Cloudflare",["Edge 프록시"],"external"),
        ("nginx",760,270,"Nginx",["Origin TLS 종료"],"core"),
        ("business",1120,250,"Business API",["공개 REST · :8080"],"core"),
        ("data",1450,250,"Data API",["내부망 · :8081"],"core")]:
        d.box(ident,x,300,w,105,title,lines,kind,state="plan")
    for ident,src,dst,points,label,at in [
        ("appCf","app","cloudflare",[(310,350),(400,350)],"HTTPS",(355,340)),
        ("cfNginx","cloudflare","nginx",[(670,350),(760,350)],"Proxy",(715,340)),
        ("nginxBusiness","nginx","business",[(1030,350),(1120,350)],"REST",(1075,340)),
        ("businessData","business","data",[(1370,350),(1450,350)],"HTTP",(1410,340))]:
        d.edge(ident,src,dst,points,label,at,state="plan")

    d.band(40, 455, 1680, 345, "prod · RDS와 알림", "알림은 같은 RDS 인스턴스의 별도 database · 생성·권한 적용 미확인")
    d.box("prodRds", 1410, 490, 290, 145, "RDS PostgreSQL", ["gromo · Data", "gromo_notification", "Notification 전용 DB"], "data", state="plan")
    d.box("kafka", 760, 675, 270, 100, "Kafka overlay", ["내부 :9092 · 단일 노드"], "event", "활성화 미확인", "off")
    d.box("notification", 1120, 675, 250, 100, "Notification", ["소비 · 스케줄 OFF"], "event", state="off")
    d.edge("dataRds", "data", "prodRds", [(1575,405),(1575,490)], "코어 DB", (1630,446), state="plan")
    d.edge("kafkaNotification", "kafka", "notification", [(1030,725),(1120,725)], "소비", (1075,715), state="off")
    d.edge("notificationDb", "notification", "prodRds", [(1370,725),(1555,725),(1555,635)], "알림 DB", (1460,715), state="off")

    d.band(40, 830, 1680, 410, "dev · main Compose 구성", "서비스 포트와 저장소 배선 · Realtime overlay는 dev 전용")
    d.box("devData", 60, 925, 300, 100, "Data API · :8080", ["코어 DB · presence 작성"], state="code")
    d.box("realtime", 500, 925, 300, 100, "Realtime · :8081", ["STOMP · 편지 · fanout"], "event", state="code")
    d.box("devBusiness", 1000, 925, 300, 100, "Business · :8082", ["미리보기"], state="code")
    d.box("devPg", 60, 1120, 740, 100, "PostgreSQL · 같은 인스턴스", ["gromo: Data / gromo_chat: Realtime · 별도 database"], "data", state="code")
    d.box("chatRedis", 930, 1120, 350, 100, "채팅·집중 Redis", ["Data 쓰기 · Realtime 읽기/fanout"], "data", state="code")
    d.box("previewRedis", 1390, 1120, 310, 100, "미리보기 Redis", ["Business 전용 · 비영속"], "data", state="code")
    d.edge("devDataDb", "devData", "devPg", [(210,1025),(210,1120)], "gromo", (265,1079), state="code")
    d.edge("realtimeDb", "realtime", "devPg", [(650,1025),(650,1120)], "gromo_chat", (720,1079), state="code")
    d.edge("realtimeRedis", "realtime", "chatRedis", [(800,975),(860,975),(860,1170),(930,1170)], "fanout", (895,1079), state="code")
    d.edge("businessPreview", "devBusiness", "previewRedis", [(1150,1025),(1150,1070),(1545,1070),(1545,1120)], "캐시", (1435,1060), state="code")

    d.box("rankRedis", 60, 1290, 660, 120, "Target-2 · 랭킹 Redis", ["score-events · 별도 소비자", "리그 p95 > 1.5초 / findRankOf p95 > 500ms"], "future", "또는 Business 다중 인스턴스 필요", "plan")
    d.box("wssPolicy", 760, 1290, 940, 120, "prod WSS · 배포 미확정", ["TLS 종료 · rate limit · 연결 수 상한을 배포 전에 확정", "편지 DB의 prod 배치와 Redis ACL도 후속 확인"], "future", state="unknown")
    return detailed(d, {
        'app': (["공개 REST · HTTPS", "prod WSS 경로 미확정"], "Target-1 · 전환 미확인"),
        'cloudflare': (["프록시 · edge 정책", "공개 진입점"], "Target-1 · 전환 미확인"),
        'nginx': (["Origin TLS 종료", "REST 경로 → Business", "admin → Notification: 목표"], "Target-1 · 전환 미확인"),
        'business': (["공개 REST · BFF · :8080", "Data 내부 HTTP 호출", "영속 DB 소유 없음"], "Target-1 · 전환 미확인"),
        'data': (["내부망 · :8081", "정산 · 코어 정본 접근", "코어 DB 전용 자격"], "Target-1 · 전환 미확인"),
        'prodRds': (["gromo: Data 소유", "gromo_notification:", "Notification 소유", "별도 database · 유저 · Flyway"], "알림 DB 생성 · 권한 미확인"),
        'kafka': (["내부 :9092 · 영속 볼륨", "KRaft 1 node · RF 1", "단일 노드 장애 내성 한계"], "main 구현 · 활성화 미확인"),
        'notification': (["전용 DB · FCM 자격", "소비 · 스케줄 기본 OFF", "알림 이력 · 중복 처리"], "main 구현 · 운영 미확인"),
        'devData': (["코어 DB · 정산 · 원자 명령", "presence:focus:* 작성", "dev 공개 :8080"], "main Compose"),
        'realtime': (["/ws/chat · /ws/realtime", "STOMP CONNECT Bearer 검증", "편지 저장 · Redis fanout"], "main dev overlay · prod 미확정"),
        'devBusiness': (["공개 DTO · 인증 · 화면 조합", "Data 내부 HTTP 호출", "미리보기 캐시 전용"], "main Compose · :8082"),
        'devPg': (["gromo: Data / gromo_chat: Realtime", "같은 인스턴스 · 별도 database · 소유권 분리"], "main dev · 편지 prod 배치 미확정"),
        'chatRedis': (["Data presence 쓰기", "Realtime presence 읽기 · fanout", "상태 사본 · Pub/Sub 재생 불가"], "main dev · 서비스 ACL 미확인"),
        'previewRedis': (["Business 전용 · 128 MiB", "LRU · 비영속 · 재생성 가능"], "main dev · 채팅 Redis와 별도"),
        'rankRedis': (["score-events · 알림과 별도 스트림 · 소비자", "리그 p95 > 1.5초 / findRankOf p95 > 500ms", "또는 Business 다중 인스턴스 필요"], "Target-2 · 설계 · 조건 충족 후 도입"),
        'wssPolicy': (["TLS 종료 · rate limit · 연결 수 상한을 배포 전에 확정", "편지 DB prod 배치 · Redis ACL 적용 후속 확인", "dev overlay 존재는 prod WSS 운영의 근거가 아니다"], "prod 배포 미확정"),
    })


def write_html(d):
    """동일 SVG·노드·간선으로 연결 강조와 문서 보기·다운로드를 제공한다."""
    diagram_dir = ROOT / "diagrams"
    current = diagram_dir / f"{d.name}.html"
    previous = diagram_dir / f"{d.name}.v{VERSION-1}.html"
    if current.exists() and not previous.exists():
        archived = current.read_text()
        for suffix in ('svg', 'drawio.xml'):
            archived = archived.replace(f'href="{d.name}.{suffix}"',
                                        f'href="{d.name}.v{VERSION-1}.{suffix}"')
        previous.write_text(archived)
    source = diagram_dir / f'{d.name}.source.json'
    source_version = json.loads(source.read_text())['version'] if source.exists() else 2
    # 첫 전환의 SVG/XML은 HTML v3 이전 v2다. 이후에는 실제 생성 버전을 따른다.
    for suffix in ('svg', 'drawio.xml', 'source.json'):
        legacy = diagram_dir / f'{d.name}.{suffix}'
        archive = diagram_dir / f'{d.name}.v{source_version}.{suffix}'
        if source_version < VERSION and legacy.exists() and not archive.exists():
            copy2(legacy, archive)
    d.write(archive=False)
    svg = (diagram_dir / f"{d.name}.svg").read_text()
    graph = {"nodes":d.nodes,"edges":d.edges}
    graph_json = json.dumps(graph, ensure_ascii=False).replace("<", "\\u003c")
    rows = []
    for n in d.nodes:
        outgoing = [f'{e["label"] or "연결"} → {next(x["title"] for x in d.nodes if x["id"] == e["target"])}' for e in d.edges if e["source"] == n["id"]]
        incoming = [f'{next(x["title"] for x in d.nodes if x["id"] == e["source"])} → {e["label"] or "연결"}' for e in d.edges if e["target"] == n["id"]]
        rows.append(f'<article><h2>{escape(n["title"])}</h2><p>{escape(" · ".join(n["lines"]))}</p><p>{escape(n["stage"])}</p><ul>' + "".join(f"<li>{escape(v)}</li>" for v in incoming+outgoing) + '</ul></article>')
    template = '''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__</title><style>
*{box-sizing:border-box}body{margin:0;color:#172b3a;background:#fff;font-family:"Apple SD Gothic Neo","Noto Sans KR",sans-serif}
header{position:sticky;top:0;z-index:2;background:#fff;border-bottom:1px solid #dce4eb;padding:12px 16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
button,a{font:inherit;font-size:13px;border:1px solid #dce4eb;border-radius:6px;padding:7px 10px;background:#f8fafc;color:#172b3a;text-decoration:none;cursor:pointer}
button[aria-pressed=true]{background:#edf4fc;border-color:#3866a0}#hint{margin:0;font-size:12px;color:#4d5a66;flex-basis:100%}
#viewport{overflow:auto;height:calc(100vh - 105px);min-height:400px}svg{display:block;width:100%;height:auto;min-width:900px}
[data-cell-id]{transition:opacity .15s}g[role=button]{cursor:pointer}g[role=button]:focus{outline:none}g[role=button]:focus rect{stroke:#172b3a;stroke-width:4}
.dim{opacity:.16}#text{max-width:1000px;margin:0 auto;padding:20px}article{border-bottom:1px solid #dce4eb;padding:12px 0}h2{font-size:20px}li,p{line-height:1.7}
[hidden]{display:none!important}@media print{header{position:static}header button{display:none}#viewport{height:auto;overflow:visible}svg{width:100%!important;min-width:0}}
</style></head><body><header>
<button id="diagram" aria-pressed="true">다이어그램</button><button id="textView" aria-pressed="false">문서 보기</button>
<button id="fit">전체 보기</button><button id="zoomIn" aria-label="확대">＋</button><button id="zoomOut" aria-label="축소">−</button><button id="reset">연결 강조 해제</button>
<a href="__NAME__.svg" download>SVG ↓</a><a href="__NAME__.drawio.xml" download>draw.io 원본 ↓</a>
<a href="/spec/__DETAIL__" target="_top">근거 문서</a><p id="hint" aria-live="polite">상자를 선택하면 연결을 강조합니다. Esc로 해제 · 실선은 main 구현이며 운영 실측을 뜻하지 않습니다.</p>
</header><main><div id="viewport">__SVG__</div><section id="text" hidden>__ROWS__</section></main>
<script type="application/json" id="graph">__GRAPH__</script><script>
const graph=JSON.parse(document.getElementById('graph').textContent),svg=document.querySelector('svg'),hint=document.getElementById('hint');let zoom=1;
function reset(){svg.querySelectorAll('[data-cell-id]').forEach(el=>el.classList.remove('dim'));hint.textContent='상자를 선택하면 연결을 강조합니다. Esc로 해제 · 실선은 main 구현이며 운영 실측을 뜻하지 않습니다.';}
function select(id){const ids=new Set([id]);graph.edges.filter(e=>e.source===id||e.target===id).forEach(e=>{ids.add(e.id);ids.add(e.source);ids.add(e.target)});svg.querySelectorAll('[data-cell-id]').forEach(el=>el.classList.toggle('dim',!ids.has(el.dataset.cellId)));const n=graph.nodes.find(n=>n.id===id);hint.textContent=n.title+' · '+n.lines.join(' · ')+' · '+n.stage;}
graph.nodes.forEach(n=>{const el=svg.querySelector('[data-cell-id="'+n.id+'"]');el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',n.title+' '+n.stage);el.addEventListener('click',()=>select(n.id));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(n.id)}})});
document.getElementById('reset').onclick=reset;document.addEventListener('keydown',e=>{if(e.key==='Escape')reset()});
function scale(v){zoom=Math.max(.5,Math.min(3,v));svg.style.width=(zoom*100)+'%';svg.style.minWidth=zoom===1?'0':'900px';}
document.getElementById('fit').onclick=()=>scale(1);document.getElementById('zoomIn').onclick=()=>scale(zoom+.25);document.getElementById('zoomOut').onclick=()=>scale(zoom-.25);
function view(text){document.getElementById('text').hidden=!text;document.getElementById('viewport').hidden=text;document.getElementById('diagram').setAttribute('aria-pressed',String(!text));document.getElementById('textView').setAttribute('aria-pressed',String(text));}
document.getElementById('diagram').onclick=()=>view(false);document.getElementById('textView').onclick=()=>view(true);
</script></body></html>'''
    html = template.replace('__TITLE__',escape(d.title)).replace('__NAME__',d.name).replace('__DETAIL__', 'service-architecture' if d.name=='03-service' else 'system-architecture').replace('__SVG__',svg).replace('__ROWS__',''.join(rows)).replace('__GRAPH__',graph_json)
    current.write_text(html)
    (diagram_dir / f"{d.name}.source.json").write_text(json.dumps({"version":VERSION,"sourceCommit":COMMIT,"title":d.title,**graph},ensure_ascii=False,indent=2)+"\n")


if __name__ == '__main__':
    manifest = json.loads((ROOT / 'diagrams' / 'manifest.json').read_text())
    for name in ('03-service','04-system'):
        entry=next(e for e in manifest if e['id']==name)
        if entry['versions'][0]['id'] != f'v{VERSION}':
            raise SystemExit(f'{name}: manifest의 현재 버전을 v{VERSION}로 등록한 뒤 생성하세요.')
    for d in (service(),system()):
        write_html(d)
