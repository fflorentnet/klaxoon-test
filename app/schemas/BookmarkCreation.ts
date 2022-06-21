import { FromSchema } from 'json-schema-to-ts';

const bookmarkCreationSchema = {
  type: 'object',
  properties: {
    link: {
      type: 'string',
      format: 'uri',
    },
  },
  required: ['link'],
} as const;

type BookmarkCreation = FromSchema<typeof bookmarkCreationSchema>;

export { bookmarkCreationSchema, BookmarkCreation };
