/** @param {NS} ns */
import { getRootHosts } from "./utilities/scanHosts"
export async function main(ns, targetServer="home") {
	ns.tail()
	const scriptCost = 4.00
	// ns.printf("%s: %s", targetServer, maxThreads)
	var serverList = await getRootHosts(ns)
	for (let index in serverList) {
		var maxRam = ns.getServerMaxRam(serverList[index])
		var usedRam = ns.getServerUsedRam(serverList[index])
		// var [maxRam, ramUsed] = ns.getServerRam(serverList[index]);
        // if (!(serverList[index].includes("node"))){
			if (serverList[index] != "home"){
				var maxThreads = Math.floor((maxRam - usedRam) / scriptCost)
				ns.printf("%s: %s", serverList[index], maxThreads)
				if (maxThreads > 0){
					ns.exec("share.js", serverList[index], Math.floor(maxThreads))
				}
			// }
		}
	}
}
