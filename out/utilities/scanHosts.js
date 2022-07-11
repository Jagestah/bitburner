/**
 * Enumerates all the accessible servers.
 *
 * @param {NS} ns The Netscript Module.
 * @param {string} host The server to start scanning from.
 * @returns {boolean} True if the server will produce money.
 */
 
export async function getAllHosts(ns, host="home") {
    // ns.print(scanList)
    // ns.tail()
    var scannedHosts = []
    scanHost(host, scannedHosts)
    function scanHost(host, scannedHosts) {
        if (!(scannedHosts.includes(host))) {
            scannedHosts.push(host)
        }
        var scanList = ns.scan(host)
        if (scanList.length > 1) {
            for (let scannedHost in scanList) {
                if (!(scannedHosts.includes(scanList[scannedHost]))) {
                    // ns.print(scanList[scannedHost])
                    scanHost(scanList[scannedHost], scannedHosts)
                }
            }
        }
    }
	
    // ns.print(scannedHosts)
    return scannedHosts;
}

export async function getRootHosts(ns) {
    var rootHosts = []
    var hostList = await getAllHosts(ns)
    // ns.print(hostList)

    for (let index in hostList) {
		if (ns.hasRootAccess(hostList[index])) {
            // ns.print(hostList[index])
            rootHosts.push(hostList[index])
		}
    }
    // ns.print(rootHosts)
    return rootHosts;
}

export async function getNonRootHosts(ns) {
    
    var allHostList = await getAllHosts(ns)
    var nukedHostsList = await getRootHosts(ns)
    var notNukedHosts = []

    for (let index in allHostList) {
		if (!(nukedHostsList.includes(allHostList[index]))) {
            // ns.print(hostList[index])
            notNukedHosts.push(allHostList[index])
		}
    }

    // ns.print(rootHosts)
    return notNukedHosts;
}


export async function nukeHosts(ns) {
    var maxPorts = 0
    var nukedHosts = []
    var notNukedHosts = await getNonRootHosts(ns)
    // ns.print(notNukedHosts)
    // Hacking level
    var player = ns.getPlayer()
    // ns.print(player.hacking)
    // BruteSSH.exe
    if (ns.fileExists("BruteSSH.exe")){
		maxPorts++
        var brute = true
	}
    // FTPCrack.exe
	if (ns.fileExists("FTPCrack.exe")){
		maxPorts++
        var ftp = true
	}
    // RelaySMTP.exe
	if (ns.fileExists("RelaySMTP.exe")){
		maxPorts++
        var smtp = true
	}
    // HTTPWorm.exe
	if (ns.fileExists("HTTPWorm.exe")){
		maxPorts++
        var http = true
    }
    // SQLInject.exe
	if (ns.fileExists("SQLInject.exe")){
		maxPorts++
        var sql = true
    }
    
    ns.printf("Hacking Level: %s, Max Ports: %s", player.hacking, maxPorts)
    for (let index in notNukedHosts) {
        var server = notNukedHosts[index]
        // ns.printf("Checking %s for nukeability", server)
        var hackingReqLevel = ns.getServerRequiredHackingLevel(server)
		var portsReqd = ns.getServerNumPortsRequired(server)
		if (portsReqd <= maxPorts && hackingReqLevel <= player.hacking) {
            if (brute) {ns.print("bruting ", server);await ns.brutessh(server)}
            if (ftp) {ns.print("FTPing ", server);await ns.ftpcrack(server)}
            if (smtp) {ns.print("SMTPing ", server);await ns.relaysmtp(server)}
            if (http) {ns.print("HTTPing ", server);await ns.httpworm(server)}
            if (sql) {ns.print("SQLing ", server);await ns.sqlinject(server)}

            ns.print("Nuking ", server)
            await ns.nuke(server)
            nukedHosts.push(server)
        }
    }

    // ns.print(rootHosts)
    return nukedHosts;
}