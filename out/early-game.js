import {main as fatten} from "./utilities/script-fatten"
import {main as batchJob} from "./utilities/script-batch"
import {main as autoNuke} from "auto-nuke.js"

/** @param {NS} ns */
export async function main(ns) {
    ns.tail()
    //  run fatten
    //  run aio against a list of servers
    //  run batchjob against fattened servers
    //  buy software and hack hosts at certain milestones
    await fatten(ns, "home", "n00dles")
    const earlyServers = [
        "n00dles",
        "foodnstuff",
        // "sigma-cosmetics",
        // "joesguns",
        // "hong-fang-tea",
        // "harakiri-sushi",
        // "iron-gym"
    ]
    await autoNuke(ns)
    var earlyServersHacked = 0
    // while (earlyServersHacked < earlyServers.length){
    for (let i in earlyServers) {
        try {
            ns.exec("aio.js", "home", 100, earlyServers[i])
            earlyServersHacked++
        } catch (err) {
            ns.printf("Couldn't hack %s: %s", earlyServers[i], err)
        }
    }
    // }
    const midServers = [
        "nectar-net",
        "max-hardware",
        "zer0",
        "neo-net",
        "silver-helix",
        "phantasy",
        "omega-net"
    ]
    // if (earlyServersHacked >= earlyServers.length){
    for (let i in midServers) {
        var fatServer = ""
        while (fatServer != "This boi fat"){
            var fatServer = await fatten(ns, "node", midServers[i])
        }
        ns.print("We got us a fat boi: ", midServers[i])

        try {

            ns.print("Updating ", midServers[i])
            ns.exec("update.js", "home", 1)
            ns.print("running batch on ", hostServer)
            ns.exec("batch-job.js", "home", 1, "node", midServers[i])
        } catch(err) {
            ns.exec("batch-job.js", "home", 1, "home", midServers[i])
            ns.print("Can't batch on %s. Maybe you need to purchase a maxed server", midServers[i])
        }
        
    }

    // }


}