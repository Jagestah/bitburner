/** @param {NS} ns */
// var serverList = ["node-23"]
import { getRootHosts } from "./utilities/scanHosts"
export async function main(ns, targetServer="joesguns") {
	ns.tail()
	var serverList = await getRootHosts(ns)
	// var serverList = ["node"]
	const execTime = ns.getGrowTime(targetServer)
	const scriptCost = 1.75
	for (let index in serverList) {
        if (!(serverList[index].includes("node"))){
			if (serverList[index] != "home"){
				ns.killall(serverList[index], true)
				var maxThreads = Math.floor(ns.getServerMaxRam(serverList[index]) / scriptCost)
				ns.printf("%s: %s", serverList[index], maxThreads)
				if (maxThreads > 0){
					if (maxThreads > 2000) {
						var i = 1
						var threadBatches = maxThreads / 1000
						while (i < threadBatches) {
							const initSleep = Math.floor(Math.random() * execTime)
							ns.exec("grow.js", serverList[index], Math.floor(maxThreads/threadBatches), targetServer, initSleep/2)
							i++
						}
					} else {
						ns.exec("grow.js", serverList[index], maxThreads, targetServer, 200)
					}
				}
			}
		}
	}
}