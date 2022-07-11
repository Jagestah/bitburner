import { getAllHosts,getNonRootHosts,getRootHosts,nukeHosts } from "./utilities/scanHosts";
import { calculateRatio, launchThreads } from "./utilities/hackHost";
import * as fatten from "./fatten.js"
import * as killall from "./killall"

/** @param {NS} ns */
const syncList = ["hack.js","grow.js","weaken.js"]
const scriptCost = 1.75
var outputThreads= [0,0,0]
export async function main(ns) {
	ns.disableLog("ALL")
    ns.tail()
    // calculateThreads(ns, "n00dles")
    if (ns.args[0]) {
        const targetServer = ns.args[0]
    }
    const threadRatio = await calculateRatio(ns, targetServer)

    function calculateThreads(host) {
        var server = ns.getServer(host)
        var totalThreads = Math.floor(server.maxRam/scriptCost)
        var hackThreads = Math.floor(totalThreads*threadRatio[0])
        var growThreads = Math.floor(totalThreads*threadRatio[1])
        var weakThreads = Math.floor(totalThreads*threadRatio[2])
        // ns.print(hackThreads, growThreads, weakThreads)
        return [
            hackThreads,
            growThreads,
            weakThreads
        ]
    }

    async function copyHackFile(host, syncList) {
		for (let file in syncList) {
			ns.rm(syncList[file], host)
		}
		await ns.scp(syncList, "home", host)
		// await ns.scp("hack.js", "home", host)
	}

    const rootHosts = await getRootHosts(ns)
    for (let index in rootHosts) {
        if (rootHosts[index] != "home") {
            var server = rootHosts[index]
            var threadCounts = calculateThreads(server)
            ns.killall(server, true)
            await copyHackFile(server, syncList)
            await launchThreads(ns, server, "grow.js", threadCounts[1], targetServer)
            await launchThreads(ns, server, "hack.js", threadCounts[0], targetServer)
            await launchThreads(ns, server, "weaken.js", threadCounts[2], targetServer)
            outputThreads[0] = outputThreads[0]+threadCounts[0]
            outputThreads[1] = outputThreads[1]+threadCounts[1]
            outputThreads[2] = outputThreads[2]+threadCounts[2]
        }
    }
    ns.printf("hack: %s, grow: %s, weak: %s", outputThreads[0],outputThreads[1],outputThreads[2])
    while (true) {
		var percentMoney = ns.getServerMoneyAvailable(targetServer) / ns.getServerMaxMoney(targetServer)
		var hackingChance = ns.hackAnalyzeChance(targetServer)
		ns.printf("host: %s, hack: %s, money: %s", targetServer, (hackingChance*100).toFixed(2), (percentMoney*100).toFixed(2))
		if (hackingChance < 0.5 || percentMoney < 0.5){
            ns.atExit(await killall.main(ns))
        }else if (hackingChance < 0.95) {
			ns.print("weakening ", targetServer)
			await ns.weaken(targetServer)
		} else if (percentMoney < 0.75) {
			ns.print("growing ", targetServer)
			await ns.grow(targetServer);
		} else {
			var hackAmount = await ns.hack(targetServer);
			ns.printf("Hacked $%sm", hackAmount/1000000)
		}
	}
}