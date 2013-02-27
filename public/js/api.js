var MemoAPI = (function() {
    var MemoAPI = {
        downloadAll: function(onsuccess, onerror) {
            $.get('/memos', function(memos) {
                onsuccess(memos);
            }, 'json');

        },
        uploadAll: function(memos, onsuccess, onerror) {
            $.post('/memos', memos)
                .success(onsuccess)
                .error(onerror);
        }
    };
    return MemoAPI;
})();
