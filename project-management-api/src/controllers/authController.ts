import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { body, validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


export const validateRegistration = [
    body('email').isEmail().withMessage('Введите действительный email'),
    body('password').isLength({ min: 6}).withMessage('Пароль должен быть не менее 6 символов'),
];


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
  
    const { email, password, name } = req.body;
  
    try {

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        return;
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
      
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
  
      res.status(201).json({ message: 'Пользователь создан', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error });
    }
  };



export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Неверный email или пароль' });
            return;
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Неверный email или пароль' });
            return;
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Успешный вход', token: token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
};
