import { readFile, writeFile } from "node:fs/promises";

const evidencePath = new URL("../public/evidence.json", import.meta.url);
const reportPath = new URL("../public/report.md", import.meta.url);
const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
const schedule = evidence.check_schedules.find(
  (candidate) => candidate.id === "delayed-live-recheck",
);

if (!schedule || schedule.uses !== "url.live" || !schedule.blocks_acceptance) {
  throw new Error("Missing blocking delayed url.live schedule");
}

const response = await fetch(schedule.with.url, {
  cache: "no-store",
  headers: { "user-agent": "frantic-delayed-verifier-proof/1.0" },
});
const checkedAt = new Date();
const runAfter = new Date(schedule.run_after);
const observation = {
  checked_at: checkedAt.toISOString(),
  response_date: response.headers.get("date"),
  url: schedule.with.url,
  http_status: response.status,
  passed: response.ok,
};

if (!response.ok) {
  throw new Error(`url.live failed with HTTP ${response.status}`);
}

const replaceEvent = (kind, event) => {
  evidence.timeline = evidence.timeline.filter((item) => item.kind !== kind);
  evidence.timeline.push({ kind, ...event });
};

if (checkedAt < runAfter) {
  replaceEvent("immediate_pass", observation);
  replaceEvent("scheduled_waiting", {
    observed_at: checkedAt.toISOString(),
    status: "waiting",
    run_after: runAfter.toISOString(),
    blocks_acceptance: true,
    reason: "not_before window has not elapsed",
  });
  evidence.status = "waiting_for_recheck";
} else {
  replaceEvent("post_window_recheck", {
    ...observation,
    status: "passed",
    run_after: runAfter.toISOString(),
  });
  evidence.status = "recheck_passed_pending_receipt";
}

evidence.timeline.sort((left, right) => {
  const leftAt = left.at ?? left.checked_at ?? left.observed_at;
  const rightAt = right.at ?? right.checked_at ?? right.observed_at;
  return new Date(leftAt) - new Date(rightAt);
});

const lines = [
  "# Delayed verifier proof timeline",
  "",
  `Status: \`${evidence.status}\``,
  "",
  ...evidence.timeline.map((event) => {
    const at = event.at ?? event.checked_at ?? event.observed_at;
    return `- \`${at}\` - **${event.kind}**${event.status ? ` (${event.status})` : ""}`;
  }),
  "",
  `Blocking schedule: \`${schedule.uses}\` after \`${schedule.run_after}\`.`,
  `Final receipt: ${evidence.final_receipt_ref ? `\`${evidence.final_receipt_ref}\`` : "pending"}.`,
  "",
];

await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
await writeFile(reportPath, `${lines.join("\n")}\n`);

