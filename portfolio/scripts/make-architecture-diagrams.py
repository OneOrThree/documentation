#!/usr/bin/env python3
"""phone/docs의 아키텍처를 SVG와 편집 가능한 draw.io XML로 함께 생성한다.

두 형식은 동일한 셀 ID·좌표·연결선을 사용한다. 다른 다이어그램은 수정하지 않는다.
근거와 구현 단계는 content/spec/architecture.mdx 및 두 상세 문서에 기록한다.
"""

from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FONT = "Apple SD Gothic Neo, Noto Sans KR, sans-serif"
COLORS = {
    "core": ("#edf4fc", "#3866a0"),
    "data": ("#fff3e8", "#a9682b"),
    "event": ("#f0edfb", "#7860aa"),
    "external": ("#f2f5f7", "#607583"),
    "future": ("#fff8e7", "#a67b26"),
}


class Diagram:
    def __init__(self, name, title, subtitle, height):
        self.name, self.width, self.height = name, 1760, height
        self.nodes, self.edges, self.decorations = [], [], []
        self.title, self.subtitle = title, subtitle

    def band(self, x, y, w, h, title, subtitle=""):
        self.decorations.append((x, y, w, h, title, subtitle))

    def box(self, ident, x, y, w, h, title, lines, kind="core", stage=""):
        self.nodes.append(dict(id=ident, x=x, y=y, w=w, h=h, title=title,
                               lines=lines, kind=kind, stage=stage))

    def edge(self, ident, source, target, points, label="", at=None, async_=False):
        self.edges.append(dict(id=ident, source=source, target=target, points=points,
                               label=label, at=at, async_=async_))

    def write(self):
        parts = [
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.width}" height="{self.height}" '
            f'viewBox="0 0 {self.width} {self.height}" role="img" aria-labelledby="diagramTitle diagramDesc">',
            f'<title id="diagramTitle">{escape(self.title)}</title>',
            f'<desc id="diagramDesc">{escape(self.subtitle)}</desc>',
            '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" '
            'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            '<path d="M 0 0 L 10 5 L 0 10 z" fill="#607583"/></marker></defs>',
            f'<g font-family="{FONT}"><rect width="1760" height="{self.height}" fill="#ffffff"/>',
        ]
        file = ET.Element("mxfile", host="app.diagrams.net", version="31.4.5")
        page = ET.SubElement(file, "diagram", id=self.name, name=self.title)
        model = ET.SubElement(page, "mxGraphModel", dx="1760", dy=str(self.height),
                              grid="1", gridSize="10", page="1", pageScale="1",
                              pageWidth="1760", pageHeight=str(self.height))
        root = ET.SubElement(model, "root")
        ET.SubElement(root, "mxCell", id="0")
        ET.SubElement(root, "mxCell", id="1", parent="0")

        def text(x, y, value, size=17, color="#4d5a66", weight="400"):
            return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" '
                    f'font-weight="{weight}">{escape(value)}</text>')

        def decor(ident, x, y, w, h, value, style):
            cell = ET.SubElement(root, "mxCell", id=ident, value=value, vertex="1",
                                 connectable="0", parent="1", style=style)
            ET.SubElement(cell, "mxGeometry", x=str(x), y=str(y), width=str(w),
                          height=str(h), attrib={"as": "geometry"})

        parts += [text(60, 58, self.title, 32, "#172b3a", "700"),
                  text(60, 92, self.subtitle, 17)]
        decor("heading", 60, 24, 1640, 45, self.title,
              "text;html=0;fontSize=32;fontStyle=1;align=left;")
        decor("subtitle", 60, 72, 1640, 30, self.subtitle,
              "text;html=0;fontSize=17;align=left;fontColor=#4d5a66;")

        for i, (x, y, w, h, title, subtitle) in enumerate(self.decorations):
            parts += [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" '
                      'fill="#f8fafc" stroke="#dce4eb"/>',
                      text(x + 24, y + 34, title, 19, "#334d61", "700")]
            if subtitle:
                parts.append(text(x + 24, y + 61, subtitle, 16))
            decor(f"band{i}", x, y, w, h, "", "rounded=1;fillColor=#f8fafc;strokeColor=#dce4eb;")
            decor(f"bandTitle{i}", x + 24, y + 12, w - 48, 30, title,
                  "text;html=0;fontSize=19;fontStyle=1;align=left;")
            if subtitle:
                decor(f"bandSub{i}", x + 24, y + 43, w - 48, 26, subtitle,
                      "text;html=0;fontSize=16;align=left;fontColor=#4d5a66;")

        lookup = {n["id"]: n for n in self.nodes}
        for edge in self.edges:
            source, target = lookup[edge["source"]], lookup[edge["target"]]
            points = edge["points"]
            assert all(a[0] == b[0] or a[1] == b[1] for a, b in zip(points, points[1:])), edge["id"]
            path = "M " + " L ".join(f"{x} {y}" for x, y in points)
            dash = ' stroke-dasharray="7 5"' if edge["async_"] else ""
            parts.append(f'<g data-cell-id="{edge["id"]}"><path d="{path}" fill="none" '
                         f'stroke="#607583" stroke-width="2" marker-end="url(#arrow)"{dash}/>')
            if edge["label"] and edge["at"]:
                x, y = edge["at"]
                label_width = sum(8.0 if ord(c) < 128 else 14.5 for c in edge["label"]) + 16
                parts.append(f'<rect x="{x-label_width/2}" y="{y-16}" width="{label_width}" '
                             'height="23" rx="4" fill="#ffffff"/>')
                parts.append(f'<text x="{x}" y="{y}" font-size="14" text-anchor="middle" '
                             f'fill="#405768">{escape(edge["label"])}</text>')
            parts.append("</g>")
            sx, sy = points[0]
            tx, ty = points[-1]
            style = ("edgeStyle=none;rounded=0;html=1;endArrow=block;endFill=1;"
                     "strokeColor=#607583;strokeWidth=2;fontSize=14;fontColor=#405768;"
                     "labelBackgroundColor=#ffffff;"
                     f"exitX={(sx-source['x'])/source['w']};exitY={(sy-source['y'])/source['h']};"
                     f"entryX={(tx-target['x'])/target['w']};entryY={(ty-target['y'])/target['h']};"
                     + ("dashed=1;" if edge["async_"] else ""))
            cell = ET.SubElement(root, "mxCell", id=edge["id"], value=edge["label"],
                                 source=edge["source"], target=edge["target"], edge="1",
                                 parent="1", style=style)
            geo = ET.SubElement(cell, "mxGeometry", relative="1", attrib={"as": "geometry"})
            array = ET.SubElement(geo, "Array", attrib={"as": "points"})
            for x, y in points[1:-1]:
                ET.SubElement(array, "mxPoint", x=str(x), y=str(y))

        for node in self.nodes:
            x, y, w, h = (node[k] for k in ["x", "y", "w", "h"])
            fill, accent = COLORS[node["kind"]]
            assert 0 <= x and x+w <= self.width and 0 <= y and y+h <= self.height
            parts += [f'<g data-cell-id="{node["id"]}">',
                      f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" '
                      f'fill="{fill}" stroke="{accent}" stroke-width="1.4"/>',
                      text(x+20, y+30, node["title"], 21, "#172b3a", "700")]
            for i, line in enumerate(node["lines"]):
                parts.append(text(x+20, y+59+i*24, line, 16))
            if node["stage"]:
                parts.append(text(x+20, y+h-15, node["stage"], 14, accent, "700"))
            parts.append("</g>")
            value = "<b>" + escape(node["title"]) + "</b><br>" + "<br>".join(
                escape(line) for line in node["lines"])
            if node["stage"]:
                value += "<br><b>" + escape(node["stage"]) + "</b>"
            style = (f"rounded=1;whiteSpace=wrap;html=1;fillColor={fill};strokeColor={accent};"
                     "fontColor=#172b3a;fontSize=16;align=left;verticalAlign=top;"
                     "spacingTop=14;spacingLeft=20;spacingRight=14;spacingBottom=12;")
            cell = ET.SubElement(root, "mxCell", id=node["id"], value=value, vertex="1",
                                 parent="1", style=style)
            ET.SubElement(cell, "mxGeometry", x=str(x), y=str(y), width=str(w),
                          height=str(h), attrib={"as": "geometry"})

        parts += ["</g></svg>"]
        out = ROOT / "diagrams"
        (out / f"{self.name}.svg").write_text("\n".join(parts) + "\n")
        ET.indent(file)
        ET.ElementTree(file).write(out / f"{self.name}.drawio.xml", encoding="utf-8",
                                   xml_declaration=True)
        print(f"{self.name}: {len(self.nodes)} nodes / {len(self.edges)} edges")


