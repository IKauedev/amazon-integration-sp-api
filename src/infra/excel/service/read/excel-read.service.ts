import { Injectable } from '@nestjs/common';
import { IProduct } from 'amazon-product-scrapper';
import { Workbook, Worksheet } from 'exceljs';

@Injectable()
export class ExcelReadService {
    constructor() {}

    async readDataFromExcel(filePath: string): Promise<any[]> {
        try {
            const workbook = new Workbook();
            await workbook.xlsx.readFile(filePath);
            
            const worksheet: Worksheet | undefined = workbook.getWorksheet(1);

            if (!worksheet) {
                throw new Error('Worksheet não encontrada no arquivo Excel.');
            }

            const data: IProduct[] = [];
            worksheet.eachRow((row, rowNumber) => {
                const rowData: any = {};
                row.eachCell((cell, colNumber) => {
                    rowData[`column${colNumber}`] = cell.value;
                });
                data.push(rowData);
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
}
