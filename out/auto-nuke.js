import { getAllHosts,getNonRootHosts,getRootHosts,nukeHosts } from "./utilities/scanHosts";
/** @param {NS} ns */


export async function main(ns) {
    ns.disableLog("ALL")
    var nukeable = await nukeHosts(ns)
    ns.print(nukeable)
}