// sw.js
var apiCacheName = 'api-0-1-1';
self.addEventListener('fetch', function (e) {
    // 需要缓存的xhr请求
    var cacheRequestUrls = [
        '/book?'
    ];
    console.log('现在正在请求：' + e.request.url);

    // 判断当前请求是否需要缓存
    var needCache = cacheRequestUrls.some(function (url) {
        return e.request.url.indexOf(url) > -1;
    });

    /**** 这里是对XHR数据缓存的相关操作 ****/
    if (needCache) {
        // 需要缓存
        // 使用fetch请求数据，并将请求结果clone一份缓存到cache
        // 此部分缓存后在browser中使用全局变量caches获取
        caches.open(apiCacheName).then(function (cache) {
            return fetch(e.request).then(function (response) {
                cache.put(e.request.url, response.clone());
                return response;
            });
        });
    }
    /* ******************************* */

    else {
        // 非api请求，直接查询cache
        // 如果有cache则直接返回，否则通过fetch请求
        e.respondWith(
            caches.match(e.request).then(function (cache) {
                return cache || fetch(e.request);
            }).catch(function (err) {
                console.log(err);
                return fetch(e.request);
            })
        );
    }
});

function getApiDataFromCache(url) {
    if ('caches' in window) {
        return caches.match(url).then(function (cache) {
            if (!cache) {
                return;
            }
            return cache.json();
        });
    }
    else {
        return Promise.resolve();
    }
}

function queryBook() {
    // ……
    // 远程请求
    var remotePromise = getApiDataRemote(url);
    var cacheData;
    // 首先使用缓存数据渲染
    getApiDataFromCache(url).then(function (data) {
        if (data) {
            loading(false);
            input.blur();            
            fillList(data.books);
            document.querySelector('#js-thanks').style = 'display: block';
        }
        cacheData = data || {};
        return remotePromise;
    }).then(function (data) {
        if (JSON.stringify(data) !== JSON.stringify(cacheData)) {
            loading(false);                
            input.blur();
            fillList(data.books);
            document.querySelector('#js-thanks').style = 'display: block';
        }
    });
    // ……
}
