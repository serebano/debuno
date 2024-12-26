#!/usr/bin/env bun
// debuno 0.1.9

// cli.ts
import process from "node:process";
var $ = Bun.$;
var pkg = (await import("./package-T3FSXZ67.js")).default;
var [subcmd, ...args] = process.argv.slice(2);
console.log("");
console.log(`  ${pkg.name} ${pkg.version}`);
console.log("");
console.log(`  pkg: ${import.meta.dirname}`);
console.log(`  cwd: ${process.cwd()}`);
console.log(`  bin: ${await $`which debuno`.text()}`);
console.log("  ------------------------------------------");
console.log("");
if (subcmd === "check") {
  await $`sh ${import.meta.dirname}/scripts/check.sh`;
  process.exit();
}
if (subcmd === "reinstall") {
  await $`sh ${import.meta.dirname}/scripts/reinstall.sh`.cwd(`${import.meta.dirname}/scripts`);
  process.exit();
}
if (subcmd === "init") {
  const dest = args[0] || "debuno-dev";
  await $`bun create debuno-dev ${dest}`.env({
    BUN_CREATE_DIR: `${import.meta.dirname}/.bun-create`
  });
  await $`sh ${import.meta.dirname}/scripts/link.sh`.cwd(dest);
  process.exit();
}
if (subcmd === "link") {
  await $`sh ${import.meta.dirname}/scripts/link.sh`;
  process.exit();
}
if (subcmd === "unlink") {
  await $`sh ${import.meta.dirname}/scripts/unlink.sh`;
  process.exit();
}
if (subcmd === "dev") {
  await $`bun run dev`.nothrow();
  process.exit();
}
if (subcmd === "start") {
  await $`bun run start`.nothrow();
  process.exit();
}
if (subcmd === "--version" || args[0] === "-v") {
  console.log(pkg.version);
  process.exit();
}
if (!args.length) {
  console.log(`	Usage: debuno [runtime] [...options]`);
  console.log(`	Example: debuno node --watch index.ts`);
  process.exit();
}
await $`sh ${import.meta.dirname}/scripts/run.sh ${subcmd} ${args.join(" ")}`.cwd(`${import.meta.dirname}/scripts`);
process.exit();
var deno = (await $`deno -V`.text()).slice(5).trim();
var bun = Bun.version;
var node = (await $`node --version`.text()).slice(1).trim();
var versions = {
  deno,
  bun,
  node
};
var validRuntimes = ["deno", "bun", "node"];
var runtime = validRuntimes.includes(subcmd) ? subcmd : null;
var rest = args;
if (!args.length) {
  console.log(`	Usage: debuno [runtime] [...options]`);
  console.log(`	Example: debuno node --watch index.ts`);
  process.exit();
}
var runtimeVersion = versions[runtime];
console.log(`${runtime} ${runtimeVersion}`);
console.log(rest);
try {
  switch (runtime) {
    case "deno":
      await $`deno -A ${rest.join(" ")}`;
      break;
    case "bun":
      break;
    case "node":
      await $`node --import ${import.meta.resolve("./node/index.js")} ${rest.join(" ")}`;
      break;
    default:
      throw new Error(`Invalid runtime!!: ${runtime}`);
  }
} catch (e) {
  console.log(e);
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY2xpLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIjIS91c3IvYmluL2VudiBidW5cbi8vIGRlbm8tbGludC1pZ25vcmUtZmlsZSBuby1leHBsaWNpdC1hbnlcblxuaW1wb3J0IHByb2Nlc3MgZnJvbSBcIm5vZGU6cHJvY2Vzc1wiO1xuY29uc3QgJCA9IEJ1bi4kXG5cbmNvbnN0IHBrZyA9IChhd2FpdCBpbXBvcnQoXCIuL3BhY2thZ2UuanNvblwiKSkuZGVmYXVsdDtcbmNvbnN0IFtzdWJjbWQsIC4uLmFyZ3NdID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuXG5jb25zb2xlLmxvZyhcIlwiKVxuY29uc29sZS5sb2coYCAgJHtwa2cubmFtZX0gJHtwa2cudmVyc2lvbn1gKVxuY29uc29sZS5sb2coXCJcIilcbmNvbnNvbGUubG9nKGAgIHBrZzogJHtpbXBvcnQubWV0YS5kaXJuYW1lfWApXG5jb25zb2xlLmxvZyhgICBjd2Q6ICR7cHJvY2Vzcy5jd2QoKX1gKVxuY29uc29sZS5sb2coYCAgYmluOiAke2F3YWl0ICRgd2hpY2ggZGVidW5vYC50ZXh0KCl9YClcblxuLy8gY29uc29sZS5sb2coYCAgJHtwa2cuaG9tZXBhZ2V9YClcbi8vIGNvbnNvbGUubG9nKGAgICR7cGtnLmRlc2NyaXB0aW9ufWApXG5jb25zb2xlLmxvZyhcIiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXG5jb25zb2xlLmxvZyhcIlwiKVxuXG5cbmlmIChzdWJjbWQgPT09ICdjaGVjaycpIHtcblx0YXdhaXQgJGBzaCAke2ltcG9ydC5tZXRhLmRpcm5hbWV9L3NjcmlwdHMvY2hlY2suc2hgXG5cdHByb2Nlc3MuZXhpdCgpXG59XG5cbmlmIChzdWJjbWQgPT09ICdyZWluc3RhbGwnKSB7XG5cdGF3YWl0ICRgc2ggJHtpbXBvcnQubWV0YS5kaXJuYW1lfS9zY3JpcHRzL3JlaW5zdGFsbC5zaGAuY3dkKGAke2ltcG9ydC5tZXRhLmRpcm5hbWV9L3NjcmlwdHNgKVxuXHRwcm9jZXNzLmV4aXQoKVxufVxuXG5pZiAoc3ViY21kID09PSAnaW5pdCcpIHtcblx0Y29uc3QgZGVzdCAgPSBhcmdzWzBdIHx8IFwiZGVidW5vLWRldlwiXG5cdGF3YWl0ICRgYnVuIGNyZWF0ZSBkZWJ1bm8tZGV2ICR7ZGVzdH1gLmVudih7XG5cdFx0QlVOX0NSRUFURV9ESVI6IGAke2ltcG9ydC5tZXRhLmRpcm5hbWV9Ly5idW4tY3JlYXRlYFxuXHR9KVxuXHRhd2FpdCAkYHNoICR7aW1wb3J0Lm1ldGEuZGlybmFtZX0vc2NyaXB0cy9saW5rLnNoYC5jd2QoZGVzdClcblx0cHJvY2Vzcy5leGl0KClcbn1cblxuaWYgKHN1YmNtZCA9PT0gJ2xpbmsnKSB7XG5cdGF3YWl0ICRgc2ggJHtpbXBvcnQubWV0YS5kaXJuYW1lfS9zY3JpcHRzL2xpbmsuc2hgXG5cdHByb2Nlc3MuZXhpdCgpXG59XG5cbmlmIChzdWJjbWQgPT09ICd1bmxpbmsnKSB7XG5cdGF3YWl0ICRgc2ggJHtpbXBvcnQubWV0YS5kaXJuYW1lfS9zY3JpcHRzL3VubGluay5zaGBcblx0cHJvY2Vzcy5leGl0KClcbn1cblxuaWYgKHN1YmNtZCA9PT0gJ2RldicpIHtcblx0YXdhaXQgJGBidW4gcnVuIGRldmAubm90aHJvdygpXG5cdHByb2Nlc3MuZXhpdCgpXG59XG5cbmlmIChzdWJjbWQgPT09ICdzdGFydCcpIHtcblx0YXdhaXQgJGBidW4gcnVuIHN0YXJ0YC5ub3Rocm93KClcblx0cHJvY2Vzcy5leGl0KClcbn1cblxuaWYgKHN1YmNtZCA9PT0gJy0tdmVyc2lvbicgfHwgYXJnc1swXSA9PT0gJy12Jykge1xuXHRjb25zb2xlLmxvZyhwa2cudmVyc2lvbilcblx0cHJvY2Vzcy5leGl0KClcbn1cblxuaWYgKCFhcmdzLmxlbmd0aCkge1xuXHRjb25zb2xlLmxvZyhgXHRVc2FnZTogZGVidW5vIFtydW50aW1lXSBbLi4ub3B0aW9uc11gKVxuXHRjb25zb2xlLmxvZyhgXHRFeGFtcGxlOiBkZWJ1bm8gbm9kZSAtLXdhdGNoIGluZGV4LnRzYClcblx0cHJvY2Vzcy5leGl0KClcbn1cblxuYXdhaXQgJGBzaCAke2ltcG9ydC5tZXRhLmRpcm5hbWV9L3NjcmlwdHMvcnVuLnNoICR7c3ViY21kfSAke2FyZ3Muam9pbihcIiBcIil9YC5jd2QoYCR7aW1wb3J0Lm1ldGEuZGlybmFtZX0vc2NyaXB0c2ApXG5wcm9jZXNzLmV4aXQoKVxuXG5cblxuY29uc3QgZGVubyA9IChhd2FpdCAkYGRlbm8gLVZgLnRleHQoKSkuc2xpY2UoNSkudHJpbSgpO1xuY29uc3QgYnVuID0gQnVuLnZlcnNpb247XG5jb25zdCBub2RlID0gKGF3YWl0ICRgbm9kZSAtLXZlcnNpb25gLnRleHQoKSkuc2xpY2UoMSkudHJpbSgpO1xuXG5jb25zdCB2ZXJzaW9uczogYW55ID0ge1xuXHRkZW5vLFxuXHRidW4sXG5cdG5vZGVcbn1cblxuY29uc3QgdmFsaWRSdW50aW1lcyA9IFsnZGVubycsICdidW4nLCAnbm9kZSddXG5jb25zdCBydW50aW1lID0gdmFsaWRSdW50aW1lcy5pbmNsdWRlcyhzdWJjbWQpID8gc3ViY21kIDogbnVsbFxuY29uc3QgcmVzdCA9IGFyZ3NcblxuaWYgKCFhcmdzLmxlbmd0aCkge1xuXHRjb25zb2xlLmxvZyhgXHRVc2FnZTogZGVidW5vIFtydW50aW1lXSBbLi4ub3B0aW9uc11gKVxuXHRjb25zb2xlLmxvZyhgXHRFeGFtcGxlOiBkZWJ1bm8gbm9kZSAtLXdhdGNoIGluZGV4LnRzYClcblx0cHJvY2Vzcy5leGl0KClcbn1cblxuLy8gaWYgKHZhbGlkUnVudGltZXMuaW5jbHVkZXMocnVudGltZSkgPT09IGZhbHNlKSB7XG4vLyBcdGNvbnNvbGUubG9nKGBcdFVzYWdlOiBkZWJ1bm8gW3J1bnRpbWVdIFsuLi5vcHRpb25zXWApXG4vLyBcdGNvbnNvbGUubG9nKGBcdEV4YW1wbGU6IGRlYnVubyBub2RlIC0td2F0Y2ggaW5kZXgudHNgKVxuLy8gXHRwcm9jZXNzLmV4aXQoKVxuLy8gfVxuXG5jb25zdCBydW50aW1lVmVyc2lvbiA9IHZlcnNpb25zW3J1bnRpbWUgYXMgYW55XVxuY29uc29sZS5sb2coYCR7cnVudGltZX0gJHtydW50aW1lVmVyc2lvbn1gKVxuY29uc29sZS5sb2cocmVzdClcblxudHJ5IHtcblx0c3dpdGNoKHJ1bnRpbWUpIHtcblx0XHRjYXNlICdkZW5vJzpcblx0XHRcdGF3YWl0ICRgZGVubyAtQSAke3Jlc3Quam9pbihcIiBcIil9YFxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdidW4nOlxuXHRcdFx0Ly8gYXdhaXQgJGBidW4gLS1wcmVsb2FkICR7aW1wb3J0Lm1ldGEucmVzb2x2ZShcIi4vYnVuL2luZGV4LnRzXCIpfSAke3Jlc3Quam9pbihcIiBcIil9YFxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdub2RlJzpcblx0XHRcdGF3YWl0ICRgbm9kZSAtLWltcG9ydCAke2ltcG9ydC5tZXRhLnJlc29sdmUoXCIuL25vZGUvaW5kZXguanNcIil9ICR7cmVzdC5qb2luKFwiIFwiKX1gXG5cdFx0XHRicmVha1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcnVudGltZSEhOiAke3J1bnRpbWV9YClcblx0fVxuXG59IGNhdGNoIChlOiBhbnkpIHtcblx0Y29uc29sZS5sb2coZSlcblx0Ly8gY29uc29sZS5sb2coZS5pbmZvLnN0ZGVyci50b1N0cmluZygpKVxufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7QUFHQSxPQUFPLGFBQWE7QUFDcEIsSUFBTSxJQUFJLElBQUk7QUFFZCxJQUFNLE9BQU8sTUFBTSxPQUFPLHVCQUFnQixHQUFHO0FBQzdDLElBQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLFFBQVEsS0FBSyxNQUFNLENBQUM7QUFFOUMsUUFBUSxJQUFJLEVBQUU7QUFDZCxRQUFRLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLE9BQU8sRUFBRTtBQUMxQyxRQUFRLElBQUksRUFBRTtBQUNkLFFBQVEsSUFBSSxVQUFVLFlBQVksT0FBTyxFQUFFO0FB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
