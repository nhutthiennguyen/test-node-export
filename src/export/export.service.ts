import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { readFileSync } from 'fs';
import { Readable } from 'stream';
var xlsx = require('node-xlsx');
const XlsxTemplate = require('xlsx-template');
const { createReadStream, createWriteStream } = require('fs');
const csvWriter = require('csv-write-stream');
import { transform } from 'stream-transform';
const FileDownload = require('js-file-download');
@Injectable()
export class ExportService {
  constructor() {}
  async error429() {
    for (let i = 1; i <= 20; i++) {
      try {
        const data = await axios.get(
          'https://apis.haravan.com/com/products.json?page=1',
          {
            headers: {
              Authorization: `Bearer 7BBF09143DDCBA01A5F39FB4BD819713968036FC6C8AED78BE63050C7A744CD9`,
            },
          },
        );
      } catch (error) {
        console.log(error.response.headers);
      }
    }
  }

  async updateWith429() {
    try {
      // const data = [];
      // const filePath = `${process.cwd()}/src/export/update.xlsx`;
      // const obj = xlsx.parse(filePath);
      // for (const x of obj[0].data) {
      //   data.push({
      //     title: 'This',
      //     product_type: 'Type',
      //     tags: x[1],
      //   });
      // }
      // for (const x of data) {
      //   await axios.post(
      //     'https://apis.haravan.com/com/products.json',
      //     {
      //       product: x,
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer 7BBF09143DDCBA01A5F39FB4BD819713968036FC6C8AED78BE63050C7A744CD9`,
      //       },
      //     },
      //   );
      // }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async export(): Promise<Buffer> {
    try {
      //export all excel file
      let items = [];

      const filePath = `${process.cwd()}/src/export/template.xlsx`;

      for (let i = 1; i <= 30; i++) {
        const rs = await this.getData(
          `https://apis.haravan.com/com/products.json?page=${i}`,
          '7BBF09143DDCBA01A5F39FB4BD819713968036FC6C8AED78BE63050C7A744CD9',
        );

        items = items.concat(rs.products);
      }

      const temp = readFileSync(filePath, 'binary');

      const values = {
        data: items.map((x) => ({
          id: x.id,
          type: x?.product_type,
          tags: x?.tags,
          title: x?.title,
        })),
      };

      const template = new XlsxTemplate(temp);

      template.substitute(1, values);

      const buffer = template.generate({ type: 'nodebuffer' });

      return buffer;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async stream() {
    try {
      //const file = [];
      const stream = createWriteStream(
        `${process.cwd()}/src/export/output/file.csv`,
      );

      stream.write(`id,  type,  tags,  title \n`);

      for (let i = 1; i <= 20; i++) {
        // const rs = await this.getData(
        //   `https://apis.haravan.com/com/products.json?page=${i}`,
        //   '7BBF09143DDCBA01A5F39FB4BD819713968036FC6C8AED78BE63050C7A744CD9',
        // );
        // const transformer = transform(function (data) {
        //   data.push(data.shift());
        //   return data;
        // });
        // transformer.on('readable', function () {
        //   let row;
        //   while ((row = transformer.read()) !== null) {
        //     file.push(row);
        //   }
        // });
        // transformer.on('error', function (err) {
        //   console.error(err.message);
        // });
        // transformer.write(rs.products.map((x) => x.id));
        // transformer.end();

        const rs = await axios.get(
          `https://apis.haravan.com/com/products.json?page=${i}`,
          {
            headers: {
              Authorization: `Bearer 7BBF09143DDCBA01A5F39FB4BD819713968036FC6C8AED78BE63050C7A744CD9`,
            },
          },
        );

        rs.data.products.forEach((x) => {
          const s =
            x.id +
            ',' +
            x?.product_type +
            ',' +
            x?.tags +
            ',' +
            x?.title +
            '\n';
          stream.write(s);
        });
      }
      stream.end();

      return 'write success';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getData(url, token) {
    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  }
}