def service():
    d = Diagram("03-service", "Gromo · 서비스 아키텍처",
                "2026.09.13 · phone/docs 기반 목표 구조 · 실선: HTTP·저장소 / 점선: 비동기 · main·통합 PR·후속 단계 구분", 1490)
    d.band(40, 120, 1680, 220, "01  명령과 데이터 소유권")
    d.band(40, 370, 1680, 850, "02  실시간 전달 · 내구 이벤트 · 위성 서비스")
    d.band(40, 1230, 1680, 220, "03  조건 충족 후 확장 · Target-2",
           "랭킹 지연·인스턴스 증가를 측정한 뒤 도입한다. 기존 채팅 Redis와 도입 시점이 다르다.")
    d.box("app", 60, 175, 280, 130, "모바일 앱",
          ["REST 명령·스냅샷", "STOMP 구독·응원·편지"], stage="React Native · Expo")
    d.box("business", 460, 175, 360, 140, "Business API",
          ["인증 · 공개 DTO · BFF", "Data 명령 호출 · DB 소유 없음"], stage="전체 진입점 이관: 목표")
    d.box("data", 1020, 175, 320, 145, "Data API",
          ["상태·정산·버전의 소유자", "명령 receipt + outbox = 같은 TX"], stage="원자 명령·outbox: 통합 PR")
    d.box("coreDb", 1450, 175, 250, 145, "PostgreSQL",
          ["gromo · 도메인 정본", "원장 · 멱등 결과 · outbox"], "data", "코어 DB 접근: Data만")
    d.box("realtime", 60, 435, 280, 170, "Realtime",
          ["채널 분리 · 현재 수신자 인가", "기존 편지 저장·전파", "신규 14종 EventRouter"], "event", "채팅·router: main / 전달: 후속")
    d.box("adapter", 500, 455, 300, 135, "실시간 전달 어댑터",
          ["커밋된 eventId 그대로 전달", "전송 경로·인가 통합 필요"], "future", "후속 · 공개 POST·토픽 미추가")
    d.box("relay", 1020, 440, 320, 150, "Data outbox relay",
          ["미전달 행 lease · 재시도", "목적지별 전달 완료 기록", "Broker ACK 뒤 발행 완료"], "event", "통합 PR #745")
    d.box("chatRedis", 60, 725, 280, 145, "Redis · 채팅/집중",
          ["chat:fanout · 휘발 Pub/Sub", "presence:focus:* · 상태 사본", "Realtime은 presence 읽기만"], "data", "main · ACL 배포는 후속")
    d.box("previewRedis", 480, 725, 340, 145, "Redis · 미리보기 전용",
          ["cache:business:preview:*", "메타데이터 · 축소 PNG · TTL", "128 MiB · allkeys-lru · 비영속"], "data", "main · 채팅 Redis와 별도")
    d.box("kafka", 1020, 725, 320, 145, "Kafka · 알림 스트림",
          ["notification-events · userId 키", "3 partitions · .DLT도 3", "KRaft 1 node · RF 1 · 7일"], "event", "통합 PR · 활성화 기본 OFF")
    d.box("notification", 1450, 725, 250, 170, "Notification",
          ["eventId 멱등 · version", "재시도 · .DLT · 재조정", "템플릿 · 발송 · 이력"], "event", "통합 PR #745")
    d.box("chatDb", 60, 1000, 280, 115, "PostgreSQL · 편지",
          ["gromo_chat · 메시지 정본"], "data", "main · 히스토리로 복구")
    d.box("link", 480, 1000, 340, 160, "Link · MMP",
          ["Vercel · 랜딩 · 초대 · 귀속", "코어가 HTTP로 전달", "링크 서버는 Kafka 미접속"], "external", "위성 분리: 목표")
    d.box("neon", 1020, 1020, 320, 115, "Neon PostgreSQL",
          ["링크 · 클릭 · 어트리뷰션 원장"], "data", "Link 소유")
    d.box("notiDb", 1450, 985, 250, 115, "PostgreSQL · 알림",
          ["gromo_notification"], "data", "별도 DB·유저·Flyway")
    d.box("fcm", 1450, 1120, 250, 95, "FCM",
          ["기기 전달 · 외부 부작용"], "external")
    d.box("score", 60, 1320, 330, 100, "score-events + .DLT",
          ["Data outbox · 절대 점수+version"], "future")
    d.box("rankConsumer", 500, 1320, 330, 100, "랭킹 컨슈머",
          ["낮은 version 거부 · 중복 수렴"], "future")
    d.box("rankRedis", 1020, 1320, 630, 100, "Redis · 랭킹 projection",
          ["ZADD 완료분 + presence 라이브분 · ACL로 쓰기 소유 강제"], "future")
    d.edge("appRest", "app", "business", [(340,240),(460,240)], "REST", (400,232))
    d.edge("internalHttp", "business", "data", [(820,240),(1020,240)], "검증 주체 · 내부 HTTP", (920,231))
    d.edge("coreWrite", "data", "coreDb", [(1340,240),(1450,240)], "단일 TX", (1395,232))
    d.edge("appSocket", "app", "realtime", [(200,305),(200,435)], "STOMP", (200,356))
    d.edge("realtimeContract", "data", "adapter", [(1040,320),(1040,350),(650,350),(650,455)],
           "커밋된 봉투 · 후속 연결", (770,350), True)
    d.edge("routerInput", "adapter", "realtime", [(500,520),(340,520)], "권한·router", (420,511), True)
    d.edge("relayOwnership", "data", "relay", [(1190,320),(1190,440)], "커밋된 outbox", (1190,375))
    d.edge("focusPresence", "data", "chatRedis",
           [(1020,295),(940,295),(940,670),(280,670),(280,725)],
           "presence:focus:* · Data 쓰기", (620,670), True)
    d.edge("chatFanout", "realtime", "chatRedis", [(170,605),(170,725)], "Pub/Sub · presence 읽기", (170,635), True)
    d.edge("chatStore", "realtime", "chatDb", [(60,555),(20,555),(20,1055),(60,1055)])
    d.edge("previewCache", "business", "previewRedis",
           [(820,295),(860,295),(860,790),(820,790)], "TTL 캐시", (860,698))
    d.edge("relayKafka", "relay", "kafka", [(1180,590),(1180,725)], "userId 키 · 재전달", (1180,660), True)
    d.edge("kafkaConsume", "kafka", "notification", [(1340,790),(1450,790)], "consume", (1395,781), True)
    d.edge("notiReads", "notification", "data",
           [(1600,725),(1600,390),(1290,390),(1290,320)],
           "조회 3종만 · 리컨실/ack/적격", (1460,390))
    d.edge("notiStore", "notification", "notiDb", [(1560,895),(1560,985)], "알림 전용 DB", (1560,943))
    d.edge("push", "notification", "fcm", [(1700,850),(1735,850),(1735,1185),(1700,1185)])
    d.edge("businessLink", "business", "link", [(460,275),(405,275),(405,1080),(480,1080)],
           "발급·귀속", (420,927))
    d.edge("relayLink", "relay", "link", [(1020,545),(970,545),(970,940),(650,940),(650,1000)],
           "실패한 HTTP 전달 재시도", (825,940), True)
    d.edge("linkStore", "link", "neon", [(820,1080),(1020,1080)], "자기 데이터", (920,1071))
    d.edge("scoreConsume", "score", "rankConsumer", [(390,1370),(500,1370)], "userId", (445,1362), True)
    d.edge("rankProjection", "rankConsumer", "rankRedis", [(830,1370),(1020,1370)],
           "version 검사 + Lua", (925,1362))
    d.write()


