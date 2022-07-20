/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
    ns.tail()
	const initSleep = Math.floor(Math.random() * 200)
	await ns.sleep(initSleep)
	var server = ns.args[0]
	while (true) {
		var percentMoney = ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server)
		var hackingChance = ns.getServerMinSecurityLevel(server) - ns.getServerSecurityLevel(server)
		ns.printf("security: %s, money: %s", (hackingChance*100).toFixed(2), (percentMoney*100).toFixed(2))
		await ns.sleep(2000)
		// if (hackingChance < 0.15) {
		// 	// ns.print("weakening ", server)
        //     await ns.sleep(2000)
		// 	// await ns.weaken(server)
		// } else if (percentMoney < 0.50) {
		// 	// ns.print("growing ", server)
        //     await ns.sleep(2000)
		// 	// await ns.grow(server);
		// } else {
        //     ns.printf("Hacking...")
		// 	var hackAmount = await ns.hack(server);
		// 	ns.printf("Hacked $%sm", hackAmount/1000000)
		// }
	}
}