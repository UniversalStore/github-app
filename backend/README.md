# Backend
Responsible for the business logic and data storage. It is a REST API that communicates with the frontend and the
GitHub GraphQL API. 

## Important
- Use a classic GitHub personal access token. Cannot use the beta GitHub fine-grained token for this app,
  as it is not possible to set the required permissions for the token to access information about code review
  contributions in private repositories