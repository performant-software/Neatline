begin
  require 'jasmine'
  require 'net/http'
  require 'uri'
  load 'jasmine/tasks/jasmine.rake'
end

task :default => 'test:all'

namespace :test do

  desc 'Run all tests'
  task :all do
    Rake::Task['test:server'].invoke
    Rake::Task['jasmine:ci'].invoke
  end

  desc 'Run the PHPUnit suite'
  task :server do
    sh %{cd tests && phpunit}
  end

  desc 'Run the Jasmine server'
  task :jasmine do
    Rake::Task['test:server'].invoke
    sh %{rake jasmine JASMINE_PORT=1337}
  end

end

desc 'Build the application'
task :build do

  # Paths.
  js = 'views/shared/javascripts'
  bs = js+'/components/bootstrap'
  ol = js+'/components/openlayers/build'

  # NPM/bower install.
  sh %{npm install}
  sh %{cd #{js} && bower install}

  # Build Boostrap and OpenLayers.
  sh %{cd #{bs} && make bootstrap}
  sh %{cd #{ol} && python build.py full OpenLayers.js}

  # Application JavaScript.
  sh %{grunt min:neatline}
  sh %{grunt min:editor}

  # Application CSS.
  sh %{grunt stylus}
  sh %{grunt concat:neatlineCss}
  sh %{grunt concat:editorCss}

  # Jasmine packages and payload.
  sh %{cd spec/javascripts/helpers && bower install}
  sh %{grunt concat:test}

end

desc 'Clean pacakges'
task :clean do
  sh %{rm -rf node_modules}
  sh %{rm -rf views/shared/javascripts/payloads}
  sh %{rm -rf views/shared/javascripts/components}
  sh %{rm -rf views/shared/css/payloads}
  sh %{rm -rf spec/javascripts/helpers/components}
end

desc 'Rebuild the application'
task :rebuild do
  Rake::Task['clean'].invoke
  Rake::Task['build'].invoke
end
