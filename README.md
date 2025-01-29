# InvernSpirit Frontend

The frontend for the [InvernSpirit](https://www.invernspirit.com/) e-commerce website, built with SvelteKit.

## Prerequisites

- [Bun](https://bun.sh/) (version 1.2.0 or higher)

## Development

### Install Dependencies

Run the following command to install all required dependencies:

```bash
bun install
```

### Set Up Environment Variables

Refer to the [.env.example](.env.example) file.
Create a `.env.local` file with the same variables.

Additionally, create a `.dev.vars` file with the following variables:

```.dotenv
BE_HOST=
BE_ID_KEY=
BE_ID_VALUE=
BE_SECRET_KEY=
BE_SECRET_VALUE=
```

These variables align with the "Private Variables" section of the [.env.example](.env.example) file. They are required for configuring Cloudflare functions.

### Start the Development Server

- Run the dev and local scripts from the package.json file:
  - Use bun run dev to start the development server.
  - If VITE_RUN_LOCAL_ON_START is not set to true in your `.env.local` file, run bun run local manually to start the BFF.

### Connect to the Backend

- Either run the [backend](https://github.com/manuelfesantos/invern-be) server locally or provide the backend's URL in the `.env.local` file using the BE_HOST variable.

### Main Commands

The following commands are available for development tasks:

- `bun run dev`: Start the development server with hot reload.
- `bun run build`: Build the application for production deployment.
- `bun run preview`: Preview the built application locally.
- `bun run build:preview`: Build and preview the application in a single step.
- `bun run local`: Start the Cloudflare functions (backend-for-frontend, or BFF). This runs automatically during development or preview if you set the `VITE_RUN_LOCAL_ON_START` environment variable in the `.env.local` file.
- `bun run check`: Perform Svelte compiler checks and TypeScript validations.
- `bun run lint`: Lint code with ESLint.
- `bun run format`: Format code with Prettier .
