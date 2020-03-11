const request = require('supertest')
const binaryParser = require('superagent-binary-parser');
const app = require('../index')
const Qs = require('qs');
const StreamTranscoder = require('stream-transcoder-2');
const { Readable } = require('stream');
const { writeFileSync, unlinkSync } = require('fs');
const { execSync } = require('child_process');


const getTransform = (input, operations) => {
  const path = "/transform?" + Qs.stringify({ input, operations: JSON.stringify(operations) });

  return (
    request(app)
      .get(path)
      .parse(binaryParser)
      .buffer()
  );
}

const inputPath = "http://techslides.com/demos/sample-videos/small.mp4";

const getFormatFromRes = (res) => {
  const outputPath = '/tmp/_spiky-test-result' + Math.random() + '.mp4';

  writeFileSync(outputPath, res.body);
  const format = JSON.parse(execSync("ffprobe -v quiet -print_format json -show_format -show_streams " + outputPath));
  unlinkSync(outputPath);

  return (format);
}

describe('Transform Endpoint', () => {
  it('should not change anything', async () => {
    const res = await getTransform(inputPath)

    expect(res.statusCode).toEqual(200)
    const format = getFormatFromRes(res);
    const stream = format.streams.find((stream) => stream.codec_name === 'h264');

    expect(stream.width).toEqual(560)
    expect(stream.height).toEqual(320)
  });

  it('should resize and format', async () => {
    const res = await getTransform(
      inputPath,
      [
        { name: "format", params: ['flv'] },
        { name: "size", params: [320, 240] },
      ]
    )

    expect(res.statusCode).toEqual(200)
    const format = getFormatFromRes(res);
    const stream = format.streams.find((stream) => stream.codec_name === 'flv1');

    expect(stream.width).toEqual(320)
    expect(stream.height).toEqual(240)
  });
})

afterEach(() => app.close());
