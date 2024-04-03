const newId = array => {
    if (array.length === 0) {
        return 1;
    }

    const ids = array.map(obj => obj.id);
    const maxId = Math.max(...ids);

    return maxId + 1;
}

module.exports = newId;
