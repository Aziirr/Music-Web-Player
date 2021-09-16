const Datastore = require('nedb');
const database = new Datastore({
    filename: 'db1.db',
    autoload: true
});
const database_methods = {

    addRecord: function (req, res, record) {
        database.count({album: record.album, song: record.song}, function (err, count) {
            if (count === 0) {
                database.insert(record, function (err, newDoc) {
                    let exists = {
                        exists: false
                    };
                    res.end(JSON.stringify(exists));
                });
            } else {
                let exists = {
                    exists: true
                };
                res.end(JSON.stringify(exists));
            }
        });
    },
    selectRecords: function (req,res) {
        database.find({ }, function (err, docs) {
            res.end(JSON.stringify(docs));
        });
    }
};

module.exports = database_methods;