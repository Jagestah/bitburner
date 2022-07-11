/**
 * Determines the optimal thread count to dedicate to hacking, growing and weakening.
 *
 * @param {NS} ns The Netscript Module.
 * @param {string} host The server to start scanning from.
 * @returns {boolean} True if the server will produce money.
 */

export async function calculateRatio(ns, host="foodnstuff") {
    var threads = 10
    var cores = 1
    var hostname = host

    var server = await ns.getServer(host)
    // ns.print(server)
    var hackTime = ns.getHackTime(host)
    var hackChange = ns.hackAnalyze(host)
    var hackSecurity = ns.hackAnalyzeSecurity(threads, hostname)
    const hackWeight = 0.5
    var growTime = ns.getGrowTime(host)
    var growthChange = ns.growthAnalyze(host, 1+(hackChange*threads), cores)
    var growthSecurity = ns.growthAnalyzeSecurity(threads, hostname, cores)
    const growWeight = 1.25
    var weakTime = ns.getWeakenTime(host)
    var weakenChange = ns.weakenAnalyze(threads, cores)
    var weakThreads = ((growthSecurity*growthChange)+hackSecurity)/weakenChange
    const weakWeight = 1
//     const output = `---
// Hack threads:                       ${threads}
// Growth threads:                     ${growthChange}
// Weakens threads:                    ${weakThreads}
// `
//     ns.print(output)
    var totalTime = threads*hackTime + growthChange*growTime + weakThreads*weakTime
    var threadRatio = [
        (threads*hackTime/totalTime)*hackWeight,
        (growthChange*growTime/totalTime)*growWeight,
        (weakThreads*weakTime/totalTime)*weakWeight
    ]
    ns.print(threadRatio)
    return threadRatio

}

export async function launchThreads(ns, host="foodnstuff", scriptName="weaken.js", threadCount="1", targetHost="n00dles"){
    if (threadCount > 0){
        // ns.print(scriptName, host, threadCount, targetHost)
        ns.exec(scriptName, host, threadCount, targetHost)
    }
}