/** @param {NS} ns */
import { getRootHosts } from "./utilities/scanHosts"
import { massGrow } from "./utilities/launch-grow"
import { massWeaken } from "./utilities/launch-weaken"
import * as killall from "./killall"
export async function main(ns) {
    ns.tail()
    // Get list of root hosts
    // massGrow with root hosts
    // massWeaken with specific hosts
    const server = ns.args[0]
    const rootHosts = await getRootHosts(ns)
    await massGrow(ns, server, rootHosts)
    await massWeaken(ns, server)
    while (true) {
        var hackingChance = ns.hackAnalyzeChance(server)
        var moneyPercent = ns.getServerMoneyAvailable(server)/ns.getServerMaxMoney(server)
        ns.printf("hack: %s, money: %s", hackingChance, moneyPercent)
        if (hackingChance < 1 || moneyPercent < 1) {
            await ns.sleep(20000)
        } else {
            await killall.main(ns)
            ns.exit()
        }
        continue
    }

}