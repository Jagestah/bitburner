/** @param {NS} ns */
// import { getRootHosts } from "./utilities/scanHosts"
// import { massGrow } from "./utilities/launch-grow"
// import { massWeaken } from "./utilities/launch-weaken"
// import * as killall from "./killall"
export async function main(ns) {
    ns.tail()
    // Get list of root hosts
    // massGrow with root hosts
    // massWeaken with specific hosts
    const server = ns.args[0]
    const targetServer = ns.args[1]
    const scriptCost = 1.75
    var waitBuffer = 1000
    var waitTime = 0
    ns.print("Fattening ", targetServer, " on ", server)

    async function launchThings(scriptTarget, waitTime) {
        if (maxThreads > 0){
            ns.killall(server, true)
            ns.printf("%s: %s", server, maxThreads)
            ns.printf("Running %s threads of %s", maxThreads, scriptTarget)
            if (maxThreads > 20000) {
                var i = 1
                var threadBatches = maxThreads / 10000
                while (i < threadBatches) {
                    ns.exec(scriptTarget, server, Math.floor(maxThreads/threadBatches), targetServer, Math.random())
                    i++
                }
            } else {
                ns.exec(scriptTarget, server, maxThreads, targetServer, 0)
            }
        }
        await ns.sleep(waitTime)
    }

    // const rootHosts = await getRootHosts(ns)
    // await massGrow(ns, server, rootHosts)
    // await massWeaken(ns, server)
    var fattening = true
    while (fattening == true) {
        var maxThreads = Math.floor(ns.getServerMaxRam(server) / scriptCost)
        var weakTime= ns.getWeakenTime(targetServer)
        var growTime= ns.getGrowTime(targetServer)
        var scriptTarget = ""


        // If security is too low, weaken
        if (ns.getServerMinSecurityLevel(targetServer) < ns.getServerSecurityLevel(targetServer)) {
            scriptTarget = "single-weaken.js"
            waitTime = waitBuffer + weakTime
            ns.printf("Need to weaken by %s more", ns.getServerSecurityLevel(targetServer) - ns.getServerMinSecurityLevel(targetServer))
            await launchThings(scriptTarget, waitTime)
        } else if (ns.getServerMoneyAvailable(targetServer) < ns.getServerMaxMoney(targetServer)) {
            scriptTarget = "single-grow.js"
            waitTime = waitBuffer + growTime
            await launchThings(scriptTarget, waitTime)
        } else {
            fattening = false
            return "This boi fat"
            // await ns.sleep(waitTime + 1000)
            // continue // Move to next server
        }
    }

}