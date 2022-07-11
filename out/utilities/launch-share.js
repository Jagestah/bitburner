/** @param {NS} ns */
export async function main(ns, targetServer="home") {
	ns.tail()
	const scriptCost = 4.00
	// const scriptHosts = await getRootHosts(ns)
	const [totalRam, ramUsed] = ns.getServerRam(targetServer);
	var maxThreads = Math.floor((totalRam-(ramUsed+64)) / scriptCost)
	ns.printf("%s: %s", targetServer, maxThreads)
	if (maxThreads > 0){
		ns.run("share.js", maxThreads)
	}
}
