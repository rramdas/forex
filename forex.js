var FxRates = new Meteor.Collection('fxrates');

if (Meteor.isClient) {

  Deps.autorun(function () {
    Meteor.subscribe('fxrates');
  });

  Template.layout.exchange_rates = function () {
    return FxRates.find({}).fetch();
  }

}

if (Meteor.isServer) {

  var fx = Npm.require('money');

  fx.base = 'USD';

  Meteor.startup(function () {
    if (FxRates.find().count() === 0 ) {
      var datum = '2013-04-12.json';
      var url = 'http://openexchangerates.org/api/historical/' + datum + '?app_id=7276637dabc244cc829cfed87bd6c989';
      var result = Meteor.http.get(url, {timeout : 300000});
      if (result.statusCode == 200) {
        console.log('Received data from Open Exchange.');
        fx.data = result.data;
        fx.rates = result.data.rates;
        FxRates.insert({ fxdate : new Date (2013, 04, 12), timestamp : result.data.timestamp, rates : fx.rates });
        console.log(fx.rates);
      }
    }

  });

  Meteor.publish('fxrates', function () {
    return FxRates.find({});
  });


}
