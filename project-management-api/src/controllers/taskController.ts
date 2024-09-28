import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const createTask = async (req: Request, res: Response) => {
    const { title, description, projectId} = req.body;
    const userId = req.user?.id;

    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                projectId,
            },
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка при создании задачи' });
    }
};


export const getAllTasks = async (req: Request, res: Response) => {
    const { projectId } = req.params;

    try {
        const tasks = await prisma.task.findMany({
            where: { projectId: parseInt(projectId) },
        });
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Ошибка при получении задач" });
    }
};


export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, completed} = req.body;

    try {
        const updateTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                completed,
            },
        });
        res.status(200).json(updateTask);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Задача не найдена" });
    }
};


export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.task.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch(error) {
        console.log(error);
        res.status(404).json({ error: "Задача не найдена" });
    }
}