import { nukeHosts } from "./utilities/scanHosts";
/** @param {NS} ns */


export async function main(ns) {
    ns.disableLog("ALL")
    var nukeable = await nukeHosts(ns)
    // ftpcrack 100
    // relaysmtp 250
    // httpworm 500
    // sqlinject 750 
    ns.print(nukeable)
}