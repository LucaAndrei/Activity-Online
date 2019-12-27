const StorageService = (() => {

    const STORAGE_KEY = 'activity-game-details';

    const save = (object) => {
        console.log("TCL: save -> object", object)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(object));
    };

    const get = () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    };

    return {
        save: save,
        get: get
    }
})

module.exports = StorageService;