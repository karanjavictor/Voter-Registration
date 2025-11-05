import pool from '../config/db';
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';

type StaffRole = 'Administrator' | 'Clerk' | 'Supervisor';
type Gender = 'Male' | 'Female' | 'Rather not say';
type Constituency = 'nairobi' | 'Machakos' | 'Mombasa' | 'Kisumu' | 'Bungoma' | 'Isiolo' | 'Tana River';

interface Staff {
    firstName: string;
    surname: string;
    dateOfBirth: Date;
    gender: Gender;
    nationalIdNumber: string;
    constituency: Constituency;
    role: StaffRole;
    password: string;
    staffId: string;
}

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}

export const createStaff = async (req: Request, res: Response) => {
    try {
        const { firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency, role, password, staffId } = req.body;
        const hashedPassword = await hashPassword(password);
        const staff: Staff = { firstName, surname, dateOfBirth: new Date(dateOfBirth), gender, nationalIdNumber, constituency, role, password: hashedPassword, staffId: staffId };
        console.log(staff);
        const formattedDateOfBirth = staff.dateOfBirth.toISOString().split('T')[0];
        // Use staff.dateOfBirth (which is a Date object) instead of dateOfBirth (which is a string)
        const [result] = await pool.query('INSERT INTO staff (firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency, role, password, staff_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, surname, formattedDateOfBirth, gender, nationalIdNumber, constituency, role, hashedPassword, staffId]);
        console.log(result);
        res.status(201).json({ message: 'Staff created successfully', staff });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create staff', error });
    }
}

export const getAllStaff = async (_req: Request, res: Response) => {
    try {
        const [result] = await pool.query('SELECT * FROM staff');
        console.log(result);
        res.status(200).json({ message: 'Staff fetched successfully', staff: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get all staff', error });
    }
}