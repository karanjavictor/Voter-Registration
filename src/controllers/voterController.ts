import pool from "../config/db";
import { type Request, type Response } from "express";
import type { Gender, Constituency } from "../controllers/staffController";

interface Voter {
    id?: number
  firstName: string;
  surname: string;
  dateOfBirth: Date;
  gender: Gender;
  nationalIdNumber: string;
  constituency: Constituency;
  isDeceased?: Boolean;
}

export const registerVoter = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      surname,
      dateOfBirth,
      gender,
      nationalIdNumber,
      constituency,
    } = req.body;
    const voter: Voter = {
      firstName,
      surname,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      nationalIdNumber,
      constituency,
    };
    console.log(voter);
    const [checkNationalIdNumber]: any = await pool.query(
      "SELECT * FROM voters WHERE nationalIdNumber = ?",
      [nationalIdNumber]
    );
    console.log(checkNationalIdNumber)
    if (checkNationalIdNumber.length > 0) {
      throw new Error("Voter with this National ID number already exists");
    }
    const formattedDateOfBirth = voter.dateOfBirth.toISOString().split("T")[0];
    const [result] = await pool.query(
      "INSERT INTO voters (firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency) VALUES (?, ?, ?, ?, ?, ?)",
      [
        firstName,
        surname,
        formattedDateOfBirth,
        gender,
        nationalIdNumber,
        constituency,
      ]
    );
    console.log(result);
    res.status(201).json({ message: "Voter registered successfully", voter });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to register voter",
    });
  }
};

export const checkVoter = async (req: Request, res: Response) => {
  try {
    const { nationalIdNumber, dateOfBirth } = req.body;

    // Normalize input date to match MySQL's DATE format
    const formattedDateOfBirth = new Date(dateOfBirth)
      .toISOString()
      .split("T")[0];

    // Run query
    const [rows]: any = await pool.query(
      `SELECT firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency 
             FROM voters 
             WHERE nationalIdNumber = ? AND dateOfBirth = ?`,
      [nationalIdNumber, formattedDateOfBirth]
    );

    // MySQL returns an array, so check if we got results
    if (!rows || rows.length === 0) {
      throw new Error("Voter not found");
    }

    const voterRow = rows[0];

    // Format the date from MySQL (which is usually a JS Date object)
    const formattedDate =
      voterRow.dateOfBirth instanceof Date
        ? voterRow.dateOfBirth.toISOString().split("T")[0]
        : voterRow.dateOfBirth;

    const voter: Voter = {
      firstName: voterRow.firstName,
      surname: voterRow.surname,
      dateOfBirth: formattedDate,
      gender: voterRow.gender,
      nationalIdNumber: voterRow.nationalIdNumber.toString(),
      constituency: voterRow.constituency,
    };

    return res.status(200).json({
      message: "Voter found",
      voter,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to check voter details",
    });
  }
};

export const getAllVoters = async (_req: Request, res: Response) => {
    try {
      // Run query
      const [rows]: any = await pool.query(
        `SELECT id, firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency, is_deceased FROM voters`
      );
      
      if (!rows || rows.length === 0) {
        return res.status(404).json({
          message: "No voters found",
          voters: []
        });
      }
  
      // Map all rows to Voter objects
      const voters: Voter[] = rows.map((voterRow: any) => {
        // Format the date from MySQL (which is usually a JS Date object)
        const formattedDate =
          voterRow.dateOfBirth instanceof Date
            ? voterRow.dateOfBirth.toISOString().split("T")[0]
            : voterRow.dateOfBirth;
  
        return {
            id: voterRow.id,
          firstName: voterRow.firstName,
          surname: voterRow.surname,
          dateOfBirth: formattedDate,
          gender: voterRow.gender,
          nationalIdNumber: voterRow.nationalIdNumber.toString(),
          constituency: voterRow.constituency,
          isDeceased: voterRow.is_deceased
        };
      });
      console.log(voters)
  
      return res.status(200).json({
        message: "Voters found",
        count: voters.length,
        voters,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch voters",
      });
    }
  };
