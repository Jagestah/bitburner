/** @param {NS} ns */
var scannedHosts = []
var rootHosts = []

function getRoot(ns, host) {
	if (ns.hasRootAccess(host)) {
		if (host != "home") {
			rootHosts.push(host)
		}
	}
}

function scanHost(ns, host) {
	scannedHosts.push(host)
	ns.print(ns)
	var scanList = ns.scan(host)
	if (scanList.length > 1) {
		for (let scannedHost in scanList) {
			if (!(scannedHosts.includes(scanList[scannedHost]))) {
				// ns.print(scanList[scannedHost])
				scanHost(scanList[scannedHost])
			}
		}
	}
}