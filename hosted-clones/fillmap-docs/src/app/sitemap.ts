import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "../lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
  {
    url: SITE_ORIGIN + "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: SITE_ORIGIN + "/adr",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/prd",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/spec",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/dataflow",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/roles",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/status",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/diagrams/0",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/prd/msg-178-prd",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/spec/%EA%B0%9C%EC%9D%B8-%EB%8F%84%EA%B0%90-%ED%99%94%EB%A9%B4-%ED%99%95%EC%A0%95-ux-api-%EC%84%A4%EA%B3%84",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/%EA%B8%B0%ED%9A%8D%ED%99%95%EC%A0%95-%EC%A7%80%EB%8F%84-%ED%99%88-%EA%B0%9C%ED%8E%B8-%EC%83%81%EB%8B%A8-%EC%85%80",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/%EB%AF%B8%EC%85%98-%ED%9B%84%EC%86%8D-%EA%B2%B0%EC%A0%95-%EC%BD%94%EC%8A%A4-%ED%8F%AC%ED%86%A0%EC%8A%A4%ED%8C%9F-%EB%B0%A9%EC%8B%9D",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-%EA%B2%A9%EC%9E%90-%ED%91%9C%EC%8B%9C%EB%AA%85-zone",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-%EA%B2%A9%EC%9E%90-%ED%96%89%EC%A0%95%EB%8F%99-%EB%9D%BC%EB%B2%A8-gridsregioncode",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-%EC%98%81%EC%86%8D-%EA%B3%84%EC%B8%B5-jpa-%EC%9C%A0%EC%A7%80-mybatis-%EC%A0%84%ED%99%98-%EB%B0%98%EB%A0%A4",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-%EC%9E%A5%EC%86%8C-%EA%B2%80%EC%83%89-%EC%B9%B4%EC%B9%B4%EC%98%A4-%EB%A1%9C%EC%BB%AC-%ED%94%84%EB%A1%9D%EC%8B%9C",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-%EC%A7%80%EB%8F%84-sdk-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%A0%84%ED%99%98",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-ai-%EC%B2%98%EB%A6%AC-%EC%8B%A4%ED%96%89-%ED%99%98%EA%B2%BD-fastapi",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-msg-167-%ED%9B%84%EC%86%8D-%EA%B2%B0%EC%A0%95-%ED%83%90%ED%97%98%EB%A5%A0-%EC%B6%95-%EA%B2%A9%EC%9E%90-%ED%91%9C%EC%8B%9C%EB%AA%85-%EA%B2%A9%EC%9E%90-%EA%B3%84%EC%95%BD",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-regionstats-recompute-equi-join-%EC%B9%98%ED%99%98",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/adr-viewport-polling-slo",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/fillmap-%ED%99%95%EC%A0%95-%EA%B8%B0%ED%9A%8D-%EB%AA%A8%EC%9D%8C",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/adr/msg-234-%EC%83%81%EA%B6%8C-%EC%9E%91%EB%8F%84-%EA%B2%B0%EC%A0%95-%EA%B3%B5%EA%B3%B5%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B2%80%EC%88%98",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/embeds/grid-occupation-trouble.html",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/embeds/hotzone-load-test.html",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/embeds/notification-system.html",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/embeds/playback-flow.html",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/embeds/redis-hotzone.html",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/embeds/upload-flow.html",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/%EA%B0%AD-%EB%B6%84%EC%84%9D-%EB%94%94%EC%9E%90%EC%9D%B8-%EB%AC%B8%EC%84%9C-%EC%BD%94%EB%93%9C-%EC%8B%B1%ED%81%AC",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/%EB%B0%B1%EC%97%94%EB%93%9C-%ED%95%99%EC%8A%B5-%EB%A1%9C%EB%93%9C%EB%A7%B5-redis-ha-%EC%95%8C%EB%A6%BC-%EA%B4%80%EC%B8%A1%EC%84%B1",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/%EB%B6%84%EC%82%B0%EB%9D%BD-%EC%A0%81%EC%9A%A9-%EC%A3%BC%EC%9D%98%EC%A0%90",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/%EC%A0%84%EA%B5%AD%EB%AC%B8%ED%99%94%EC%B6%95%EC%A0%9C%ED%91%9C%EC%A4%80%EB%8D%B0%EC%9D%B4%ED%84%B0-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%85%8B",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/%ED%8A%B8%EB%9F%AC%EB%B8%94%EC%8A%88%ED%8C%85-%ED%8C%8C%EC%9D%BC-%EC%97%86%EC%9D%B4-%EA%B2%A9%EC%9E%90-%EC%A0%90%EB%A0%B9-msg-132",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/2026-07-21-ai-highlight-blur-%EA%B0%9C%EB%B0%9C-%EA%B8%B0%EB%A1%9D",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/ai-%EB%B8%94%EB%9F%AC-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EC%8B%A4%EC%B8%A1-%ED%98%84%ED%99%A9",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/erd-%EC%A0%95%EB%A0%AC-%EB%94%94%EC%9E%90%EC%9D%B8-%EA%B8%B0%EC%A4%80-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%AA%A8%EB%8D%B8",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/zone-%EC%83%81%EA%B6%8C-%EA%B3%B5%EA%B3%B5%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B7%BC%EA%B1%B0",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/research/zone-%ED%91%9C%EC%8B%9C%EB%AA%85-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%ED%95%B4%EC%84%A4",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/status/project",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "/status/status",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  ];
}
