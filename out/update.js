import { getRootHosts } from "./utilities/scanHosts";

/** @param {NS} ns */
export async function main(ns) {
    ns.tail()
    const syncList = [
        "hack.js",
        "grow.js",
        "weaken.js",
        "oversight.js",
        "aio.js",
        "single-hack.js",
        "single-grow.js",
        "single-weaken.js",]
    const hostList = await getRootHosts(ns)
    for (let index in hostList) {
        if (hostList[index] != "home") {
            await ns.killall(hostList[index])
            for (let fileIndex in syncList) {
                try {
                    await ns.rm(syncList[fileIndex], hostList[index])
                } catch (error) {
                    ns.print(error);
                }
            }
            await ns.scp(syncList, "home", hostList[index])
        }
    }
}
