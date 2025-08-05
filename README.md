# InvernSpirit Frontend

The frontend for the [Invern Spirit](https://www.invernspirit.com/) e-commerce website, built with SvelteKit.

## Prerequisites

- [Bun](https://bun.sh/) (version 1.2.19 or higher)
- [Backend](https://github.com/manuelfesantos/invern-be)

## Development

### Install Dependencies

Run the following command to install all required dependencies:

```bash
bun install
```

### Set Up Environment Variables

Refer to the [.env.example](.env.example) file.

Create a `.env.local` file with the same variables.

```bash
cp .env.example .env.local
```

Additionally, you'll need a `.dev.vars` file that only contains the private variables portion of the [.env.example](.env.example) file.

```bash
cp .env.example .dev.vars
```

### Start the Development Server

- Run the dev and local scripts from the package.json file:
  - Use `bun run dev:local` to start both the development server and the functions local server.

### Connect to the Backend

Provide the backend host followed by `/public/countries` to the `BE_HOST` environment variable. You can run the [backend](https://github.com/manuelfesantos/invern-be) server locally.

### Main Commands

The following commands are available for development tasks:

- `bun run dev`: Start the development server with hot reload.
- `bun run dev:local`: Start the development server and functions local server with hot reload.
- `bun run build`: Build the application for production deployment.
- `bun run preview`: Preview the built application locally.
- `bun run preview:local`: Preview the built application locally, including running the functions local server.
- `bun run build:preview`: Build and preview the application in a single step.
- `bun run build:preview:local`: Build and preview the application in a single step, including running the functions local server.
- `bun run local`: Start the Cloudflare functions local server (backend-for-frontend, or BFF).
- `bun run check`: Perform Svelte compiler checks and TypeScript validations.
- `bun run lint`: Lint code with ESLint.
- `bun run format`: Format code with Prettier .
- `bun run format:lint`: Format code with Prettier and fix lint errors.
