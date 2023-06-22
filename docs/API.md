# Bandada API Documentation

Bandada provides an API to manage members in a group. You can add or remove members in a group that you are admin of, using the API.

## Enabling API Access

To enable API access for a group, head over to the group page in the dashboard, and switch on the "Enable API Access" toggle button. Once the API is enabled, a new API key will be generated for you.

You can disable the API access anytime using the same toggle button.


## API Endpoints

Base URL : `https://bandada.appliedzkp.org/api`

Include the API key as a custom header `X-API-KEY` in all requests to the API.

### Add a member

`POST /groups/:group/members/:member`

Example:

```bash

curl --request POST 'https://bandada.appliedzkp.org/api/groups/38922764296632428858395574229367/members/82918723982' \
--header 'x-api-key: <api-key-here>'
```

### Remove a member

`DELETE /groups/:member/members/:member`

Example:

```bash
curl --request DELETE 'https://bandada.appliedzkp.org/api/groups/38922764296632428858395574229367/members/82918723982' \
--header 'x-api-key: <api-key-here>'
```
