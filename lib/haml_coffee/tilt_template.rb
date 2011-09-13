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

module HamlCoffee
  class TiltTemplate < Tilt::Template
    def self.default_mime_type
      'application/javascript'
    end

    def prepare ; end

    def evaluate(scope, locals = {}, &block)
      filename = if scope.respond_to?(:logical_path) # Sprockets
                   scope.logical_path
                 elsif scope.respond_to?(:filename)
                   scope.filename
                 elsif locals.key?(:filename)
                   locals[:filename]
                 end

      HamlCoffee.compile(data, :filename => filename)
    end
  end
end
