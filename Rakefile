task :default => 'test:all'

begin

  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
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

namespace :build do

  desc 'Build the 1.0.x application'
  task :old do
    sh %{npm install}
    sh %{grunt cssmin:neatline}
    sh %{grunt cssmin:editor}
    sh %{grunt min:neatline}
    sh %{grunt min:editor}
  end

  desc 'Build the 1.2.x application'
  task :new do
    sh %{npm install}
    sh %{grunt cssmin:neatline}
    sh %{grunt cssmin:editor}
    sh %{grunt min:v2neatline}
    sh %{grunt min:editor}
  end

  desc 'Clean pacakges'
  task :clean do
    sh %{rm -rf views/shared/javascripts/payloads}
    sh %{rm -rf views/shared/css/payloads}
    sh %{rm -rf views/shared/javascripts/v2/payloads}
  end

end
