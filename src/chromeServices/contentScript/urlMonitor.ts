let previousURL = "";
setInterval(() => {
    let currentURL = getURLString();
    if (previousURL !== currentURL) {
        previousURL = currentURL;
        window.dispatchEvent(new Event('locationchange'));
    }
}, 1000);

const getURLString = (): string => {
    return window.location.href;
}
export const getURL = (): URL => {
    return new URL(getURLString());
}

export const onLocationChange = (callback: EventListenerOrEventListenerObject): void => {
    window.addEventListener('locationchange', callback)
}