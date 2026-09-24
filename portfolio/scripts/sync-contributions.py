#!/usr/bin/env python3
"""Refresh the committed PR contribution snapshot from GitHub assignees.

Run locally with GitHub CLI authentication. The site build reads the committed
JSON; it never calls GitHub. Authors are deliberately never used for credit.
Use --input to replay an already fetched GraphQL snapshot without network.
"""

import argparse
import json
import subprocess
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src/data/contributions.json"
PEOPLE = {
    "joejaeyoung": "jo",
    "flying-adventure": "ahn",
    "kmellon-p": "kwon",
}
LABELS = {
    "overall": "전체",
    "backend": "백엔드",
    "infra": "인프라 · CI",
    "docs": "문서 정본",
    "app": "앱 (React Native)",
    "ios": "iOS 네이티브",
    "android": "안드로이드 네이티브",
}
RECENT_SINCE = "2026-09-10"

PR_QUERY = """query($cursor:String){repository(owner:"OneOrThree",name:"phone"){
  pullRequests(states:MERGED,first:25,after:$cursor,orderBy:{field:CREATED_AT,direction:ASC}){
    totalCount pageInfo{hasNextPage endCursor}
    nodes{number mergedAt assignees(first:10){nodes{login}}
      files(first:100){totalCount pageInfo{hasNextPage} nodes{path}}}
  }
}}"""
FILES_QUERY = """query($number:Int!,$cursor:String){repository(owner:"OneOrThree",name:"phone"){
  pullRequest(number:$number){files(first:100,after:$cursor){
    pageInfo{hasNextPage endCursor} nodes{path}
  }}
}}"""


def graphql(query, **variables):
    cmd = ["gh", "api", "graphql", "-f", "query=" + query]
    for key, value in variables.items():
        if value is not None:
            cmd += ["-F" if isinstance(value, int) else "-f", f"{key}={value}"]
    response = subprocess.run(cmd, check=True, text=True, capture_output=True)
    result = json.loads(response.stdout)
    if result.get("errors"):
        raise RuntimeError(result["errors"])
    return result["data"]["repository"]


def fetch_prs():
    prs = []
    cursor = None
    while True:
        page = graphql(PR_QUERY, cursor=cursor)["pullRequests"]
        prs.extend(page["nodes"])
        if not page["pageInfo"]["hasNextPage"]:
            if len(prs) != page["totalCount"]:
                raise RuntimeError("Merged PR count changed during pagination; retry")
            break
        cursor = page["pageInfo"]["endCursor"]

    for pr in prs:
        if not pr["files"]["pageInfo"]["hasNextPage"]:
            continue
        files = []
        cursor = None
        while True:
            page = graphql(FILES_QUERY, number=pr["number"], cursor=cursor)["pullRequest"]["files"]
            files.extend(page["nodes"])
            if not page["pageInfo"]["hasNextPage"]:
                break
            cursor = page["pageInfo"]["endCursor"]
        if len(files) != pr["files"]["totalCount"]:
            raise RuntimeError(f"PR #{pr['number']} file count changed; retry")
        pr["files"]["nodes"] = files
        pr["files"]["pageInfo"]["hasNextPage"] = False
    return prs


def areas_for(path):
    parts = path.split("/")
    top = parts[0]
    areas = set()
    if top == "back" or (top == "server" and len(parts) > 1 and parts[1] not in ("docs", "scripts")):
        areas.add("backend")
    if top == "app":
        if "ios" in parts:
            areas.add("ios")
        elif "android" in parts:
            areas.add("android")
        else:
            areas.add("app")
    if top == "docs" or (top == "server" and len(parts) > 1 and parts[1] == "docs"):
        areas.add("docs")
    if top in (".github", "observability", "loadtest", "scripts") or (
        top == "server" and len(parts) > 1 and parts[1] == "scripts"
    ) or top.startswith("docker-compose"):
        areas.add("infra")
    return areas


def summarize(prs, since=None):
    counts = {key: Counter() for key in LABELS}
    unassigned = Counter()
    merged = 0
    for pr in prs:
        if since and pr["mergedAt"][:10] < since:
            continue
        merged += 1
        assignees = [item["login"] for item in pr["assignees"]["nodes"]]
        if len(assignees) > 1:
            raise RuntimeError(f"PR #{pr['number']} has multiple assignees; define attribution first")
        if assignees and assignees[0] not in PEOPLE:
            raise RuntimeError(f"PR #{pr['number']} has unknown assignee {assignees[0]}")
        person = PEOPLE[assignees[0]] if assignees else None
        areas = {"overall"}
        for file in pr["files"]["nodes"]:
            areas.update(areas_for(file["path"]))
        for area in areas:
            if person:
                counts[area][person] += 1
            else:
                unassigned[area] += 1
    result = {}
    for area, label in LABELS.items():
        total = sum(counts[area].values())
        result[area] = {
            "label": label,
            "unit": "PR",
            "total": total,
            "unassigned": unassigned[area],
            "members": {
                person: {
                    "count": counts[area][person],
                    "pct": round(counts[area][person] * 100 / total, 1) if total else 0,
                }
                for person in PEOPLE.values()
            },
        }
    return {"merged": merged, "areas": result}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, help="Replay a previously collected GraphQL JSON array")
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()
    prs = json.loads(args.input.read_text()) if args.input else fetch_prs()
    if len({pr["number"] for pr in prs}) != len(prs):
        raise RuntimeError("Duplicate PR numbers")
    if any(pr["files"]["pageInfo"]["hasNextPage"] for pr in prs):
        raise RuntimeError("Incomplete file pagination")
    cutoff = max(pr["mergedAt"] for pr in prs)
    kst = timezone(timedelta(hours=9))
    cutoff_kst = datetime.fromisoformat(cutoff.replace("Z", "+00:00")).astimezone(kst)
    snapshot = {
        "asOf": cutoff,
        "asOfKst": cutoff_kst.strftime("%Y-%m-%d %H:%M KST"),
        "basis": "OneOrThree/phone 머지 PR의 GitHub assignee 기준. 작성자·커밋 계정은 사용하지 않음. 미배정 PR은 비율에서 제외.",
        "recentSince": RECENT_SINCE,
        "overall": summarize(prs),
        "recent": summarize(prs, RECENT_SINCE),
    }
    args.output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n")
    print(f"{snapshot['overall']['merged']} merged PRs, cutoff {cutoff}")


if __name__ == "__main__":
    main()
