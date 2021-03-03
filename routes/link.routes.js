import { Router } from 'express';
import config from 'config';
import shortid from 'shortid';
import Link from '../models/Link.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router()

router.post('/generate', authMiddleware, async (req, res) => {
	try {
		const baseUrl = config.get('BASE_URL');
		const { from } = req.body;

		const code = shortid.generate();

		const existing = await Link.findOne({ from });

		if (existing) {
			return res.json({ link: existing })
		}

		const to = baseUrl + '/t/' + code;

		const link = new Link({
			code, to, from, owner: req.user.userId
		})

		await link.save();

		res.status(201).json({ link })

		
	} catch (error) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
	}
})

router.get('/', authMiddleware, async (req, res) => {
	try {
		const links = await Link.find({ owner: req.user.userId });
		res.status(200).json(links);
	} catch (error) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
	}
})

router.get('/:id', authMiddleware, async (req, res) => {
	try {
		const links = await Link.findById(req.params.id);
		res.status(200).json(links);
	} catch (error) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
	}
})

export default router;