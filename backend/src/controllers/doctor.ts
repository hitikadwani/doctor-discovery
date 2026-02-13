import { Request, Response } from 'express';
import { pool } from '../config/db'

export const getDoctors = async (req: Request, res: Response) => {
   try {
    const { name, city, speciality, page = 1, limit = 10 } =req.query;
    const offset = (Number(page)-1)*Number(limit);

    let query = `Select d.* from doctor d inner join specialities s on d.speciality_id = s.id inner join cities c on c.id=d.city_id where 1=1  `;

    //const values: any [] = [];
    
    if(name) {
        query+= `AND d.name LIKE ${name}$`;
    }
    if(city) {
        query+= `AND d.city_id = ${city}`;
    }

    if(speciality) {
       query+= `AND d.speciality_id = ${speciality}`;
    }

    query += `LIMIT ${Number(limit)} OFFSET ${offset}`;
    const [rows] = await pool.query(query);

    res.json(rows);

   } catch (error) {
       res.status(500).json({msg: "Server Error:", error});
   }
};

export const getDoctorById = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query(`Update doctor set search_count = search_count+1 where id = ?`, [id]);
        //console.log("here1");
        const [rows]: any = await pool.query(
            `Select d.*, c.name as city_name, s.name as speciality_name from doctor d inner join cities c on d.city_id=c.id inner join specialities s on s.id=d.speciality_id where d.id = ?`, [id]);
        
            
        if(rows.length === 0) {
            res.json({msg: 'Doctor not found'});
        }
        //console.log("here");

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({msg: "Server Error:", error});
    }
};

export const createDoctor = async (req: Request, res: Response) => {
    try {
        const { name, gender, age, email, phone, city_id, speciality_id,institute_name, degree_name, YOE, consultation_fee, profile_picture } = req.body;

        const [result]: any = await pool.query(`Insert into doctor (name, gender, age, email, phone, city_id, speciality_id, institute_name, degree_name, YOE, consultation_fee, profile_picture) VALUES 
           (?,?,?,?,?,?,?,?,?,?,?,?)`, [name, gender,age, email, phone, city_id, speciality_id, institute_name, degree_name, YOE, consultation_fee, profile_picture]);

        res.status(201).json({msg: "Doctor created Successfully", doctorId: result.insertId});

        
    } catch(error) {
        res.status(500).json({msg: 'Server Error:', error});
    }
}