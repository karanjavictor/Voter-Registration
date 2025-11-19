import pool from '../config/db';
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';

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
const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}

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
  