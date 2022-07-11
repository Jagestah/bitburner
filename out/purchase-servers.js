/** @param {NS} ns */
export async function main(ns) {
	// ns.tail()
	// var maxRAM = ns.getPurchasedServerMaxRam()
	// var maxCost = ns.getPurchasedServerCost(ns.getPurchasedServerMaxRam())
	// var maxCount = ns.getPurchasedServerLimit()
	// var maxInvestment = maxCost * maxCount
	// ns.printf("max-ram: %s, max-cost: %s, max-servers: %s, max-investment: %s", maxRAM, maxCost, maxCount, maxInvestment)
	// var ram = Math.pow(2, 9)
	// ns.printf("%s: $%smil", ram, ns.getPurchasedServerCost(ram)/1000000)
	// ns.tail()
	const prefix = "node";
	const playerMoney = ns.getServerMoneyAvailable("home")
	const serverCount = 1
	for (let i = 20; i >= 8; i--) {
		var ramAmount = Math.pow(2, i)

		var purchaseCost = ns.getPurchasedServerCost(ramAmount) * serverCount
		if (purchaseCost < playerMoney){
			var readableCost = purchaseCost/1000000
			var promptText = `Buy ${serverCount} servers for ${readableCost}m with ${ramAmount} RAM each?`
			var input = await ns.prompt(promptText)
			if (input) {
				for (let j = 1; j <= serverCount; j++) {
					await ns.purchaseServer(prefix, ramAmount)
				}
			}
		break
		};
	}

	// 2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2 // 1048576
	// 2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2 // 524288
	// 2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2 // 262144
	// 2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2 // 131072
	// 2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2 // 65536
	// 2*2*2*2*2*2*2*2*2*2*2*2*2*2*2 // 32768
	// 2*2*2*2*2*2*2*2*2*2*2*2*2*2 // 16384
	// 2*2*2*2*2*2*2*2*2*2*2*2*2 // 8192
	// 2*2*2*2*2*2*2*2*2*2*2*2 // 4096
	// 2*2*2*2*2*2*2*2*2*2*2 // 2048
	// 2*2*2*2*2*2*2*2*2*2 // 1024
	// 2*2*2*2*2*2*2*2*2 // 512
	// 2*2*2*2*2*2*2*2 // 256
	// 2*2*2*2*2*2*2 // 128
	// 2*2*2*2*2*2 // 64
	// 2*2*2*2*2 // 32
	// 2*2*2*2 // 16
	// 2*2*2 // 8
	// 2*2 //4

	// const serverList = ns.getPurchasedServers()
	// for (let i in serverList) {
	// 	if (ns.getServerMaxRam(serverList[i]) < ramAmount/2){
	// 		ns.print("Deleting ", serverList[i])
	// 		await ns.killall(serverList[i])
	// 		ns.deleteServer(serverList[i])
	// 	}
	// }
	
	// var i = 0
	// for (i = 0; i < 25; ++i) {
	// 	ns.purchaseServer(prefix, ram);
	// }

}