import { AmazonScrapperUseCase } from "@application/use-cases/scrapper/amazon-scrapper.use-case";
import { Controller, Get, Query, Inject, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Counter } from "prom-client";

function isValidUrl(url: string): boolean {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocolo
    '(www\\.)?' + // www
    '((([a-z\\d](?!-)|[a-z\\d](?!-)[a-z\\d-]{0,61}[a-z\\d])\\.)+[a-z]{2,6}|localhost|' + // domínio
    '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IP
    '[\\[a-f\\d]{1,4}(:[\\[a-f\\d]{1,4}){0,7}\\])' + // IPv6
    '(:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // caminho
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query
    '(\\#[-a-z\\d_]*)?$','i'); // fragmento
  return !!urlPattern.test(url);
}

@ApiTags('Amazon')
@Controller('amazon')
export class AmazonExtractProductController {
  constructor(
    private readonly amazonScrapperUseCase: AmazonScrapperUseCase,
    @Inject('AMAZON_EXTRACT_COUNTER') private readonly extractCounter: Counter,
  ) {}

  @Get('scrapper')
  @ApiOperation({ summary: 'Extrair produtos de uma URL do Amazon' })
  @ApiQuery({ name: 'url', required: true, description: 'URL do produto Amazon a ser extraído' })
  @ApiResponse({ status: 200, description: 'Lista de produtos extraídos' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  async handle(@Query('url') url: string) {
    if (!isValidUrl(url)) {
      throw new BadRequestException('URL inválida');
    }

    try {
      this.extractCounter.inc({ status: 'success' });
      const products = await this.amazonScrapperUseCase.execute(url);
      return products;
    } catch (error) {
      this.extractCounter.inc({ status: 'error' });
      throw new BadRequestException('Erro ao extrair produtos');
    }
  }
}
