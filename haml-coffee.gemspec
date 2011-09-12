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

$:.push File.expand_path('../lib', __FILE__)

Gem::Specification.new do |s|
  s.name        = 'haml-coffee'
  s.version     = '0.1.0'
  s.authors     = ['Brennan Frydl']
  s.email       = ['me@bfrydl.com']
  s.homepage    = 'http://github.com/bfrydl/ruby-haml-coffee'
  s.summary     = %q{Ruby wrapper around the JavaScript haml-coffee compiler}
  s.description = %q{ruby-haml-coffee is a Ruby wrapper around the JavaScript haml-coffee compiler.}

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- spec/*`.split("\n")
  s.require_paths = ['lib']

  s.add_development_dependency 'rspec'

  s.add_runtime_dependency 'execjs'
  s.add_runtime_dependency 'coffee-script'
end
