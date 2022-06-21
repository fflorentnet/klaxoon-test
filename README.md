# Installation and launch
## Requirements

- Node 16
- Git
- Docker/Docker Compose

Without any changes, the application will automatically connect to a local MySQL database. It is highly recommanded to start it through the `docker-compose` configuration.

## Set-up locally
The installation is pretty straight forward for a node application:

```bash
  $ npm install
  $ npm build
```

The application can then be started with a
```bash
  $ npm start
```


## Set-up using Docker-Compose
The build of the application and the installation of the dependencies is done through a step of the Docker build.

This means a simple
```bash
  $ docker-compose up -d
```
should be able to start the application, alongside a MySQL db and an Adminer instance for debug purpuses.

# Usage
## Create a new bookmark
The API for the creation of a new bookmark is the following: `/api/v1/bookmark`.
A `link` parameter is needed so the application is able to fetch the related information to the link, following the oEmbed convention.

As follow, a `POST` request will look like this: 

```json
{
    "link": "https://www.flickr.com/photos/feuilllu/45771361701/"
}
```

and the response, after fetching the information of the linked would be:
```json
{
    "link": "https://www.flickr.com/photos/feuilllu/45771361701/",
    "information": {
        "title": "2018 Visite de Klaxoon",
        "author": "Pierre Metivier",
        "thumbnail": "https://live.staticflickr.com/4817/45771361701_2678123510_q.jpg",
        "type": "photo",
        "width": 1024,
        "height": 685
    },
    "id": 2,
    "createdAt": "2022-06-21T11:25:01.358Z",
    "updatedAt": "2022-06-21T11:25:01.358Z"
}
```

Incidentelly, if the domain of the URL is not supported (eg. Twitter), an error will be returned.

If the parameter is not present or is not a valid URL, an error will also be returned and the process won't go further.

### Example
```bash
curl --location --request POST 'http://127.0.0.1:3000/api/v1/bookmark' \
--header 'Content-Type: application/json' \
--data-raw '{
    "link": "https://www.flickr.com/photos/feuilllu/45771361701/"
}'
```
## Fetching bookmarks

- `GET /api/v1/bookmark/` will retrieve the list of persisted bookmarks.
- `GET /api/v1/bookmark/:id` (with the id being a number) will retrieve the bookmark matching the id. If the bookmark does not exist, a `404` error will be returned.

### Examples
- Fetching all the bookmarks
```bash
curl --location --request GET 'http://localhost:3000/api/v1/bookmark/'
```
- Fetching a specific bookmark
```bash
curl --location --request GET 'http://localhost:3000/api/v1/bookmark/1/'
```

## Deleting a bookmark

- `GET /api/v1/bookmark/:id` (with the id being a number) will retrieve the bookmark matching the id.

### Example
```bash
curl --location --request DELETE 'http://127.0.0.1:7000/api/v1/bookmark/3'
```

# Architecture summary

## Libraries
The libraries used in this project are the following:
- `fastify`
  - `fastify/env` (supports for dotenv)
  - `fastify-plugin` (extends plugin system of fastify)
  - `@fastify/type-provider-json-schema-to-ts` (uses for object validation in incoming requests)
  - `@fastify/mysql` (supports for MySQL)
- `typeorm` (a basic ORM lib)
- `axios` (somewhat simplifies external API usages)
- `class-transformer` (serialization/deserialization tools, used for the oEmbed part)

For testing purposes:
- `jest`
- `better-sqlite3` (used as a in-memory placeholder for the MySQL db)

Other tools:
- `pino` and `pino-prettier` (a nice looking logger);
- `eslint`
- `nodemon`

## Application design

As the application uses `fastify`, I used the plugins system to a certain extent.
There are two main plugins:
- `LinkAdapterRegistry` (`app/adapters/LinkAdapterFactory`): This plugin is a registry for the adapters. The role of the adapter is to be able to fetch the required information for a specific URL. For our examples (Flickr and Vimeo), the application perform a simple `GET` request on their respective domain.
  - `FlickrAdapter` (`app/adapters/FlickrAdapter`): This adapter is also registered as a plugin and is added to the `AdapterRegistry`. This adapter deals with Flickr urls.
  - `VimeoAdapter` (`app/adapters/Vimeo`): This adapter is also registered as a plugin and is added to the `AdapterRegistry`. This adapter deals with Vimeo urls.
  - ... if a new domain happened to be needed, a new `Adapter` would be needed.
- `setupDb` (`app/repositories/db`): Prepare and expose a `DataSource` connection for `fastify` and other services. This plugin fetches information from the `dotenv` file for its configuration, where it uses the `DbConfigHelper` to generate the correct parameters.

## Choices
- The bookmark creation API 'could' have been a simple `GET` call with a url as param. It didn't seem that REST for me, so I prefered a simple object with a single param.
- For ease of development, each adapter matches a single domain. In a perfect world, this should not be the case.
- The `PUT` call only updates the oEmbed information.