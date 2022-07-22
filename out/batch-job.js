//hack
//weaken
//grow
//weaken
//establish target
/** @param {NS} ns */
export async function main(ns) {
    // ns.tail()
    ns.disableLog("ALL")
    ns.print("---")
    var server = ns.args[0]
    var targetServer = ns.args[1]
    const scriptCost = 1.75
    // try {
    //     ns.exec("no-hack.js", "home", 1, targetServer)
    // } catch {
    //     ns.print("Maybe it's already running")
    // }
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
        // ns.print("potentialBatches: ", potentialBatches)
        // ns.print("batchOffset: ", batchOffset)
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

    function establishThreads(hackTarget) {
        serverMoney = ns.getServerMoneyAvailable(targetServer)
        desiredHackAmount = (serverMoney * hackTarget)
        desiredHackThreads = Math.ceil(ns.hackAnalyzeThreads(targetServer, desiredHackAmount))
        hackSecurityIncrease = (ns.hackAnalyzeSecurity(desiredHackThreads, targetServer) * ns.getServerSecurityLevel(targetServer))
        weakenChange = ns.weakenAnalyze(1, 1)
        weakenHackThreads = Math.ceil(hackSecurityIncrease / weakenChange)
        desiredGrowMultiplier = (serverMoney / (serverMoney - desiredHackAmount))
        if (!desiredGrowMultiplier){
            desiredGrowMultiplier = 900
        } else if (desiredGrowMultiplier < 1) {
            desiredGrowMultiplier = 1
        }
        desiredGrowThreads = Math.ceil(ns.growthAnalyze(targetServer, desiredGrowMultiplier*1.15))
        growSecurityIncrease = ((ns.growthAnalyzeSecurity(1, targetServer, 1)*desiredGrowThreads) * ns.getServerSecurityLevel(targetServer))
        weakenGrowThreads = Math.ceil(growSecurityIncrease*1.15 / weakenChange)
        // ns.print("desiredGrowMultiplier ", desiredGrowMultiplier)
        // ns.print("desiredGrowThreads ", desiredGrowThreads)
        return [desiredHackThreads+1, weakenHackThreads+1, desiredGrowThreads+1, weakenGrowThreads+1];
    }

    // [desiredHackThreads, weakenHackThreads, desiredGrowThreads, weakenGrowThreads] = establishThreads(hackTarget)
    [potentialBatches, batchOffset, growOffset, weakOffset] = establishTiming()
    // ns.exec("single-hack.js", server, 1, targetServer, 0)
    // await ns.sleep(hackTime+100)
    
    var batchCost = 16

    while (true) {
        // var spaceAvailable = true
        var hackTarget = 0.90
        // ns.printf("desiredGrowThreads %s", desiredGrowThreads)
        let [potentialBatches, batchOffset, growOffset, weakOffset] = establishTiming()
        for (let i = 1; i < potentialBatches; i++) {
            while (batchCost >= 16 && hackTarget > 0.05) {
                let [desiredHackThreads, weakenHackThreads, desiredGrowThreads, weakenGrowThreads] = establishThreads(hackTarget)
                batchCost = (desiredHackThreads + weakenHackThreads + desiredGrowThreads + weakenGrowThreads) * scriptCost;
                if ((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) > batchCost){
                    if (serverMoney/ns.getServerMaxMoney(targetServer) <= 0.10) {
                        desiredHackThreads  = 1
                    }
                    ns.print("+++")
                    ns.printf("Hacking for %s", hackTarget*100)
                    // ns.print("batch ", i)
                    ns.printf("hack %s with %s threads from %s", targetServer, desiredHackThreads, server)
                    ns.printf("weak %s with %s threads from %s", targetServer, weakenHackThreads, server)
                    ns.printf("grow %s with %s threads from %s", targetServer, desiredGrowThreads, server)
                    ns.printf("weak %s with %s threads from %s", targetServer, weakenGrowThreads, server)
                    ns.exec("single-hack.js", server, desiredHackThreads, targetServer, hackOffset, Math.random())
                    ns.exec("single-weaken.js", server, weakenHackThreads, targetServer, 0, Math.random())
                    ns.exec("single-grow.js", server, desiredGrowThreads, targetServer, growOffset, Math.random())
                    ns.exec("single-weaken.js", server, weakenGrowThreads, targetServer, weakOffset, Math.random())
                    // spaceAvailable = true
                    await ns.sleep(batchOffset)
                } else {
                    // ns.print("Not enough ram on ", server)
                    // ns.print("batchCost ", batchCost)
                    // ns.printf("desiredHackThreads: %s, %s",desiredHackThreads,desiredHackThreads*scriptCost)
                    // ns.printf("weakenHackThreads: %s, %s",weakenHackThreads,weakenHackThreads*scriptCost)
                    // ns.printf("desiredGrowThreads: %s, %s",desiredGrowThreads,desiredGrowThreads*scriptCost)
                    // ns.printf("weakenGrowThreads: %s, %s",weakenGrowThreads,weakenGrowThreads*scriptCost)
                    // spaceAvailable = false
                    hackTarget = hackTarget / 2
                    // ns.print("hackTarget: ",hackTarget)
                    await ns.sleep(60)
                    break
                }
            }
        }
        // ns.printf("Sleeping for %sms", batchOffset)
        await ns.sleep(batchOffset)
    }
    
}