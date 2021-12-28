import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { chmodSync, readFileSync } from 'fs';
import { Model } from 'mongoose';
import { ProductDocument } from './schema';
const XlsxTemplate = require('xlsx-template');
const { createReadStream, createWriteStream } = require('fs');
const readLine = require('readline');
const stream = require('stream');
const readerByLine = require('line-by-line');
@Injectable()
export class ExportService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}
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

      for (let i = 1; i <= 100; i++) {
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

  async import() {
    try {
      // const instream = createReadStream(
      //   `${process.cwd()}/src/export/output/file.csv`,
      // );

      // const outstream = new stream();

      // const rl = readLine.createInterface(instream, outstream);

      // rl.on('line', async (line) => {
      //   const arr = line.split(',');

      //   if (arr[0] === 'id' || !line) {
      //     return;
      //   }

      //   if (count <= 1) {
      //     await this.productModel.create({
      //       id: arr[0],
      //       type: arr[1],
      //       tags: arr[2],
      //       title: arr[3],
      //     });
      //   }
      // });

      // rl.on('close', function () {
      //   console.log('have done');
      // });

      const rl = new readerByLine(
        `${process.cwd()}/src/export/output/file.csv`,
      );

      rl.on('error', function (err) {
        console.log(err);
      });

      rl.on('line', async (line) => {
        const arr = line.split(',');

        await this.productModel.create({
          id: arr[0],
          type: arr[1],
          tags: arr[2],
          title: arr[3],
        });
      });

      rl.on('end', function () {
        console.log('have done');
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
