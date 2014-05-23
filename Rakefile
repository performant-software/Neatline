
require 'fileutils'

def get_static_files
  `git ls-files **/dist/*`.lines.map(&:strip).to_a
end

def set_assumed_unchanged(files, on)
  if on
    flag = '--assume-unchanged'
  else
    flag = '--no-assume-unchanged'
  end

  files.each { |f| sh %{git update-index #{flag} #{f}} }
end

def has_changes
  status = `git status --short`
  status.match(/^[MA]/) || status.match(/^.[MA]/) if has_changes
end

def commit_all(message)
  sh %{git commit --all --message "#{message}"}
end

namespace :neatline do

  desc 'Sets up the development environment.'
  task :setup do
    sh %{npm install}
    sh %{composer install}
    sh %{grunt build}
  end


  desc 'Regenerates static files and commits any changes.'
  task :commit_static do

    # Compress the payloads.
    sh %{grunt compile:min}

    # Stage and commit the changes.
    sh %{git add --force views/**/dist/**}
    commit_all("Committing compiled assets.")

    # Untrack the payloads.
    sh %{git rm -r --cached views/**/dist/**}
    commit_all("Untracking compiled assets.")

  end

  desc 'This creates a release branch, processes the release, and closes the branch without pushing it to github.'
  task :release, [:version] do |t, args|
    version = args[:version]

    puts "Releasing Neatline #{version}"
    sh %{git flow release start #{version}}

    Rake::Task["neatline:version"].invoke(version)
    Rake::Task["neatline:i18n"].invoke

    # TODO: Include hook for updating CHANGELOG.md

    Rake::Task["neatline:package"].invoke

    puts "Created pkg/Neatline-#{version}.zip"
    sh %{git flow release finish #{version}}

    FileUtils.rm('plugin.ini.release')
    Rake::Task["neatline:print_gbye"]
  end

  desc 'Set the version number everywhere it needs to be set.'
  task :version, [:version] do |t, args|
    version = args[:version]

    sh %{npm version #{version}}
    sh %{bower version #{version}}

    # (npm and bower both automatically commit their changes, with no option not
    # to. And they use different formats for the commit messages. Because they're
    # just helpful like that. SERENITY NOW!)
    sh %{git tag --delete "#{version}"}
    sh %{git tag --delete "v#{version}"}
    sh %{git reset HEAD^^}
    sh %{sed --in-place=.release --expression='s/^version.*/version="#{version}"/' plugin.ini}

    commit_all("Bumped version to #{version}.")
  end

  desc 'Update i18n.'
  task :i18n do
    sh %{tx pull --force}
    sh %{grunt pot}
    sh %{grunt po2mo}
    commit_all("Updated i18n.")
  end

  task :print_gbye do
    puts "Done."
    puts "All changes are local."
    puts "Nothing has been pushed."
    puts "You can handle that."
    puts
    puts "    git push"
    puts "    git push --tags"
    puts
    puts "Also, please check the package file before uploading to http://omeka.org/wp-admin."
  end

  desc 'Regenerate static assets and create the package file.'
  task :package do
    static_files = get_static_files
    set_assumed_unchanged(static_files, false)

    sh %{grunt package}
    static_files.each { |f| sh %{git add --force #{f}} }

    commit_all("Updated assets.")
    set_assumed_unchanged(static_files, true)
  end

end
