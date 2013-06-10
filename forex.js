FxRates = new Meteor.Collection('fxrates');
Trades = new Meteor.Collection('trades');
Stocks = new Meteor.Collection('stocks');

if (Meteor.isClient) {

  var spread = 0.02;

  function updateRates () {
      Meteor.call("getRates", function(error, result) {
      Session.set('ticks', result.data.ticks);
      Session.set('eurusd', result.data.ticks.EURUSD); 
      Session.set('eurgbp', result.data.ticks.EURGBP); 
      Session.set('eurjpy', result.data.ticks.EURJPY); 
    });
  }

  Meteor.setInterval(updateRates, 30);

  Deps.autorun(function () {
    Meteor.subscribe('fxrates');
    Meteor.subscribe('trades');
    Meteor.subscribe('stocks');
  });

  Template.layout.exchange_rates = function () {
//    return FxRates.find({}).fetch();
    return Stocks.find({}).fetch();
  }

  Template.layout.events({
    'click #buyOrder' : function (event, template) {
    }
  });

  Template.layout.ticks = function () {
    return Session.get('ticks');
  }

  Template.layout.buy_ticks = function () {
    return Session.get('buy_ticks');
  }

  Template.layout.direction = function () {
  }

  Template.orderHistory.open_trades = function () {
    return Trades.find({}).fetch();
  }

  Template.orderHistory.new_trade = function () {
    //setup a new trade, get the rate from the user's selection
  }

  Template.buyOrderModal.events({

    'click #buy-button': function (event, template) {

      var buysell = Template.find('buysell').value();
      var pair = Template.find('pair').value();
      var rate = Template.find('rate').value();
      var risklevel = Template.find('risklevel').value();

      console.log('Entering new trade');

      Trades.insert( { buysell : buysell, pair : pair, rate : rate, risklevel : risklevel } );
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
  });

  Meteor.publish('stocks', function () {
    return Stocks.find();
  });

  Meteor.methods ({
    getRates: function () {
      this.unblock();
      return Meteor.http.get('http://localhost:8080/update');
    }
  });

}
