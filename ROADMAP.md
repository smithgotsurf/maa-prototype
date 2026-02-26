# MAA Prototype — Roadmap

Future features and enhancements beyond the current proof-of-concept.

## From Initial Design (Out of Scope for PoC)

- **Payment processing** — structure the code for future integration
- **Email notifications**
- **Reporting** beyond basic counts and CSV export
- **Mobile-responsive design**
- **CI/CD pipeline**
- **Cloud deployment (AWS)**
  - look into AWS Amplify for hosting
- **Password reset / account management** — handled by Auth0

> **Not planned:** Team/roster management

## Registration Enhancements

### Waitlist & Program Capacity
- Mark a specific program (e.g. 8U Baseball) as full/closed to registration
- Waitlist support for closed programs (SportsEngine has this today)

### Late Registration
- $20 late fee per player when registration period has officially closed
- **Private link flow:** generate a unique URL (with nonce query key) to send to individual parents so registration stays closed to the public but accessible to specific families
- Each link is single-use / tied to one parent

### Cart & Registration Editing
- After adding a registration to the cart, allow reviewing and editing it
- Ability to go back through the registration flow to make changes before checkout

### Admin Registration
- Allow an admin to register a player on behalf of a parent/guardian
- Skips payment collection
