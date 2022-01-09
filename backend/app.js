const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const bodyParser = require('body-parser')

var admin = require('firebase-admin')

var serviceAccount = require('./pwa-firebase.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://smart-home-9497d-default-rtdb.firebaseio.com',
})

app.use(cors())
app.use(bodyParser.json())

console.log(admin.app().name)

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/api/posts', (req, res) => {
	const { title, location, image, id } = req.body
	const post = { title, location, image, id }
	console.log('post', post)
	admin
		.database()
		.ref('/posts')
		.push(post)
		.then(() => {
			res.status(201).json({ message: 'Post added successfully', id: post.id })
		})
		.catch((err) => {
			res.status(500).json({ error: err.code })
		})
	console.log('post1', post)
})

app.listen(port, () => console.log(`Backend app listening on port ${port}!`))
