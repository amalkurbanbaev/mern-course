import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { decode } from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import config from 'config';

const router = Router();

// /api/auth/register
router.post(
	'/register',
	[
		check('email', 'Некорректный email').isEmail(), // эти экспресс чеки передаются в метод validationResult для последующей проверки
		check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6}) // эти экспресс чеки передаются в метод validationResult для последующей проверки
	],
	async (req, res) => {
		try {

			console.log('Body: ', req.body)

			// методу validationResult() передается запрос в котором храняться необходимые данные для проверки (указаны выше в чеках)
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Неккоректные данные при регистрации'
				});
			}

			// из заоловка запроса забираем мейл и пароль пользователя
			const { email, password } = req.body;

			// поиск через findOne не существует ли в базе уже юзер с таким емейлом
			const candidate = await User.findOne({ email });

			// если существует то выходим из процесса с ошибкой 400
			if (candidate) {
				return res.status(400).json({ message: 'Такой пользователь уже зарегистрирован' })
			}
			// если не существует то хэшируем переданный пароль
			const hashedPassword = await bcrypt.hash(password, 12);

			// создаем пользователя по нашей схеме в ../models/User.js
			const user = new User({ email, password: hashedPassword });
			await user.save();

			// если все было ок вовзращаем во фронт 201 статус и сообщение
			res.status(201).json({ message: 'Пользователь создан' });

		} catch (error) {
			res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
		}
	}
);

// /api/auth/login
router.post(
	'/login',
	[
		check('email', 'Введите корректный email').normalizeEmail().isEmail(),
		check('password', 'Введите пароль').exists()
	],
	async (req, res) => {
		try {

			// методу validationResult() передается запрос в котором храняться необходимые данные для проверки (указаны выше в чеках)
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Неккоректные данные при входе в систему'
				});
			}

			const { email, password } = req.body;

			const user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ message: 'Пользователь не найден' })
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
			}

			const token = jwt.sign(
				{ userId: user.id },
				config.get('JWT_SECRET'),
				{ expiresIn: '1h' }
			)

			res.json({
				token,
				userId: user.id
			})
		} catch (error) {
			res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
		}
	}
);

export default router;