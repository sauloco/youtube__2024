const swapPanels = ({player, primary, secondary, primaryInner, secondaryInner}) => {

    const fixedPrimary = document.querySelector('#fixed_primary')
    if (fixedPrimary) {
        fixedPrimary.id = 'fixed_secondary'
    }

    primaryInner.id = 'secondary_inner'
    secondaryInner.id = 'primary_inner'

    primary.id = 'secondary'
    primary.classList.add('youtube__2024-primary')
    secondary.id = 'primary'

    swapElements(primary, secondary)

    clearInterval(cancelFindingInterval)

    startIntervals()

}

const startIntervals = () => {
    if (isActive) {
        cancelKeepPlayerInPrimaryInterval = setInterval(keepPlayerInPrimary, 10)
        cancelKeepFixedSecondaryInSecondaryInterval = setInterval(keepFixedSecondaryInSecondary, 10)
    }
}

const swapElements = (node1, node2) => {
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
}

const keepPlayerInPrimary = () => {
    const player = document.querySelector('#player')
    const primary = document.querySelector('#primary')

    if (player && primary) {
        if (player.parentElement === primary) {
            console.info('player already in primary')
            return
        }

        primary.insertBefore(player, primary.children[0])
        clearInterval(cancelKeepPlayerInPrimaryInterval)
    }

}

const keepFixedSecondaryInSecondary = () => {
    const fixedSecondary = document.querySelector('#fixed-secondary')
    const secondary = document.querySelector('#secondary')

    if (fixedSecondary && secondary) {
        if (fixedSecondary.parentElement === secondary) {
            console.info('fixed secondary already in secondary')
            return
        }

        secondary.insertBefore(fixedSecondary, secondary.children[0])
        clearInterval(cancelKeepFixedSecondaryInSecondaryInterval)
    }
}

const findPanels = () => {
    const player = document.querySelector('#player')
    const primary = document.querySelector('#primary')
    const secondary = document.querySelector('#secondary')
    const primaryInner = document.querySelector('#primary-inner')
    const secondaryInner = document.querySelector('#secondary-inner')

    let isCommentsInPrimary = true
    if (primary) {
        isCommentsInPrimary = !!primary.querySelector('#comments')
        if (isCommentsInPrimary) {
            console.info('Nice, youtube__2024 not needed. It will be deactivated now')
            clearInterval(cancelFindingInterval)
            isActive = false
            return null
        }
    }

    return !isCommentsInPrimary && (player && primary && secondary && primaryInner && secondaryInner) ? {
        player, primary, secondary, primaryInner, secondaryInner
    } : null
}

let isActive = true;

let cancelFindingInterval;

let cancelKeepPlayerInPrimaryInterval;

let cancelKeepFixedSecondaryInSecondaryInterval;

const initYoutube__2024 = () => {
    cancelFindingInterval = setInterval(() => {
        const panels = findPanels()
        if (panels) {
            swapPanels(panels)
        }
    }, 10)
}

initYoutube__2024()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === 'urlChanged') {
        startIntervals()
    }
});