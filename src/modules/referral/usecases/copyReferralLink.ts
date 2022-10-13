const fallbackCopyToClipBoard = (link: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = link;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand("copy");
        return successful;
    } catch (err) {
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
};

const copyToClipBoard = (link: string) => {
    if (!navigator.clipboard) return fallbackCopyToClipBoard(link);
    return navigator.clipboard
        .writeText(link)
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.error(err);
            return false;
        });
};

export const copyReferralLink = (link: string) => {
    return copyToClipBoard(link);
};
