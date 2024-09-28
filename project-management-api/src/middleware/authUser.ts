import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error("Token отсутствует");
        res.status(401).json({ error: 'Требуется аутентификация' });
        return;
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key') as { userId: number };
        console.log("Decoded JWT: ", decoded);

        const userId = decoded.userId;
        if (!userId) {
            console.error("ID пользователя не найден в токене.");
            res.status(401).json({ error: 'ID пользователя не найден в токене' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            console.error("Пользователь не найден: ", userId);
            res.status(401).json({ error: 'Пользователь не найден' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Ошибка при аутентификации: ", error);
        res.status(401).json({ error: 'Не удалось аутентифицировать'});
        return;
    }
};
