$(function() {
    'use strict';

    var memoPad = $('#memo-pad');
    $('#add-button').click(function() {
        var memoData = new Memo();
        memoData.created = new Date().getTime();
        memoData.x = 0;
        memoData.y = 0;
        Memo.save(memoData);

        showMemo(memoData);

    });
    $('#sync-button').click(function() {
        Memo.sync(function() {
            alert('同期が完了しました');
            loadMemos();
        }, function() {
            alert('エラーが発生しました');
        });
    });
    
    function loadMemos() {
        Memo.loadAll(function(memos) {
            for (var id in memos) {
                var memo = memos[id];
                showMemo(memo);
            }
        });
    };
    loadMemos();
    var showMemo = function(memoData) {
        var memo = $(document.createElement('div'));
        memo.addClass('memo');
        memo.css({
            left: memoData.x,
            top: memoData.y
        });
        var memoTitleBar = $(document.createElement('div'));
        memoTitleBar.addClass('memo-title-bar').appendTo(memo);;
        var moving = false;
        var prevPos;
        memoTitleBar.mousedown(function(e) {
            moving = true;
            prevPos = { x: e.pageX, y: e.pageY };
        });
        $(document).mousemove(function(e) {
            if (!moving) {
                return;
            }
            var deltaX = e.pageX - prevPos.x;
            var deltaY = e.pageY - prevPos.y;
            var memoPos = memo.position();
            memoPos = {
                left: (memoPos.left + deltaX) + 'px',
                top: (memoPos.top + deltaY) + 'px'
            };
            memo.css(memoPos);
            prevPos = { x: e.pageX, y: e.pageY };
            
            memoData.x = memoPos.left;
            memoData.y = memoPos.top;
            Memo.save(memoData);
        });
        $(document).mouseup(function() {
            moving = false;
        });
        
        var memoBody = $(document.createElement('div'));
        memoBody.addClass('memo-body').appendTo(memo);;
        memoBody.attr('contentEditable', true);
        if (memoData.content) {
            memoBody.html(memoData.content);
        }
        var closeButton = $(document.createElement('div'));
        closeButton.addClass('memo-close-button').appendTo(memoTitleBar);
        closeButton.click(function() {
            memo.remove();
            Memo.remove(memoData.id);
        });
        memoPad.append(memo);
        memoBody.css({
            height: (memo.height() - 16) + 'px'
        });
        memoBody.keyup(function() {
            memoData.content = memoBody.html();
            Memo.save(memoData);
        });
        memoBody.focus();
        return memo;
    };
});
