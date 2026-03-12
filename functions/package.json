name: Deploy Firebase Functions
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g firebase-tools
      - run: cd functions && npm install
      - run: firebase functions:config:set sendgrid.key="DIN_SENDGRID_API_NØGLE"
      - run: firebase deploy --only functions
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
