var deferredPrompt
const notificationButtons = document.querySelectorAll('.enable-notifications')

if (!window.Promise) {
	window.Promise = Promise
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(function () {
			console.log('Service worker registered!')
		})
		.catch(function (err) {
			console.log(err)
		})
}

window.addEventListener('beforeinstallprompt', function (event) {
	console.log('beforeinstallprompt fired')
	event.preventDefault()
	deferredPrompt = event
	return false
})

function displayConfirmNotification() {
	if ('serviceWorker' in navigator) {
		console.log('[Notification] Display Confirm')
		var options = {
			body: 'You successfully subscribed to push notifications!',
			icon: '/src/images/icons/app-icon-96x96.png',
			vibrate: [100, 50, 100],
			image: '/src/images/sf-boat.jpg',
			data: {
				dateOfArrival: Date.now(),
				primaryKey: 1,
			},
			tag: 'confirm-notification',
			renotify: true,
			actions: [
				{
					action: 'confirm',
					title: 'Yes',
					icon: '/src/images/icons/app-icon-96x96.png',
				},
				{
					action: 'cancel',
					title: 'No',
					icon: '/src/images/icons/app-icon-96x96.png',
				},
			],
		}
		navigator.serviceWorker.ready.then(function (swRegistration) {
			swRegistration.showNotification('Push Notification', options)
		})
	}
}

function askForNotificationPermission() {
	Notification.requestPermission(function (result) {
		console.log('[Notification] User Choice', result)
		if (result !== 'granted') {
			console.log('No notification permission granted')
		} else {
			// Change the button text
			displayConfirmNotification()
			notificationButtons.forEach(function (button) {
				button.textContent = 'Notifications enabled'
				button.disabled = true
			})
			// subscribeUserToPush() // subscribe the user to push
		}
	})
}

if ('Notification' in window) {
	for (var i = 0; i < notificationButtons.length; i++) {
		notificationButtons[i].style.display = 'inline-block'
		notificationButtons[i].addEventListener(
			'click',
			askForNotificationPermission
		)
	}
}
