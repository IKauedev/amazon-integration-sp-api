import { ExcelWriteService } from '@infra/excel/service/write/excel-write.service';
import { Injectable } from '@nestjs/common';
import { AmazonProduct, IProduct } from 'amazon-product-scrapper';

@Injectable()
export class AmazonScrapperService {
  constructor(private readonly amazonScrapper: AmazonProduct, private readonly excelWriteService: ExcelWriteService) {}

  async scrapper(url: string): Promise<IProduct | null> {
    try {
      const products: IProduct | null = await this.amazonScrapper.getProduct(url, "pt-br");
      
      if (!products) {
        return null;
      }

      this.excelWriteService.writeDataToExcel([products!], "products");

      return products;
    } catch (error) {
      throw new Error(`Ocorreu um erro interno no servidor: ${error}`);
    }
  }
}
