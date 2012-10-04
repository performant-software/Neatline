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

desc 'Build the application'
task :build do
  sh %{npm install}
  sh %{grunt cssmin}
  sh %{grunt min}
end

desc 'Clean pacakges'
task :clean do
  sh %{rm -rf views/shared/javascripts/payloads}
  sh %{rm -rf views/shared/css/payloads}
end
