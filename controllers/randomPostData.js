const randomTitle = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const randomTags = (array) => {
    // const array = ["#meme", "#motive", "#3", "#3", "#wwe", "#pod", "#somerandomtag", "#somemorerandomtag", "#It_does_not_mean_anything"]
    const n = 15
    const copyArray = array.slice();
    const randomElements = [];
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * copyArray.length);
        const randomElement = copyArray[randomIndex];
        randomElements.push(randomElement);
        copyArray.splice(randomIndex, 1);
    }
    return randomElements;
}

module.exports = { randomTags, randomTitle }