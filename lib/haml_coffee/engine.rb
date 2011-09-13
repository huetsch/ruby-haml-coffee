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
  class Engine < Rails::Engine
    initializer 'sprockets.haml_coffee', :after => 'sprockets.environment' do |app|
      app.assets.register_engine('.haml-coffee', TiltTemplate)
    end
  end
end
