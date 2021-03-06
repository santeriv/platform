// Meteor packages import
import { Template } from 'meteor/templating';

// APINF import
import convertStatusCode from './convert_status_code';

Template.viewApiStatus.onRendered(() => {
  // Init tooltip
  $('[data-toggle="tooltip"]').tooltip();
});

Template.viewApiStatus.helpers({
  classList () {
    // Get api
    const api = Template.currentData().api;
    // Get class name depending on the api status code
    const { className } = convertStatusCode(api.latestMonitoringStatusCode);

    // Create a new line using join
    return [
      `api-status-indicator-${api._id}`,
      'icon-indicator',
      className,
    ].join(' ');
  },

  originalTitle () {
    // Get api
    const api = Template.currentData().api;

    // Get original title depending on the api status code
    const { statusText } = convertStatusCode(api.latestMonitoringStatusCode);

    return statusText;
  },
});
