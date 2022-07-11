/** @param {NS} ns */
export async function main(ns) {
	var server = ns.args[0]
	var sleepTime= ns.args[1]
	await ns.sleep(sleepTime)
	// ns.print(ns.args.length);
	while(true) {
		await ns.weaken(server)
	}
}