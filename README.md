# Invitation Card

A React/Vite application for creating personalized children's party invitations. Users can choose a template, edit the invitation details, upload a photo or custom background, download the finished card as a PNG, and share it through the device's native share menu.

Live site: https://ninkov.github.io/invitation-card/

## Features

- Ready-made templates for birthday, Frozen, superhero, and Marvel-style invitations.
- Editable fields for guest name, host name, date, time, venue, title, RSVP date, and custom message.
- Optional photo upload for the invitation.
- Optional custom background upload.
- Text position controls.
- PNG export using a canvas renderer for more reliable mobile sharing.
- Native share flow for WhatsApp, Viber, Facebook, Messenger, and other installed apps.
- GitHub Pages deployment with GitHub Actions.
- Custom favicon and Open Graph image.

## Development

```bash
npm install
npm run dev
```

The Vite app uses:

```js
base: "/invitation-card/"
```

This keeps production asset URLs compatible with the GitHub Pages project URL.

## Checks

```bash
npm run lint
npm run build
```

## Deployment

The project is deployed automatically to GitHub Pages through:

```text
.github/workflows/deploy.yml
```

On every push to `main`, the workflow:

1. installs dependencies with `npm ci`;
2. builds the app with `npm run build`;
3. publishes the `dist` folder to GitHub Pages.

GitHub Pages should be configured with `Source: GitHub Actions`.

## Project Structure

```text
src/App.jsx                         App state and share/export orchestration
src/components/InvitationEditor.jsx Editor controls
src/components/InvitationPreview.jsx Live card preview
src/data/invitationData.js          Templates and UI option data
src/utility/cardRenderer.js         Canvas PNG renderer
src/utility/imageFiles.js           File/data URL helpers
public/party-favicon.svg           Favicon
public/og-image.png                 Open Graph image
```

## Sharing Notes

Browsers cannot reliably open a specific social app and attach a locally generated PNG directly. The app uses the native Web Share API with a generated PNG file, and the user chooses WhatsApp, Viber, Facebook, Messenger, or another target from the system share menu.

If the browser does not support file sharing, the app falls back to downloading the PNG so it can be attached manually.
