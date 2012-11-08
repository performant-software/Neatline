task :default => 'test:all'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

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
    sh %{rake jasmine JASMINE_PORT=1337}
  end

end

desc 'Build the application'
task :build do

  # Paths.
  js = 'views/shared/javascripts/v2'
  cmp = js+'/components'

  # NPM/bower install.
  sh %{npm install}
  sh %{cd #{js} && bower install}

  # Build Boostrap and OpenLayers.
  sh %{cd #{cmp}/bootstrap && make bootstrap}
  sh %{cd #{cmp}/openlayers/build && python build.py full OpenLayers.js}

  # Application JavaScript.
  sh %{grunt min:neatline}

  # Application CSS.
  sh %{grunt stylus}

  # Append OpenLayers theme.
  sh %{grunt concat:openlayers}

  # Jasmine packages and payload.
  sh %{cd spec/javascripts/helpers && bower install}
  sh %{grunt concat:test}

end

desc 'Clean pacakges'
task :clean do
  sh %{rm -rf node_modules}
  sh %{rm -rf views/shared/javascripts/v2/payloads}
  sh %{rm -rf views/shared/javascripts/v2/components}
  sh %{rm -rf views/shared/css/v2/payloads}
  sh %{rm -rf spec/javascripts/helpers/components}
end

desc 'Rebuild the application'
task :rebuild do
  Rake::Task['clean'].invoke
  Rake::Task['build'].invoke
end

namespace :dev do

  desc 'Insert exhibit'
  task :insert do
    sh %{bash .sql/insert_exhibit.sh}
  end

  desc 'Clear exhibit'
  task :truncate do
    sh %{bash .sql/clear_exhibit.sh}
  end

end
