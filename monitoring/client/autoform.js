// Meteor package imports
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';
import { AutoForm } from 'meteor/aldeed:autoform';

// Apinf import
import { Apis } from '/apis/collection';
import { MonitoringSettings, MonitoringData } from '/monitoring/collection';

AutoForm.hooks({
  apiMonitoringForm: {
    before: {
      update: (doc) => {
        // Check form on validation
        if (AutoForm.validateForm('apiMonitoringForm')) {
          // Get new data
          const monitoringData = doc.$set;
          // If data was updated than enabled is false or url is updated
          // For apply new url, cron must be restarted
          // If enabled is false, cron must be stop too
          Meteor.call('stopCron', monitoringData.apiId);

          // Restart cron with new url
          if (monitoringData.enabled) {
            Meteor.call('startCron', monitoringData.apiId, monitoringData.url);
          }
          // Success result
          return doc;
        }
        // Get success message translation
        const message = TAPi18n.__('apiMonitoringForm_errorMessage');

        // Alert the user of error
        sAlert.error(message);
        return false;
      },
    },
    after: {
      insert: (error, result) => {
        if (result) {
          // Get monitoring document
          const monitoring = MonitoringSettings.findOne(result);

          // Get api id
          const apiId = monitoring.apiId;

          MonitoringData.insert({ apiId }, (error, id) => {
            // Linked both collections
            MonitoringSettings.update(result, { $set: { data: id } });
          });

          // Link Monitoring collection with Apis collection
          Apis.update(apiId, { $set: { monitoringId: result } });

          // Start Cron
          Meteor.call('startCron', apiId, monitoring.url);
        }
      },
    },
    onSuccess () {
      // Get update values
      const updateFormValues = this.updateDoc ? this.updateDoc.$set : this.insertDoc;

      // If monitoring is enabled then get the API status immediately
      if (updateFormValues.enabled) {
        Meteor.call('getApiStatus', updateFormValues.apiId, updateFormValues.url);
      }

      // Get success message translation
      const message = TAPi18n.__('apiMonitoringForm_successMessage');

      // Alert the user of success
      sAlert.success(message);
    },
    onError () {
      // Get success message translation
      const message = TAPi18n.__('apiMonitoringForm_errorMessage');

      // Alert the user of error
      sAlert.error(message);
    },
  },
});
