# ease-store-app

EaseStore App is a mobile app for EaseStore, providing merchandise and order management.

Developed with Vue + Vite + Capacitorjs, and [Vant 4](https://github.com/youzan/vant) + [UnoCSS](https://github.com/unocss/unocss).

Barcode scanning powered by MLKit with [@capacitor-mlkit](https://github.com/capawesome-team/capacitor-mlkit/)

FOR BACKEND SERVER, PLEASE REFER TO [ease-store-server](https://github.com/MengLuoRJ/ease-store-server)

## Project Setup

```sh
pnpm install
```

### Setting Project

Edit config files depending on your requirements to setup the project.

- `.env`: Environment Variables, copy `.env.example` to `.env` and edit it based on `env.d.ts`
- `vite.config.ts`: Vite Config
- `uno.config.ts`: UnoCSS Config
- `capacitor.config.ts`: Capacitor Config
  
**DO NOT USE THE SETTINGS IN THE FILE, CHANGE THEM TO YOUR OWN**

### Setup Capacitorjs

```sh
pnpm cap init
```


```sh
# To add Android
npx cap add android

# To add iOS, install the @capacitor/ios package
pnpm add @capacitor/ios
npx cap add ios 
```


### Sync Code for Capacitorjs

```sh
pnpm sync
```

### Build and Sync Code for Capacitorjs

```sh
pnpm build:sync
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```


### Open Project in Android Studio

```sh
pnpm open:android
```
