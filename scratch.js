/** @param {NS} ns */
var hostList = ["n00dles"]
export async function main(ns) {
	while (true) {
		for (let host in hostList) {
			ns.disableLog("ALL")
			var server = hostList[host]
			var hackingChance = ns.hackAnalyzeChance(server)
			var moneyPercent = (ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server))
			
			ns.printf("host: %s, hack-chance: %s, money-percent: %s", server, (hackingChance*100).toFixed(2), (moneyPercent*100).toFixed(2))
			if (hackingChance < 0.95) {
				ns.print("weakening ", server)
				await ns.weaken(server)
			}
			if (moneyPercent < 0.50) {
				ns.print("growing ", server)
				await ns.grow(server)
			}	
			await ns.hack(server) //hostList[0], hostList[1]
		}
	}
	// Hack the n00dles!
	// var percentMoney = ns.getServerMoneyAvailable("n00dles")/ns.getServerMaxMoney("n00dles")
	// ns.print(percentMoney.toFixed(2))
	// ns.print(ns.getServerGrowth("n00dles"))
	// await ns.grow("n00dles")
	// ns.print(ns.hackAnalyzeChance("CSEC"))
	ns.tail()
}

// 20 hacks to 1 grow
// hack = minecraft

//nectar-net, harakiri-sushi