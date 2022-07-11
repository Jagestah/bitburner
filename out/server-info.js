/** @param {NS} ns */
var scannedHosts = []
var rootHosts = []
const output = {}
const scriptCost = 0.15
export async function main(ns) {
	ns.disableLog("ALL")
	function scanHost(host) {
		scannedHosts.push(host)
		var scanList = ns.scan(host)
		if (scanList.length > 1) {
			for (let scannedHost in scanList) {
				if (!(scannedHosts.includes(scanList[scannedHost]))) {
					// ns.print(scanList[scannedHost])
					scanHost(scanList[scannedHost])
				}
			}
		}
	}
	function getRoot(host) {
		if (ns.hasRootAccess(host)) {
			if (host != "home") {
				rootHosts.push(host)
			}
		}
	}
	var maxRAM = ns.getPurchasedServerMaxRam()
	var maxCost = ns.getPurchasedServerCost(ns.getPurchasedServerMaxRam())
	var maxCount = ns.getPurchasedServerLimit()
	var maxInvestment = maxCost * maxCount
	ns.printf("max-ram: %s, max-cost: %s, max-servers: %s, max-investment: %s", maxRAM, maxCost, maxCount, maxInvestment)

	scanHost("home")
	for (let index in scannedHosts) {
		// ns.print(scannedHosts[index])
		var server = scannedHosts[index]
		// ns.print(server)
		var serverInfo = ns.getServer(server)
		var requiredGrow = serverInfo.moneyMax / serverInfo.moneyAvailable
		var cleanoutThreads = ns.hackAnalyzeThreads(server, serverInfo.moneyAvailable)
		if (serverInfo.moneyMax > 0) {
			var growTimes = ns.growthAnalyze(server, requiredGrow);
		} else {
			var growTimes = "N/A"
		}
		var hackingChance = (ns.hackAnalyzeChance(server)*100).toFixed(0)
		var growthServers = maxRAM/(growTimes/scriptCost)
		var portsReqd = ns.getServerNumPortsRequired(server)
		var player = ns.getPlayer()
		var hackingReqLevel = ns.getServerRequiredHackingLevel(server)
		if (hackingChance > 0 && serverInfo.moneyMax > 0 && player.hacking > hackingReqLevel) {
			output[server] = {
				"hackingReqLevel": hackingReqLevel,
				"portsReqd": portsReqd,
				// "servers-to-max-money": growthServers,
				// "cost-to-max-money": maxCost*growthServers,
				"serverGrowth": serverInfo.serverGrowth,
				"serverMaxMoney": serverInfo.moneyMax.toExponential(2),
				// "cleanoutThreads": cleanoutThreads,
				// "growTimes": Math.floor(growTimes),
				// "growIndex": (serverInfo.moneyMax/Math.floor(growTimes)).toFixed(0),
				// "hackingChance": hackingChance,
			}
		}
		
		getRoot(scannedHosts[index])
	}
	for (let index in rootHosts) {
		// var server = rootHosts[index]
		// // ns.print(server)
		// var serverInfo = ns.getServer(server)
		// var requiredGrow = serverInfo.moneyMax / serverInfo.moneyAvailable
		// var cleanoutThreads = ns.hackAnalyzeThreads(server, serverInfo.moneyMax)
		// if (serverInfo.moneyMax > 0) {
		// 	var growTimes = ns.growthAnalyze(server, requiredGrow);
		// } else {
		// 	var growTimes = "N/A"
		// }
		
		// output[server] = {
		// 	"serverGrowth": serverInfo.serverGrowth,
		// 	"serverMaxMoney": serverInfo.moneyMax,
		// 	"cleanoutThreads": cleanoutThreads,
		// 	"growTimes": growTimes
		// }
	}
	ns.tail()
	ns.print(JSON.stringify(output, null, 2))
	// ns.print(scannedHosts)
	// ns.print(rootHosts)

}