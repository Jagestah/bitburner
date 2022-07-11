/** @param {NS} ns */
export async function main(ns) {
	const initSleep = Math.floor(Math.random() * 200)
	await ns.sleep(initSleep)
	ns.disableLog("ALL")
	var server = ns.args[0]
	while (true) {
		var percentMoney = ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server)
		var hackingChance = ns.hackAnalyzeChance(server)
		ns.printf("host: %s, hackingChance: %s, percentMoney: %s", server, (hackingChance*100).toFixed(2), (percentMoney*100).toFixed(2))
		if (hackingChance < 0.95) {
			ns.print("weakening ", server)
			await ns.weaken(server)
		} else if (percentMoney < 0.75) {
			ns.print("growing ", server)
			await ns.grow(server);
		} else {
			var hackAmount = await ns.hack(server);
			ns.printf("Hacked $%sm", hackAmount/1000000)
		}
	}
}