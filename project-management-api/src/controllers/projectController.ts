import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getProjects = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const projects = await prisma.project.findMany({
            where: { userId },
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении проектов' });
    }
};



export const createProject = async (req: Request, res: Response) => {
    const { title, description } = req.body;

    if (!req.user) {
        res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        return;
    }

    const userId = req.user.id;

    try {
        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                userId,
            },
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании проекта' });
    }
};


export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!req.user) {
        res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        return;
    }

    try {
        const updatedProject = await prisma.project.update({
            where: { id: parseInt(id) },
            data: { 
                title,
                description,
            },
        });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(404).json({ error: 'Проект не найден' });
    }
};


export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
        res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        return;
    }

    try {
        await prisma.project.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Проект не найден' });
    }
};
