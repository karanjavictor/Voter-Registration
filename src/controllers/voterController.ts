import pool from "../config/db";
import { type Request, type Response } from "express";
import type { Gender, Constituency } from "../controllers/staffController";

interface Voter {
  id?: number;
  firstName: string;
  surname: string;
  dateOfBirth: Date;
  gender: Gender;
  nationalIdNumber: string;
  constituency: Constituency;
  isDeceased?: Boolean;
  deathCertificateNumber?: "";
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
    console.log(checkNationalIdNumber);
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
      `SELECT id, firstName, surname, dateOfBirth, gender, nationalIdNumber, constituency, is_deceased, death_certificate_number FROM voters`
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "No voters found",
        voters: [],
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
        isDeceased: voterRow.is_deceased,
        deathCertificateNumber: voterRow.death_certificate_number,
      };
    });

    return res.status(200).json({
      message: "Voters found",
      voters,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch voters",
    });
  }
};

export const updateVoter = async (req: Request, res: Response) => {
  try {
    const {
      isDeceased,
      constituency,
      deathCertificateNumber,
      nationalIdNumber,
    } = req.body;

    // Validate required fields
    if (!nationalIdNumber) {
      throw new Error("National ID Number is required");
    }

    // 1. Fetch current voter state
    const [rows]: any = await pool.query(
      `SELECT is_deceased, death_certificate_number FROM voters WHERE nationalIdNumber = ?`,
      [nationalIdNumber]
    );

    if (!rows || rows.length === 0) {
      throw new Error("Voter not found");
    }

    const currentVoter = rows[0];

    // 2. Prevent setting isDeceased back to false
    if (currentVoter.isDeceased === 1 && isDeceased === false) {
      throw new Error("You cannot mark a deceased voter as alive");
    }

    // 3. If isDeceased = true, require deathCertificateNumber
    if (
      isDeceased === true &&
      (!deathCertificateNumber || deathCertificateNumber.trim() === "")
    ) {
      throw new Error(
        "Death certificate number is required when voter is deceased"
      );
    }

    // 4. Update voter
    await pool.query(
      `UPDATE voters 
         SET 
           is_deceased = ?, 
           death_certificate_number = ?, 
           constituency = ?
         WHERE nationalIdNumber = ?`,
      [
        isDeceased,
        isDeceased ? deathCertificateNumber : null, // Clear if alive
        constituency,
        nationalIdNumber,
      ]
    );

    return res.status(200).json({
      message: "Voter updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to update voter",
    });
  }
};