def system():
    d = Diagram("04-system", "Gromo · 시스템 아키텍처",
                "2026.09.13 · 배포 목표와 main 구성의 경계 · 위: Target-1 / 아래: 추가된 dev 서비스 · 운영 호스트 실측 도면 아님", 1420)
    d.band(700, 125, 710, 850, "Target-1 · prod 배치 목표",
           "AWS EC2 · t4g.large(8 GB) 증설 전제 · Docker Compose")
    d.band(40, 1010, 1680, 365, "GCP dev · main에 추가된 구성",
           "Realtime·Redis·미리보기의 prod 편입은 후속. 위 Target-1 자원표에 자동 포함된 것으로 세지 않는다.")
    d.box("app", 60, 205, 240, 120, "모바일 앱",
          ["React Native · Expo", "HTTPS · WSS"], stage="사용자 진입")
    d.box("cloudflare", 390, 205, 240, 120, "Cloudflare",
          ["DNS · Proxy", "원본 클라이언트 IP"], "external")
    d.box("nginx", 740, 205, 260, 120, "Nginx · TLS :443",
          ["REST → Business", "admin → Notification"], stage="목표 라우팅")
    d.box("business", 740, 405, 260, 130, "Business API",
          ["목표 :8080 · 인증/BFF", "Data 내부 HTTP"], stage="전체 이관: 통합 단계")
    d.box("notification", 1090, 405, 260, 130, "Notification",
          ["목표 :8082 · 알림 소유", "admin만 제한 노출"], "event", "통합 PR #745")
    d.box("data", 740, 625, 260, 140, "Data API",
          ["목표 :8081 · 내부망", "정산 · outbox relay", "코어 DB 전용 자격"], stage="공개 포트 제거: 목표")
    d.box("kafka", 1090, 625, 260, 140, "Kafka :9092",
          ["KRaft · 1 node · RF 1", "내부망 · 영속 볼륨", "512 MiB heap · 7일 보존"], "event", "통합 PR · broker/relay 별도 ON")
    d.box("agent", 1090, 855, 260, 95, "Datadog Agent",
          ["서비스별 APM · 로그 · 메트릭"], "external")
    d.box("rds", 1460, 625, 260, 140, "RDS PostgreSQL",
          ["gromo / gromo_notification", "별도 DB 유저 · Flyway", "같은 인스턴스 · 교차 접근 차단"], "data", "알림 DB 사전 프로비저닝")
    d.box("fcm", 1460, 405, 260, 130, "FCM",
          ["푸시 발송·기기 전달", "FCM 자격은 알림만"], "external")
    d.box("datadog", 1460, 855, 260, 95, "Datadog",
          ["서비스별 지연·실패·lag 관측"], "external")
    d.box("link", 60, 430, 260, 140, "Link · MMP",
          ["Vercel · 초대/매치/귀속", "별도 배포 · Kafka 미접속", "내부 호출은 HTTPS + 토큰"], "external")
    d.box("neon", 410, 430, 220, 140, "Neon",
          ["Link 전용", "PostgreSQL"], "data")
    d.box("docs", 60, 765, 260, 130, "Documentation",
          ["Vercel · Next.js", "docs.oneorthree.world"], "external", "이번 배포 대상")
    d.box("git", 410, 765, 220, 130, "GitHub",
          ["documentation/main", "Vercel Git 연동"], "external")
    d.box("realtime", 90, 1100, 280, 170, "Realtime :8081",
          ["/ws/chat + /ws/realtime", "기존 편지 · 새 router", "새 도메인 전달은 비활성"], "event", "main · dev overlay")
    d.box("redis", 480, 1100, 300, 170, "Redis · 채팅/집중",
          ["chat:fanout · presence:focus:*", "Data :8080이 presence 작성", "Realtime은 읽기 · fanout"], "data", "main · 서비스 ACL은 후속")
    d.box("chatDb", 910, 1100, 290, 170, "PostgreSQL · dev",
          ["gromo_chat · 편지 정본", "DB init → Flyway → Realtime", "prod 물리 배선은 미확정"], "data", "main · 별도 database")
    d.box("preview", 1300, 1100, 390, 170, "Business :8082 · 미리보기",
          ["전용 business-redis · 128 MiB", "allkeys-lru · TTL · 영속화 없음", "채팅 Redis와 다른 인스턴스"], "core", "main · 수동 활성화 overlay")
    d.edge("appEdge", "app", "cloudflare", [(300,265),(390,265)], "HTTPS", (345,257))
    d.edge("edgeNginx", "cloudflare", "nginx", [(630,265),(740,265)], "Proxy", (685,257))
    d.edge("routeBusiness", "nginx", "business", [(870,325),(870,405)], "REST", (870,365))
    d.edge("routeAdmin", "nginx", "notification", [(1000,265),(1220,265),(1220,405)],
           "admin · 전용 토큰", (1130,256))
    d.edge("internalData", "business", "data", [(870,535),(870,625)], "내부 HTTP", (870,586))
    d.edge("notiCommand", "business", "notification", [(1000,465),(1090,465)])
    d.edge("dataKafka", "data", "kafka", [(1000,690),(1090,690)], "relay", (1045,681), True)
    d.edge("notiConsume", "kafka", "notification", [(1220,625),(1220,535)], "consume", (1220,582), True)
    d.edge("dataDb", "data", "rds", [(1000,735),(1045,735),(1045,805),(1590,805),(1590,765)],
           "gromo · Data 전용", (1240,805))
    d.edge("notiDb", "notification", "rds", [(1350,510),(1430,510),(1430,585),(1590,585),(1590,625)],
           "gromo_notification", (1580,585))
    d.edge("fcmSend", "notification", "fcm", [(1350,465),(1460,465)], "HTTPS", (1405,456))
    d.edge("dataObserve", "data", "agent", [(1000,750),(1020,750),(1020,902),(1090,902)],
           "APM", (1043,848), True)
    d.edge("businessObserve", "business", "agent", [(740,480),(715,480),(715,925),(1090,925)],
           "Business APM", (865,925), True)
    d.edge("notiObserve", "notification", "agent", [(1350,500),(1380,500),(1380,915),(1350,915)],
           async_=True)
    d.edge("ddExport", "agent", "datadog", [(1350,902),(1460,902)], "export", (1405,894), True)
    d.edge("linkEntry", "app", "link", [(180,325),(180,430)], "초대 링크", (180,385))
    d.edge("linkDb", "link", "neon", [(320,500),(410,500)], "SQL", (365,492))
    d.edge("linkCommand", "business", "link", [(740,500),(675,500),(675,620),(190,620),(190,570)],
           "발급·귀속 · HTTP", (450,620))
    d.edge("docsDeploy", "git", "docs", [(410,830),(320,830)], "배포", (365,821))
    d.edge("chatRedis", "realtime", "redis", [(370,1180),(480,1180)], "Pub/Sub", (425,1171), True)
    d.edge("chatDbWrite", "realtime", "chatDb", [(230,1270),(230,1325),(1060,1325),(1060,1270)],
           "편지 저장 · 히스토리 재조회", (650,1325))
    d.write()


if __name__ == "__main__":
    service()
    system()
