# docker-nsfwjs

### Features ✨

- ℹ️ Return predictions for `Neutral`, `Drawing`, `Sexy`, `Hentai` and `Porn`
- 🎯 Pretty accurate (~93%)
- 🖼️ Supports different image formats
- ⚡ 250ms to make predictions to a single image

### About 🗞️

A Docker REST API for NSFW detection with [NSFWJS](https://github.com/infinitered/nsfwjs). Hard-fork of [andresribeiro/nsfwjs-docker](https://github.com/andresribeiro/nsfwjs-docker), which has the following goals:
- More standard tooling (npm instead of pnpm, no git hooks, tsc instead of swc)
- Slimmer deployment image + repo (models not in repo, more stages in docker build)

### Installation ⚙️

```shell
docker run -p 8080:8080 -d --name nsfwjs ghcr.io/holzmaster/nsfwjs:latest
```

If you are deploying in production, you will probably want to pass the `--restart always` flag to start the container whenever the server restarts

### Usage 🔨

#### One image, multipart/form-data

`POST` request to `/single/multipart-form` sending an image in the `content` field

```json
{
  "prediction": {
    "neutral": 0.9992233514785767,
    "drawing": 0.0006749277818016708,
    "porn": 0.00004637416350306012,
    "sexy": 0.000037574754969682544,
    "hentai": 0.000017801607100409456
  }
}
```

#### Multiple images, multipart/form-data

`POST` request to `/multiple/multipart-form` sending images in the `contents` field

```json
{
  "predictions": [
    {
      "neutral": 0.9992233514785767,
      "drawing": 0.0006749277818016708,
      "porn": 0.00004637416350306012,
      "sexy": 0.000037574754969682544,
      "hentai": 0.000017801607100409456
    },
    {
      "neutral": 0.9992233514785767,
      "drawing": 0.0006749277818016708,
      "porn": 0.00004637416350306012,
      "sexy": 0.000037574754969682544,
      "hentai": 0.000017801607100409456
    }
  ]
}
```
