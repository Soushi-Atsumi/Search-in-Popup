/*
 * Search in Popup - More useful searching extension than Built-in features.
 * Copyright (c) 2022 Soushi Atsumi. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * This Source Code Form is "Incompatible With Secondary Licenses", as
 * defined by the Mozilla Public License, v. 2.0.
 */
'use strict';

setTimeout(() => {
	browser.browserAction.getPopup({}).then(async (url) => {
		const pageActions = JSON.parse(await (await fetch(browser.runtime.getURL('/_values/PageActions.json'))).text());
		const searchEngines = JSON.parse(await (await fetch(browser.runtime.getURL('/_values/SearchEngines.json'))).text());
		const storageKeys = JSON.parse(await (await fetch(browser.runtime.getURL('/_values/StorageKeys.json'))).text());
		const additionalSearchEngine = {
			all: [],
			get main() { return this.all.filter(e => e.isMain)[0]; }
		};

		const searchEngineOptions = await browser.storage.local.get([storageKeys.additionalSearchEngine, storageKeys.searchEngine]);
		const pageActionOptions = await browser.storage.local.get([storageKeys.pageAction]);

		if (pageActionOptions === undefined || pageActionOptions[storageKeys.pageAction] !== pageActions.goBackToHome) {
			window.location = url;
			return;
		}

		if (Object.keys(searchEngineOptions).includes(storageKeys.additionalSearchEngine)) {
			additionalSearchEngine.all = searchEngineOptions[storageKeys.additionalSearchEngine];
		}

		let panelUrl;

		switch (searchEngineOptions[storageKeys.searchEngine]) {
			case searchEngines.additional.name:
				panelUrl = additionalSearchEngine.main.url;
				break;
			case searchEngines.bing.name:
				panelUrl = searchEngines.bing.url;
				break;
			case searchEngines.duckduckgo.name:
				panelUrl = searchEngines.duckduckgo.url;
				break;
			case searchEngines.google.name:
				panelUrl = searchEngines.google.url;
				break;
			case searchEngines.yahoo.name:
				panelUrl = searchEngines.yahoo.url;
				break;
			case searchEngines.yahooJapan.name:
				panelUrl = searchEngines.yahooJapan.url;
				break;
			default:
				panelUrl = browser.runtime.getURL('index.html');
		}

		browser.browserAction.setPopup({
			popup: panelUrl
		});
		window.location = url;
	});
}, 500);
