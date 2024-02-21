const randomTitle = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const randomTags = () => {
    const array = [1, 2, 3, 3, 5, 5, 2, 2, 4, 4, 3, 2, 4, 33, 4, 3, 2, 4, 4, 4, 23423, 423, 423, 523, 5, 245, 345, 34, 5, 345, 34, 534, 5, 435]
    const n = 5
    const copyArray = array.slice();
    const randomElements = [];
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * copyArray.length);
        const randomElement = copyArray[randomIndex];
        randomElements.push(randomElement);
        copyArray.splice(randomIndex, 1);
    }
    return randomElements.join(' ');
}

module.exports = { randomTags, randomTitle }