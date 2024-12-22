import pkg1 from "debuno/package.json" with {type: "json"}
const pkg2 = await (await fetch("https://esm.sh/debuno/package.json")).json();

const upgradeAvailable = pkg1.version !== pkg2.version

if (upgradeAvailable) {
    console.log(`A new release of debuno is available: ${pkg2.version} (Current version: ${pkg1.version})`)
}
