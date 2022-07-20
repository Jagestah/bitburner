import { getRootHosts } from "./utilities/scanHosts"

/** @param {NS} ns */
export async function main(ns, targetServer="neo-net") {
	ns.tail()
	const scriptCost = 1.75
	const serverList = ["node"]
	const execTime = ns.getWeakenTime(targetServer)
	// const serverList = await getRootHosts(ns)
	for (let index in serverList) {
        // if (!(serverList[index].includes("node"))){
			if (serverList[index] != "home"){
				ns.killall(serverList[index], true)
				var maxThreads = Math.floor(ns.getServerMaxRam(serverList[index]) / scriptCost)
				ns.printf("%s: %s", serverList[index], maxThreads)
				if (maxThreads > 0){
					if (maxThreads > 2000) {
						var i = 1
						var threadBatches = maxThreads / 1000
						while (i < threadBatches) {
							const initSleep = Math.floor(Math.random() * execTime/2)
							ns.exec("weaken.js", serverList[index], Math.floor(maxThreads/threadBatches), targetServer, initSleep/2)
							i++
						}
					} else {
						ns.exec("weaken.js", serverList[index], maxThreads, targetServer, 0)
					}
				}
			}
		// }
	}
}
