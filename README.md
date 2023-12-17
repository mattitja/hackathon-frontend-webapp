# Hau Drauf Game

## API model generation

```bash
npm install @openapitools/openapi-generator-cli -g
``````

```bash
openapi-generator-cli generate \
  -i ./backend.yaml \
  -o src/generated/whackend \
  -g typescript-fetch \
  --additional-properties=supportsES6=true,npmVersion=10.2.4,typescriptThreePlus=true
```

## Icons

Icons come from <https://tabler.io/icons>.
