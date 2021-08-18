export function changeBackground() {
    console.log(document.body.style.background)
    if (document.body.style.background === "rgb(245, 245, 245)" || document.body.style.background === "" || document.body.style.background === "white") {
        document.body.style.background = "rgb(158, 157, 159)";
    } else {
        document.body.style.background = "rgb(245, 245, 245)";
    }
}