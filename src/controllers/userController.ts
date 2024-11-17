import {Request, Response} from 'express';
import {User} from "../models/users";
import xlsx from 'xlsx';
import async from 'async';
import dayjs from 'dayjs';

const importFile = async(req:Request, res:Response) => {
    try {
        const filePath = req.file?.path; // Getting the file path from request
        
        const workbook = xlsx.readFile(filePath?filePath:"");   // Reading the excel file using xlsx
        const sheetName = workbook.SheetNames[0]; // Creating a sheetbook
        const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Converting the sheet into a json object

        // Async function to process one row at a time (using async.eachSeries) and store it to database
        await new Promise((resolve, reject) => {
            async.eachSeries(
                data,
                async(row: any, cb) => {
                    try {
                        // Check if the email already exists in the database for eliminating duplicate row
                        const existingUser = await User.findOne({ email: row["Email"] });

                        if (existingUser) {
                            console.log(`Skipping duplicate email: ${row["Email"]}`);
                            return cb(); // Skip this row and proceed to the next
                        }
                        
                        let rawdob = row["Date of Birth"];
                        // Check if the date is read as number
                        if(typeof rawdob === "number"){
                            rawdob = dayjs(new Date((row["Date of Birth"] - 25569) * 86400 * 1000)).format("YYYY-MM-DD");   // Change the format from Excel serial format to Javascript date
                        }else{
                            rawdob = dayjs(row["Date of Birth"], "DD MMM YYYY").format("YYYY-MM-DD");
                        }
                        
                        // Creating a database schema object for each row
                        const user = new User({
                            name: row["Name of the Candidate"],
                            email: row["Email"],
                            mobile: row["Mobile No."],
                            dob: rawdob,
                            yoe: row["Work Experience"],
                            resumeTitle: row["Resume Title"],
                            currentLocation: row["Current Location"],
                            postalAddress: row["Postal Address"],
                            currentEmployer: row["Current Employer"],
                            currentDesignation: row["Current Designation"],
                        });
                        await user.save();  // Saving the user data in mongoDB
                        cb();   // Callback to proceed for next row
                    } catch (error) {
                        console.error(`Error processing row: ${JSON.stringify(row)}`, error);
                    }
                },(err) => {
                    if(err) {
                        console.error("Error during file processing", err);
                        return reject(err);
                        
                    }
                    resolve(null);
                }
            );
        });


        res.send({status:200, success:true, body:req.params})   // API response for successful upload
    } catch (error) {
        console.error("Error importing file: " + error);
        
        res.send({status:400, success:false, body:req.body})    // API response for failed upload
    }
};

module.exports = {importFile};