import { getAllHosts,getNonRootHosts,getRootHosts,nukeHosts } from "./utilities/scanHosts";
export async function main(ns) {
    var allHosts = await getRootHosts(ns)
    ns.print(allHosts)
    for (let index in allHosts) {
        // if (!(allHosts[index].includes("node"))){
			if (allHosts[index] != "home"){
                ns.print("Killing ",allHosts[index])
                await ns.killall(allHosts[index])
            }
        // }
    }
}