import pool from '../config/db';
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

dotenv.config();


type StaffRole = 'Administrator' | 'Clerk' | 'Supervisor';
export type Gender = 'Male' | 'Female' | 'Rather not say';
export type Constituency = 'Nairobi' | 'Machakos' | 'Mombasa' | 'Kisumu' | 'Bungoma' | 'Isiolo' | 'Tana River';
type StaffStatus = 'Active' | 'Inactive';

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
const SECRET = process.env["JWT_SECRET"] as string;
const NODE_ENV = process.env["NODE_ENV"] ?? "development";



export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}
export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};


export const createStaff = async (req: Request, res: Response) => {
    try {
        const { firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency, role, password, staffId } = req.body;
        const hashedPassword = await hashPassword(password);
        const staff: Staff = { firstName, surname, dateOfBirth: new Date(dateOfBirth), gender, nationalIdNumber, constituency, role, password: hashedPassword, staffId: staffId };
        // Check if National ID already exists
        const [checkNationalIdNumber]: any = await pool.query(
            'SELECT * FROM staff WHERE nationalIdNumber = ?', 
            [nationalIdNumber]
        );
        
        if (checkNationalIdNumber.length > 0) {
           throw new Error("Staff with this National ID number already exists");
        }

        // Check if Staff ID already exists
        const [checkStaffId]: any = await pool.query(
            'SELECT * FROM staff WHERE staff_id = ?', 
            [staffId]
        );
        
        if (checkStaffId.length > 0) {
            throw new Error("Staff with this Staff ID already exists");
        }


        const formattedDateOfBirth = staff.dateOfBirth.toISOString().split('T')[0];
        await pool.query('INSERT INTO staff (firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency, role, password, staff_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, surname, formattedDateOfBirth, gender, nationalIdNumber, constituency, role, hashedPassword, staffId]);
        return res.status(201).json({ message: 'Staff created successfully', staff });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create staff' });
    }
}

export const getAllStaff = async (_req: Request, res: Response) => {
    try {
        const [result] = await pool.query('SELECT * FROM staff');
        return res.status(200).json({ message: 'Staff fetched successfully', staff: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to get all staff', error });
    }
}

export const updateStaff = async (req: Request, res: Response) => {
    try {
      const { nationalIdNumber, isActive, constituency, role } = req.body;
  
      // Validate required fields
      if (!nationalIdNumber) {
        throw new Error("National ID Number is required");
      }
  
      // 1. Fetch current staff state
      const [rows]: any = await pool.query(
        `SELECT isActive, constituency, role 
           FROM staff 
           WHERE nationalIdNumber = ?`,
        [nationalIdNumber]
      );
  
      if (!rows || rows.length === 0) {
        throw new Error("Staff member not found");
      }
  
      const currentStaff = rows[0];
  
      // 2. Validate isActive if provided
      if (isActive !== undefined) {
        if (isActive !== "Active" && isActive !== "Inactive") {
          throw new Error("isActive must be either 'Active' or 'Inactive'");
        }
      }
  
      // 3. Prepare fields for update
      const updatedIsActive: StaffStatus = isActive !== undefined ? isActive : currentStaff.isActive;
      const updatedConstituency: Constituency = constituency !== undefined ? constituency : currentStaff.constituency;
      const updatedRole: StaffRole = role !== undefined ? role : currentStaff.role;
  
      // 4. Perform update
      await pool.query(
        `UPDATE staff 
           SET 
             isActive = ?, 
             constituency = ?, 
             role = ?
           WHERE nationalIdNumber = ?`,
        [updatedIsActive, updatedConstituency, updatedRole, nationalIdNumber]
      );
  
      return res.status(201).json({
        message: "Staff updated successfully",
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Failed to update staff",
      });
    }
  };

  export const loginStaff = async (req: Request, res: Response) => {
    try {
      const { staffId, password } = req.body;
  
      // 1. Validate input
      if (!staffId || !password) {
        throw new Error("Staff ID and password are required");
      }
  
      // 2. Fetch staff by staffId
      const [rows]: any = await pool.query(
        `SELECT staff_id, firstName, surname, password, role, isActive 
         FROM staff 
         WHERE staff_id = ?`,
        [staffId]
      );
  
      if (!rows || rows.length === 0) {
        throw new Error("Invalid staff ID or password");
      }
  
      const staff = rows[0];
  
      // 3. Check if account is active
      if (!staff.isActive) {
        throw new Error("Your account is not active");
      }
  
      // 4. Compare passwords
      const passwordMatch = await comparePassword(password, staff.password);
      if (!passwordMatch) {
        throw new Error("Invalid staff ID or password");
      }
  
      // 5. Generate JWT (expires in 1 day)
      const token = jwt.sign(
        {
          staffId: staff.staff_id,
          role: staff.role,
        },
        SECRET,
        { expiresIn: "1d" }
      );
  
      // 6. Send token in secure cookie
      res.cookie("staff_token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production", // only HTTPS in production
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      // 7. Response
      return res.status(200).json({
        message: "Logged in successfully",
        staff: {
          role: staff.role,
          staffId: staff.staff_id,
        },
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Login attempt failed",
      });
    }
  };

  
  