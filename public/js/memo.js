var Memo = (function() {
    var Memo = function() {
    };
    Memo.save = function(data, onsuccess, onerror) {
        if (!data.id) {
            data.id = UUID.generate();
            data.created = new Date().getTime();
        }
        data.updated = new Date().getTime();
        var memos = localStorage.memos;
        if (!memos) {
            memos = {};
        } else {
            memos = JSON.parse(memos);
        }
        memos[data.id] = data;
        localStorage.memos = JSON.stringify(memos);
        if (typeof onsuccess === 'function') {
            setTimeout(onsuccess, 0);
        }        
    };
    Memo.remove = function(id, onsuccess, onerror) {
        var memos = localStorage.memos;
        if (memos) {
            memos = JSON.parse(memos);
            var memo = memos[id];
            if (memo) {
                memo.removed = true;
                memo.updated = new Date().getTime();
                localStorage.memos = JSON.stringify(memos);
            }
        }
        if (typeof onsuccess === 'function') {
            setTimeout(onsuccess, 0);
        }        
    };
    Memo.loadAll = function(onsuccess, onerror) {
        var memos = localStorage.memos;
        var result = {};
        if (memos) {
            memos = JSON.parse(memos);
            for (var id in memos) {
                var memo = memos[id];
                if (memo.removed) {
                    continue;
                }
                result[id] = memo;
            }
        }
        if (typeof onsuccess === 'function') {
            setTimeout(function() {
                onsuccess(result);
            }, 0);
        }        

    };
    Memo.findById = function(id, onsuccess, onerror) {
        var memos = localStorage.memos;
        var memo;
        if (memos) {
            memos = JSON.parse(memos);
            memo = memos[id];
            if (memo.removed) {
                memo = null;
            }
        }
        if (typeof onsuccess === 'function') {
            setTimeout(function() {
                onsuccess(memo || null);
            }, 0);
        }
    };

    Memo.sync = function(onsuccess, onerror) {
        var localMemos = localStorage.memos;
        if (localMemos) {
            localMemos = JSON.parse(localMemos);
        } else {
            localMemos = {};
        }
        
        MemoAPI.downloadAll(function(serverMemos) {
            for (var id in localMemos) {
                var serverMemo = serverMemos[id];
                var localMemo = localMemos[id];
                // サーバ側に存在しない場合は上書き
                if (!serverMemo) {
                    serverMemos[id] = localMemo;
                }
                // ローカルで削除されていたら削除
                else if (localMemo.removed) {
                    serverMemos[id].removed = true;
                    serverMemos[id].updated = new Date().getTime();
                }
                // ローカルのほうが新しかったら上書き
                else if (localMemo.updated > serverMemo.updated) {
                    serverMemos[id] = localMemo;
                }

            }
            MemoAPI
                .uploadAll(serverMemos, function() {
                    localStorage.memos = JSON.stringify(serverMemos);
                    onsuccess();
                }, onerror);
        }, onerror);
    };
    return Memo;
})();
