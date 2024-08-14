chrome.action.onClicked.addListener(async () => {
    const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    chrome.tabs.sendMessage(activeTab.id, {
        message: "get_url",
        url: activeTab.url,
    });
});
