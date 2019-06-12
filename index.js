// index.js
function registerServiceWorker(file) {
    return navigator.serviceWorker.register(file);
}
function subscribeUserToPush(registration, publicKey) {
    var subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: window.urlBase64ToUint8Array(publicKey)
    }; 
    return registration.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
        return pushSubscription;
    });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    var publicKey = 'BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A';
    // registeredservice worker
    registerServiceWorker('./sw.js').then(function (registration) {
        console.log('Service Worker registration success');
        // Enable the message push subscription function of the client
        return subscribeUserToPush(registration, publicKey);
    }).then(function (subscription) {
        var body = {subscription: subscription};
        // To facilitate subsequent push, simply generate an identifier for each client
        body.uniqueid = new Date().getTime();
        console.log('uniqueid', body.uniqueid);
        // Store generated client subscription information on your own server
        return sendSubscriptionToServer(JSON.stringify(body));
    }).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        console.log(err);
    });
}
