const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    network: {
        type: String,
        default: "http://localhost:8545"
    },
    maxBlocks: {type: Number, default: 100}
});

module.exports = mongoose.model('Settings', settingsSchema);
