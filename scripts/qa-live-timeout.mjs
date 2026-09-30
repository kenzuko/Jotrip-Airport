import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const source=readFileSync("app.js","utf8");
const html=readFileSync("index.html","utf8");
const live=source.slice(source.indexOf("async function fetchWithTimeout("),source.indexOf("\nconst state=",source.indexOf("async function fetchWithTimeout(")));
const snapshot=source.slice(source.indexOf("async function fetchJson("),source.indexOf("\nasync function fetchSnapshotPayload(",source.indexOf("async function fetchJson(")));
assert.match(live,/controller\.abort\(\)/);
assert.match(snapshot,/signal:controller\.signal/);
assert.match(source,/fetchWithTimeout\(\x60\$\{LIVE_API_URL\}\/version/);
assert.match(source,/fetchWithTimeout\(\x60\$\{LIVE_API_URL\}\?t=/);
assert.match(source,/github-snapshot-fallback|Live API fallback/);
assert.match(html,/app\.js\?v=20260930-bounded-fallback1/);
const hung=(url,{signal})=>new Promise((resolve,reject)=>{
  signal.addEventListener("abort",()=>reject(new Error("fake transport aborted")),{once:true});
});
const globals={AbortController,setTimeout,clearTimeout,fetch:hung,LIVE_TIMEOUT_MS:30,
  SNAPSHOT_TIMEOUT_MS:30,DATA_BASE:"https://example.invalid",window:{JOTRIP_NATIVE_FETCH:hung}};
const run=(fn)=>vm.runInNewContext(fn,vm.createContext(globals));
await assert.rejects(()=>run(live+"\nfetchWithTimeout")("https://example.invalid",{},30),/fake transport aborted/);
await assert.rejects(()=>run(snapshot+"\nfetchJson")("latest.json"),/fake transport aborted/);
globals.fetch=async()=>({ok:true,json:async()=>({latest:true})});
globals.window.JOTRIP_NATIVE_FETCH=globals.fetch;
const good=await run(live+"\nfetchWithTimeout")("https://example.invalid",{},30);
assert.equal(good.ok,true);
const snap=await run(snapshot+"\nfetchJson")("latest.json");
assert.equal(snap.latest,true);
console.log("Airport Live bounded timeout and fallback source guard PASS");
