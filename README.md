# MAA Prototype

A registration and information web app prototype for the **Meadow Athletic Association (MAA)**.

Hosted at: [https://smithgotsurf.github.io/maa-prototype/](https://smithgotsurf.github.io/maa-prototype/)

✨Vibe✨ coded with Claude

## Tech

- React 19
- react-router-dom v7 (HashRouter)
- Vite

## Project Structure

```
src/
├── main.jsx              # HashRouter + route definitions
├── App.jsx               # Layout shell (header, nav, Outlet)
├── utils.jsx             # Shared utilities, icons, helpers
├── data.js               # Season config, programs, mock data
├── context/
│   └── AppContext.jsx     # Cart + players state
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── FaqPage.jsx
│   ├── FieldsPage.jsx
│   ├── SponsorsPage.jsx
│   └── AdminPage.jsx
├── Registration.jsx       # RegPage + CartPage
├── app.css
├── registration.css
└── waivers/               # HTML waiver documents
```

## Dev

```bash
npm run dev   # starts on port 5174
```
