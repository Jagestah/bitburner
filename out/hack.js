/** @param {NS} ns */
export async function main(ns) {
	const initSleep = Math.floor(Math.random() * 200)
	await ns.sleep(initSleep)
	var server = ns.args[0]
	while (true) {
		await ns.hack(server)
	}
}