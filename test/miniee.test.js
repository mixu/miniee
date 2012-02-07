var Mee = require('../miniee.js');

// set and emit an event using a string

var ee;
exports['given a new miniee'] = {
  setUp: function(done) {
    ee = new Mee();
    done();
  },
  tearDown: function(done) {
    done();
  },

  'should be able to set a listener using a string': function(test) {
    ee.on('test', function(arg) { test.ok(arg === 'success'); test.done(); } );
    ee.emit('test', 'success');
  },

  'should be able to set a listener using a regexp': function(test) {
    ee.on(/test.*/, function(arg) { test.ok(arg === 'success'); test.done(); } );
    ee.emit('test', 'success');
  },

  'a regexp listener should match varying events': function(test) {
    test.expect(2);
    ee.on(/test.*/, function(arg) {
      if(arg === 'success') {
        test.ok(true);
      }
      if(arg == 'final') {
        test.ok(true); test.done();
      }
    });
    ee.emit('testing', 'success');
    ee.emit('test', 'final');
  },

  'listeners set using once should only fire once': function(test) {
    test.expect(1);
    ee.once(/test.*/, function(arg) {
      if(arg === 'success') {
        test.ok(true);
      }
      if(arg == 'final') {
        test.ok(false);
      }
    });
    ee.emit('testing', 'success');
    ee.emit('test', 'final');
    test.done();
  },

  'you can set multiple listeners with the same string': function(test) {
    test.expect(2);
    ee.on('test', function(arg) { test.ok(arg === 'success');  } );
    ee.on('test', function(arg) { test.ok(arg === 'success'); test.done(); } );
    ee.emit('test', 'success');
  },

  'you can set multiple listeners with the same regexp': function(test) {
    test.expect(2);
    ee.on(/aaa.*/, function(arg) { test.ok(arg === 'success'); } );
    ee.on(/aaa.*/, function(arg) { test.ok(arg === 'success'); test.done(); } );
    ee.emit('aaaa', 'success');
  },

  'you can pass an arbitrary number of arguments on events': function(test) {
    test.expect(8);
    ee.on('test', function(a, b, c, d, e, f, g, h) {
      test.equal(a, 'as');
      test.equal(b, 'easy');
      test.equal(c, 'as');
      test.equal(d, '1');
      test.equal(e, '2');
      test.equal(f, '3');
      test.equal(g, 'it');
      test.equal(h, 'works');
      test.done();
    });
    ee.emit('test', 'as', 'easy', 'as', '1', '2', '3', 'it', 'works');
  },

  'setting more than one once() will still trigger all events': function(test) {
    test.expect(3);
    ee.once(/aaa.*/, function(arg) { test.ok(arg === 'success'); console.log('1');  } );
    ee.on(/aaa.*/, function(arg) { test.ok(arg === 'success'); console.log('2'); } );
    ee.once(/aaa.*/, function(arg) { test.ok(arg === 'success'); console.log('3'); test.done(); } );
    ee.emit('aaaa', 'success');
  },

  'can remove a single callback by string': function(test) {
    test.expect(1);
    var fail = function() { test.ok(false); };
    ee.on('tickets:21', fail);
    ee.once('tickets:21', fail);
    ee.removeListener('tickets:21', fail);
    ee.emit('tickets:21', 'data');
    setTimeout(function() {
      test.ok(true);
      test.done();
    }, 10);
  },

  'can remove a single callback by regexp': function(test) {
    var fail = function() { test.ok(false); };
    ee.on(new RegExp('^tickets:*'), fail);
    ee.once(new RegExp('^tickets:*'), fail);
    ee.removeListener(new RegExp('^tickets:*'), fail);
    ee.emit('tickets:21', 'data');
    setTimeout(function() {
      test.done();
    }, 10);
  },

  'can remove all listeners from an event by string': function(test) {
    var fail = function() { test.ok(false); };
    ee.on('tickets:21', fail);
    ee.once('tickets:21', fail);
    ee.removeAllListeners('tickets:21');
    ee.emit('tickets:21', 'data');
    setTimeout(function() {
      test.done();
    }, 10);
  },

  'can remove all listeners from an event by regexp': function(test) {
    var fail = function() { test.ok(false); };
    ee.on(new RegExp('^tickets:*'), fail);
    ee.once(new RegExp('^tickets:*'), fail);
    ee.removeAllListeners(new RegExp('^tickets:*'));
    ee.emit('tickets:21', 'data');
    setTimeout(function() {
      test.done();
    }, 10);
  }

};


// if this module is the script being run, then run the tests:
if (module == require.main) {
  var nodeunit_runner = require('nodeunit-runner');
  nodeunit_runner.run(__filename);
}
