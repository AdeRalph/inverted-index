var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');
var noop = function() {};

var jrunner = new Jasmine();

// remove default reporter logs
jrunner.configureDefaultReporter({print: noop});

// add jasmine-spec-reporter
jasmine.getEnv().addReporter(new SpecReporter());

// load jasmine.json configuration   
jrunner.loadConfigFile();
jrunner.execute();
