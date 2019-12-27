"use strict";
const UIService = (($) => {
    
    const placeholderDiv = $("#placeholder");
    const loadTemplate = (url, callback) => {
        placeholderDiv.load(url, () => {
            
            return callback();
        });
    }
    const topbarDiv = $("topbar");
    const loadLayout = (url) => {
        topbarDiv.load(url, () => {
            require('../../components/topbar/topbar')($);
        })
    }
    // const save = (key, value) => {
    //     localStorage.setItem(key, value);
    // };

    // const get = (key) => {
    //     return localStorage.getItem(key);
    // };

    return {
        loadTemplate,
        loadLayout
    }
})

module.exports = UIService;