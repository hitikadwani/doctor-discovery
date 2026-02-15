import { Request, Response } from 'express';
import { pool } from '../config/db';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '../../uploads');

export const getDoctors = async (req: Request, res: Response) => {
   try {
    const { name, city, speciality, page = 1, limit = 10 } =req.query;
    const offset = (Number(page)-1)*Number(limit);

    let cityId: number | null = null;
    if(city && typeof city=== 'string') {
       const [cityRows]: any = await pool.query(`Select id from cities where name =?`, [city.trim()]);
       if(cityRows.length>0) {
        cityId=cityRows[0].id;
       }
       if(cityId===null) {
        return res.json([]);
       }
    }

    let specialityId: number | null = null;
    if(speciality && typeof speciality=== 'string') {
        const [specialityRows]: any = await pool.query('Select id from specialities where name =?', [speciality.trim()]);
        if(specialityRows.length>0) {
            specialityId=specialityRows[0].id;
        }
        if(specialityId===null) {
            return res.json([]);
        }
    }

    let query = `Select d.*, c.name as city_name,s.name as speciality_name from doctor d inner join specialities s on d.speciality_id = s.id inner join cities c on c.id=d.city_id where 1=1  `;

    
    
    if(name) {
        const safeName = String(name).replace(/'/g, "''");
        query += ` AND d.name LIKE '%${safeName}%'`;
    }
    if(cityId) {
        query+= `AND d.city_id = ${cityId}`;
    }

    if(specialityId) {
       query+= `AND d.speciality_id = ${specialityId}`;
    }

    query += ` LIMIT ${Number(limit)} OFFSET ${offset}`;
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
        const { name, gender, age, email, phone, city, speciality, institute_name, degree_name, YOE, consultation_fee } = req.body;
        let profile_picture = req.body.profile_picture;
         console.log("creating doctor");
         let city_id: number | null = null;
         if(city && typeof city === 'string') {
            console.log("city_fetching");
            const [cityRows]: any = await pool.query(`Select id from cities where name = ?`, [city.trim()]);
            if(cityRows.length>0) {
                city_id=cityRows[0].id;
            }
            console.log("city_id", city_id);
            if(city_id===null) {
                return res.status(400).json({msg: 'Invalid city name'});
            }
         }
         
         let speciality_id: number | null = null;
         if(speciality && typeof speciality === 'string') {
            const [specialityRows]: any = await pool.query(`Select id from specialities where name = ?`, [speciality.trim()]);
            if(specialityRows.length>0) {
                speciality_id=specialityRows[0].id;
            }
            if(speciality_id===null) {
                return res.status(400).json({msg: 'Invalid speciality name'});
            }
         }

          if (profile_picture && typeof profile_picture === 'string' && profile_picture.match(/^data:image\/\w+;base64,/)) {
            const match = profile_picture.match(/^data:image\/(\w+);base64,(.+)$/);
            if (match) {
              const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
              const filename = `doctor-${Date.now()}.${ext}`;
              if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
              fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(match[2] as any, 'base64'));
              profile_picture = `/uploads/${filename}`;
            }
          }

        const [result]: any = await pool.query(`Insert into doctor (name, gender, age, email, phone, city_id, speciality_id, institute_name, degree_name, YOE, consultation_fee, profile_picture) VALUES 
           (?,?,?,?,?,?,?,?,?,?,?,?)`, [name, gender,age, email, phone, city_id, speciality_id, institute_name, degree_name, YOE, consultation_fee, profile_picture]);

        res.status(201).json({msg: "Doctor created Successfully", doctorId: result.insertId});

        
    } catch(error) {
        res.status(500).json({msg: 'Server Error:', error});
    }
}