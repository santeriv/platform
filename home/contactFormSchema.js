import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

export default new SimpleSchema({
  name: {
    type: String,
    label: TAPi18n.__('contactForm_name_label'),
    max: 50,
    optional: false,
    autoform: {
      placeholder: TAPi18n.__('contactForm_name_placeholder'),
    },
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: TAPi18n.__('contactForm_email_label'),
    optional: false,
    autoform: {
      placeholder: TAPi18n.__('contactForm_email_placeholder'),
    },
  },
  message: {
    type: String,
    label: TAPi18n.__('contactForm_message_label'),
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
      placeholder: TAPi18n.__('contactForm_message_placeholder'),
    },
  },
});
