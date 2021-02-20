const destroyTabs = {}

const invalidProtocols = {
	'moz-extension:': true,
	'about:': true,
	'chrome:': true,
}

const defaultContainers = {
	'firefox-default': true,
	'firefox-private': true,
}

async function onUpdated(tabId, changeInfo, tab){
	// whenever a tab in our list of tabs marked for destruction is "complete", remove it
	if(destroyTabs[tabId] && changeInfo.status && changeInfo.status === 'complete'){
		delete destroyTabs[tabId]
		browser.tabs.remove(tabId)
	}
}

async function onBeforeRequest(details){
	const tab = await browser.tabs.get(details.tabId)

	// bail if the tab was not opened from another tab
	if(!tab.hasOwnProperty('openerTabId'))
		return

	// bail if the new tab is already in a default container
	if(!tab.cookieStoreId || defaultContainers[tab.cookieStoreId])
		return

	const {host: originHost, protocol: originProtocol} = new URL(details.originUrl)
	const {host: targetHost} = new URL(details.url)

	// if the new tab has a different url host
	if(originHost.toLowerCase() !== targetHost.toLowerCase() && !invalidProtocols[originProtocol]){
		// sadly, this is not possible:
		// await browser.tabs.update(details.tabId, {
		// 	cookieStoreId: 'firefox-default'
		// })

		// mark the old tab for destruction
		destroyTabs[details.tabId] = true

		// create a new tab in a default container (by not specifying a container)
		browser.tabs.create({
			url: details.url,
			index: tab.index,
			active: tab.active
		})

		// block the request for the old tab
		return {cancel: true}
	}
}

browser.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
	urls: ['<all_urls>'],
	types: ['main_frame'],
}, ['blocking'])

browser.tabs.onUpdated.addListener(onUpdated)
