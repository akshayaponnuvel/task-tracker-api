import { Response } from "express";
import Task from "../models/task.model";
import redisClient from "../config/redis";
import { AuthRequest } from "../middleware/auth.middleware";

const getCacheKey = (userId: string) => `tasks:${userId}`;

// ✅ Helper to invalidate cache
const invalidateTaskCache = async (userId: string) => {
  try {
    await redisClient.del(getCacheKey(userId));
    console.log("Cache invalidated");
  } catch (err) {
    console.error("Redis delete error:", err);
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const cacheKey = getCacheKey(userId);

    let cachedTasks = null;

    // ✅ Check cache first
    try {
      cachedTasks = await redisClient.get(cacheKey);
    } catch (err) {
      console.error("Redis get error:", err);
    }

    if (cachedTasks) {
      console.log("Cache HIT");
      return res.json(JSON.parse(cachedTasks));
    }

    console.log("Cache MISS");

    const tasks = await Task.find({ owner: userId }).sort({ createdAt: -1 });

    // ✅ Store in cache (5 minutes)
    try {
      await redisClient.set(cacheKey, JSON.stringify(tasks), {
        EX: 300
      });
    } catch (err) {
      console.error("Redis set error:", err);
    }

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const task = await Task.create({
      ...req.body,
      owner: userId
    });

    await redisClient.del(`tasks:${userId}`);

    // ❌ Invalidate cache
    await invalidateTaskCache(userId);

    res.status(201).json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: id, owner: userId },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await redisClient.del(`tasks:${userId}`);

    // ❌ Invalidate cache
    await invalidateTaskCache(userId);

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      owner: userId
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await redisClient.del(`tasks:${userId}`);

    // ❌ Invalidate cache
    await invalidateTaskCache(userId);

    res.json({ message: "Task deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
