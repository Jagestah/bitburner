//hack
//weaken
//grow
//weaken
//establish target
/** @param {NS} ns */
export async function main(ns) {
    ns.tail()
    ns.print("---")
    var server = ns.args[0]
    var targetServer = ns.args[1]
    const scriptCost = 1.75
    // ns.print(targetServer)

    //establish timing
    const scriptOffset = 20
    const batchBuffer = 500
    var hackTime= 0
    var weakTime= 0
    var growTime= 0
    var totalTime = 0
    var potentialBatches = 0
    var batchOffset = 0
    var hackOffset = 0
    var growOffset = 0
    var weakOffset = 0

    function establishTiming(){
        hackTime= ns.getHackTime(targetServer)
        weakTime= ns.getWeakenTime(targetServer)
        growTime= ns.getGrowTime(targetServer)
        totalTime = weakTime + scriptOffset * 3
        potentialBatches = Math.floor(totalTime / ((scriptOffset * 4) + batchBuffer))
        batchOffset = totalTime / potentialBatches
        ns.print("potentialBatches: ", potentialBatches)
        ns.print("batchOffset: ", batchOffset)
        if (hackTime < growTime && growTime < weakTime) {
            hackOffset = (weakTime - hackTime) - scriptOffset
            growOffset = (weakTime - growTime) + scriptOffset
            weakOffset = scriptOffset * 2
        } else {
            ns.print("Timing doesn't work")
        }
            hackOffset = (weakTime - hackTime) - scriptOffset
            return [potentialBatches, batchOffset, growOffset, weakOffset]
    }
    


    var serverMoney = 0
    var desiredHackAmount = 0
    var desiredHackThreads = 0
    var hackSecurityIncrease = 0
    var weakenChange = 0
    var weakenHackThreads = 0
    var desiredGrowMultiplier = 0
    var desiredGrowThreads = 0
    var growSecurityIncrease = 0
    var weakenGrowThreads = 0

    function establishThreads() {
        serverMoney = ns.getServerMoneyAvailable(targetServer)
        desiredHackAmount = (serverMoney * 0.9).toExponential()
        desiredHackThreads = Math.ceil(ns.hackAnalyzeThreads(targetServer, desiredHackAmount))
        hackSecurityIncrease = (ns.hackAnalyzeSecurity(desiredHackThreads, targetServer) * ns.getServerSecurityLevel(targetServer))
        weakenChange = ns.weakenAnalyze(1, 1)
        weakenHackThreads = Math.ceil(hackSecurityIncrease / weakenChange)
        desiredGrowMultiplier = (serverMoney / (serverMoney - desiredHackAmount)) * 1.15
        desiredGrowThreads = Math.ceil(ns.growthAnalyze(targetServer, desiredGrowMultiplier))
        growSecurityIncrease = ((ns.growthAnalyzeSecurity(1, targetServer, 1)*desiredGrowThreads) * ns.getServerSecurityLevel(targetServer))
        weakenGrowThreads = Math.ceil(growSecurityIncrease / weakenChange)
        return [desiredHackThreads, weakenHackThreads, desiredGrowThreads, weakenGrowThreads]
    }

    [desiredHackThreads, weakenHackThreads, desiredGrowThreads, weakenGrowThreads] = establishThreads()
    [potentialBatches, batchOffset, growOffset, weakOffset] = establishTiming()
    ns.exec("single-hack.js", server, 1, targetServer, 0)
    await ns.sleep(hackTime+100)
    
    var batchCost = 0

    while (true) {
        [desiredHackThreads, weakenHackThreads, desiredGrowThreads, weakenGrowThreads] = establishThreads()
        [potentialBatches, batchOffset, growOffset, weakOffset] = establishTiming()
        for (let i = 1; i < potentialBatches; i++) {
            batchCost = (desiredHackThreads + weakenHackThreads + desiredGrowThreads + weakenGrowThreads) * scriptCost;
            if ((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) > batchCost){
                if (serverMoney/ns.getServerMaxMoney(targetServer) < 0.02) {
                    desiredHackThreads  = 1
                }
                ns.print("+++")
                ns.print("batch ", i)
                ns.printf("hack %s with %s threads from %s with offset %s", targetServer, desiredHackThreads, server, hackOffset)
                ns.printf("weak %s with %s threads from %s with offset %s", targetServer, weakenHackThreads, server, 0)
                ns.printf("grow %s with %s threads from %s with offset %s", targetServer, desiredGrowThreads, server, growOffset)
                ns.printf("weak %s with %s threads from %s with offset %s", targetServer, weakenGrowThreads, server, weakOffset)
                ns.exec("single-hack.js", server, desiredHackThreads, targetServer, hackOffset, Math.random())
                ns.exec("single-weaken.js", server, weakenHackThreads, targetServer, 0, Math.random())
                ns.exec("single-grow.js", server, desiredGrowThreads, targetServer, growOffset, Math.random())
                ns.exec("single-weaken.js", server, weakenGrowThreads, targetServer, weakOffset, Math.random())
                await ns.sleep(batchOffset)
            } else {
                ns.print("Not enough ram on ", server)
                ns.print("batchCost ", batchCost)
                await ns.sleep(batchOffset)
                break
            }
        }
    }
    
}