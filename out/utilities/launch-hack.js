
import { getRootHosts } from "./utilities/scanHosts"
/** @param {NS} ns */
export async function main(ns, targetServer="n00dles") {
	ns.tail()
	const scriptCost = 1.75
	const scriptHosts = ["home"]
	const execTime = ns.getWeakenTime(targetServer)
	// const scriptHosts = await getRootHosts(ns)
	for (let index in scriptHosts) {
        if (!scriptHosts[index].includes("node")){
            ns.killall(scriptHosts[index], true)
            var maxThreads = Math.floor(ns.getServerMaxRam(scriptHosts[index]) / scriptCost)
            ns.printf("%s: %s", scriptHosts[index], maxThreads)
            if (maxThreads > 0){
                if (maxThreads > 1000) {
                    var i = 1
                    var threadBatches = maxThreads / 200
                    while (i < threadBatches) {
                        const initSleep = Math.floor(Math.random() * execTime)
                        ns.exec("oversight.js", scriptHosts[index], Math.floor(maxThreads/threadBatches), targetServer, initSleep/2)
                        i++
                    }
                } else {
                    ns.exec("oversight.js", scriptHosts[index], maxThreads, targetServer, execTime)
                }
            }
		}
	}
}
