var Mee = require('../miniee.js');

// set and emit an event using a string
exports['should be able to set a listener using a string'] = function(test) {
  var ee = new Mee();
  ee.on('test', function(arg) { test.ok(arg === 'success'); test.finish(); } );
  ee.emit('test', 'success');
};    

exports['should be able to set a listener using a regexp'] = function(test) {
  var ee = new Mee();
  ee.on(/test.*/, function(arg) { test.ok(arg === 'success'); test.finish(); } );
  ee.emit('test', 'success');
};

exports['a regexp listener should match varying events'] = function(test) {
  test.numAssertions = 2;
  var ee = new Mee();
  ee.on(/test.*/, function(arg) { 
    if(arg === 'success') { 
      test.ok(true); 
    } 
    if(arg == 'final') { 
      test.ok(true); test.finish(); 
    } 
  });
  ee.emit('testing', 'success');
  ee.emit('test', 'final');
};

exports['listeners set using once should only fire once'] = function(test) {
  test.numAssertions = 1;
  var ee = new Mee();
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
  test.finish();   
};  
  
exports['you can set multiple listeners with the same string'] = function(test) {
  var ee = new Mee();
  test.numAssertions = 2;
  ee.on('test', function(arg) { test.ok(arg === 'success');  } );
  ee.on('test', function(arg) { test.ok(arg === 'success'); test.finish(); } );  
  ee.emit('test', 'success');  
};

exports['you can set multiple listeners with the same regexp'] = function(test) {
  var ee = new Mee();
  test.numAssertions = 2;
  ee.on(/aaa.*/, function(arg) { test.ok(arg === 'success'); } );
  ee.on(/aaa.*/, function(arg) { test.ok(arg === 'success'); test.finish(); } );  
  ee.emit('aaaa', 'success');  
};

exports['you can pass an arbitrary number of arguments on events'] = function(test) {
  var ee = new Mee();
  test.numAssertions = 8;  
  ee.on('test', function(a, b, c, d, e, f, g, h) { 
    test.equal(a, 'as'); 
    test.equal(b, 'easy'); 
    test.equal(c, 'as'); 
    test.equal(d, '1'); 
    test.equal(e, '2'); 
    test.equal(f, '3'); 
    test.equal(g, 'it'); 
    test.equal(h, 'works'); 
    test.finish(); 
  });  
  ee.emit('test', 'as', 'easy', 'as', '1', '2', '3', 'it', 'works');      
};

// setting more than one once() will still trigger all events
exports['setting more than one once() will still trigger all events'] = function(test) {
  var ee = new Mee();
  test.numAssertions = 3;
  ee.once(/aaa.*/, function(arg) { test.ok(arg === 'success'); console.log('1');  } );
  ee.on(/aaa.*/, function(arg) { test.ok(arg === 'success'); console.log('2'); } );
  ee.once(/aaa.*/, function(arg) { test.ok(arg === 'success'); console.log('3'); test.finish(); } );  
  ee.emit('aaaa', 'success');  
};


// removing an event with a specified callback will remove duplicate callbacks with the same event

// removing all events using a string will remove all callbacks on an event

// removing an regexp with a specified callback will remove duplicate callbacks with the same regexp, but not duplicate callbacks with a different regexp

// removing all events using a regexp will remove all matching regexps, regardless of the callback


// if this module is the script being run, then run the tests:
if (module == require.main) {
  var async_testing = require('async_testing');
  process.nextTick(function() {
    async_testing.run(__filename, process.ARGV, function() { process.exit(); } );
  });
}
