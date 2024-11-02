import { Injectable } from '@nestjs/common';
import { IProduct } from 'amazon-product-scrapper';
import { Column, Workbook } from 'exceljs';

@Injectable()
export class ExcelWriteService {
    constructor() {}

    async writeDataToExcel(data: IProduct[], fileName: string): Promise<void> {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('amazon-product');

            const headers = this.generateHeader();
            worksheet.columns = headers as Partial<Column>[];

            data.forEach(item => {
                worksheet.addRow(this.mapDataToRow(item));
            });

            await workbook.xlsx.writeFile(fileName.concat('.xlsx'));
        } catch (error) {
            throw new Error(`Erro ao gerar a planilha: ${error}`)
        }
    }

    private generateHeader(): Partial<Column>[] {
        return [
            { header: 'ASIN', key: 'asin', width: 20 },
            { header: 'Título', key: 'title', width: 30 },
            { header: 'Detalhes', key: 'details', width: 30 },
            { header: 'Link', key: 'link', width: 40 },
            { header: 'Imagem', key: 'image', width: 30 },
            { header: 'Moeda', key: 'currency', width: 10 },
            { header: 'Desconto (%)', key: 'discountPercent', width: 15 },
            { header: 'Quantidade', key: 'quantity', width: 10 },
        ];
    }

    private mapDataToRow(item: IProduct): { [key: string]: any } {
        return {
            asin: item.asin ?? '-',
            title: item.title ?? '-',
            details: item.details ?? '-',
            link: item.link ?? '-',
            image: item.image ?? '-',
            currency: item.price?.currency ?? '-',
            discountPercent: item.price?.discountPercent ?? '-',
            quantity: item.price?.quantity ?? '-',
        };
    }
}
