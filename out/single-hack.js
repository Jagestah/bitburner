/** @param {NS} ns */
export async function main(ns) {
	var server = ns.args[0]
    await ns.sleep(ns.args[1])
    await ns.hack(server)
}