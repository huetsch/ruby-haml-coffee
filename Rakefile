# encoding: UTF-8
#
# Copyright 2011 Brennan Frydl (http://bfrydl.com/)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

require 'bundler/gem_tasks'
require 'rspec/core/rake_task'

task :default => :build

task :generatejs do
  input = Pathname.new('vendor/haml-coffee/lib/compiler.js')
  output = Pathname.new('lib/haml_coffee/haml-coffee.js')

  status = {}
  contents = []

  root = input.realpath.dirname
  compiler_module = input.basename.to_s

  process_file = proc do |name, path|
    case status[name]
    when :processed
      next
    when :processing
      raise StandardError, "Cyclic dependency detected in #{name}: #{status}"
    else
      status[name] = :processing
    end

    content = path.read

    content.gsub!(/require\('([^']*)'\)/) do |match|
      _path = Pathname.new(File.expand_path(File.join('../', "#{$1}.js"), path))
      _name = _path.relative_path_from(root).to_s

      process_file.call(_name, _path)

      "modules[#{_name.inspect}]"
    end

    content.gsub!(/module\.exports/, "modules[#{name.inspect}]")

    contents << [name, content]
    status[name] = :processed
  end

  process_file.call(compiler_module, input)

  output.open('w') do |file|
    file.puts 'compile = (function() {'
    file.puts '  var modules = {};'

    contents.each do |(name, content)|
      file.puts
      file.puts "  // #{name}" 
      file.puts content.gsub(/^/, '  ').chomp
    end

    file.puts
    file.puts "  var Compiler = modules[#{compiler_module.inspect}];"
    file.puts '  return function(namespace, filename, source) {'
    file.puts '    var c = new Compiler(c);'
    file.puts '    c.parse(source);'
    file.puts '    return c.render(filename, namespace);'
    file.puts '  }'

    file.puts('}).call(this);')
  end
end
