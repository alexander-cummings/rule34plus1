function storeImagesOrAddNavigation() {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);

    if(urlParams.get("page") !== "post") {
        return;
    }

    if(urlParams.get("s") === "list") {
        const images = Array.from(document.getElementsByClassName("thumb"));

        if (images.length === 0) {
            return;
        }

        const firstImageId = images.at(0).id.slice(1);

        let previousImageId = images.at(-1).id.slice(1);
        let currentImageId = firstImageId;
        let nextImageId;
        for(let i = 1; i < images.length; ++i) {
            nextImageId = images.at(i).id.slice(1);
            chrome.storage.local.set({
                [currentImageId]: {
                    previous: previousImageId,
                    next: nextImageId,
                }
            });

            previousImageId = currentImageId;
            currentImageId = nextImageId;
        }

        chrome.storage.local.set({
            [nextImageId]: {
                previous: currentImageId,
                next: firstImageId,
            }
        });
    }
    else if(urlParams.get("s") === "view" && urlParams.has("id")) {
        const imageId = urlParams.get("id");

        chrome.storage.local.get([imageId]).then((result) => {
            const navigationInfo = result[imageId];

            const content = document.querySelector("div.flexi > div");

            const previous = document.createElement("a");
            previous.innerHTML = "Previous";
            previous.href = "https://rule34.xxx/index.php?page=post&s=view&id="
                + navigationInfo.previous;

            const next = document.createElement("a");
            next.innerHTML = "Next";
            next.href = "https://rule34.xxx/index.php?page=post&s=view&id="
                + navigationInfo.next;

            const previousNextSeparator = document.createTextNode(" | ");
            const previousNextContainer = document.createElement("h4");

            previousNextContainer.appendChild(previous);
            previousNextContainer.appendChild(previousNextSeparator);
            previousNextContainer.appendChild(next);

            content.appendChild(previousNextContainer);

            document.addEventListener("keydown", event => {
                if(event.key === "ArrowRight") {
                    window.location.href = next.href;
                }
                else if(event.key === "ArrowLeft") {
                    window.location.href = previous.href;
                }
            });
        });
    }
}

storeImagesOrAddNavigation();
