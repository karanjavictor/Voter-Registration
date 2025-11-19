import pool from '../config/db';
import { type Request, type Response } from 'express';


export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        // Build date filter condition
        let dateFilter = '';
        let dateParams: any[] = [];
        let formattedStartDate: string | undefined;
        let formattedEndDate: string | undefined;

        if (startDate && endDate) {
            formattedStartDate = new Date(startDate as string).toISOString().split('T')[0];
            formattedEndDate = new Date(endDate as string).toISOString().split('T')[0];
            dateFilter = 'WHERE created_at BETWEEN ? AND ?';
            dateParams = [formattedStartDate, formattedEndDate];
        }

        // Build deceased filter (uses updated_at)
        let deceasedDateFilter = '';
        let deceasedDateParams: any[] = [];

        if (startDate && endDate && formattedStartDate && formattedEndDate) {
            deceasedDateFilter = 'AND updated_at BETWEEN ? AND ?';
            deceasedDateParams = [formattedStartDate, formattedEndDate];
        }

        // 1. Get total number of staff
        const [totalStaffResult]: any = await pool.query(
            `SELECT COUNT(*) as totalStaff FROM staff ${dateFilter}`,
            dateParams
        );
        const totalStaff = totalStaffResult[0].totalStaff;

        // 2. Get total number of deceased voters
        const [totalDeceasedResult]: any = await pool.query(
            `SELECT COUNT(*) as totalDeceased FROM voters WHERE is_deceased = 1 ${deceasedDateFilter}`,
            deceasedDateParams
        );
        const totalDeceased = totalDeceasedResult[0].totalDeceased;

        // 3. Get total voter registration
        const [totalVotersResult]: any = await pool.query(
            `SELECT COUNT(*) as totalVoters FROM voters ${dateFilter}`,
            dateParams
        );
        const totalVoters = totalVotersResult[0].totalVoters;

        // 4. Get constituency analytics for voters
        const [constituencyData]: any = await pool.query(
            `SELECT 
                constituency, 
                COUNT(*) as value 
             FROM voters 
             ${dateFilter}
             GROUP BY constituency 
             ORDER BY constituency`,
            dateParams
        );

        // Map constituency data to match your desired format
        const colors = [
            '#3B82F6', '#DC10B6', '#13475c', '#FF0000', 
            '#008000', '#8D6F64', '#FFA500', '#9333EA',
            '#F59E0B', '#EF4444'
        ];

        const constituencyAnalytics = constituencyData.map((item: any, index: number) => ({
            id: index + 1,
            name: item.constituency,
            value: item.value,
            color: colors[index % colors.length]
        }));

        // Prepare response with optional filters
        const response: any = {
            success: true,
            data: {
                totalStaff,
                totalDeceased,
                totalVoters,
                constituencyAnalytics
            }
        };

        // Only include filters in response if they were provided
        if (formattedStartDate && formattedEndDate) {
            response.filters = {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            };
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error('Analytics Error:', error);
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Failed to retrieve analytics' 
        });
    }
};