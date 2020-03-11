# Spiky

A very simple Node, Express and [stream-transcoder-2](https://www.npmjs.com/package/stream-transcoder-2) based on-the-fly video transcoding server.

## API

```
GET /transform?input=[uri]&operations=[JSON list of operations to perform]
```

The API is not as simple as setting `width` and `height` like most other API, Spiky is a straightforward layer around `stream-transcoder-2` so the API very much minic the `stream-transcoder-2` parameters. To ensure type safety and nesting operations must be serialized with JSON. For example:

```
const operations = JSON.stringify(
  [
    { name: "format", params: ['flv'] },
    { name: "size", params: [320, 240] },
  ]
);
```


## Limitations

The following operations are authorized:

```
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
```

The code is really simple (the logic itself is less than 10 lines of code). Please take a look at it you need more information.