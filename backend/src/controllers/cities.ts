import { Request, Response } from "express";
import { pool } from '../config/db';

export const getCities = async(req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`Select id, name from cities order by name`);
        res.json(rows);
    } catch(error) {
        res.status(500).json({msg: 'Server Error', error});
    }
}