import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import path from 'path';
import authRouter from './routes/auth.routes.js';
import linkRouter from './routes/link.routes.js';
import redirectRouter from './routes/redirect.routes.js';

const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/link', linkRouter);
app.use('/t', redirectRouter)

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = config.get('PORT') || 5000;

async function start() {

	try {
		await mongoose.connect(config.get('MONGO_URI'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		
	app.listen(PORT, () => {
		console.log(`Server has been started on port ${PORT}...`);
	})
	} catch (error) {
		console.log('Server error', error.message);
		process.exit(1);
	}
}

start();
