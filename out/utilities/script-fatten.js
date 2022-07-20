/** @param {NS} ns */
// import { getRootHosts } from "./utilities/scanHosts"
// import { massGrow } from "./utilities/launch-grow"
// import { massWeaken } from "./utilities/launch-weaken"
// import * as killall from "./killall"
export async function main(ns, server = "home", targetServer = "n00dles") {
    ns.tail()
    // Get list of root hosts
    // massGrow with root hosts
    // massWeaken with specific hosts
    const scriptCost = 1.75
    var waitTime = 1000
    ns.print("Fattening ", targetServer, " on ", server)

    async function launchThings() {
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
            waitTime = waitTime + weakTime
            await launchThings()
        } else if (ns.getServerMoneyAvailable(targetServer) < ns.getServerMaxMoney(targetServer)) {
            scriptTarget = "single-grow.js"
            waitTime = waitTime + growTime
            await launchThings()
        } else {
            fattening = false
            return "This boi fat"
            // await ns.sleep(waitTime + 1000)
            // continue // Move to next server
        }
        
        fattening = false
    }

}