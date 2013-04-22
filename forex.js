var FxRates = new Meteor.Collection('fxrates');
var Trades = new Meteor.Collection('trades');

if (Meteor.isClient) {

  Deps.autorun(function () {
    Meteor.subscribe('fxrates');
    Meteor.subscribe('trades');
  });

  Template.layout.exchange_rates = function () {
    return FxRates.find({}).fetch();
  }

  Template.layout.events({

    'click #buyOrder' : function (event, template) {
    }

  });

  Template.orderHistory.open_trades = function () {
    return Trades.find({}).fetch();
  }

  Template.orderHistory.new_trade = function () {
    //setup a new trade, get the rate from the user's selection
  }

  Template.buyOrderModal.events({
    'click #buy-button': function (event, template) {
      //save trade
    }
  });
}

if (Meteor.isServer) {


  Meteor.startup(function () {

    if (Trades.find().count() === 0 ) {
      Trades.insert( { buysell : 'BUY', pair : 'USD/EUR', rate : '1.308', risklevel : 'X100'} );
      Trades.insert( { buysell : 'SELL', pair : 'USD/NZD', rate : '0.938', risklevel : 'X50'} );
      Trades.insert( { buysell : 'BUY', pair : 'EUR/CAD', rate : '1.398', risklevel : 'X400'} );
      Trades.insert( { buysell : 'SELL', pair : 'USD/EUR', rate : '1.308', risklevel : 'X100'} );
      Trades.insert( { buysell : 'BUY', pair : 'USD/EUR', rate : '1.308', risklevel : 'X100'} );
    }
  });

  Meteor.publish('fxrates', function () {
    return FxRates.find({});
  });

  Meteor.publish ('trades', function () {
    return Trades.find();
  })


}
