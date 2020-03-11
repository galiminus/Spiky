const StreamTranscoder = require('stream-transcoder-2');
const Express = require('express');

const AUTHORIZED_OPERATIONS = [
  "videoCodec",
  "videoBitrate",
  "fps",
  "format",
  "maxSize",
  "minSize",
  "size",
  "aspectRatio",
  "audioCodec",
  "sampleRate",
  "channels",
  "audioBitrate",
  "custom"
];

const app = Express()
  .get('/transform', ({ query: { input, operations = '[{ "name": "format", "params": ["mp4"] }]' }}, res) => {
    let pipeline = new StreamTranscoder({ source: input });

    for ({ name, params } of JSON.parse(operations))
      if (AUTHORIZED_OPERATIONS.indexOf(name) >= 0) {
        pipeline = pipeline[name](...params);
      }

    pipeline.stream().pipe(res);
  })
  .listen(process.env.PORT || 3000);

module.exports = app;
